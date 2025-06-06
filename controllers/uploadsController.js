const XLSX = require('xlsx');

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
            const dataRows = rows.slice(1);
            const users = dataRows
                .filter(row => row[0]) 
                .map(row => ({
                    lastName: row[1],              
                    firstName: row[2],             
                    status: row[3],           
                    chid: row[4],              
                    parentName: row[5],      
                }));

            // TODO: Validate if savings are encoded monthly or yearly
            users.forEach((user, userIdx) => {
                let savingsBool = true;
                for (let i = 6; i < headerRow.length; i++) {
                    const value = dataRows[userIdx][i];
                    if (typeof value !== 'undefined' && value !== '') {
                        const year = headerRow[i];
                        if (savingsBool) {
                            user[`savings_${year}`] = parseFloat(value) || 0;
                            savingsBool = false;
                        } else {
                            user[`match_${year}`] = parseFloat(value) || 0;
                            savingsBool = true;
                        }
                    }
                }
            });

            // DEBUGGING: Prints the parsed users to the console
            console.log(users);
            res.status(200).json({ success: true, message: 'Excel file processed successfully.', users });

            // TODO: Save the users to the database
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Failed to process Excel file.' });
        }
    }
};
