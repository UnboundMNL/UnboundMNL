const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');
const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');

const { dashboardButtons } = require('../controllers/functions/buttons');
const { updateOrgParts, getOrgParts } = require('../controllers/functions/sharedData');

const profileController = {

    dashboard: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const userID = req.session.userId;
                const sidebar = req.session.sidebar;
                const user = await User.findById(userID);
                const authority = user.authority;
                const username = user.username;
                let orgParts;
                let nCluster = 0;
                let nProject = 0;
                let nGroup = 0;
                let nMember = 0;
                let savings = 0;
                let allSaving;
                let memberList;
                let savingIds;
                let memberIds;

                switch (authority) {
                    case "Admin":
                        allSaving = await Saving.find({});
                        for (const item of allSaving) {
                            savings += item.totalSaving;
                        }
                        nCluster = await Cluster.countDocuments();
                        nProject = await Project.countDocuments();
                        nGroup = await Group.countDocuments();
                        nMember = await Member.countDocuments();
                        break;
                    case "SEDO":
                        const cluster = await Cluster.findOne({ _id: user.validCluster });
                        if (cluster) {
                            nProject = cluster.totalProjects;
                            nGroup = cluster.totalGroups;
                            nMember = cluster.totalMembers;
                            savings = cluster.totalKaban;
                            const projectList = await Project.find({ _id: { $in: cluster.projects } });
                            const groupIds = projectList.flatMap(project => project.groups);
                            const groupList = await Group.find({ _id: { $in: groupIds } });
                            memberIds = groupList.flatMap(group => group.members);
                            memberList = await Member.find({ _id: { $in: memberIds } });
                            savingIds = memberList.flatMap(member => member.savings);
                            allSaving = await Saving.find({ _id: { $in: savingIds } })
                        }
                        break;
                    case "Treasurer":
                        const group = await Group.find({ _id: user.validGroup });
                        nMember = group.totalMembers;
                        savings = group.totalKaban;
                        memberIds = group.flatMap(group => group.members);
                        memberList = await Member.find({ _id: { $in: memberIds } });
                        savingIds = memberList.flatMap(member => member.savings);
                        allSaving = await Saving.find({ _id: { $in: savingIds } });
                        break;
                    default:
                        break;
                }
                const monthCounts = {};
                const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                months.forEach((month) => {
                    monthCounts[month] = 0;
                });
                if (allSaving) {
                    allSaving.forEach((saving) => {
                        months.forEach((month) => {
                            if (saving[month].savings > 0) {
                                monthCounts[month]++;
                            }
                        });
                    });
                } else {
                    months.forEach((month) => {
                        monthCounts[month] = 0;
                    })
                }
                dashbuttons = dashboardButtons(authority);
                res.render("dashboard", { authority, orgParts, username, dashbuttons, sidebar, nCluster, nProject, nGroup, nMember, savings, monthCounts });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while fetching data." });
        }
    },

    profile: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const userID = req.session.userId;
                const sidebar = req.session.sidebar;
                const user = await User.findById(userID);
                const authority = user.authority;
                const username = user.username;
                const user1 = user;
                dashbuttons = dashboardButtons(authority);
                res.render("profile", { user1, authority, username, dashbuttons, sidebar });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while fetching data." });
        }
    },

    editProfile: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const userID = req.session.userId;
                let user = await User.findById(userID);
                const username = user.username;
                const newUsername = req.body.username;
                const newPassword = req.body.password;
                const updateData = req.body;
                newPassword = newPassword.toString();
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$/;
                if (username === newUsername) {
                    delete updateData.username;
                } else {
                    let tempUser = await User.findOne({ username: newUsername })
                    if (tempUser) {
                        return res.status(300).json({ error: "Username has already been taken. Choose a different username." })
                    }
                }
                if (newPassword !== "" && !passwordRegex.test(newPassword)) {
                    return res.status(400).json({ error: "Passwod should be at least 6 characters long, and containing only alphanumeric characters" });
                }
                if (((newPassword !== "") && (req.body.password === req.body.repassword))) {
                    updateData.password = newPassword;
                } else {

                    delete updateData.password;
                    delete updateData.repassword;
                    req.session.expires = null;
                }
                const usernameRegex = /^(?=.{3,15}$)(?=.*[a-zA-Z0-9])[a-zA-Z0-9_-]*$/;
                if (!usernameRegex.test(newUsername) || newUsername.toLowerCase() === "visitor") {
                    return res.status(401).json({ error: "Username must contain at least one letter or number, and be between 3-15 characters long, and cannot be 'visitor!" });
                }
                user = await User.findOneAndUpdate({ username: username }, updateData, { new: true });
                if (user) {
                    return res.redirect("/profile");;
                } else {
                    return res.status(404).json({ error: "User not found" });
                }
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while fetching data." });
        }
    }

}

module.exports = profileController;