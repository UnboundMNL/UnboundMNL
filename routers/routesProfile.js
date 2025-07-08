const express = require('express');
const router = express.Router();
const he = require("he");
const mongoose = require('mongoose');

const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');

const profileController = require('../controllers/profileController');

router.get("/dashboard", profileController.dashboard);
router.get("/financial-report", profileController.report)
router.get("/profile", profileController.profile);
router.patch("/editProfile", profileController.editProfile);
router.get("/retrieveUsernameList", profileController.retrieveUsernameList);
router.get("/accounts", profileController.accounts);
router.post("/redirectMiddle", profileController.redirectMiddle);


module.exports = router;  
