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
          //console.log(userId);
          user = await User.findById(userID);
        let authority = user.authority
          res.render("dashboard", { user, authority});
        } else {
          res.redirect("/");
        }
      } catch (error) {
        console.error(error);
        return res.status(500).render("fail", { error: "That user does not exist." });
      }
    });






module.exports = router;  