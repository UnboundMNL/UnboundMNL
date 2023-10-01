const express = require('express');
const router = express.Router();
const he = require("he");
const mongoose = require('mongoose');

//const Loan = require('../models/Loan')
const Member = require('../models/Member');
const Part = require('../models/Part');
const Saving = require('../models/Saving');
const User = require('../models/User');



    router.get("/dashboard", async (req, res) => {
        try {
            if (req.session.isLoggedIn) {
                const userID = req.session.userId;
                const user = await User.findById(userID);
                const auth = user.authority;
    
                let orgParts;
    
                if (auth === "Admin") {
                    orgParts = await Part.find();
                } else if (auth === "SEDO" || auth === "Treasurer") {
                    const validOrg = user.validOrg; 
                    orgParts = await Part.find({ _id: { $in: validOrg } });
                    //maybe we could just have the topmost accessible thing for SEDO then recursively get all other things that the user can access
                    //i think that's extra read processes though (recursion) as opposed to just checcking everything once...? 
                    //i mean this current solution isnt O(n^2) naman

                    //  as for additional security, maybe RBAC? but i think that's something very complex and im not sure where to start on that
                }
                //get members of orgParts
                //total values are in the Parts schema
                res.render("dashboard", { user, authority: auth, orgParts });
            } else {
                res.redirect("/");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).render("fail", { error: "An error occurred while fetching data." });
        }
    });
    



module.exports = router;  