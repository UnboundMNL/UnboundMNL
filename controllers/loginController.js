const User = require('../models/User');
const mongoose = require('mongoose')
const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');
const loginController = {

    login: async (req, res) => {
        try {
            console.log("does req.session not exist?", !req.session.isLoggedIn);
            if (!req.session.isLoggedIn) {
                let { username, password, remember } = req.body;
                const user = await User.findOne({ username: username });
                if (!user) {
                    return res.status(401).json({ error: "User not found" });
                }
                const isPasswordMatch = await user.comparePassword(password);
                req.session.authority = user.authority;
                if (user.authority == "SEDO") {
                    req.session.clusterId = user.validCluster;
                } else if (user.authority == "Treasurer") {
                    req.session.groupId = user.validGroup;
                    const project = await Project.findOne({
                        groups: { $in: [req.session.groupId] }
                    });
                    req.session.projectId = project._id;
                    const cluster = await Cluster.findOne({
                        projects: { $in: [req.session.projectId] }
                    });
                    req.session.clusterId = cluster._id;
                }
                if (!isPasswordMatch) {
                    return res.status(401).json({ error: "Incorrect Password" });
                }
                req.session.isLoggedIn = true;
                req.session.userId = user._id;
                req.session.sidebar = true;
                if (!remember) {
                    req.session.cookie.expires = false;
                }
                req.session.rememberMe = remember;
                res.json();
            } else {
                res.redirect("/dashboard");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "DB error." });
        }
    },

    logout: async (req, res) => {
        try {
            req.session.destroy();
            res.json();
        } catch (err) {
            console.error('Error logging out:', err);
            return new Error('Error logging out');
        }
        res.status(200).send();
    },

    clearSession: (req, res) => {
        try {
            req.session.destroy((error) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ error: "Failed to clear the session." });
                } else {
                    res.sendStatus(200);
                    console.log("Session destroyed.")
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Server error." });
        }
    }

}

module.exports = loginController;