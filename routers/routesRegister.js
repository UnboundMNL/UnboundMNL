const express = require('express');
const router = express.Router();
const he = require("he");
const mongoose = require('mongoose');

//const Loan = require('../models/Loan')
const Member = require('../models/Member');
const Part = require('../models/Part');
const Saving = require('../models/Saving');
const User = require('../models/User');


router.post("/register", async (req, res) => {
  if(req.session.isLoggedIn){
      try {
        const loggedInUser = await User.findById(req.session.userId);
        if (loggedInUser.authority !== 'Admin') {
            return res.status(401).json({ error: "Only admins can register new accounts." });
        }

        const { username, password, repassword, authority, validPart } = req.body;
        if (password !== repassword) {
          return res.status(400).json({ error: "Passwords do not match." });
        }
    
        //checking inputs for other stuff
        const MIN_PASSWORD_LENGTH = 6; 
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/; 
        if (password.length < MIN_PASSWORD_LENGTH || !passwordRegex.test(password)) {
          return res.status(400).json({ error: "Password must be at least 6 characters long and must contain upper and lowercase lettes, and numbers." });
        }
    
        let usernameRegex = /^(?=.{3,15}$)(?=.*[a-zA-Z0-9])[a-zA-Z0-9_-]*$/;
        if (!usernameRegex.test(username)) {
          return res.status(400).json( { error: "Username must contain at least one letter or number, and be between 3-15 characters long, and cannot be 'visitor'!" });
        }
        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(400).json( { error:"Username already exists"});
        }

        //get the children of validPart (if SEDO)
    
        const user = new User({ username, password, authority, validPart });
        const savedUser = await user.save();
        savedUser.userId = savedUser._id;
        await savedUser.save();
    
        res.redirect("/success");
      } catch (error) {
        console.error(error);
        return res.status(500).json( { error: "An error occured, please try again" });
      }
    }else{
      res.redirect("/") //res.render("/") , redirect back to homepage (aka login page)
    }
  });

  module.exports = router;  