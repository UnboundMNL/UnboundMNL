const Saving = require('../../models/Saving');
const Group = require('../../models/Group');
const Project = require('../../models/Project');
const Cluster = require('../../models/Cluster');
const { parseNumber, mapMonthNameToSchemaKey } = require('./uploadHelpers');

// Helper function to process yearly savings
async function processYearlySavings(createdMember, headerRow, dataRows, rowIdx, sessionData) {
    for (let i = 5; i < headerRow.length; i += 2) {
        const value = parseNumber(dataRows[rowIdx][i]);
        const year = headerRow[i];
        const matchValue = parseNumber(dataRows[rowIdx][i + 1]);
        
        if (year) {
            const savingDoc = new Saving({
                memberID: createdMember._id,
                year: parseNumber(year),
                totalSaving: value,
                totalMatch: matchValue,
            });
            
            await savingDoc.save();
            createdMember.savings.push(savingDoc._id);
            createdMember.totalSaving += value;
            createdMember.totalMatch += matchValue;

            // Update totals
            await updateOrganizationTotals(sessionData, value);

            console.log(`Saving for member ${createdMember.name?.firstName} ${createdMember.name?.lastName} - Year: ${year}, Value: ${value}, Match: ${matchValue}`);
        }
    }
}

// Helper function to process monthly savings
async function processMonthlySavings(createdMember, headerRow, dataRows, rowIdx, sessionData, year) {
    let yearTotalSaving = 0;
    let yearTotalMatch = 0;
    const monthsData = {};

    for (let i = 5; i < headerRow.length; i += 2) {
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
        const savingDoc = new Saving({
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

        // Update totals
        await updateOrganizationTotals(sessionData, yearTotalSaving);
    }
}

// Helper function to update organization totals
async function updateOrganizationTotals(sessionData, totalAmount) {
    const group = await Group.findById(sessionData.groupId);
    if (group) {
        group.totalKaban = (group.totalKaban || 0) + totalAmount;
        await group.save();
    }

    const project = await Project.findById(sessionData.projectId);
    if (project) {
        project.totalKaban = (project.totalKaban || 0) + totalAmount;
        await project.save();
    }

    const cluster = await Cluster.findById(sessionData.clusterId);
    if (cluster) {
        cluster.totalKaban = (cluster.totalKaban || 0) + totalAmount;
        await cluster.save();
    }
}

module.exports = {
    processYearlySavings,
    processMonthlySavings,
    updateOrganizationTotals
};