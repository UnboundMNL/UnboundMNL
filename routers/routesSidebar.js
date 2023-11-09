const express = require('express');
const router = express.Router();
const he = require("he");
const mongoose = require('mongoose');

const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');

const sidebarController = require('../controllers/sidebarController');

router.post("/sidebarChange", sidebarController.sidebarChange);

module.exports = router;  