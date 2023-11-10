const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');
const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');
const { updateOrgParts, getOrgParts } = require('../controllers/functions/sharedData');
const { dashboardButtons } = require('../controllers/functions/buttons');

async function getAuthorizedMembers(user, authority) {
    let orgParts;
    if (authority === "Admin") {
        orgParts = await Member.find({}).populate("savings");
    } else if (authority === "SEDO") {
        const accessibleProjects = await Project.find({ cluster: user.validCluster });
        const accessibleGroups = await Group.find({ project: { $in: accessibleProjects.map(project => project._id) } });
        orgParts = await Member.find({ group: { $in: accessibleGroups.map(group => group._id) } }).populate("savings");
    } else if (authority === "Treasurer") {
        const accessibleGroup = await Group.findById(user.validGroup);
        if (accessibleGroup) {
            orgParts = await Member.find({ group: accessibleGroup._id }).populate("savings");
        } else {
            orgParts = [];
        }
    } else {
        orgParts = [];
    }
    return orgParts;
}

const savingsController = {

    savings: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const userID = req.session.userId;
                const sidebar = req.session.sidebar;
                const user = await User.findById(userID);
                const authority = user.authority;
                const username = user.username;
                const orgParts = await getAuthorizedMembers(user, authority);
                dashbuttons = dashboardButtons(authority);
                res.render("savings", { authority, username, dashbuttons, sidebar, orgParts });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while fetching data." });
        }
    },

    newSaving: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const { id, year, updateData } = req.body;
                const saving = await Saving.findOne({ memberID: id, year });
                if (saving) {
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
                    updatedData.totalSavings = totalSavings;
                    updatedData.totalMatch = totalMatch;
                    const updatedSaving = await Saving.findOneAndUpdate(
                        { memberID: id, year },
                        updatedData,
                        { new: true }
                    );
                    if (updatedSaving) {
                        res.json();
                    }
                } else {
                    const newSaving = new Saving({ memberID: id, year });
                    await newSaving.save();
                    const member = await Member.findOne({ _id: id });
                    member.savings.push(newSaving._id)
                    member.save();
                    const updatedSaving = await Saving.findOneAndUpdate({ memberID: id, year }, updateData, { new: true });
                    if (updatedSaving) {
                        res.json();
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
