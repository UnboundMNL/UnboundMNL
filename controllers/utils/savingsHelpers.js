const Saving = require('../../models/Saving');
const Group = require('../../models/Group');
const Project = require('../../models/Project');
const Cluster = require('../../models/Cluster');
const { parseNumber, mapMonthNameToSchemaKey, isValidNumericValue } = require('./uploadHelpers');

// Helper function to process monthly savings
async function processMonthlySavings(createdMember, headerRow, dataRows, rowIdx, sessionData, year) {
    let yearTotalSaving = 0;
    let yearTotalMatch = 0;
    let totalDeductions = 0;
    const monthsData = {};

    // Validate if member belongs to the inputted cluster, project, and group
    if (sessionData.clusterId && String(createdMember.clusterId) !== String(sessionData.clusterId)) {
        console.log(`Member ${createdMember.name?.firstName} ${createdMember.name?.lastName} belongs to different cluster. Expected: ${sessionData.clusterId}, Got: ${createdMember.clusterId}`);
        return -1; // Return -1 to indicate member doesn't belong to this cluster
    }

    if (sessionData.projectId && String(createdMember.projectId) !== String(sessionData.projectId)) {
        console.log(`Member ${createdMember.name?.firstName} ${createdMember.name?.lastName} belongs to different project. Expected: ${sessionData.projectId}, Got: ${createdMember.projectId}`);
        return -1; // Return -1 to indicate member doesn't belong to this project
    }

    if (sessionData.groupId && String(createdMember.groupId) !== String(sessionData.groupId)) {
        console.log(`Member ${createdMember.name?.firstName} ${createdMember.name?.lastName} belongs to different group. Expected: ${sessionData.groupId}, Got: ${createdMember.groupId}`);
        return -1; // Return -1 to indicate member doesn't belong to this group
    }

    // Check if saving for this year already exists
    const existingSaving = await Saving.findOne({
        memberID: createdMember._id,
        year: parseNumber(year)
    });
    
    if (existingSaving) {
        return 0; // Return 0 to indicate no new saving was created
    }

    // First pass: find deductions value
    for (let i = 5; i < headerRow.length; i++) {
        const month = headerRow[i] ? String(headerRow[i]).trim() : '';
        const rawValue = dataRows[rowIdx][i];
        
        if (month && String(month).toLowerCase().includes('deductions')) {
            if (!isValidNumericValue(rawValue)) {
                return {
                    error: true,
                    message: `Invalid deductions value: "${rawValue}" - must be a number`
                };
            }
            totalDeductions = parseNumber(rawValue);
            break;
        }
    }

    // Second pass: process month columns and validate values
    for (let i = 5; i < headerRow.length; i += 2) {
        const month = headerRow[i] ? String(headerRow[i]).trim() : '';
        const rawSavingsValue = dataRows[rowIdx][i];
        const rawMatchValue = dataRows[rowIdx][i + 1];
        
        if (month && !String(month).toLowerCase().includes('deductions')) {
            // Validate savings value
            if (!isValidNumericValue(rawSavingsValue)) {
                return {
                    error: true,
                    message: `Invalid ${month} savings value: "${rawSavingsValue}" - must be a number`
                };
            }
            
            // Validate match value
            if (!isValidNumericValue(rawMatchValue)) {
                return {
                    error: true,
                    message: `Invalid ${month} match value: "${rawMatchValue}" - must be a number`
                };
            }
            
            let monthKey = mapMonthNameToSchemaKey(month);
            if (monthKey) {
                const value = parseNumber(rawSavingsValue);
                const matchValue = parseNumber(rawMatchValue);
                
                // Skip if both values are 0 or empty
                if (value === 0 && matchValue === 0) {
                    continue;
                }
                
                monthsData[monthKey] = {
                    savings: value,
                    match: matchValue
                };
                yearTotalSaving += value;
                yearTotalMatch += matchValue;
            }
        }
    }
    
    if (Object.keys(monthsData).length > 0) {
        const savingDoc = new Saving({
            memberID: createdMember._id,
            year: parseNumber(year),
            ...monthsData,
            totalSaving: yearTotalSaving,
            totalMatch: yearTotalMatch,
            totalDeductions: totalDeductions, 
        });
        
        await savingDoc.save();
        createdMember.savings.push(savingDoc._id);
        
        // Update member totals (only add new amounts)
        createdMember.totalSaving += yearTotalSaving;
        createdMember.totalMatch += yearTotalMatch;
        createdMember.totalDeductions += totalDeductions;

        // Update totals
        await updateOrganizationTotals(sessionData, yearTotalSaving);
        
    }
    return 1; // Return 1 to indicate a new saving was created
}

// Helper function to update organization totals
async function updateOrganizationTotals(sessionData, totalAmount) {
    const group = await Group.findById(sessionData.groupId);
    if (group) {
        group.totalKaban += totalAmount;
        await group.save();
    }

    const project = await Project.findById(sessionData.projectId);
    if (project) {
        project.totalKaban += totalAmount;
        await project.save();
    }

    const cluster = await Cluster.findById(sessionData.clusterId);
    if (cluster) {
        cluster.totalKaban += totalAmount;
        await cluster.save();
    }
}

module.exports = {
    processMonthlySavings,
    updateOrganizationTotals
};