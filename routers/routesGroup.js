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

const groupController = require('../controllers/groupController.js');

router.get('/group/view/:page', groupController.group);
router.post("/newGroup", groupController.newGroup);
router.post('/group/:id/edit', groupController.editGroup);
router.post('/group/:id/delete', groupController.deleteGroup);
router.get('/editSHGForm/:shgId', groupController.loadEditSHGForm);
router.post("/groupMiddle", groupController.groupMiddle);

module.exports = router;  