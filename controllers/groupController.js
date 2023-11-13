const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');

const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');
const { updateOrgParts, getOrgParts } = require('../controllers/functions/sharedData');
const { dashboardButtons } = require('../controllers/functions/buttons');

const groupController = {

    //retrieve groups in a project
    group: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const sidebar = req.session.sidebar;
                const page = req.params.page;
                const userID = req.session.userId;
                const user = await User.findById(userID);
                const authority = user.authority;
                const username = user.username;
                const cluster = await Cluster.findOne({ _id: req.session.clusterId });
                const project = await Project.findOne({ _id: req.session.projectId });
                if (!project) {
                    return res.redirect("/project");
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
                let totalPages;
                if (orgParts.length !== 0) {
                    totalPages = Math.ceil(orgParts.length / perPage);
                    if (page > totalPages) {
                        return res.redirect("/group");
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
                res.render("group", { authority, pageParts, username, sidebar, dashbuttons, page, totalPages, SPU: project.name, location: project.location, 
                    projectName: project.name, clusterName: cluster.name, search: req.query.search });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while retrieving group information." });
        }
    },

    //create a new group
    newGroup: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const { SPU, name, location, depositoryBank, bankAccountType, bankAccountNum,
                    SHGLeaderFirstName, SHGLeaderLastName, SHGLeaderPhone,
                    SEDPChairmanFirstName, SEDPChairmanLastName, SEDPChairmanPhone,
                    kabanTreasurerFirstName, kabanTreasurerLastName, kabanTreasurerPhone,
                    kabanAuditorFirstName, kabanAuditorLastName, kabanAuditorPhone } = req.body;
                const projectId = req.session.projectId;
                let project = await Project.findById(projectId);
                const group = await Group.find({ _id: { $in: project.groups } });
                const existingGroups = group.flatMap(group => group.name);
                if (existingGroups.includes(name)) {
                    return res.json({ error: "A group with the same name already exists." });
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
                res.json({ success: "A Group has been added." });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while creating a new group." });
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
                        kaban = await Saving.find({ memberID: member._id });
                        for (const item of kaban) {
                            cluster.totalKaban -= item.totalSaving;
                            cluster.totalKaban -= item.totalMatch;
                            project.totalKaban -= item.totalSaving;
                            project.totalKaban -= item.totalMatch;
                        }
                        await Saving.deleteMany({ memberID: member._id });
                        await Member.deleteOne({ _id: member._id });
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

    loadEditSHGForm: async (req, res) => {
        const shgId = req.params.shgId;
        const shg = await Group.findOne({ _id: shgId });
        const project = await Project.findOne({ _id: req.session.projectId });
        res.render('components/popups/popupFields/SHGFormFields', { shg, SPU: project.SPU, location: project.location });
    },

    groupMiddle: async (req, res) => {
        try {
            req.session.groupId = req.body.id;
            delete req.session.memberId;
            await req.session.save();
            res.status(200).json({ success: true, message: 'group ID saved' });
        } catch (error) {
            console.error(error);
        }
    }

}

module.exports = groupController;