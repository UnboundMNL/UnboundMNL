const express = require('express');
const router = express.Router();
const he = require("he");
const mongoose = require('mongoose');

const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');

const registerController = require('../controllers/registerController');

router.post("/register", registerController.register);
router.get("/registration", registerController.registration);

module.exports = router;  