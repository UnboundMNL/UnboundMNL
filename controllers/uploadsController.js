const XLSX = require('xlsx');
const Saving = require('../models/Saving');
const memberController = require('../controllers/memberController.js');
const path = require('path');
const fs = require('fs');

const CONFIG = {
    SUPPORTED_FORMATS: ['.xlsx', '.xls'],
    HEADER_ROW_COUNT: 3, // Adjust this based on your Excel file structure
    ENCODING_TYPES: ['YEARLY', 'MONTHLY'] // Supported encoding types
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
    
    monthName = String(monthName).trim().toLowerCase();
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
    
    const statusLower = status.toLowerCase();
    const statusMap = {
        'active': 'Active',
        'rws': 'RwS', // Retired with Savings
        'rwos': 'RwoS' // Retired without Savings
    };
    return statusMap[statusLower] || status;
}

// Helper function to validate member data
function validateMemberData(member, rowIndex) {
    const errors = []; 
    
    const missingFields = [];
    if (!member.name?.firstName?.trim()) missingFields.push('First name');
    if (!member.name?.lastName?.trim()) missingFields.push('Last name');
    if (!member.orgId?.trim()) missingFields.push('Organization ID');
    if (missingFields.length > 0) {
        errors.push(`Row ${rowIndex}: User not added - ${missingFields.join(', ')} ${missingFields.length === 1 ? 'is' : 'are'} required`);
    }

    // Disallow numerals in first or last name
    const hasNumber = str => /\d/.test(str);
    if (member.name?.firstName && hasNumber(member.name.firstName)) {
        errors.push(`Row ${rowIndex}: User not added - First name cannot contain numbers`);
    }
    if (member.name?.lastName && hasNumber(member.name.lastName)) {
        errors.push(`Row ${rowIndex}: User not added - Last name cannot contain numbers`);
    }

    // Disallow numerals in parentName
    if (member.parentName && hasNumber(member.parentName)) {
        errors.push(`Row ${rowIndex}: User not added - Parent name cannot contain numbers`);
    }

    if (member.originalStatus && member.originalStatus.trim() !== '' && !['Active', 'RwS', 'RwoS'].includes(member.status)) {
        errors.push(`Row ${rowIndex}: User not added - Invalid member status '${member.originalStatus}'. Valid options are: Active, RwS, RwoS`);
    }

    return {
        valid: errors.length === 0,
        errors: errors
    };
}

// Helper function to process each member's data
function processMemberData(row) {
    const originalStatus = row[2] ? String(row[2]).trim() : '';
    
    return {
        name: {
            lastName: row[0] ? String(row[0]).trim() : '',
            firstName: row[1] ? String(row[1]).trim() : '',
        },
        status: originalStatus ? mapMemberStatus(originalStatus) : 'Active',
        orgId: row[3] ? String(row[3]).trim() : '',
        parentName: row[4] && String(row[4]).trim() !== '' ? String(row[4]).trim() : 'Unknown',
        originalStatus: originalStatus,
        statusWasEmpty: !originalStatus || originalStatus === '',
        parentWasEmpty: !row[4] || String(row[4]).trim() === ''
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
            const encoding = template[0] ? String(template[0]).trim().toUpperCase() : '';
            const headerRow = rows[1];
            const dataRows = rows.slice(headerCount);

            if (!CONFIG.ENCODING_TYPES.includes(encoding)) {
                req.session.massRegistrationSummary = {
                    recordsDone: 0,
                    recordsTotal: 0,
                    errorCount: 1,
                    issues: ['Invalid encoding type. Expected "YEARLY" or "MONTHLY".'],
                    successRate: '0.00',
                    message: 'Invalid encoding type. Expected "YEARLY" or "MONTHLY".'
                };
                hasResponded = true;
                return res.redirect('/mass-register-done');
            }

            for (let rowIdx = 0; rowIdx < dataRows.length; rowIdx++) {
                const row = dataRows[rowIdx];
                
                // Skip completely empty rows without logging an issue
                if (!row || row.every(cell => cell === '' || cell === null || cell === undefined)) {
                    continue;
                }
                
                nonEmptyRows++;
                let member = processMemberData(row);

                const memberForValidation = {
                    name: member.name,
                    status: member.status,
                    orgId: member.orgId,
                    parentName: member.parentName,
                    originalStatus: member.originalStatus
                };

                // Validate member data
                const validation = validateMemberData(memberForValidation, rowIdx + headerCount + 1);
                if (!validation.valid) {
                    issues.push(...validation.errors);
                    continue;
                }

                try {
                    const memberData = {
                        name: member.name,
                        status: member.status,
                        orgId: member.orgId,
                        parentName: member.parentName
                    };

                    // Check if the member already exists, if not, create a new member
                    const memberResult = await memberController.bulkRegisterMember(memberData, {
                        groupId: req.session.groupId,
                        projectId: req.session.projectId,
                        clusterId: req.session.clusterId
                    });

                    if (memberResult && memberResult.success) {
                        const createdMember = memberResult.member;

                        if (member.statusWasEmpty) {
                            issues.push(`Row ${rowIdx + headerCount + 1}: User added - Member status was empty, defaulted to 'Active'`);
                        }
                        if (member.parentWasEmpty) {
                            issues.push(`Row ${rowIdx + headerCount + 1}: User added - Parent name was empty, defaulted to 'Unknown'`);
                        }

                        // Log warning if there was an update error
                        if (memberResult.warning) {
                            console.warn(`${memberResult.warning}`);
                            issues.push(`Row ${rowIdx + headerCount + 1}: Warning - ${memberResult.warning}`);
                        }
                        
                        let savingDoc = null;
                        let monthsData = {};
                        let year = null;

                        if (encoding === 'YEARLY') {
                            for (let i = 6; i < headerRow.length; i += 2) {
                                const value = parseNumber(dataRows[rowIdx][i]);
                                year = headerRow[i];
                                const matchValue = parseNumber(dataRows[rowIdx][i + 1]);
                                
                                // If the year is not defined, skip this iteration
                                if (year) {
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

                                    console.log(`Saving for member ${createdMember.name?.firstName} ${createdMember.name?.lastName} - Year: ${year}, Value: ${value}, Match: ${matchValue}`);
                                }
                            }

                        } else  {
                            // MONTHLY ENCODING: accumulate all months for the year in one doc
                            let yearTotalSaving = 0;
                            let yearTotalMatch = 0;
                            monthsData = {};
                            year = template[1];

                            for (let i = 6; i < headerRow.length; i += 2) {
                                const month = headerRow[i] ? String(headerRow[i]).trim() : '';
                                const value = parseNumber(dataRows[rowIdx][i]);
                                const matchValue = parseNumber(dataRows[rowIdx][i + 1]);
                                
                               if (month) {
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
                            issues.push(`Row ${rowIdx + headerCount + 1}: User not added - Member with ID ${member.orgId} already exists`);
                        } else if (memberResult && memberResult.error === 'CREATION_ERROR') {
                            console.log(`Member ${member.name?.firstName} ${member.name?.lastName} could not be created - creation error.`);
                            issues.push(`Row ${rowIdx + headerCount + 1}: User not added - Member ${member.name?.firstName} ${member.name?.lastName} could not be created - ${memberResult.message}`);
                        } else {
                            console.log(`Member ${member.name?.firstName} ${member.name?.lastName} could not be created.`);
                            issues.push(`Row ${rowIdx + headerCount + 1}: User not added - Member ${member.name?.firstName} ${member.name?.lastName} could not be created`);
                        }
                        continue;
                    }
                
                } catch (error) {
                    console.error(`Error saving member ${member.name?.firstName} ${member.name?.lastName}:`, error);
                    issues.push(`Row ${rowIdx + headerCount + 1}: User not added - Member ${member.name?.firstName} ${member.name?.lastName} could not be created - ${error.message}`);
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
                successRate: logCount > 0 && nonEmptyRows > 0 ? ((logCount / nonEmptyRows) * 100).toFixed(2) : '0.00',
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