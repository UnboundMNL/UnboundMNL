const express = require('express');
const router = express.Router();
const he = require("he");
const mongoose = require('mongoose');

const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');

const adminController = require('../controllers/adminFunctionsController');

//  GETS

// DELETE
router.post("/adminUserDelete", adminController.adminUserDelete);

// PATCH
router.patch("/userDetailsOverride", adminController.userDetailsOverride);


module.exports = router;  