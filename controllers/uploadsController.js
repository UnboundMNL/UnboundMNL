const XLSX = require('xlsx');
const Saving = require('../models/Saving');
const Member = require('../models/Member');
const memberController = require('../controllers/memberController.js');
const savingsController = require('../controllers/savingsController.js');

function mapMonthNameToSchemaKey(monthName) {
    monthName = monthName && monthName.toLowerCase();
    const monthMap = {
        'january': 'jan',
        'february': 'feb',
        'march': 'mar',
        'april': 'apr',
        'may': 'may',
        'june': 'jun',
        'july': 'jul',
        'august': 'aug',
        'september': 'sep',
        'october': 'oct',
        'november': 'nov',
        'december': 'dec'
    };
    if (!monthName) return null;
    return monthMap[monthName.toLowerCase()] || null;
}

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
            
            let logCount = 0;
            const template = rows[0];
            const headerRow = rows[1];
            const dataRows = rows.slice(3);

            // DEBUGGING: Store members and print later
            members = [];

            for (let rowIdx = 0; rowIdx < dataRows.length; rowIdx++) {
                const row = dataRows[rowIdx];
                // Skip rows with missing required fields
                if (!(row[1] && row[2] && row[3] && row[4] && row[5])) continue;

                const member = {
                    name: {
                        lastName: row[1] ? String(row[1]).trim() : '',
                        firstName: row[2] ? String(row[2]).trim() : '',
                    },
                    status: row[3] ? String(row[3]).trim() : '',
                    orgId: row[4] ? String(row[4]).trim() : '',
                    parentName: row[5] ? String(row[5]).trim() : ''
                };

                try {
                    // DEBUGGING: Print the member being processed
                    console.log(`Processing member at index ${rowIdx}:`, member);
                    
                    // TODO: Error handling  for existing members
                    const createdMember = await memberController.bulkRegisterMember(member);

                    if (createdMember) {
                        let savingDoc = null;
                        let monthsData = {};
                        let year = null;

                        if (template[1] === 'YEARLY') {
                            for (let i = 6; i < headerRow.length; i += 2) {
                                const value = dataRows[rowIdx][i];
                                year = headerRow[i];
                                let matchValue = 0;
                                if (i + 1 < headerRow.length) {
                                    const matchRaw = dataRows[rowIdx][i + 1];
                                    matchValue = matchRaw && !isNaN(Number(matchRaw)) ? Number(matchRaw) : 0;
                                }
                                if (year && value && !isNaN(Number(value))) {
                                    // DEBUGGING: Print the saving details
                                    console.log(`Saving for member ${member.name?.firstName} ${member.name?.lastName} - Year: ${year}, Value: ${value}, Match: ${matchValue}`);
                                    savingDoc = new Saving({
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
                        } else {
                            // MONTHLY ENCODING: accumulate all months for the year in one doc
                            let yearTotalSaving = 0, yearTotalMatch = 0;
                            monthsData = {};
                            year = template[2];

                            for (let i = 6; i < headerRow.length; i += 2) {
                                const month = headerRow[i];
                                const value = dataRows[rowIdx][i];
                                let matchValue = 0;
                                if (i + 1 < headerRow.length) {
                                    const matchRaw = dataRows[rowIdx][i + 1];
                                    matchValue = matchRaw && !isNaN(Number(matchRaw)) ? Number(matchRaw) : 0;
                                }
                                if (month && value && !isNaN(Number(value))) {
                                    let monthKey = mapMonthNameToSchemaKey(month);
                                    monthsData[monthKey] = {
                                        savings: Number(value),
                                        match: matchValue
                                    };
                                    yearTotalSaving += Number(value);
                                    yearTotalMatch += matchValue;
                                    createdMember.totalSaving += Number(value);
                                    createdMember.totalMatch += matchValue;

                                    // DEBUGGING: Print the saving details
                                    console.log(`Saving for member ${member.name?.firstName} ${member.name?.lastName} - Year: ${year}, Month: ${month}, Value: ${value}, Match: ${matchValue}`);
                                }
                            }
                            if (Object.keys(monthsData).length > 0) {
                                savingDoc = new Saving({
                                    memberID: createdMember._id,
                                    year: Number(year),
                                    ...monthsData,
                                    totalSaving: yearTotalSaving,
                                    totalMatch: yearTotalMatch,
                                });
                                await savingDoc.save();
                                createdMember.savings.push(savingDoc._id);
                                
                                // DEBUGGING: Print member and saving details
                                console.log(`Saving for member ${createdMember.name?.firstName} ${createdMember.name?.lastName} for year ${year}:`, {
                                    yearTotalSaving: savingDoc.yearTotalSaving,
                                    yearTotalMatch: savingDoc.yearTotalMatch
                                });
                            }
                        }

                        await createdMember.save();

                        // DEBUGGING: Print the created member
                        console.log("Created member:", createdMember);
                        members[rowIdx] = createdMember; 
                        logCount++;
                    } else {
                        console.log(`Member ${member.name?.firstName} ${member.name?.lastName} could not be created.`);
                        continue;
                    }
                } catch (error) {
                    console.error(`Error saving member ${member.name?.firstName} ${member.name?.lastName}:`, error);
                }
            }
            
            // DEBUGGING: Prints the members after saving to the database
            if (logCount > 0 ) {
                console.log(`Successfully processed ${logCount} members.`);
                res.status(200).json({ success: true, message: 'Excel file processed successfully.', members });
            } else {
                console.log('No members saved.');
                res.status(400).json({ success: false, message: 'No members saved.' });
            }
            
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
