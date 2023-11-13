const express = require('express');
const router = express.Router();
const he = require("he");
const mongoose = require('mongoose');

const Member = require('../models/Member');
const Saving = require('../models/Saving');
const User = require('../models/User');
const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');

const choicesController = require('../controllers/choicesController.js');

router.post('/SHGChoices', choicesController.SHGChoices);
router.post('/projectChoices', choicesController.projectChoices);
router.post('/clusterChoices', choicesController.clusterChoices);

module.exports = router;  
