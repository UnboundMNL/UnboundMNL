const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');

const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');
const { project } = require('./userController');
const { updateOrgParts, getOrgParts } = require('../controllers/functions/sharedData');
const { dashboardButtons } = require('../controllers/functions/buttons');

const partController = {
    //create a new group
    newGroup: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const projectId = req.session.projectId;
                let project = await Project.findById(projectId);
                const { SPU, name, location, depositoryBank, bankAccountType, bankAccountNum,
                    SHGLeaderFirstName, SHGLeaderLastName, SHGLeaderPhone,
                    SEDPChairmanFirstName, SEDPChairmanLastName, SEDPChairmanPhone,
                    kabanTreasurerFirstName, kabanTreasurerLastName, kabanTreasurerPhone,
                    kabanAuditorFirstName, kabanAuditorLastName, kabanAuditorPhone } = req.body;
                const existingGroup = await Group.findOne({ SPU, name, location });
                if (existingGroup) {
                    return res.status(400).json({ error: "A group with the same name, area, and SPU already exists." });
                }
                let SHGLeader = {
                    firstName: SHGLeaderFirstName,
                    lastName: SHGLeaderLastName,
                    contatNo: SHGLeaderPhone
                };
                let SEDPChairman = {
                    firstName: SEDPChairmanFirstName,
                    lastName: SEDPChairmanLastName,
                    contatNo: SEDPChairmanPhone
                };
                let kabanTreasurer = {
                    firstName: kabanTreasurerFirstName,
                    lastName: kabanTreasurerLastName,
                    contatNo: kabanTreasurerPhone
                };
                let kabanAuditor = {
                    firstName: kabanAuditorFirstName,
                    lastName: kabanAuditorLastName,
                    contatNo: kabanAuditorPhone
                };
                const newGroup = new Group({
                    SPU,
                    name,
                    location,
                    depositoryBank,
                    bankAccountType,
                    bankAccountNum,
                    SHGLeader,
                    SEDPChairman,
                    kabanTreasurer,
                    kabanAuditor
                });
                const cluster = await Cluster.findOne({ _id: req.session.clusterId });
                cluster.totalGroups += 1;
                await cluster.save();
                project.totalGroups += 1;
                await newGroup.save();
                project.groups.push(newGroup._id);
                await project.save();
                res.redirect("/group");
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while creating a new group." });
        }
    },

    retrieveGroup: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const sidebar = req.session.sidebar;
                const userID = req.session.userId;
                const user = await User.findById(userID);
                const authority = user.authority;
                const username = user.username;
                let memberList = [];
                const group = await Group.findOne({ _id: req.session.groupId });
                if (!group) {
                    res.redirect("/group");
                }
                const year = new Date().getFullYear();
                const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sept", "oct", "nov", "dec"];
                const members = await Member.find({ _id: { $in: group.member } });
                let totalSavings = 0;
                if (members) {
                    for (const member of members) {
                        const savings = await Saving.findOne({
                            _id: { $in: member.savings },
                            year: year
                        });
                        const data = {
                            name: member.name.firstName + ' ' + member.name.lastName,
                            id: member._id,
                        };
                        if (savings) {
                            for (const month of months) {
                                data[month] = {
                                    savings: savings[month]?.savings || "",
                                    match: savings[month]?.match || ""
                                };
                            }
                            data.totalMatch = savings.totalMatch;
                            data.totalSavings = savings.totalSavings;
                        } else {
                            for (const month of months) {
                                data[month] = {
                                    savings: "",
                                    match: ""
                                };
                            }
                            data.totalMatch = 0;
                            data.totalSavings = 0;
                        }
                        totalSavings += parseInt(data.totalSavings);
                        memberList.push(data);
                    }
                }
                dashbuttons = dashboardButtons(authority);
                res.render("member", { authority, username, sidebar, dashbuttons, grpName: group.name, year, memberList, totalSavings });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while retrieving group information." });
        }
    },

    reloadTable: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                let memberList = [];
                const group = await Group.findOne({ _id: req.session.groupId });
                const year = req.params.year;
                const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sept", "oct", "nov", "dec"];
                const members = await Member.find({ _id: { $in: group.member } });
                let totalSavings = 0;
                for (const member of members) {
                    const savings = await Saving.findOne({
                        _id: { $in: member.savings },
                        year: year
                    });
                    const data = {
                        name: member.name.firstName + ' ' + member.name.lastName,
                        id: member._id,
                    };
                    if (savings) {
                        for (const month of months) {
                            data[month] = {
                                savings: savings[month]?.savings || "",
                                match: savings[month]?.match || ""
                            };
                        }
                        data.totalMatch = savings.totalMatch;
                        data.totalSavings = savings.totalSavings;
                    } else {
                        for (const month of months) {
                            data[month] = {
                                savings: "",
                                match: ""
                            };
                        }
                        data.totalMatch = 0;
                        data.totalSavings = 0;
                    }
                    totalSavings += data.totalSavings;
                    memberList.push(data);
                }
                res.status(200).json({ memberList, totalSavings, year });
            } else {
                res.status(400).json({ error: "An error occurred while retrieving group information." });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while retrieving group information." });
        }
    },
    // edit group
    editGroup: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const groupId = req.params.id;
                const group = await Group.findById(groupId);
                const { SPU, name, location, depositoryBank, bankAccountType, bankAccountNum,
                    SHGLeaderFirstName, SHGLeaderLastName, SHGLeaderPhone,
                    SEDPChairmanFirstName, SEDPChairmanLastName, SEDPChairmanPhone,
                    kabanTreasurerFirstName, kabanTreasurerLastName, kabanTreasurerPhone,
                    kabanAuditorFirstName, kabanAuditorLastName, kabanAuditorPhone } = req.body;
                if (group.name != name) {
                    const existingGroup = await Group.findOne({ SPU, name, location });
                    if (existingGroup) {
                        return res.status(400).json({ error: "A group with the same name, area, and SPU already exists." });
                    }
                }
                const SHGLeader = {
                    firstName: SHGLeaderFirstName,
                    lastName: SHGLeaderLastName,
                    contatNo: SHGLeaderPhone
                };
                const SEDPChairman = {
                    firstName: SEDPChairmanFirstName,
                    lastName: SEDPChairmanLastName,
                    contatNo: SEDPChairmanPhone
                };
                const kabanTreasurer = {
                    firstName: kabanTreasurerFirstName,
                    lastName: kabanTreasurerLastName,
                    contatNo: kabanTreasurerPhone
                };
                const kabanAuditor = {
                    firstName: kabanAuditorFirstName,
                    lastName: kabanAuditorLastName,
                    contatNo: kabanAuditorPhone
                };
                const updateData = {
                    SPU,
                    name,
                    location,
                    depositoryBank,
                    bankAccountType,
                    bankAccountNum,
                    SHGLeader,
                    SEDPChairman,
                    kabanTreasurer,
                    kabanAuditor
                };
                const updatedGroup = await Group.findOneAndUpdate({ SPU: group.SPU, name: group.name, area: group.area }, updateData, { new: true });
                if (updatedGroup) {
                    res.redirect("/group");
                } else {
                    return res.status(404).json({ error: "Update error!" });
                }
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while editing the group." });
        }
    },
    // delete a group
    deleteGroup: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const groupId = req.params.id;
                const group = await Group.findById(groupId);
                const cluster = await Cluster.findById(req.session.clusterId);
                const project = await Project.findById(req.session.projectId);
                let kaban;
                if (Array.isArray(group.members)) {
                    for (const member of group.members) {
                        kaban = await Saving.findMany({ member: member });
                        for (const item of kaban) {
                            cluster.totalKaban -= item.totalSavings;
                            project.totalKaban -= item.totalSavings;
                        }
                        await Saving.deleteMany({ member: member });
                        await Member.deleteOne({ _id: member });
                        cluster.totalMembers -= 1;
                        project.totalMembers -= 1;
                    }
                }
                const deletedGroup = await Group.findByIdAndDelete(groupId);
                project.groups = project.groups.filter(arrayMembers => !arrayMembers.equals(groupId.toString()));
                cluster.totalGroups -= 1;
                project.totalGroups -= 1;
                await cluster.save();
                await project.save();
                if (deletedGroup) {
                    return res.json(deletedGroup);
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
    //create a new project
    newProject: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const { name, location } = req.body;
                let groups = [];
                const newProject = new Project({
                    name,
                    groups,
                    location
                });
                await newProject.save();
                const cluster = await Cluster.findById(req.session.clusterId);
                cluster.projects.push(newProject._id);
                cluster.totalProjects += 1;
                await cluster.save();
                res.redirect("/project");
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while creating a new project." });
        }
    },
    //retrieve project
    retrieveProject: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const sidebar = req.session.sidebar;
                const page = req.params.page;
                const userID = req.session.userId;
                const user = await User.findById(userID);
                const authority = user.authority;
                const username = user.username;
                const project = await Project.findOne({ _id: req.session.projectId });
                if (!project) {
                    res.redirect("/cluster");
                }
                let updatedParts = [];
                if (req.query.search) {
                    updatedParts = await Group.find({
                        $and: [
                            { name: { $regex: req.query.search, $options: 'i' } },
                            { _id: { $in: project.groups } }
                        ]
                    });
                } else {
                    updatedParts = await Group.find({ _id: { $in: project.groups } });
                }
                const orgParts = updatedParts;
                const perPage = 6; // change to how many clusters per page
                let totalPages = Math.ceil(orgParts.length / perPage);
                if (page > totalPages) {
                    res.redirect("/group")
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
                res.render("group", { authority, pageParts, username, sidebar, dashbuttons, page, totalPages, SPU: project.name, location: project.location });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while retrieving group information." });
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
                        group = await Group.findById(groupId);
                        if (Array.isArray(group.members)) {
                            for (const member of group.members) {
                                kaban = await Saving.findMany({ member: member });
                                for (const item of kaban) {
                                    cluster.totalKaban -= item.totalSavings;
                                }
                                await Saving.deleteMany({ member: member });
                                cluster.totalMembers -= 1;
                                await Member.deleteOne({ _id: member });
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
    //create a new cluster
    newCluster: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const { name, location } = req.body;
                const existingCluster = await Cluster.findOne({ name });
                if (existingCluster) {
                    return res.status(400).json({ error: "A Cluster with the same name already exists." });
                }
                let projects = [];
                const newCluster = new Cluster({
                    name,
                    location,
                    projects,
                });
                await newCluster.save();
                res.redirect("/cluster");
            } else {
                res.redirect("/");
            }
        } catch (error) {
            return res.status(500).json({ error: "An error occurred while creating a new cluster    ." });
        }
    },
    //retrieve cluster
    retrieveCluster: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                if (req.session.authority == "Treasurer") {
                    res.redirect("/group")
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
                let updatedParts;
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
                let totalPages = Math.ceil(orgParts.length / perPage);
                if (page > totalPages) {
                    res.redirect("/project")
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
                res.render("project", { authority, pageParts, username, sidebar, dashbuttons, page, totalPages });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while retrieving group information." });
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
                                        await Saving.deleteMany({ member: member });
                                        await Member.deleteOne({ _id: member });
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
            return res.status(500).render("fail", { error: "An error occurred while retrieving group information." });
        }
    }
}

module.exports = partController;