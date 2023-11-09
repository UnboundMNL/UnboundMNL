const express = require('express');
const router = express.Router();
const he = require("he");
const mongoose = require('mongoose');

const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');

const loginController = require('../controllers/loginController');

router.post("/login", loginController.login); //logging in
router.post("/logout", loginController.logout);
router.post("/clear-session", loginController.clearSession); // Server-side route to clear the session

module.exports = router;  