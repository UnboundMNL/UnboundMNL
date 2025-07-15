const XLSX = require('xlsx');
const User = require('../models/User');
const memberController = require('./memberController');
const fs = require('fs');

// Import helper functions
const { 
    CONFIG, 
    validateFileUpload, 
    validateEncoding
} = require('./utils/uploadHelpers');

const { 
    validateMemberData, 
    processMemberData 
} = require('./utils/memberDataHelpers');

const { 
    processMonthlySavings 
} = require('./utils/savingsHelpers');

module.exports = {
    post: async (req, res) => {
        let issues = [];
        let members = [];
        let logCount = 0;
        let nonEmptyRows = 0;
        let hasResponded = false;
        let headerCount = CONFIG.HEADER_ROW_COUNT;
        
        try {
            const selectedCluster = req.body.cluster;
            const selectedSubproject = req.body.subproject;
            const selectedShg = req.body.shg;
            
            console.log('Form selections:', {
                cluster: selectedCluster,
                subproject: selectedSubproject,
                shg: selectedShg
            });
            
            // Validate selections based on authority
            const authority = req.session.authority || (await User.findById(req.session.userId))?.authority;
            
            if (authority === 'Admin') {
                if (!selectedCluster || !selectedSubproject || !selectedShg) {
                    req.session.massRegistrationSummary = {
                        recordsDone: 0,
                        recordsTotal: 0,
                        errorCount: 1,
                        issues: ['Please select cluster, project, and group before uploading.'],
                        successRate: '0.00',
                        message: 'Missing required selections.'
                    };
                    hasResponded = true;
                    return res.redirect('/mass-register-done');
                }
            } else if (authority === 'SEDO') {
                if (!selectedSubproject || !selectedShg) {
                    req.session.massRegistrationSummary = {
                        recordsDone: 0,
                        recordsTotal: 0,
                        errorCount: 1,
                        issues: ['Please select project and group before uploading.'],
                        successRate: '0.00',
                        message: 'Missing required selections.'
                    };
                    hasResponded = true;
                    return res.redirect('/mass-register-done');
                }
            }
            
            // Validate file
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

            // Read Excel file
            const workbook = XLSX.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(sheet, {
                header: 1,
                defval: '',
            });
            
            const headerRow = rows[1];
            const dataRows = rows.slice(headerCount);

            // Validate encoding type
            const encodingValidation = validateEncoding(headerRow);
            if (!encodingValidation.valid) {
                req.session.massRegistrationSummary = {
                    recordsDone: 0,
                    recordsTotal: 0,
                    errorCount: 1,
                    issues: [encodingValidation.error],
                    successRate: '0.00',
                    message: 'File encoding not recognized.'
                };
                hasResponded = true;
                return res.redirect('/mass-register-done');
            }

            // Process each row
            for (let rowIdx = 0; rowIdx < dataRows.length; rowIdx++) {
                const row = dataRows[rowIdx];
                
                // Skip empty rows
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
                    const combinedErrors = validation.errors.join(', ');
                    issues.push(`Row ${rowIdx + headerCount + 1}: User not added - ${combinedErrors}`);
                    continue;
                }

                try {
                    const memberData = {
                        name: member.name,
                        status: member.status,
                        orgId: member.orgId,
                        parentName: member.parentName
                    };

                    // Determine session data based on authority
                    let sessionData = {};
                    if (authority === 'Admin' || authority === 'SEDO') {
                        sessionData = {
                            groupId: selectedShg,
                            projectId: selectedSubproject,
                            clusterId: selectedCluster || req.session.clusterId
                        };
                    } else if (authority === 'Treasurer') {
                        sessionData = {
                            groupId: req.session.groupId,
                            projectId: req.session.projectId,
                            clusterId: req.session.clusterId
                        };
                    }

                    // Create member
                    const memberResult = await memberController.bulkRegisterMember(memberData, sessionData);

                    if (memberResult && memberResult.success) {
                        const createdMember = memberResult.member;
                        const isExistingMember = memberResult.isExisting;

                        // Handle warnings
                        if (!isExistingMember) {
                            if (member.statusWasEmpty && member.parentWasEmpty) {
                                issues.push(`Row ${rowIdx + headerCount + 1}: User added - Member status and parent name were empty, defaulted to 'Active' and 'Unknown'`);
                            } else if (member.statusWasEmpty) {
                                issues.push(`Row ${rowIdx + headerCount + 1}: User added - Member status was empty, defaulted to 'Active'`);
                            } else if (member.parentWasEmpty) {
                                issues.push(`Row ${rowIdx + headerCount + 1}: User added - Parent name was empty, defaulted to 'Unknown'`);
                            }
                        }

                        if (memberResult.warning) {
                            issues.push(`Row ${rowIdx + headerCount + 1}: Warning - ${memberResult.warning}`);
                        }
                        
                        const savingResult = await processMonthlySavings(createdMember, headerRow, dataRows, rowIdx, sessionData, req.body.year);

                        if (savingResult?.error) {
                            issues.push(`Row ${rowIdx + headerCount + 1}: User savings not saved - ${savingResult.message}`);
                        } else if (savingResult === -1) {
                            issues.push(`Row ${rowIdx + headerCount + 1}: User not updated - Member ${createdMember.name?.firstName} ${createdMember.name?.lastName} 
                                does not belong to the selected cluster/project/group`);
                        } else if (savingResult === 0) {
                            issues.push(`Row ${rowIdx + headerCount + 1}: User not updated - Member ${createdMember.name?.firstName} ${createdMember.name?.lastName} 
                                already has savings for the year ${req.body.year}`);
                        } else if (savingResult === 1) {
                            if (isExistingMember) {
                                issues.push(`Row ${rowIdx + headerCount + 1}: User updated - Member ${createdMember.name?.firstName} ${createdMember.name?.lastName} 
                                    exists, updated savings for year ${req.body.year}`);
                            }
                            await createdMember.save();
                            members.push(createdMember);
                            logCount++;
                        }
                        
                    } else {
                        // Handle creation errors
                        if (memberResult?.error === 'CREATION_ERROR') {
                            issues.push(`Row ${rowIdx + headerCount + 1}: User not added - Member ${member.name?.firstName} ${member.name?.lastName} could not be created - ${memberResult.message}`);
                        } else if (memberResult?.error === 'MEMBER_ID_EXISTS_BUT_DIFFERENT_NAME') {
                            issues.push(`Row ${rowIdx + headerCount + 1}: User not added - Member ${member.name?.firstName} ${member.name?.lastName} failed validation - ${memberResult.message}`);
                            
                        } else {
                            issues.push(`Row ${rowIdx + headerCount + 1}: User not added - Member ${member.name?.firstName} ${member.name?.lastName} could not be created`);
                        }
                    }
                
                } catch (error) {
                    console.error(`Error saving member ${member.name?.firstName} ${member.name?.lastName}:`, error);
                    issues.push(`Row ${rowIdx + headerCount + 1}: User not added - Member ${member.name?.firstName} ${member.name?.lastName} could not be created - ${error.message}`);
                }
            }
            
            // Set summary
            req.session.massRegistrationSummary = {
                recordsDone: logCount,
                recordsTotal: nonEmptyRows,
                errorCount: nonEmptyRows - logCount,
                issues: issues,
                successRate: nonEmptyRows > 0 ? ((logCount / nonEmptyRows) * 100).toFixed(2) : '0.00',
                message: logCount > 0 ? `Successfully processed ${logCount} of ${nonEmptyRows} members.` : 'No members were saved.'
            };
            
        } catch (err) {
            console.error('Unhandled error:', err);
            req.session.massRegistrationSummary = {
                recordsDone: logCount,
                recordsTotal: nonEmptyRows || 0,
                errorCount: (nonEmptyRows || 0) - logCount + 1,
                issues: [...issues, `System error: ${err.message}`],
                successRate: logCount > 0 && nonEmptyRows > 0 ? ((logCount / nonEmptyRows) * 100).toFixed(2) : '0.00',
                message: 'An error occurred while processing the file.'
            };
        } finally {
            if (req.file && req.file.path) {
                try {
                    fs.unlinkSync(req.file.path);
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