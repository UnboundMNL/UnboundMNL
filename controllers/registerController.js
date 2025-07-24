const User = require('../models/User');
const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');
const mongoose = require('mongoose')
const { dashboardButtons } = require('../controllers/functions/buttons');

const registerController = {

  // registration for users
  register: async (req, res) => {
    if (req.session.isLoggedIn) {
      try {
        const { authority, username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.json({ error: "Username already exists" });
        }
        let newUser;
        if (authority == "Admin") {
          newUser = new User({
            authority,
            username,
            password
          });
        } else if (authority == "SEDO") {
          const { validCluster } = req.body
          newUser = new User({
            authority,
            username,
            password,
            validCluster
          });
        } else {
          const { validGroup } = req.body
          newUser = new User({
            authority,
            username,
            password,
            validGroup
          });
        }
        await newUser.save();
        if (newUser) {
          res.json({ succes: "New user has been added!" })
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occured, please try again" });
      }
    } else {
      res.redirect("/") // redirect back to homepage (aka login page)
    }
  },

  // registration page
  registration: async (req, res) => {
    try {
      if (req.session.isLoggedIn) {
        const userID = req.session.userId;
        const sidebar = req.session.sidebar;
        const user = await User.findById(userID);
        const authority = user.authority;
        const username = user.username;
        dashbuttons = dashboardButtons(authority);
        let clusterChoices;
        if (authority == "Treasurer") {
          return res.redirect("/");
        }
        if (authority == "Admin") {
          clusterChoices = await Cluster.find({});
        } else {
          clusterChoices = await Cluster.findById(req.session.clusterId);
        }
        res.render("registration", { authority, username, dashbuttons, sidebar, clusterChoices });
      } else {
        res.redirect("/");
      }
    } catch (error) {
      console.error(error);
      return res.status(500).render("fail", { error: "An error occurred while fetching data." });
    }
  },

  // delete user
  deleteUser: async (req, res) => {
    if (req.session.isLoggedIn) {
      const user = await User.findById(req.session.userId);
      req.session.destroy();
      const deletedUser = await User.findByIdAndDelete(user._id);
      if (deletedUser) {
        res.json({ deletedUser });
      } else {
        return res.status(404).json({ error: "Delete error! Project not found." });
      }
    } else {
      res.redirect("/");
    }
  },
  massRegistrationPage: async (req, res) => {
    try {
      if (req.session.isLoggedIn) {
        const userID = req.session.userId;
        const sidebar = req.session.sidebar;
        const user = await User.findById(userID);
        const authority = user.authority;
        const username = user.username;
        dashbuttons = dashboardButtons(authority);
        let clusterChoices;
        let subprojects = [];
        let shgs = [];

        if (authority == "Admin") {
            clusterChoices = await Cluster.find({}).lean();
        } else if (authority == "SEDO" && req.session.clusterId) {
            const cluster = await Cluster.findById(req.session.clusterId).lean();
            clusterChoices = cluster ? [cluster] : [];
        } else {
            clusterChoices = [];
        }
        
        try {
            if (authority === "Admin") {
              // Admin can see all projects and groups
              const projects = await Project.find({}).populate('groups').lean();
              const groups = await Group.find({}).lean();
              const allClusters = await Cluster.find({}).lean();
              
              subprojects = projects.map(project => {
                  // Find which cluster contains this project
                  const parentCluster = allClusters.find(cluster => 
                      cluster.projects && cluster.projects.some(p => p.toString() === project._id.toString())
                  );
                  
                  return {
                      '_id': project._id.toString(),
                      'name': project.name,
                      'cluster': parentCluster ? parentCluster._id.toString() : null,
                      'groups': project.groups ? project.groups.map(group => group._id.toString()) : []
                  };
              });
              
              shgs = groups.map(group => ({
                  '_id': group._id.toString(),
                  'name': group.name,
                  'cluster': null // Groups don't have cluster field
              }));
              
          } else if (authority === "SEDO" && req.session.clusterId) {
                
                const cluster = await Cluster.findById(req.session.clusterId).populate('projects').lean();
                
                if (cluster && cluster.projects) {
                    const projectIds = cluster.projects.map(p => p._id);
                    const projects = await Project.find({ 
                        _id: { $in: projectIds } 
                    }).populate('groups').lean();
                    
                    let allGroups = [];
                    projects.forEach(project => {
                        if (project.groups && project.groups.length > 0) {
                            allGroups.push(...project.groups);
                        }
                    });
                    subprojects = projects.map(project => ({
                        '_id': project._id.toString(),
                        'name': project.name,
                        'cluster': req.session.clusterId.toString(), // Set cluster from session
                        'groups': project.groups ? project.groups.map(group => group._id.toString()) : []
                    }));
                    
                    shgs = allGroups.map(group => ({
                        '_id': group._id.toString(),
                        'name': group.name,
                        'cluster': null // Groups don't have cluster field
                    }));
                } else {
                    subprojects = [];
                    shgs = [];
                }
                
            } else if (authority === "Treasurer" && req.session.groupId) {
                
                const project = await Project.findOne({ 
                    groups: req.session.groupId 
                }).populate('groups').lean();
                
                if (project) {
                    const group = project.groups.find(g => g._id.toString() === req.session.groupId.toString());
                    
                    if (group) {
                        subprojects = [{
                            '_id': project._id.toString(),
                            'name': project.name,
                            'cluster': null, // Projects don't have cluster field
                            'groups': [group._id.toString()]
                        }];
                        
                        shgs = [{
                            '_id': group._id.toString(),
                            'name': group.name,
                            'cluster': null // Groups don't have cluster field
                        }];
                    }
                }
            } else {
                console.log('No matching authority condition met');
                console.log('Authority:', authority);
                console.log('Session clusterId:', req.session.clusterId);
                console.log('Session groupId:', req.session.groupId);
            }
        } catch (dbError) {
            console.error('Database query error:', dbError);
            // Fallback to empty arrays if database queries fail
            subprojects = [];
            shgs = [];
        }

        res.render("massRegistration", {
            authority, 
            username, 
            dashbuttons, 
            sidebar,
            clusters: clusterChoices,
            subprojects: JSON.stringify(subprojects),
            shgs: JSON.stringify(shgs)
        });
      } else {
        res.redirect("/");
      }
    } catch (error) {
      console.error(error);
      return res.status(500).render("fail", { error: "An error occurred while fetching data." });
    }
  },
  massRegistrationDone: async (req, res) => {
    try {
      if (req.session.isLoggedIn) {
        const userID = req.session.userId;
        const sidebar = req.session.sidebar;
        const user = await User.findById(userID);
        const authority = user.authority;
        const username = user.username;
        dashbuttons = dashboardButtons(authority);
        let clusterChoices;

        if (authority == "Admin") {
          clusterChoices = await Cluster.find({});
        } else if (authority == "SEDO") {
          clusterChoices = await Cluster.findById(req.session.clusterId);
        } else {
          clusterChoices = [];
        }

        const summary = req.session.massRegistrationSummary || {};
        delete req.session.massRegistrationSummary;

        res.render("massRegistrationSummary", {
          authority, username, dashbuttons, sidebar, clusterChoices,
          recordsDone: summary.recordsDone,
          recordsTotal: summary.recordsTotal,
          errorCount: summary.errorCount,
          issues: summary.issues,
          successRate: summary.successRate
        });
      } else {
        res.redirect("/");
      }
    } catch (error) {
      console.error(error);
      return res.status(500).render("fail", { error: "An error occurred while fetching data." });
    }
  },

  checkUsername: async (req, res) => {
    try {
      if (req.session.isLoggedIn) {
        const { username } = req.body;
        
        const existingUser = await User.findOne({ username });
        res.json({ exists: !!existingUser });
      } else {
        res.redirect("/");
      }
    } catch (error) {
      res.status(500).render("fail", { error: "Internal server error" });
    }
  }
}

module.exports = registerController;
