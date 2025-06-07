const XLSX = require('xlsx');
const Saving = require('../models/Saving');
const Member = require('../models/Member');
const memberController = require('../controllers/memberController.js');
const savingsController = require('../controllers/savingsController.js');

module.exports = {
    post: async (req, res) => {
        try {
            const workbook = XLSX.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0]; 
            const sheet = workbook.Sheets[sheetName];

            const rows = XLSX.utils.sheet_to_json(sheet, {
                header: 1,
                defval: '',
            });
            
            const headerRow = rows[0];
            const dataRows = rows.slice(2);
            const members = dataRows
                .filter(row => 
                    // skip rows that do not have the user data
                    row[1] && row[2] && row[3] && row[4] && row[5] 
                ) 
                .map(row => ({
                    name: {
                        lastName: row[1],
                        firstName: row[2],
                    },
                    status: row[3],
                    orgId: row[4],
                    parentName: row[5]
                }));

            for (const [memberIdx, member] of members.entries()) {
                try {
                    const createdMember = await memberController.bulkRegisterMember(member);

                    // DEBUGGING: Prints the member being processed
                    console.log(`Processing member: ${createdMember._id} ${createdMember.name.firstName} ${createdMember.name.lastName}`);
                    
                    if (createdMember) {
                        for (let i = 6; i < headerRow.length; i+=2) {
                            const value = dataRows[memberIdx][i];
                            const year = headerRow[i];
                            let matchValue = 0;
                            if (year && value && !isNaN(Number(value))) {
                                if (i + 1 < headerRow.length) {
                                    const matchRaw = dataRows[memberIdx][i + 1];
                                    matchValue = matchRaw && !isNaN(Number(matchRaw)) ? Number(matchRaw) : 0;
                                }

                                const savingDoc = new Saving({
                                    memberID: createdMember._id,
                                    year: Number(year),
                                    totalSaving: Number(value),
                                    totalMatch: matchValue,
                                });

                                createdMember.totalSaving += Number(value);
                                createdMember.totalMatch += matchValue;

                                await savingDoc.save();

                                createdMember.savings.push(savingDoc._id);
                                
                                // DEBUGGING: Print member and saving details
                                console.log(`Saving for member ${createdMember.name?.firstName} ${createdMember.name?.lastName} for year ${year}:`, {
                                    totalSaving: savingDoc.totalSaving,
                                    totalMatch: savingDoc.totalMatch
                                });
                            }
                        }
                        await createdMember.save();

                        // DEBUGGING: Print the created member
                        console.log("Created member:", createdMember);
                        members[memberIdx] = createdMember; 
                    } else {
                        continue;
                    }
                } catch (error) {
                    console.error(`Error saving member ${member.name?.firstName} ${member.name?.lastName}:`, error);
                }
            }
            
            // DEBUGGING: Prints the members after saving to the database
            console.log('Members saved to the database:', members);
            res.status(200).json({ success: true, message: 'Excel file processed successfully.', members });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Failed to process Excel file.' });
        } finally {
            // discard the uploaded file
            const fs = require('fs');
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                } else {
                    console.log('File deleted successfully');
                }
            });
        }
    }
};
