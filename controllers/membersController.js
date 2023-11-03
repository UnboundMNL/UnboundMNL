let sharedData = {};

const Member = require('../models/Member');
// const Part = require('../models/Part');
const Saving = require('../models/Saving');
const User = require('../models/User');

const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');

const { dashboardButtons } = require('../controllers/functions/buttons');
const { updateOrgParts, getOrgParts } = require('../controllers/functions/sharedData');

const membersController = {
    retrieveMember: async (req, res) => {
        try{
            if(req.session.isLoggedIn){
                const sidebar = req.session.sidebar;
                const page = req.params.page;
                const userID = req.session.userId;
                const user = await User.findById(userID);

                //let member = await Member.findById(req.params.memberId).populate("savings");
                let member = await Member.findById(req.params.memberId);

                dashbuttons = dashboardButtons(user.authority);

                res.render("member", { member, dashbuttons, sidebar, page }); //page parts?

            }
            else {
                res.redirect("/");
            }
        }catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while fetching data." });
        }
    },
    
    newMember: async (req, res) => {
        try {
            if(req.session.isLoggedIn) {
                const userID = req.session.userId;
                
                const { memberFirstname, memberMiddlename, memberLastname, id, 
                    memberFatherFirstname, memberFatherMiddlename, memberFatherLastname,
                    memberMotherFirstname, memberMotherMiddlename, memberMotherLastname,
                    sex, birthdate, address, status } = req.body;
                    // might remove status from here in future idk. leaving it in case they wanna track non-Active members but yeah.
                
                let name = {
                    firstName: memberFirstname,
                    middleName: memberMiddlename,
                    lastName: memberLastname
                }
    
                let nameFather = {
                    firstName: memberFatherFirstname,
                    middleName: memberFatherMiddlename,
                    lastName: memberFatherLastname
                }
    
                let nameMother = {
                    firstName: memberMotherFirstname,
                    middleName: memberMotherMiddlename,
                    lastName: memberMotherLastname
                }
                let savings = [];
                const newMember = new Member({
                    name, id, nameFather, nameMother, sex, birthdate, address, savings, status
                })
                await newMember.save();

                let group = await Group.findById(req.params.groupId);
                group.member.push(newMember);
                group.totalMembers += 1;
                await group.save();

                let project = await Project.findById(req.params.projectId);
                project.totalMembers += 1;
                await project.save();

                let cluster = await Cluster.findById(req.params.clusterId);
                cluster.totalMembers += 1;
                await cluster.save();

                res.redirect("/members");
            }
            else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while saving data." });
        }
    },

    editMember: async (req, res) => {
        try {
            if(req.session.isLoggedIn) {
                const userID = req.session.userId;
                
                const { memberFirstname, memberMiddlename, memberLastname, id, 
                    memberFatherFirstname, memberFatherMiddlename, memberFatherLastname,
                    memberMotherFirstname, memberMotherMiddlename, memberMotherLastname,
                    sex, birthdate, address, status } = req.body;
                    // might remove status from here in future idk. leaving it in case they wanna track non-Active members but yeah.
                
                let name = {
                    firstName: memberFirstname,
                    middleName: memberMiddlename,
                    lastName: memberLastname
                }
    
                let nameFather = {
                    firstName: memberFatherFirstname,
                    middleName: memberFatherMiddlename,
                    lastName: memberFatherLastname
                }
    
                let nameMother = {
                    firstName: memberMotherFirstname,
                    middleName: memberMotherMiddlename,
                    lastName: memberMotherLastname
                }

                const updateData = {name, id, nameFather, nameMother, sex, birthdate, address, status};

                const updateMember = Member.findOneAndUpdate({
                    _id: req.params.memberId}, updateData, {new: true})
                
                if(updateMember) {
                    console.log("Member updated successfully.")
                    res.redirect("/members");
                }
                else {
                    console.log("Member update failed.")
                }
            }
            else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while saving data." });
        }

    },
    
    // deleteMember: async (req, res) => {
    //     try {
    //         if(req.session.isLoggedIn) {
    //             const userID = req.session.userId;
                
    //             const member = await Member.findById(req.params.memberId);
    //             const group = await Group.findById(req.params.groupId);
    //             const project = await Project.findById(req.params.projectId);
    //             const cluster = await Cluster.findById(req.params.clusterId);


    //             //something about deleting savings from each group/project/cluster total

    //             await Saving.deleteMany({ member: member });
    //             await member.remove(); //idk if this actually works lol

    //             group.member.pull(member);
    //             group.totalMembers -= 1;
    //             await group.save();

    //             project.totalMembers -= 1;
    //             await project.save();

    //             cluster.totalMembers -= 1;
    //             await cluster.save();

    //             res.redirect("/members");
    //         }
    //         else {
    //             res.redirect("/");
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).render("fail", { error: "An error occurred while saving data." });
    //     }
    // }
    deleteMember: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const memberId = req.params.id;
                const member = await Group.findById(memberId);
                const group = await Group.find({ members: member._id });
                const loggedInUserId = req.session.userId;
                const user = await User.findById(loggedInUserId);

                await Saving.deleteMany({ member: member });
                await Member.deleteMany({ _id: { $in: group.members } });
                const deletedMember = await Member.findByIdAndDelete(memberId);
                if (deletedMember) {
                    return res.json(deletedMember);
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

}

module.exports = membersController;