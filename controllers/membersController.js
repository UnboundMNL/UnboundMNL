let sharedData = {};

const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');

const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');

const { dashboardButtons } = require('../controllers/functions/buttons');
const { updateOrgParts, getOrgParts } = require('../controllers/functions/sharedData');

const membersController = {
    retrieveMember: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const sidebar = req.session.sidebar;
                const page = req.params.page;
                const userID = req.session.userId;
                const user = await User.findById(userID);
                const username = user.username;
                const authority = user.authority;
                if (!req.session.memberId) {
                    res.redirect("/group")
                }
                const member = await Member.findById(req.session.memberId);
                const memberId = member._id;
                const cluster = await Cluster.findById(member.clusterId);
                const project = await Project.findById(member.projectId);
                const group = (await Group.findById(member.groupId)).name;
                dashbuttons = dashboardButtons(authority);
                const originalDate = new Date(member.birthdate);
                originalDate.setMinutes(originalDate.getMinutes() + originalDate.getTimezoneOffset());
                const options = {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                };
                fixedBirthdate = new Intl.DateTimeFormat('en-US', options).format(originalDate);
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const parts = fixedBirthdate.split(' ');
                let editDate;
                if (parts.length === 3) {
                    const monthIndex = months.indexOf(parts[0]) + 1;
                    const day = parts[1].replace(',', '');
                    const year = parts[2];
                    editDate = year + '-' + (monthIndex < 10 ? '0' : '') + monthIndex + '-' + day;
                }
                const clusterChoices = await Cluster.find({ totalGroups: { $gt: 0 } });
                const projectChoices = await Project.find({ _id: { $in: cluster.projects } });
                const groupChoices = await Group.find({ _id: { $in: project.groups } });
                res.render("memberprofile", {
                    member, dashbuttons, sidebar, page, authority, username, cluster: cluster.name, project: project.name, group,
                    fixedBirthdate, editDate, memberId, clusterChoices, projectChoices, groupChoices
                });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while fetching data." });
        }
    },

    newMember: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const { MemberFirstName, MemberLastName, id,
                    FatherFirstName, FatherLastName,
                    MotherFirstName, MotherLastName,
                    sex, birthdate, address, status } = req.body;
                const name = {
                    firstName: MemberFirstName,
                    lastName: MemberLastName
                };
                const nameFather = {
                    firstName: FatherFirstName,
                    lastName: FatherLastName
                };
                const nameMother = {
                    firstName: MotherFirstName,
                    lastName: MotherLastName
                };
                let savings = [];
                const projectId = req.session.projectId;
                const groupId = req.session.groupId;
                const clusterId = req.session.clusterId;
                const newMember = new Member({
                    name, id, nameFather, nameMother, sex, birthdate, address, savings, status, projectId, groupId, clusterId
                });
                await newMember.save();
                const group = await Group.findById(req.session.groupId);
                group.member.push(newMember);
                group.totalMembers += 1;
                await group.save();
                const project = await Project.findById(req.session.projectId);
                project.totalMembers += 1;
                await project.save();
                const cluster = await Cluster.findById(req.session.clusterId);
                cluster.totalMembers += 1;
                await cluster.save();
                res.redirect("/member");
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while saving data." });
        }
    },

    editMember: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const { MemberFirstName, MemberLastName, id,
                    FatherFirstName, FatherLastName,
                    MotherFirstName, MotherLastName,
                    sex, birthdate, address, status,
                    projectId, groupId, clusterId } = req.body;
                const name = {
                    firstName: MemberFirstName,
                    lastName: MemberLastName
                };
                const nameFather = {
                    firstName: FatherFirstName,
                    lastName: FatherLastName
                };
                const nameMother = {
                    firstName: MotherFirstName,
                    lastName: MotherLastName
                };
                const member = await Member.findOne({ _id: req.params.id });
                if (member) {
                    if (member.groupId.toString() !== groupId) {
                        const prevGroup = await Group.findOne({ _id: member.groupId });
                        prevGroup.totalMembers -= 1;
                        prevGroup.totalKaban -= member.totalSaving;
                        prevGroup.member = prevGroup.member.filter(memberId => !memberId.equals(member._id.toString()));
                        await prevGroup.save();
                        const newGroup = await Group.findOne({ _id: groupId });
                        newGroup.totalMembers += 1;
                        newGroup.totalKaban += member.totalSaving;
                        newGroup.member.push(member._id);
                        await newGroup.save();
                        if (member.projectId.toString() !== projectId) {
                            const prevProject = await Project.findOne({ _id: member.projectId });
                            prevProject.totalMembers -= 1;
                            prevProject.totalKaban -= member.totalSaving;
                            await prevProject.save();
                            const newProject = await Project.findOne({ _id: projectId });
                            newProject.totalMembers += 1;
                            newProject.totalKaban += member.totalSaving;
                            await newProject.save();
                            if (member.clusterId.toString() !== clusterId) {
                                const prevCluster = await Cluster.findOne({ _id: member.clusterId });
                                prevCluster.totalMembers -= 1;
                                prevCluster.totalKaban -= member.totalSaving;
                                await prevCluster.save();
                                const newCluster = await Project.findOne({ _id: clusterId });
                                newCluster.totalMembers += 1;
                                newCluster.totalKaban += member.totalSaving;
                                await newCluster.save();
                            }
                        }
                    }
                    const updateData = { name, id, nameFather, nameMother, sex, birthdate, address, status, projectId, groupId, clusterId };
                    member.set(updateData);
                    const updateMember = await member.save({ new: true });
                    if (updateMember) {
                        res.json();
                    }
                } else {
                    res.status(500).render("fail", { error: "No member found." });
                }
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while saving data." });
        }
    },
    deleteMember: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const memberId = req.params.id;
                const member = await Member.findById(memberId);
                const cluster = await Cluster.findById(req.session.clusterId);
                const project = await Project.findById(req.session.projectId);
                const group = await Group.findById(req.session.groupId);
                await Saving.deleteMany({ memberID: memberId });
                cluster.totalKaban -= member.totalSaving;
                cluster.totalMembers -= 1;
                await cluster.save();
                project.totalKaban -= member.totalSaving;
                project.totalMembers -= 1;
                await project.save();
                group.totalKaban -= member.totalSaving;
                group.totalMembers -= 1;
                group.member = group.member.filter(arrayMembers => !arrayMembers.equals(memberId.toString()));
                await group.save();
                const deletedMember = await Member.findByIdAndDelete(memberId);
                if (deletedMember) {
                    res.json(deletedMember);
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

    retrieveMasterlist: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const userID = req.session.userId;
                const user = await User.findById(userID);
                const authority = user.authority;
                const username = user.username;
                res.render("masterlist", { authority, username });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while deleting the project." });
        }
    }
}

module.exports = membersController;