const express = require('express');
const router = express.Router();
const he = require("he");
const mongoose = require('mongoose');

const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');

const registerController = require('../controllers/registerController');

router.post("/register", registerController.register);
router.post("/check-username", registerController.checkUsername);
router.get("/mass-register", registerController.massRegistrationPage)
router.get("/mass-register-done", registerController.massRegistrationDone)
router.get("/registration", registerController.registration);
router.post("/deleteUser", registerController.deleteUser);

module.exports = router;  
