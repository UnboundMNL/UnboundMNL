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

const memberController = require('../controllers/memberController.js');

router.get('/member', memberController.member);
router.get('/membersTable/:year', memberController.reloadTable);
router.get('/memberInfo', memberController.retrieveMember);
router.post('/newMember', memberController.newMember);
router.post('/member/:id/edit', memberController.editMember);
router.post('/member/:id/delete', memberController.deleteMember);
router.get('/masterlist', memberController.retrieveMasterlist)
router.post("/memberMiddle", memberController.memberMiddle);

module.exports = router;  