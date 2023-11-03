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
                // im imagining what the form will have
                // i think we can get SPU from projects? or maybe we can just have a dropdown of SPUs? or manually input?

                const projectId = req.session.projectId; // [TO UPDATE MAYBE]
                let project = await Project.findById(projectId);

                const { SPU, name, location, depositoryBank, bankAccountType, bankAccountNum, 
                    SHGLeaderFirstName, SHGLeaderLastName, SHGLeaderPhone, 
                    SEDPChairmanFirstName, SEDPChairmanLastName, SEDPChairmanPhone, 
                    kabanTreasurerFirstName, kabanTreasurerLastName, kabanTreasurerPhone, 
                    kabanAuditorFirstName, kabanAuditorLastName, kabanAuditorPhone  } = req.body;
                
                // req.body.SPU = project.name; //maybe change this to project name?

                const existingGroup = await Group.findOne({ SPU, name, location });
                if (existingGroup) {
                    return res.status(400).json({ error: "A group with the same name, area, and SPU already exists." });
                }
                let SHGLeader = {
                    firstName: SHGLeaderFirstName,
                    lastName: SHGLeaderLastName,
                    contatNo: SHGLeaderPhone
                }

                let SEDPChairman = {
                    firstName: SEDPChairmanFirstName,
                    lastName: SEDPChairmanLastName,
                    contatNo: SEDPChairmanPhone
                }

                let kabanTreasurer = {
                    firstName: kabanTreasurerFirstName,
                    lastName: kabanTreasurerLastName,
                    contatNo: kabanTreasurerPhone
                }
                let kabanAuditor = {
                    firstName: kabanAuditorFirstName,
                    lastName: kabanAuditorLastName,
                    contatNo: kabanAuditorPhone
                }
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
                const cluster = await Cluster.findOne({_id: req.session.clusterId});
                cluster.totalGroups+=1;
                await cluster.save();
                project.totalGroups+=1;
                await newGroup.save();
                project.groups.push(newGroup._id);
                await project.save();

                //redirecting to dashboard rn cuz idk where else to redirect to
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
                const page = req.params.page;
                const userID = req.session.userId;
                const user = await User.findById(userID);
                const authority = user.authority;
                const username = user.username;
                
                const group = await Group.findOne({ _id: req.session.groupId });

                let updatedParts = [] 

                // var updatedParts;
                if (req.query.search){
                    updatedParts = await Member.find({
                        $and: [
                          { name: { $regex: req.query.search, $options: 'i' } }, 
                          { _id: { $in: group.member } } 
                        ]
                      });
                } else{
                    updatedParts = await Member.find({_id: { $in: group.member } });
                }

                //await updateOrgParts(updatedParts); 
                // const orgParts = getOrgParts();
                const pageParts = updatedParts;
                //console.log(orgParts);
 
                dashbuttons = dashboardButtons(authority);
                res.render("member", { authority, pageParts, username, sidebar, dashbuttons, grpName: group.name});
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


                const { SPU, name, location, depositoryBank, bankAccountType, bankAccountNum, 
                    SHGLeaderFirstName, SHGLeaderLastName, SHGLeaderPhone, 
                    SEDPChairmanFirstName, SEDPChairmanLastName, SEDPChairmanPhone, 
                    kabanTreasurerFirstName, kabanTreasurerLastName, kabanTreasurerPhone, 
                    kabanAuditorFirstName, kabanAuditorLastName, kabanAuditorPhone  } = req.body;
                
                if(group.name != name){
                    const existingGroup = await Group.findOne({ SPU, name, location });
                    if (existingGroup) {
                        return res.status(400).json({ error: "A group with the same name, area, and SPU already exists." });
                    }
                }
              
                let SHGLeader = {
                    firstName: SHGLeaderFirstName,
                    lastName: SHGLeaderLastName,
                    contatNo: SHGLeaderPhone
                }

                let SEDPChairman = {
                    firstName: SEDPChairmanFirstName,
                    lastName: SEDPChairmanLastName,
                    contatNo: SEDPChairmanPhone
                }

                let kabanTreasurer = {
                    firstName: kabanTreasurerFirstName,
                    lastName: kabanTreasurerLastName,
                    contatNo: kabanTreasurerPhone
                }
                let kabanAuditor = {
                    firstName: kabanAuditorFirstName,
                    lastName: kabanAuditorLastName,
                    contatNo: kabanAuditorPhone
                }

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
    
                // either should work... i think. as long as the group id is passed in the url
                //const updatedGroup = await Group.findOneAndUpdate({ _id: groupId }, updateData, { new: true });
                const updatedGroup = await Group.findOneAndUpdate({SPU: group.SPU, name: group.name, area: group.area}, updateData,{ new: true });

                if (updatedGroup) {
                    res.redirect("/group");
                  } else {
                    return res.status(404).json( { error: "Update error!"});
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
                // const loggedInUserId = req.session.userId;
                // const user = await User.findById(loggedInUserId);

                const cluster = await Cluster.findById(req.session.ClusterId);
                const project = await Project.findById(req.session.ProjectId);
                var kaban;
                if (Array.isArray(group.members)){
                    for (const member of group.members) {
                        kaban = await Saving.findMany({member: member});
                        for (const item of kaban){
                            cluster.totalKaban-=item.totalSavings;
                            project.totalKaban-=item.totalSavings;
                        }
                        await Saving.deleteMany({ member: member });
                        await Member.deleteOne({_id:  member });
                        cluster.totalMembers-=1;
                        project.totalMembers-=1;
                    }
                }
                
                const deletedGroup = await Group.findByIdAndDelete(groupId);
                cluster.totalGroups -=1;
                project.totalGroups -=1;
                await cluster.save();
                await project.save();
                // If the project was successfully deleted, delete associated groups, members, and savings
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
    
                // idk what the form will have
                const { name, location, SPU} = req.body;
            
 
    
                let groups = [];
                const newProject = new Project({
                    name,
                    groups,
                    SPU,
                    location
                    //anything else to add?
                });
                await newProject.save();

                const cluster = await Cluster.findById(req.session.clusterId);
                cluster.projects.push(newProject._id);
                cluster.totalProjects+=1;
                await cluster.save();
    
                //redirecting to dashboard rn cuz idk where else to redirect to
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
                // const project = await Project.findById(projectId)
                //     // .populate('groups')
                //     //.populate('members').populate('savings');
                // const loggedInUserId = req.session.userId;
                // const user = await User.findById(loggedInUserId);


                // if (!project) {
                //     return res.status(404).render("fail", { error: "Project not found." });
                // }
                
                const project = await Project.findOne({ _id: req.session.projectId });

                let updatedParts = [] 



                // var updatedParts;
                if (req.query.search){
                    updatedParts = await Group.find({
                        $and: [
                          { name: { $regex: req.query.search, $options: 'i' } }, 
                          { _id: { $in: project.groups } } 
                        ]
                      });
                } else{
                    updatedParts = await Group.find({_id: { $in: project.groups } });
                }




                //await updateOrgParts(updatedParts); 
                // const orgParts = getOrgParts();
                const orgParts = updatedParts;
                //console.log(orgParts);
                var pageParts = [];
                var perPage = 6; // change to how many clusters per page
                var totalPages;
                if (orgParts.length > perPage) {
                    var startPage = perPage * (page-1);
                    for (var i = 0; i < perPage && (startPage + i < orgParts.length); i++) {
                        pageParts.push(orgParts[startPage + i]);
                    }
                    totalPages = Math.ceil(orgParts.length / perPage);
                } else {
                    pageParts = orgParts;
                    totalPages = 1;
                }
                var totalPages = Math.ceil(orgParts.length/perPage);
                dashbuttons = dashboardButtons(authority);
                res.render("group", { authority, pageParts, username, sidebar, dashbuttons, page, totalPages,SPU:project.SPU, location:project.location  });
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

                const { name, location, SPU } = req.body;

                if(project.name != name){
                    const existingProject = await Project.findOne({ name });
                    if (existingProject) {
                        return res.status(400).json({ error: "A project with the same name already exists." });
                    }
                }
                updateData = req.body;
                /*
                //IF MOVING THE PROJECT FROM ONE CLUSTER TO ANOTHER

                //Assuming u can move the project from... anywhere ig (ie destination cluster)
                //const oldCluster = await Cluster.findOne({ projects: project._id });
                //const newCluster = await Cluster.findById(req.session.clusterId); //cuz the currently open cluster Id would be stored in middleware na

                //Assuming that the project is moved from one (the currently open) cluster to another (not open), the following code should work.
                //To add: only admin can do this?
                const oldClusterId = req.session.clusterId;
                const oldCluster = await Cluster.findById(oldClusterId);
                oldCluster.projects = oldCluster.projects.filter(id => id.toString() !== projectId);
                await oldCluster.save();


                clusterId = req.params.clusterId; 
                const newCluster = await Cluster.findById(clusterId);
                newCluster.projects.push(project._id);
                */ 
    
                // either should work... i think. as long as the group id is passed in the url
                //const updateProject = await Project.findOneAndUpdate({ _id: projectId }, updateData, { new: true });
                const updateProject = await Project.findOneAndUpdate({name: project.name}, updateData,{ new: true });

                if (updateProject) {
                    res.redirect("/project");
                  } else {
                    return res.status(404).json( { error: "Update error!"});
                }

                //res.redirect("/dashboard");
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
    
                // Find the project by ID
                const project = await Project.findById(projectId);
    
                // Check if the logged-in user is authorized to delete the project
                // const loggedInUserId = req.session.userId;
                // const user = await User.findById(loggedInUserId);
                const cluster = await Cluster.findById(req.session.ClusterId);
                var kaban;
                if (Array.isArray(project.groups)){
                    for (const groupId of project.groups) {
                        group = await Group.findById(groupId);
                        if (Array.isArray(group.members)){
                            for (const member of group.members) {
                                kaban = await Saving.findMany({member: member});
                                for (const item of kaban){
                                    cluster.totalKaban-=item.totalSavings;
                                }
                                await Saving.deleteMany({ member: member });
                                cluster.totalMembers-=1;
                                await Member.deleteOne({_id:  member });
                            }
                        }
                        await Group.deleteOne({_id:  group });
                        cluster.totalGroups-=1;
                    }
                }

                            
                
                // 4. Delete projects in cluster

                
                const deletedProject = await Project.findByIdAndDelete(projectId);
                
                cluster.totalProjects-=1;
                await cluster.save();
                // If the project was successfully deleted, delete associated groups, members, and savings
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
                // idk what this form will have
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

                //redirecting to dashboard rn cuz idk where else to redirect to
                res.redirect("/cluster");
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while creating a new cluster." });
        }
    },


    //retrieve cluster
    retrieveCluster: async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const sidebar = req.session.sidebar;
                const page = req.params.page;
                const userID = req.session.userId;
                const user = await User.findById(userID);
                const authority = user.authority;
                const username = user.username;

                let cluster = await Cluster.findOne({ _id: req.session.clusterId });
                if(authority == "SEDO"){
                    id = user.validCluster;
                    cluster = await Cluster.findOne({ _id: id });
                }
                //console.log(cluster.name);
                var updatedParts;
                if (req.query.search){
                    updatedParts = await Project.find({
                        $and: [
                          { name: { $regex: req.query.search, $options: 'i' } }, 
                          { _id: { $in: cluster.projects } } 
                        ]
                      });
                } else{
                    updatedParts = await Project.find({ _id: { $in: cluster.projects } });
                }
                //await updateOrgParts(updatedParts); 
                // const orgParts = getOrgParts();

                const orgParts = updatedParts;
                //console.log(orgParts)

                var pageParts = [];
                var perPage = 6; // change to how many clusters per page
                var totalPages;
                if (orgParts.length > perPage) {
                    var startPage = perPage * (page-1);
                    for (var i = 0; i < perPage && (startPage + i < orgParts.length); i++) {
                        pageParts.push(orgParts[startPage + i]);
                    }
                    totalPages = Math.ceil(orgParts.length / perPage);
                } else {
                    pageParts = orgParts;
                    totalPages = 1;
                }
                var totalPages = Math.ceil(orgParts.length/perPage);
                dashbuttons = dashboardButtons(authority);
                res.render("project", { authority, pageParts, username, sidebar, dashbuttons, page, totalPages  });
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

                const loggedInUserId = req.session.userId;
                const user = await User.findById(loggedInUserId);


                const { name, location, oldName } = req.body;
                if (oldName !== name){
                    const existingCluster = await Cluster.findOne({ name });
                    if (existingCluster) {
                        return res.status(400).json({ error: "A Cluster with the same name already exists." });
                    }
                }
                updateData = req.body;
    
                // either should work... i think. as long as the group id is passed in the url
                //const updateCluster = await Cluster.findOneAndUpdate({ _id: projectId }, updateData, { new: true });
                const updateCluster = await Cluster.findOneAndUpdate({name: cluster.name}, updateData,{ new: true });

                if (updateCluster) {
                    res.redirect("/cluster");
                  } else {
                    return res.status(500).render("fail", { error: "Update error!" });
                }

                // res.redirect("/cluster");
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
    
                // const loggedInUserId = req.session.userId;
                // const user = await User.findById(loggedInUserId);
                var project;
                var group;
                if (Array.isArray(cluster.projects)){
                    for (const projectId of cluster.projects) {
                        project = await Project.findById(projectId);
                        if (Array.isArray(project.groups)){
                            for (const groupId of project.groups) {
                                group = await Group.findById(groupId);
                                if (Array.isArray(group.members)){
                                    for (const member of group.members) {
                                        await Saving.deleteMany({ member: member });
                                        await Member.deleteOne({_id:  member });
                                    }
                                }
                                await Group.deleteOne({_id:  group });
                            }
                        }

                            await Project.deleteOne({_id: project})
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
                let { project } = req.body;
                console.log(project)
                const SHG = await Group.find({});
                res.json({ SHG });
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
                let { cluster } = req.body;
                const project = await Project.find({});
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
