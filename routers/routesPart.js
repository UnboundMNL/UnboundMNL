const express = require('express');
const router = express.Router();
const he = require("he");
const mongoose = require('mongoose');

//const Loan = require('../models/Loan')
const Member = require('../models/Member');
const Part = require('../models/Part');
const Saving = require('../models/Saving');
const User = require('../models/User');

const partController = require('../controllers/partController.js');

router.get("/newGroup", partController.newGroup);
router.get("/newProject", partController.newProject);
router.get("/newCluster", partController.newCluster);

module.exports = router;  
