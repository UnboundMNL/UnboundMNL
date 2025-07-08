const User = require('../models/User');
const Cluster = require('../models/Cluster');
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
        //if (authority == "Treasurer") {
        //  return res.redirect("/");
        //}
        if (authority == "Admin") {
          clusterChoices = await Cluster.find({});
        } else {
          clusterChoices = await Cluster.findById(req.session.clusterId);
        }

        ///const subprojects = null;

        // TODO: add data
        // shape must be like this
        // id can have dashes or not, just make sure it is consistent
        // this id is passed directly through form
        const subprojects = [
          {
            '_id': '533686c6-5b5e-11f0-b4cc-fba2f2c0320a',
            'name': 'Project 1',
            'groups': [
              '45385ec8-5b5e-11f0-9677-db8c863b48e5',
              '70f59abc-5b5e-11f0-bd3c-73c4f5a9919b'
            ]
          },
          {
            '_id': '4fa6d9fc-5b5e-11f0-bf8c-63da6b061f11',
            'name': 'Project 2',
            'groups': [
              '75bbd480-5b5e-11f0-bb6a-83bfe7555433',
              '7774d114-5b5e-11f0-a942-5b80ac11610c',
              '2404e7f0-5b61-11f0-9119-9b1f069ff1f3'
            ]
          },
        ]
        const shgs = [
          {
            '_id': '45385ec8-5b5e-11f0-9677-db8c863b48e5',
            'name': 'Cluster 1 SHG 1'
          },
          {
            '_id': '70f59abc-5b5e-11f0-bd3c-73c4f5a9919b',
            'name': 'Cluster 1 SHG 2'
          },
          {
            '_id': '75bbd480-5b5e-11f0-bb6a-83bfe7555433',
            'name': 'Cluster 2 SHG 1'
          },
          {
            '_id': '7774d114-5b5e-11f0-a942-5b80ac11610c',
            'name': 'Cluster 2 SHG 2'
          },
          {
            '_id': '2404e7f0-5b61-11f0-9119-9b1f069ff1f3',
            'name': 'Cluster 2 SHG 3'
          },
        ]

        res.render("massRegistration", {
          authority, username, dashbuttons, sidebar,
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
        if (authority == "Treasurer") {
          return res.redirect("/");
        }
        if (authority == "Admin") {
          clusterChoices = await Cluster.find({});
        } else {
          clusterChoices = await Cluster.findById(req.session.clusterId);
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
  }
}

module.exports = registerController;
