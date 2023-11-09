const express = require('express');
const router = express.Router();
const he = require("he");
const mongoose = require('mongoose');

const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');

const userController = require('../controllers/userController');

router.get("/dashboard", userController.dashboard);

router.get("/cluster/view/:page", userController.cluster);;
router.get("/profile", userController.profile);
router.post("/clusterMiddle",userController.clusterMiddle);
router.post("/projectMiddle",userController.projectMiddle);
router.post("/groupMiddle",userController.groupMiddle);
router.post("/memberMiddle",userController.memberMiddle);

module.exports = router;  