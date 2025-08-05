const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');

const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');
const { updateOrgParts, getOrgParts } = require('../controllers/functions/sharedData');
const { dashboardButtons } = require('../controllers/functions/buttons');

const memberController = {

    // loads the member page to show the savings and matching grant for the specific year
    member: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                delete req.session.memberId;
                const sidebar = req.session.sidebar;
                const userID = req.session.userId;
                const user = await User.findById(userID);
                const authority = user.authority;
                const username = user.username;
                let memberList = [];
                const cluster = await Cluster.findOne({ _id: req.session.clusterId });
                const project = await Project.findOne({ _id: req.session.projectId });
                const group = await Group.findOne({ _id: req.session.groupId });
                if (!group) {
                    return res.redirect("/group");
                }
                const year = new Date().getFullYear();


                const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

                const members = await Member.find({ _id: { $in: group.members } });
                let totalBalance = 0;

                // gets savings and matching grant of each member of a group on the current year
                if (members) {
                    for (const member of members) {
                        const savings = await Saving.findOne({
                            _id: { $in: member.savings },
                            year: year
                        });
                        const data = {
                            name: member.name.firstName + ' ' + member.name.lastName,
                            orgId: member.orgId,
                            id: member._id
                        };
                        if (savings) {
                            for (const month of months) {
                                data[month] = {
                                    savings: parseFloat((savings[month]?.savings || 0).toFixed(2)),
                                    match: parseFloat((savings[month]?.match || 0).toFixed(2))
                                };
                            }
                            data.totalMatch = parseFloat((savings.totalMatch || 0).toFixed(2));
                            data.totalSaving = parseFloat((savings.totalSaving || 0).toFixed(2));
                            data.totalDeductions = parseFloat((savings.totalDeductions || 0).toFixed(2));
                        } else {
                            for (const month of months) {
                                data[month] = {
                                    savings: "",
                                    match: ""
                                };
                            }
                            data.totalMatch = 0;
                            data.totalSaving = 0;
                            data.totalDeductions = 0;
                        }
                        totalBalance += parseFloat(data.totalSaving || 0) + parseFloat(data.totalMatch || 0) - parseFloat(data.totalDeductions || 0);
                        memberList.push(data);
                    }
                }
                dashbuttons = dashboardButtons(authority);
                res.render("member", { authority, username, sidebar, dashbuttons, groupName: group.name, year, memberList, totalBalance: parseFloat(totalBalance.toFixed(2)), projectName: project.name, clusterName: cluster.name });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while retrieving group information." });
        }
    },

    // reloads the member page and gets savings and matching grant of each member of a group on a specific year
    reloadTable: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                let memberList = [];
                const group = await Group.findOne({ _id: req.session.groupId });
                const year = req.params.year;
                const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];


                const members = await Member.find({ _id: { $in: group.members } });
                let totalBalance = 0;
                for (const member of members) {
                    const savings = await Saving.findOne({
                        _id: { $in: member.savings },
                        year: year
                    });
                    const data = {
                        name: member.name.firstName + ' ' + member.name.lastName,
                        id: member._id,
                        orgId: member.orgId
                    };
                    if (savings) {
                        for (const month of months) {
                            data[month] = {
                                savings: parseFloat((savings[month]?.savings || 0).toFixed(2)),
                                match: parseFloat((savings[month]?.match || 0).toFixed(2))
                            };
                        }
                        data.totalMatch = parseFloat((savings.totalMatch || 0).toFixed(2));
                        data.totalSaving = parseFloat((savings.totalSaving || 0).toFixed(2));
                        data.totalDeductions = parseFloat((savings.totalDeductions || 0).toFixed(2));
                    } else {
                        for (const month of months) {
                            data[month] = {
                                savings: "",
                                match: ""
                            };
                        }
                        data.totalMatch = 0;
                        data.totalSaving = 0;
                        data.totalDeductions = 0;
                    }
                    totalBalance += parseFloat(data.totalSaving || 0) + parseFloat(data.totalMatch || 0) - parseFloat(data.totalDeductions || 0);
                    memberList.push(data);
                }
                res.status(200).json({ memberList, totalBalance: parseFloat(totalBalance.toFixed(2)), year });
            } else {
                res.status(400).json({ error: "An error occurred while retrieving group information." });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while retrieving group information." });
        }
    },

    // member's profile page
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
                    return res.redirect("/member");
                }
                const member = await Member.findById(req.session.memberId);
                const memberId = member._id;
                const cluster = await Cluster.findById(member.clusterId);
                const project = await Project.findById(member.projectId);
                const group = (await Group.findById(member.groupId)).name;

                let fixedBirthdate;
                let editDate = '';
                dashbuttons = dashboardButtons(authority);
                // change date to Philippine format
                if (member.birthdate) {
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
                    if (parts.length === 3) {
                        const monthIndex = months.indexOf(parts[0]) + 1;
                        const day = parts[1].replace(',', '');
                        const year = parts[2];
                        editDate = year + '-' + (monthIndex < 10 ? '0' : '') + monthIndex + '-' + day;
                    }
                } else {
                    fixedBirthdate = 'Unknown';
                    editDate = '';
                }
                const clusterChoices = await Cluster.find({ totalGroups: { $gt: 0 } });
                const projectChoices = await Project.find({
                    _id: { $in: cluster.projects },
                    totalGroups: { $gt: 0 }
                });
                const groupChoices = await Group.find({ _id: { $in: project.groups } });
                let allSavings = 0;
                let totalSaving = null;
                if (memberId) {
                    allSavings = await Saving.find({ memberID: memberId }).sort({ year: 1 });
                    totalSaving = allSavings.reduce((total, saving) => total + parseFloat(saving.totalSaving) + parseFloat(saving.totalMatch), 0);
                }
                res.render("memberprofile", {
                    member, dashbuttons, sidebar, page, authority, username, cluster: cluster.name, project: project.name, group,
                    fixedBirthdate, editDate, memberId, clusterChoices, projectChoices, groupChoices, allSavings, totalSaving
                });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while fetching data." });
        }
    },

    // adding members
    newMember: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const { MemberFirstName, MemberLastName, orgId,
                    ParentFirstName, ParentLastName,
                    sex, birthdate, address, status } = req.body;
                const existingMember = await Member.find({ orgId });
                if (existingMember.length !== 0) {
                    return res.json({ error: "A member with the same ID already exists." });
                }
                const name = {
                    firstName: MemberFirstName,
                    lastName: MemberLastName
                };
                const parentName = `${ParentFirstName || ''} ${ParentLastName || ''}`.trim();
                let savings = [];
                const projectId = req.session.projectId;
                const groupId = req.session.groupId;
                const clusterId = req.session.clusterId;
                const newMember = new Member({
                    name, orgId, parentName, sex, birthdate, address, savings, status, projectId, groupId, clusterId
                });
                await newMember.save();
                const group = await Group.findById(req.session.groupId);
                group.members.push(newMember);
                group.totalMembers += 1;
                await group.save();
                const project = await Project.findById(req.session.projectId);
                project.totalMembers += 1;
                await project.save();
                const cluster = await Cluster.findById(req.session.clusterId);
                cluster.totalMembers += 1;
                await cluster.save();
                res.json({ success: "A Member has been added." });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while saving data." });
        }
    },

    // Bulk add members
    bulkRegisterMember: async (member, sessionData = null) => {
        try {
            const { name, status, orgId, parentName } = member;
            const existingMember = await Member.findOne({ orgId });

            // If member already exists, return error details
            if (existingMember) {
                if (
                    member.name &&
                    existingMember.name &&
                    member.name.firstName === existingMember.name.firstName &&
                    member.name.lastName === existingMember.name.lastName &&
                    member.orgId === existingMember.orgId
                ) {
                    return {
                        success: true,
                        member: existingMember,
                        isExisting: true,
                        message: 'Member already exists, will update savings only'
                    };
                } else {
                    return {
                        success: false,
                        member: null,
                        error: 'MEMBER_ID_EXISTS_BUT_DIFFERENT_NAME',
                        message: 'Member with the same ID already exists but has different name',
                    }
                }
            }

            const newMember = new Member({
                name,
                orgId,
                parentName,
                status,
                projectId: sessionData?.projectId,
                groupId: sessionData?.groupId,
                clusterId: sessionData?.clusterId
            });

            await newMember.save();

            // If session data is provided, update group/project/cluster totals
            if (sessionData && sessionData.groupId && sessionData.projectId && sessionData.clusterId) {
                try {
                    const group = await Group.findById(sessionData.groupId);
                    if (group) {
                        group.members.push(newMember._id);
                        group.totalMembers += 1;
                        await group.save();
                    }

                    const project = await Project.findById(sessionData.projectId);
                    if (project) {
                        project.totalMembers += 1;
                        await project.save();
                    }

                    const cluster = await Cluster.findById(sessionData.clusterId);
                    if (cluster) {
                        cluster.totalMembers += 1;
                        await cluster.save();
                    }
                } catch (updateError) {
                    console.error('Error updating group/project/cluster totals:', updateError);
                    // Return success with warning about totals update failure
                    return {
                        success: true,
                        member: newMember,
                        warning: 'Member created but failed to update group/project/cluster totals',
                        updateError: updateError.message
                    };
                }
            }

            return {
                success: true,
                member: newMember
            };
        } catch (error) {
            console.error('Error in bulkRegisterMember:', error);
            return {
                success: false,
                error: 'CREATION_ERROR',
                message: `Failed to create member: ${error.message}`,
                details: error.message
            };
        }
    },

    // editing members
    editMember: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const { MemberFirstName, MemberLastName, orgId,
                    ParentFirstName, ParentLastName,
                    sex, birthdate, address, status,
                    projectId, groupId, clusterId } = req.body;
                const name = {
                    firstName: MemberFirstName,
                    lastName: MemberLastName
                };
                const parentName = `${ParentFirstName || ''} ${ParentLastName || ''}`.trim();
                const member = await Member.findOne({ _id: req.params.id });
                if (member) {
                    if (member.orgId !== orgId) {
                        const existingMember = await Member.findOne({ orgId });
                        if (existingMember) {
                            return res.status(400).json({ error: "A member with the same ID already exists." });
                        }
                    }
                    if (member.groupId.toString() !== groupId) {
                        const prevGroup = await Group.findOne({ _id: member.groupId });
                        prevGroup.totalMembers -= 1;
                        prevGroup.totalKaban -= member.totalSaving;
                        prevGroup.totalKaban -= member.totalMatch;
                        prevGroup.members = prevGroup.members.filter(memberId => !memberId.equals(member._id.toString()));
                        await prevGroup.save();
                        const newGroup = await Group.findOne({ _id: groupId });
                        newGroup.totalMembers += 1;
                        newGroup.totalKaban += member.totalSaving;
                        newGroup.totalKaban += member.totalMatch;
                        newGroup.members.push(member._id);
                        await newGroup.save();
                        if (member.projectId.toString() !== projectId) {
                            const prevProject = await Project.findOne({ _id: member.projectId });
                            prevProject.totalMembers -= 1;
                            prevProject.totalKaban -= member.totalSaving;
                            prevProject.totalKaban -= member.totalMatch;
                            await prevProject.save();
                            const newProject = await Project.findOne({ _id: projectId });
                            newProject.totalMembers += 1;
                            newProject.totalKaban += member.totalSaving;
                            newProject.totalKaban += member.totalMatch;
                            await newProject.save();
                            if (member.clusterId.toString() !== clusterId) {
                                const prevCluster = await Cluster.findOne({ _id: member.clusterId });
                                prevCluster.totalMembers -= 1;
                                prevCluster.totalKaban -= member.totalSaving;
                                prevCluster.totalKaban -= member.totalMatch;
                                await prevCluster.save();
                                const newCluster = await Cluster.findOne({ _id: clusterId });
                                newCluster.totalMembers += 1;
                                newCluster.totalKaban += member.totalSaving;
                                newCluster.totalKaban += member.totalMatch;
                                await newCluster.save();
                            }
                        }
                    }
                    const updateData = { name, orgId, parentName, sex, birthdate, address, status, projectId, groupId, clusterId };
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

    // deleting members
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
                cluster.totalKaban -= member.totalMatch;
                cluster.totalMembers -= 1;
                await cluster.save();
                project.totalKaban -= member.totalSaving;
                project.totalKaban -= member.totalMatch;
                project.totalMembers -= 1;
                await project.save();
                group.totalKaban -= member.totalSaving;
                group.totalKaban -= member.totalMatch;
                group.totalMembers -= 1;
                group.members = group.members.filter(arrayMembers => !arrayMembers.equals(memberId.toString()));
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

    // showing all the accessible members
    retrieveMasterlist: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const userID = req.session.userId;
                const user = await User.findById(userID);
                const authority = user.authority;
                const username = user.username;
                let members;
                const memberList = [];
                switch (authority) {
                    case "Admin":
                        members = await Member.find();
                        break;
                    case "SEDO":
                        members = await Member.find({ clusterId: req.session.clusterId });
                        break;
                    case "Treasurer":
                        return res.redirect("/");
                }

                if (members) {
                    for (const member of members) {
                        memberList.push({
                            name: member.name.firstName + ' ' + member.name.lastName,
                            id: member.orgId,
                            objectID: member._id
                        });
                    }
                }

                res.render("masterlist", { authority, username, memberList });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while deleting the project." });
        }
    },

    // middleware to save member ids
    memberMiddle: async (req, res) => {
        try {
            req.session.memberId = req.body.id;
            await req.session.save();
            res.status(200).json({ success: true, message: 'member ID saved' });
        } catch (error) {
            console.error(error);
        }
    },

    // financial report page
    report: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const userID = req.session.userId;
                const sidebar = req.session.sidebar;
                const user = await User.findById(userID);
                const authority = user.authority;
                const username = user.username;

                const id = req.query.id;
                const member = await Member.findById(id).populate('savings').populate('groupId');

                // TODO: monthly savings
                const monthCounts = {};
                const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

                const counts = [1000, 2100, 2310, 2345, 1234, 9000, 6969, 3840, 2160, 1920, 1080, 9090]

                months.forEach((m, i) => monthCounts[m] = counts[i])
                
                const name = member.name.firstName + ' ' + member.name.lastName

                const orgId = member.orgId

                const totalSaving = member.totalSaving;
                const totalMatch = member.totalMatch
                const totalDeductions = member.totalDeductions

                const genDate = new Date()

                const generateLink = "/exportReport?id=" + id 

                // don't touch this
                const dateOptions = { year: "numeric", month: "long", day: "numeric" }

                res.render("financialReport", { authority, username, sidebar, monthCounts, name, orgId, genDate, dateOptions, totalSaving, totalMatch, totalDeductions, generateLink });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while fetching data." });
        }
    },
}

module.exports = memberController;