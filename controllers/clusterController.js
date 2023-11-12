const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');

const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');
const { updateOrgParts, getOrgParts } = require('../controllers/functions/sharedData');
const { dashboardButtons } = require('../controllers/functions/buttons');

const clusterController = {

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
                    return res.redirect("/project");
                }
                if (req.session.authority == "Treasurer") {
                    return res.redirect("/member");
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
                let totalPages;
                if (orgParts.length !== 0) {
                    totalPages = Math.ceil(orgParts.length / perPage);
                    if (page > totalPages) {
                        return res.redirect("/cluster");
                    }
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
                res.render("cluster", { authority, pageParts, username, sidebar, dashbuttons, page, totalPages, search: req.query.search });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while fetching data." });
        }
    },

    //create a new cluster
    newCluster: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const { name, location } = req.body;
                const existingCluster = await Cluster.findOne({ name });
                if (existingCluster) {
                    return res.json({ error: "A Cluster with the same name already exists." });
                }
                let projects = [];
                const newCluster = new Cluster({
                    name,
                    location,
                    projects,
                });
                await newCluster.save();
                res.json({ success: "A Cluster has been added." });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            return res.status(500).json({ error: "An error occurred while creating a new cluster    ." });
        }
    },

    // edit cluster
    editCluster: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const clusterId = req.params.id;
                const cluster = await Cluster.findById(clusterId);
                const { name, oldName } = req.body;
                if (oldName !== name) {
                    const existingCluster = await Cluster.findOne({ name });
                    if (existingCluster) {
                        return res.status(400).json({ error: "A Cluster with the same name already exists." });
                    }
                }
                updateData = req.body;
                const updateCluster = await Cluster.findOneAndUpdate({ name: cluster.name }, updateData, { new: true });
                if (updateCluster) {
                    res.redirect("/cluster");
                } else {
                    return res.status(500).render("fail", { error: "Update error!" });
                }
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while editing the group." });
        }
    },

    deleteCluster: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const clusterId = req.params.id;
                const cluster = await Cluster.findById(clusterId);
                let project, group;
                if (Array.isArray(cluster.projects)) {
                    for (const projectId of cluster.projects) {
                        project = await Project.findById(projectId);
                        if (Array.isArray(project.groups)) {
                            for (const groupId of project.groups) {
                                group = await Group.findById(groupId);
                                if (Array.isArray(group.members)) {
                                    for (const member of group.members) {
                                        await Saving.deleteMany({ memberID: member._id });
                                        await Member.deleteOne({ _id: member._id });
                                    }
                                }
                                await Group.deleteOne({ _id: group });
                            }
                        }
                        await Project.deleteOne({ _id: project })
                    }
                }
                const deletedCluster = await Cluster.findByIdAndDelete(clusterId);
                if (deletedCluster) {
                    return res.json(deletedCluster);
                } else {
                    return res.status(404).json({ error: "Delete error!" });
                }
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while deleting the cluster." });
        }
    },

    loadEditClusterForm: async (req, res) => {
        const clusterId = req.params.clusterId;
        const cluster = await Cluster.findOne({ _id: clusterId });
        res.render('components/popups/popupFields/ClusterFormFields', { cluster });
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
    }

}

module.exports = clusterController;