const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');

const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');
const { project } = require('./userController');

const partController = {
    //create a new group
    newGroup: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                // im imagining what the form will have
                // i think we can get SPU from projects? or maybe we can just have a dropdown of SPUs? or manually input?
                const { SPU, name, area, depositoryBank, bankAccountType, bankAccountNum, 
                    signatory_firstName, signatory_middleName, signatory_lastName, 
                    other_firstName, other_middleName, other_lastName, other_contactNo } = req.body;

                const existingGroup = await Group.findOne({ SPU, name, area });
                if (existingGroup) {
                    return res.status(400).json({ error: "A group with the same name, area, and SPU already exists." });
                }
            
                const signatories = [];
                for (let i = 0; i < signatory_firstName.length; i++) {
                    signatories.push({
                        firstName: signatory_firstName[i],
                        middleName: signatory_middleName[i],
                        lastName: signatory_lastName[i]
                    });
                }
                
                const otherPeople = [];
                for (let i = 0; i < other_firstName.length; i++) {
                    otherPeople.push({
                        firstName: other_firstName[i],
                        middleName: other_middleName[i],
                        lastName: other_lastName[i],
                        contactNo: [other_contactNo[i]]
                    });
                }
                
                const newGroup = new Group({
                    SPU,
                    name,
                    area,
                    depositoryBank,
                    bankAccountType,
                    bankAccountNum,
                    signatories,
                    otherPeople
                });
                await newGroup.save();

                //redirecting to dashboard rn cuz idk where else to redirect to
                res.redirect("/dashboard");
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
                const groupId = req.params.id; 
                // idk if this works will fix in future
    
                const group = await Group.findById(groupId)
                    // .populate('members').populate('savings');
                    // im thinking this only loads the actual group info and not the members and savings yet
                    // this is for like preloading current info into the edit form, then the function below is for actually editing the group (editGroup)
                const loggedInUserId = req.session.userId;
                const user = await User.findById(loggedInUserId);
                if (!group.validSEDOs.includes(loggedInUserId) && !group.validTreasurers.includes(loggedInUserId) && !(user.authority != "admin")) {
                    return res.status(403).json({ error: "You are not authorized to edit this group." });
                }

                if (!group) {
                    return res.status(404).render("fail", { error: "Group not found." });
                }

                res.render("editGroup", { group });
            } else {
                res.redirect("/");
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
                const loggedInUserId = req.session.userId;
                const user = await User.findById(loggedInUserId);
                if (!group.validSEDOs.includes(loggedInUserId) && !group.validTreasurers.includes(loggedInUserId) && !(user.authority != "admin")) {
                    return res.status(403).json({ error: "You are not authorized to edit this group." });
                }


                const { SPU, name, area, depositoryBank, bankAccountType, bankAccountNum, 
                    signatory_firstName, signatory_middleName, signatory_lastName, 
                    other_firstName, other_middleName, other_lastName, other_contactNo } = req.body;
                
                const existingGroup = await Group.findOne({ SPU, name, area });
                if (existingGroup) {
                    return res.status(400).json({ error: "A group with the same name, area, and SPU already exists." });
                }
                
                const signatories = [];
                for (let i = 0; i < signatory_firstName.length; i++) {
                    signatories.push({
                        firstName: signatory_firstName[i],
                        middleName: signatory_middleName[i],
                        lastName: signatory_lastName[i]
                    });
                }
                    
                const otherPeople = [];
                for (let i = 0; i < other_firstName.length; i++) {
                    otherPeople.push({
                        firstName: other_firstName[i],
                        middleName: other_middleName[i],
                        lastName: other_lastName[i],
                        contactNo: [other_contactNo[i]]
                    });
                }

                const updateData = {
                    name,
                    area,
                    depositoryBank,
                    bankAccountType,
                    bankAccountNum,
                    signatories,
                    otherPeople
                };
    
                // either should work... i think. as long as the group id is passed in the url
                //const updatedGroup = await Group.findOneAndUpdate({ _id: groupId }, updateData, { new: true });
                const updatedGroup = await Group.findOneAndUpdate({SPU: group.SPU, name: group.name, area: group.area}, updateData,{ new: true });

                if (updatedGroup) {
                    return res.json(updatedGroup);
                  } else {
                    return res.status(404).json( { error: "Update error!"});
                }

                //res.redirect("/dashboard");
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while editing the group." });
        }
    },

    //create a new project
    newProject: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                // idk what the form will have
                const { name } = req.body;
            
                let groups = [];
                const newProject = new Project({
                    name,
                    groups,
                });
                await newProject.save();

                //redirecting to dashboard rn cuz idk where else to redirect to
                res.redirect("/dashboard");
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while creating a new group." });
        }
    },
    
    //retrieve project
    retrieveProject: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const projectId = req.params.id; 
                // idk if this works will fix in future
    
                const project = await Project.findById(projectId)
                    // .populate('groups').populate('members').populate('savings');
                const loggedInUserId = req.session.userId;
                const user = await User.findById(loggedInUserId);
                if (!project.validSEDOs.includes(loggedInUserId) && !(user.authority != "admin")) {
                    return res.status(403).json({ error: "You are not authorized to edit this project." });
                }

                if (!project) {
                    return res.status(404).render("fail", { error: "Project not found." });
                }

                res.render("editGroup", { group });
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

                const loggedInUserId = req.session.userId;
                const user = await User.findById(loggedInUserId);
                if (!project.validSEDOs.includes(loggedInUserId) && !(user.authority != "admin")) {
                    return res.status(403).json({ error: "You are not authorized to edit this project." });
                }

                const { name } = req.body;
                
                const existingProject = await Project.findOne({ name });
                if (existingProject) {
                    return res.status(400).json({ error: "A project with the same name already exists." });
                }

                updateData = req.body;
    
                // either should work... i think. as long as the group id is passed in the url
                //const updateProject = await Project.findOneAndUpdate({ _id: projectId }, updateData, { new: true });
                const updateProject = await Project.findOneAndUpdate({name: project.name}, updateData,{ new: true });

                if (updateProject) {
                    return res.json(updateProject);
                  } else {
                    return res.status(404).json( { error: "Update error!"});
                }

                //res.redirect("/dashboard");
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while editing the group." });
        }
    },

    

    //create a new cluster
    newCluster: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                // idk what this form will have
                const { name } = req.body;
            
                let projects = [];
                const newCluster = new Cluster({
                    name,
                    projects,
                });
                await newCluster.save();

                //redirecting to dashboard rn cuz idk where else to redirect to
                res.redirect("/dashboard");
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while creating a new group." });
        }
    },

    

}

module.exports = partController;
