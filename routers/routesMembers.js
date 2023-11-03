const express = require('express');
const router = express.Router();
const he = require("he");
const mongoose = require('mongoose');

//const Loan = require('../models/Loan')
const Member = require('../models/Member');
const Part = require('../models/Part');
const Saving = require('../models/Saving');
const User = require('../models/User');
const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');

const { clusteridMiddleware } = require('../lib/middleware');
const { projectidMiddleware } = require('../lib/middleware');
const { groupidMiddleware } = require('../lib/middleware');
const { memberidMiddleware } = require('../lib/middleware');
const { savingidMiddleware } = require('../lib/middleware');

const membersController = require('../controllers/membersController.js');

router.use(clusteridMiddleware);
router.use(projectidMiddleware);
router.use(groupidMiddleware);
router.use(memberidMiddleware);
router.use(savingidMiddleware);

//TO ADD: Midleware for cluster/project/group IDs

router.get('/memberInfo', membersController.retrieveMember);
router.post('/newMember', membersController.newMember);
router.post('/member/:id/edit', membersController.editMember);
router.post('/member/:id/delete', membersController.deleteMember);
router.get('/masterlist', membersController.retrieveMasterlist)


module.exports = router;  
