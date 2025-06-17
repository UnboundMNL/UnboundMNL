const XLSX = require('xlsx');

module.exports = {
    post: async (req, res) => {
        try {
            const workbook = XLSX.readFile(req.file.path);
            
            const sheets = {};

            workbook.SheetNames.forEach(sheetName => {
                const sheet = workbook.Sheets[sheetName];
                
                const rows = XLSX.utils.sheet_to_json(sheet, {
                    header: 1,
                    defval: '',
                });
                
                sheets[sheetName] = rows;
            });

            // TODO: Parse sheets
        } catch (err) {
            // TODO: Error
        }
    }
};