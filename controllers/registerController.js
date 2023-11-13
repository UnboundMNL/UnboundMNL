const User = require('../models/User');
const Cluster = require('../models/Cluster');
const mongoose = require('mongoose')
const { dashboardButtons } = require('../controllers/functions/buttons');

const registerController = {

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

  deleteUser: async (req, res) => {
    if (req.session.isLoggedIn) {
      const user = await User.findById(req.session.userId);
      req.session.destroy();
      const deletedUser = await User.findByIdAndDelete(user._id);
      if (deletedUser) {
        res.json({deletedUser});
      } else {
        return res.status(404).json({ error: "Delete error! Project not found." });
      }
    } else {
      res.redirect("/");
    }
  },

}

module.exports = registerController;