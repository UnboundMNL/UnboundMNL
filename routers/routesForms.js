const express = require('express');
const router = express.Router();

const Member = require('../models/Member');
const Part = require('../models/Part');
const Saving = require('../models/Saving');
const User = require('../models/User');
const Cluster = require('../models/Cluster');

const formsController = require('../controllers/formsController');

//This is one just to render the forms in a separate page
router.get("/addUser", async (req, res) => {
    if(req.session.isLoggedIn){
        const user = await User.findById(req.session.userId);
        const authority = user.authority;
        var clusters=[]; // sample
        if (authority == "Admin"){
            clusters = await Cluster.find({});
        }
        if (authority == "SEDO"){
            clusters = await Cluster.find({validSEDOs : [user]});
        }
        res.render("popup", { authority, clusters });
    }
    else
        res.redirect("/");
});

//This one changes the form depending on the user type selected
router.post("/addUser", async (req, res) => {
    res.render("components/addUser", { userType: req.body.userType });
});


//ACTUAL ROUTES TO BE USED
router.get('/editClusterForm/:clusterName', formsController.loadEditClusterForm);
module.exports = router;