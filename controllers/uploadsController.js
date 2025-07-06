const XLSX = require('xlsx');
const Saving = require('../models/Saving');
const Member = require('../models/Member');
const memberController = require('../controllers/memberController.js');
const savingsController = require('../controllers/savingsController.js');
const path = require('path');
const fs = require('fs');

const CONFIG = {
    SUPPORTED_FORMATS: ['.xlsx', '.xls'],
    HEADER_ROW_COUNT: 4
};

// Helper function to validate the uploaded file
function validateFileUpload(file) {
    if (!file || !file.path) {
        return { valid: false, error: 'No file uploaded.' };
    }
    
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!CONFIG.SUPPORTED_FORMATS.includes(fileExtension)) {
        return { valid: false, error: 'Invalid file format. Only Excel files are supported.' };
    }
    
    return { valid: true };
}

// Helper function to map month names to schema keys
function mapMonthNameToSchemaKey(monthName) {
    if (!monthName) return null;
    
    monthName = monthName.toLowerCase();
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
    
    return monthMap[monthName] || null;
}

// Helper function to map member status
function mapMemberStatus(status) {
    if (!status) return 'Active';
    
    status = status.toLowerCase();
    const statusMap = {
        'active': 'Active',
        'rws': 'RwS', // Retired with Savings
        'rwos': 'RwoS' // Retired without Savings
    };
    return statusMap[status] || 'Active'; // default to 'Active' if not found
}

// Helper function to validate member data
function validateMemberData(member, rowIndex) {
    const errors = [];
    
    if (!member.name?.firstName?.trim()) {
        errors.push('First name is required');
    }
    
    if (!member.name?.lastName?.trim()) {
        errors.push('Last name is required');
    }
    
    if (!member.orgId?.trim()) {
        errors.push('Organization ID is required');
    }

    return {
        valid: errors.length === 0,
        errors: errors.map(err => `Row ${rowIndex}: ${err}`)
    };
}

// Helper function to process each member's data
function processMemberData(row) {
    return {
        name: {
            lastName: row[1] ? String(row[1]).trim() : '',
            firstName: row[2] ? String(row[2]).trim() : '',
        },
        status: row[3] ? mapMemberStatus(String(row[3]).trim()) : 'Active',
        orgId: row[4] ? String(row[4]).trim() : '',
        parentName: row[5] && String(row[5]).trim() !== '' ? String(row[5]).trim() : 'Unknown'
    };
}

// Helper function to safely parse numbers
function parseNumber(value, defaultValue = 0) {
    if (value === null || value === undefined || value === '') {
        return defaultValue;
    }
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
}

module.exports = {
    post: async (req, res) => {
        let issues = [];
        let members = [];
        let logCount = 0;
        let nonEmptyRows = 0;
        let hasResponded = false;
        
        try {
            const fileValidation = validateFileUpload(req.file);
            if (!fileValidation.valid) {
                req.session.massRegistrationSummary = {
                    recordsDone: 0,
                    recordsTotal: 0,
                    errorCount: 1,
                    issues: [fileValidation.error], 
                    successRate: '0.00',
                    message: 'File validation failed.'
                };
                hasResponded = true;
                return res.redirect('/mass-register-done');
            }

            // Read the uploaded Excel file
            const workbook = XLSX.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0]; 
            const sheet = workbook.Sheets[sheetName];

            const rows = XLSX.utils.sheet_to_json(sheet, {
                header: 1,
                defval: '',
            });
            
            let headerCount = CONFIG.HEADER_ROW_COUNT;
            const template = rows[0];
            const headerRow = rows[1];
            const dataRows = rows.slice(3);

            for (let rowIdx = 0; rowIdx < dataRows.length; rowIdx++) {
                const row = dataRows[rowIdx];
                
                // Skip completely empty rows without logging an issue
                if (!row || row.every(cell => cell === '' || cell === null || cell === undefined)) {
                    continue;
                }
                
                nonEmptyRows++;
                const statusEmpty = !row[3] || String(row[3]).trim() === '';
                let member = processMemberData(row);

                if (statusEmpty) {
                    issues.push(`Row ${rowIdx + headerCount}: Member status is empty, defaulting to 'Active'`);
                }

                // Validate member data
                const validation = validateMemberData(member, rowIdx + headerCount);
                if (!validation.valid) {
                    issues.push(...validation.errors);
                    continue;
                }

                try {
                    const memberResult = await memberController.bulkRegisterMember(member, {
                        groupId: req.session.groupId,
                        projectId: req.session.projectId,
                        clusterId: req.session.clusterId
                    });

                    if (memberResult && memberResult.success) {
                        const createdMember = memberResult.member;
                        
                        // Log warning if there was an update error
                        if (memberResult.warning) {
                            console.warn(`${memberResult.warning}`);
                            issues.push(`Row ${rowIdx + headerCount}: Warning - ${memberResult.warning}`);
                        }
                        
                        let savingDoc = null;
                        let monthsData = {};
                        let year = null;

                        if (template[1] === 'YEARLY') {
                            for (let i = 6; i < headerRow.length; i += 2) {
                                const value = parseNumber(dataRows[rowIdx][i]);
                                year = headerRow[i];
                                const matchValue = parseNumber(dataRows[rowIdx][i + 1]);
                                
                                if (year && (value > 0 || matchValue > 0)) {
                                    console.log(`Saving for member ${createdMember.name?.firstName} ${createdMember.name?.lastName} - Year: ${year}, Value: ${value}, Match: ${matchValue}`);
                                    
                                    savingDoc = new Saving({
                                        memberID: createdMember._id,
                                        year: parseNumber(year),
                                        totalSaving: value,
                                        totalMatch: matchValue,
                                    });
                                    
                                    await savingDoc.save();
                                    createdMember.savings.push(savingDoc._id);
                                    createdMember.totalSaving += value;
                                    createdMember.totalMatch += matchValue;
                                }
                            }
                        } else {
                            // MONTHLY ENCODING: accumulate all months for the year in one doc
                            let yearTotalSaving = 0;
                            let yearTotalMatch = 0;
                            monthsData = {};
                            year = template[2];

                            for (let i = 6; i < headerRow.length; i += 2) {
                                const month = headerRow[i];
                                const value = parseNumber(dataRows[rowIdx][i]);
                                const matchValue = parseNumber(dataRows[rowIdx][i + 1]);
                                
                               if (month && (value > 0 || matchValue > 0)) {
                                    let monthKey = mapMonthNameToSchemaKey(month);
                                    if (monthKey) {
                                        monthsData[monthKey] = {
                                            savings: value,
                                            match: matchValue
                                        };
                                        yearTotalSaving += value;
                                        yearTotalMatch += matchValue;
                                        
                                        console.log(`Saving for member ${createdMember.name?.firstName} ${createdMember.name?.lastName} - Year: ${year}, Month: ${month}, Value: ${value}, Match: ${matchValue}`);
                                    }
                                }
                            }
                            
                            
                            if (Object.keys(monthsData).length > 0) {
                                savingDoc = new Saving({
                                    memberID: createdMember._id,
                                    year: parseNumber(year),
                                    ...monthsData,
                                    totalSaving: yearTotalSaving,
                                    totalMatch: yearTotalMatch,
                                });
                                
                                await savingDoc.save();
                                createdMember.savings.push(savingDoc._id);
                                createdMember.totalSaving += yearTotalSaving;
                                createdMember.totalMatch += yearTotalMatch;
                            }
                        }

                        await createdMember.save();
                        members.push(createdMember); 
                        logCount++;
                        
                    } else {
                        // Handle different error types from the memberResult
                        if (memberResult && memberResult.error === 'DUPLICATE_ORG_ID') {
                            console.log(`Member ${member.name?.firstName} ${member.name?.lastName} could not be created - duplicate ID.`);
                            issues.push(`Row ${rowIdx + headerCount}: Member with ID ${member.orgId} already exists.`);
                        } else if (memberResult && memberResult.error === 'CREATION_ERROR') {
                            console.log(`Member ${member.name?.firstName} ${member.name?.lastName} could not be created - creation error.`);
                            issues.push(`Row ${rowIdx + headerCount}: Member ${member.name?.firstName} ${member.name?.lastName} could not be created - ${memberResult.message}`);
                        } else {
                            console.log(`Member ${member.name?.firstName} ${member.name?.lastName} could not be created.`);
                            issues.push(`Row ${rowIdx + headerCount}: Member ${member.name?.firstName} ${member.name?.lastName} could not be created.`);
                        }
                        continue;
                    }
                
                } catch (error) {
                    console.error(`Error saving member ${member.name?.firstName} ${member.name?.lastName}:`, error);
                    issues.push(`Row ${rowIdx + headerCount}: Member ${member.name?.firstName} ${member.name?.lastName} could not be created - ${error.message}`);
                }
            }
            
            if (logCount > 0) {
                console.log(`Successfully processed ${logCount} members.`);
                req.session.massRegistrationSummary = {
                    recordsDone: logCount,
                    recordsTotal: nonEmptyRows,
                    errorCount: nonEmptyRows - logCount,
                    issues: issues, 
                    successRate: nonEmptyRows > 0 ? ((logCount / nonEmptyRows) * 100).toFixed(2) : '0.00',
                    message: `Successfully processed ${logCount} of ${nonEmptyRows} members.`
                };
            } else {
                console.log('No members saved.');
                req.session.massRegistrationSummary = {
                    recordsDone: 0,
                    recordsTotal: nonEmptyRows,
                    errorCount: nonEmptyRows,
                    issues: issues,
                    successRate: '0.00',
                    message: 'No members were saved.'
                };
            }
            
        } catch (err) {
            console.error('Unhandled error:', err);
            req.session.massRegistrationSummary = {
                recordsDone: logCount,
                recordsTotal: nonEmptyRows || 0,
                errorCount: (nonEmptyRows || 0) -logCount + 1,
                issues: [...issues, `System error: ${err.message}`],
                successRate: '0.00',
                message: 'An error occurred while processing the file.'
            };
        } finally {
            if (req.file && req.file.path) {
                try {
                    fs.unlinkSync(req.file.path);
                    console.log('File deleted successfully');
                } catch (err) {
                    console.error('Error deleting file:', err);
                }
            }

            if (!hasResponded) {
                return res.redirect('/mass-register-done');
            }
        }
    }
};