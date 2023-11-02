const User = require('../models/User');


const mongoose = require('mongoose')


const loginController = {

    login: async (req, res) => {
        try {
            console.log("does req.session not exist?", !req.session.isLoggedIn);
            if(!req.session.isLoggedIn){
                let { username, password, remember } = req.body;
                const user = await User.findOne({ username: username });
                if (!user) {
                    return res.status(401).json({ error: "That User Does Not Exist." });
                }
                const isPasswordMatch = await user.comparePassword(password);
                // const isPasswordMatch = (password == user.password);
                // doesnt work for me - isnt this comparing the content of password to the hashed password in the db?
                // my local db doesnt have paswords hashed so I use this instead

                if (user.authority=="SEDO"){
  
                    req.session.clusterId = user.validCluster;
                    console.log(user.validCluster)
                } else if (user.authority=="Treasurer"){
                    req.session.projectId = user.validGroup;
                    console.log(user.validGroup)
                }
                if (!isPasswordMatch ) {
                    return res.status(401).json({ error: "Wrong Password." });
                }
            
                req.session.isLoggedIn = true;
                req.session.userId = user._id;
                req.session.sidebar = true;
                
                if (!remember) {
                  console.log("no remember!");
                  //req.expires = false;
                  //req.session.expires=false;
                  req.session.cookie.expires = false;
                }
                req.session.rememberMe = remember;
                res.json();
            }
            else{
                res.redirect("/dashboard");
            }
        } catch (error) {
            console.error(error);
            
            return res.status(500).json({ error: "DB error." });
        }
    },

    logout: async (req, res) => {
        try {
            req.session.destroy();
            res.json()
        } catch (err) {
            console.error('Error logging out:', err);
            return new Error('Error logging out');
        }
        
        res.status(200).send();

    },

    clearSession: (req, res) => {
        try {
            // Clear the session (destroy the session)
            req.session.destroy((error) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to clear the session." });
            } else {
                res.sendStatus(200);
                console.log("Session destroyed.")
            }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Server error." });
        }
    }
}

module.exports = loginController;