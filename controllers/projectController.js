const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');

const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');
const { updateOrgParts, getOrgParts } = require('../controllers/functions/sharedData');
const { dashboardButtons } = require('../controllers/functions/buttons');

const projectController = {

    //retrieve projects of a cluster
    project: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                if (req.session.authority == "Treasurer") {
                    return res.redirect("/group");
                }
                const sidebar = req.session.sidebar;
                const page = req.params.page;
                const userID = req.session.userId;
                const user = await User.findById(userID);
                const authority = user.authority;
                const username = user.username;
                let cluster = await Cluster.findOne({ _id: req.session.clusterId });
                if (authority == "SEDO") {
                    id = user.validCluster;
                    cluster = await Cluster.findOne({ _id: id });
                }
                if (req.query.search) {
                    updatedParts = await Project.find({
                        $and: [
                            { name: { $regex: req.query.search, $options: 'i' } },
                            { _id: { $in: cluster.projects } }
                        ]
                    });
                } else {
                    updatedParts = await Project.find({ _id: { $in: cluster.projects } });
                }
                const orgParts = updatedParts;
                const perPage = 6; // change to how many clusters per page
                let totalPages;
                if (orgParts.length !== 0) {
                    totalPages = Math.ceil(orgParts.length / perPage);
                    if (page > totalPages) {
                        return res.redirect("/project");
                    }
                }
                let pageParts = [];
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
                res.render("project", { authority, pageParts, username, sidebar, dashbuttons, page, totalPages, clusterName: cluster.name, search: req.query.search });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while retrieving group information." });
        }
    },

    //create a new project
    newProject: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const { name, location } = req.body;
                const cluster = await Cluster.findOne({ _id: req.session.clusterId });
                const project = await Project.find({ _id: { $in: cluster.projects } });
                const existingProjects = project.flatMap(project => project.name);
                if (existingProjects.includes(name)) {
                    return res.json({ error: "A Project with the same name already exists." });
                }
                let groups = [];
                const newProject = new Project({
                    name,
                    groups,
                    location
                });
                await newProject.save();

                cluster.projects.push(newProject._id);
                cluster.totalProjects += 1;
                await cluster.save();
                res.json({ success: "A Project has been added." });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while creating a new project." });
        }
    },

    // edit project
    editProject: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const projectId = req.params.id;
                const project = await Project.findById(projectId);
                const { name } = req.body;
                if (project.name != name) {
                    const existingProject = await Project.findOne({ name });
                    if (existingProject) {
                        return res.status(400).json({ error: "A project with the same name already exists." });
                    }
                }
                updateData = req.body;
                const updateProject = await Project.findOneAndUpdate({ name: project.name }, updateData, { new: true });
                if (updateProject) {
                    res.redirect("/project");
                } else {
                    return res.status(404).json({ error: "Update error!" });
                }
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while editing the project." });
        }
    },

    deleteProject: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const projectId = req.params.id;
                const project = await Project.findById(projectId); // Find the project by ID
                const cluster = await Cluster.findById(req.session.clusterId);
                let kaban;
                if (Array.isArray(project.groups)) {
                    for (const groupId of project.groups) {
                        let group = await Group.findById(groupId);
                        if (Array.isArray(group.members)) {
                            for (const member of group.members) {
                                kaban = await Saving.find({ memberID: member._id });
                                for (const item of kaban) {
                                    cluster.totalKaban -= item.totalSaving;
                                    cluster.totalKaban -= item.totalMatch;
                                }
                                await Saving.deleteMany({ memberID: member._id });
                                cluster.totalMembers -= 1;
                                await Member.deleteOne({ _id: member._id });
                            }
                        }
                        await Group.deleteOne({ _id: group });
                        cluster.totalGroups -= 1;
                    }
                }
                const deletedProject = await Project.findByIdAndDelete(projectId);
                cluster.projects = cluster.projects.filter(arrayMembers => !arrayMembers.equals(projectId.toString())); // If the project was successfully deleted, delete associated groups, members, and savings
                cluster.totalProjects -= 1;
                await cluster.save();
                if (deletedProject) {
                    return res.json(deletedProject);
                } else {
                    return res.status(404).json({ error: "Delete error! Project not found." });
                }
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while deleting the project." });
        }
    },

    loadEditSubProjectsForm: async (req, res) => {
        const projectId = req.params.projectId;
        const project = await Project.findOne({ _id: projectId });
        res.render('components/popups/popupFields/Sub-ProjectsFormFields', { project });
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
    }

}

module.exports = projectController;