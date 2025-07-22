const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');
const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');
const { updateOrgParts, getOrgParts } = require('../controllers/functions/sharedData');
const { dashboardButtons } = require('../controllers/functions/buttons');

const savingsController = {

    // add new savings
    newSaving: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const { id, year, updateData } = req.body;
                const saving = await Saving.findOne({ memberID: id, year });
                if (saving) { // if there is already a saving for that year
                    let updatedData = {};
                    let totalSavings = 0;
                    let totalMatch = 0;
                    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                    months.forEach(month => {
                        const match = parseInt(updateData[month]?.match || saving[month]?.match || 0, 10);
                        const savings = parseInt(updateData[month]?.savings || saving[month]?.savings || 0, 10);
                        // Accumulate savings and match for the whole year
                        totalMatch += match;
                        totalSavings += savings;

                        updatedData[month] = {
                            match: match,
                            savings: savings
                        };
                    });
                    updatedData.totalSaving = totalSavings;
                    updatedData.totalMatch = totalMatch;
                    
                    // Handle totalDeductions if provided
                    if (updateData.totalDeductions !== undefined) {
                        updatedData.totalDeductions = parseInt(updateData.totalDeductions, 10);
                    }
                    
                    const currentSaving = await Saving.findOne({ memberID: id, year });
                    const member = await Member.findOne({ _id: id });
                    member.totalSaving += (updatedData.totalSaving - currentSaving.totalSaving);

                    member.totalMatch += (updatedData.totalMatch - currentSaving.totalMatch);
                    
                    // Update member totalDeductions if provided
                    if (updatedData.totalDeductions !== undefined) {
                        member.totalDeductions = updatedData.totalDeductions;
                    }
                    const updatedMember = await member.save();
                    const group = await Group.findById(req.session.groupId);
                    group.totalKaban += (updatedData.totalSaving - currentSaving.totalSaving);
                    group.totalKaban += (updatedData.totalMatch - currentSaving.totalMatch);
                    const updatedGroup = await group.save();
                    const project = await Project.findById(req.session.projectId);
                    project.totalKaban += (updatedData.totalSaving - currentSaving.totalSaving);
                    project.totalKaban += (updatedData.totalMatch - currentSaving.totalMatch);
                    const updatedProject = await project.save();
                    const cluster = await Cluster.findById(req.session.clusterId);
                    cluster.totalKaban += (updatedData.totalSaving - currentSaving.totalSaving);
                    cluster.totalKaban += (updatedData.totalMatch - currentSaving.totalMatch);

                    const updatedCluster = await cluster.save();
                    const updatedSaving = await Saving.findOneAndUpdate(
                        { memberID: id, year },
                        updatedData,
                        { new: true }
                    );
                    if (updatedSaving && updatedMember && updatedGroup && updatedProject && updatedCluster) {
                        res.json();
                    }
                } else { // if there aren't savings for the year
                    const newSaving = new Saving({ memberID: id, year });
                    await newSaving.save();
                    let updatedData = {};
                    let totalSavings = 0;
                    let totalMatch = 0;
                    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                    months.forEach(month => {
                        const match = parseInt(updateData[month]?.match || 0, 10);
                        const savings = parseInt(updateData[month]?.savings || 0, 10);
                        // Accumulate savings and match for the whole year
                        totalMatch += match;
                        totalSavings += savings;
                        updatedData[month] = {
                            match: match,
                            savings: savings
                        };
                    });
                    updatedData.totalSaving = totalSavings;
                    updatedData.totalMatch = totalMatch;
                    
                    // Handle totalDeductions if provided
                    if (updateData.totalDeductions !== undefined) {
                        updatedData.totalDeductions = parseInt(updateData.totalDeductions, 10);
                    }

                    const currentSaving = await Saving.findOne({ memberID: id, year });
                    const member = await Member.findOne({ _id: id });
                    member.totalSaving += (updatedData.totalSaving - currentSaving.totalSaving);

                    member.totalMatch += (updatedData.totalMatch - currentSaving.totalMatch);
                    
                    // Update member totalDeductions if provided
                    if (updatedData.totalDeductions !== undefined) {
                        member.totalDeductions = updatedData.totalDeductions;
                    }

                    member.savings.push(newSaving._id);
                    const updatedMember = await member.save();

                    const group = await Group.findById(req.session.groupId);
                    group.totalKaban += updatedData.totalSaving;
                    group.totalKaban += updatedData.totalMatch;
                    const updatedGroup = await group.save();
                    
                    const project = await Project.findById(req.session.projectId);
                    project.totalKaban += updatedData.totalSaving;
                    project.totalKaban += updatedData.totalMatch;
                    const updatedProject = await project.save();
                    
                    const cluster = await Cluster.findById(req.session.clusterId);
                    cluster.totalKaban += updatedData.totalSaving;
                    cluster.totalKaban += updatedData.totalMatch;
                    const updatedCluster = await cluster.save();
                    
                    const updatedSaving = await Saving.findOneAndUpdate(
                        { memberID: id, year }, 
                        updatedData, 
                        { new: true }
                    );
                    
                    if (updatedSaving && updatedMember && updatedGroup && updatedProject && updatedCluster) {
                        res.json({ data: "true" });
                    }
                }
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while saving data." });
        }
    }

}

module.exports = savingsController;
