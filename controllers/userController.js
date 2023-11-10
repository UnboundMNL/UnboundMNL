let sharedData = {};

const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');
const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');

const { dashboardButtons } = require('../controllers/functions/buttons');
const { updateOrgParts, getOrgParts } = require('../controllers/functions/sharedData');

const userController = {

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
<<<<<<< HEAD
                switch (authority) {
                    case "Admin":
                        const allSaving = await Saving.find({});
                        for (item in allSaving) {
=======
                let allSaving;
                switch (authority) {
                    case "Admin":
                        allSaving = await Saving.find({});
                        for (const item of allSaving) {
>>>>>>> 04f7f935db62c1cb100d6e36884b4eeda2819cd5
                            savings += item.totalSavings;
                        }
                        nCluster = await Cluster.countDocuments();
                        nProject = await Project.countDocuments();
                        nGroup = await Group.countDocuments();
                        nMember = await Member.countDocuments();
                        break;
                    case "SEDO":
                        const cluster = await Cluster.findOne({ _id: user.validCluster });
                        nProject = cluster.totalProjects;
                        nGroup = cluster.totalGroups;
                        nMember = cluster.totalMembers;
                        savings = cluster.totalKaban;
                        break;
                    case "Treasurer":
                        const group = await Group.find({ _id: user.validGroup });
                        nMember = group.totalMembers;
                        savings = group.totalKaban;
                        break;
                    default:
                        break;
                }
<<<<<<< HEAD
                dashbuttons = dashboardButtons(authority);
                res.render("dashboard", { authority, orgParts, username, dashbuttons, sidebar, nCluster, nProject, nGroup, nMember, savings });
=======
                const monthCounts = {};
                const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                months.forEach((month) => {
                    monthCounts[month] = 0;
                });

                allSaving.forEach((saving) => {
                    months.forEach((month) => {
                        if (saving[month].savings > 0) {
                            monthCounts[month]++;
                        }
                    });
                });
                dashbuttons = dashboardButtons(authority);
                res.render("dashboard", { authority, orgParts, username, dashbuttons, sidebar, nCluster, nProject, nGroup, nMember, savings, monthCounts });
>>>>>>> 04f7f935db62c1cb100d6e36884b4eeda2819cd5
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while fetching data." });
        }
    },

    cluster: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                let page = req.params.page;
                const userID = req.session.userId;
                const sidebar = req.session.sidebar;
                const user = await User.findById(userID);
                const authority = user.authority;
                const username = user.username;
                if (req.session.authority == "SEDO") {
                    res.redirect("/project")
                }
                if (req.session.authority == "Treasurer") {
                    res.redirect("/member")
                }
                if (authority !== "Admin") {
                    return res.status(403).render("fail", { error: "You are not authorized to view this page." });
                }
                let updatedParts;
                if (req.query.search) {
                    updatedParts = await Cluster.find({ name: { $regex: req.query.search } });
                } else {
                    updatedParts = await Cluster.find({});
                }
                const orgParts = updatedParts;
                let pageParts = [];
                let perPage = 6; // change to how many clusters per page
                let totalPages = Math.ceil(orgParts.length / perPage);
                if (page > totalPages) {
                    res.redirect("/cluster")
                }
                if (orgParts.length > perPage) {
                    let startPage = perPage * (page - 1);
                    for (let i = 0; i < perPage && (startPage + i < orgParts.length); i++) {
                        pageParts.push(orgParts[startPage + i]);
                    }
                } else {
                    pageParts = orgParts;
                    totalPages = 1;
                }
                dashbuttons = dashboardButtons(authority);
                res.render("cluster", { authority, pageParts, username, sidebar, dashbuttons, page, totalPages });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while fetching data." });
        }
    },

    member: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const userID = req.session.userId;
                const sidebar = req.session.sidebar;
                const user = await User.findById(userID);
                const authority = user.authority;
                const username = user.username;
                const updatedParts = [];
                await updateOrgParts(updatedParts);
                const orgParts = getOrgParts();
                dashbuttons = dashboardButtons(authority);
                res.render("member", { authority, username, dashbuttons, sidebar, orgParts });
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
<<<<<<< HEAD
                    console.log("invalid new password");
                    return res.status(400).json({ error: "Passwod should be at least 6 characters long, and containing only alphanumeric characters" });
                }
                if (((newPassword !== "") && (req.body.password === req.body.repassword))) {
                    console.log("valid new password")
                    updateData.password = newPassword;
                } else {
                    console.log("no new password")
=======
                    return res.status(400).json({ error: "Passwod should be at least 6 characters long, and containing only alphanumeric characters" });
                }
                if (((newPassword !== "") && (req.body.password === req.body.repassword))) {
                    updateData.password = newPassword;
                } else {
    
>>>>>>> 04f7f935db62c1cb100d6e36884b4eeda2819cd5
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
    },

    clusterMiddle: async (req, res) => {
        try {
            req.session.clusterId = req.body.id;
            delete req.session.projectId;
            delete req.session.groupId;
            delete req.session.memberId;
            await req.session.save();
            res.status(200).json({ success: true, message: 'cluster ID saved' });
        } catch (error) {
            console.error(error);
        }
    },
    
    projectMiddle: async (req, res) => {
        try {
            req.session.projectId = req.body.id;
            delete req.session.groupId;
            delete req.session.memberId;
            await req.session.save();
            res.status(200).json({ success: true, message: 'project ID saved' });
        } catch (error) {
            console.error(error);
        }
    },

    groupMiddle: async (req, res) => {
        try {
            req.session.groupId = req.body.id;
            delete req.session.memberId;
<<<<<<< HEAD
            console.log("Group Middle: ", req.session.groupId);
=======
>>>>>>> 04f7f935db62c1cb100d6e36884b4eeda2819cd5
            await req.session.save();
            res.status(200).json({ success: true, message: 'group ID saved' });
        } catch (error) {
            console.error(error);
        }
    },

    memberMiddle: async (req, res) => {
        try {
            req.session.memberId = req.body.id;
            await req.session.save();
            res.status(200).json({ success: true, message: 'member ID saved' });
        } catch (error) {
            console.error(error);
        }
    }
    
}

module.exports = userController;