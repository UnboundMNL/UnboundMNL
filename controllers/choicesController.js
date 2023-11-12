const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');

const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');
const { updateOrgParts, getOrgParts } = require('../controllers/functions/sharedData');
const { dashboardButtons } = require('../controllers/functions/buttons');

const choicesController = {

    SHGChoices: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                let { projectId } = req.body;
                const project = await Project.findOne({ _id: projectId });
                const shg = await Group.find({ _id: { $in: project.groups } });
                res.json({ shg });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while retrieving group information." });
        }
    },

    projectChoices: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                let { clusterId } = req.body;
                const cluster = await Cluster.findOne({ _id: clusterId });
                const project = await Project.find({
                    _id: { $in: cluster.projects },
                    totalGroups: { $gt: 0 }
                });
                res.json({ project });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while retrieving project information." });

        }
    },

    clusterChoices: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const cluster = await Cluster.find({ totalGroups: { $gt: 0 } });
                res.json({ cluster });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while retrieving group information." });

        }
    },
    
}

module.exports = choicesController;