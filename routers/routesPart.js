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

const partController = require('../controllers/partController.js');

const { clusteridMiddleware } = require('../lib/middleware');
const { projectidMiddleware } = require('../lib/middleware');
const { groupidMiddleware } = require('../lib/middleware');
const { memberidMiddleware } = require('../lib/middleware');
const { savingidMiddleware } = require('../lib/middleware');

router.use(clusteridMiddleware);
router.use(projectidMiddleware);
router.use(groupidMiddleware);
router.use(memberidMiddleware);
router.use(savingidMiddleware);

router.post("/newGroup", partController.newGroup);
router.post("/newProject", partController.newProject);
router.post("/newCluster", partController.newCluster);

router.get('/member', partController.retrieveGroup);
router.get('/membersTable/:year', partController.reloadTable);
router.post('/group/:id/edit', partController.editGroup);
router.post('/group/:id/delete', partController.deleteGroup);

router.get('/group/view/:page', partController.retrieveProject);
router.post('/project/:id/edit', partController.editProject);
router.post('/project/:id/delete', partController.deleteProject);

router.get('/project/view/:page', partController.retrieveCluster);
router.post('/cluster/:id/edit', partController.editCluster);
router.post('/cluster/:id/delete', partController.deleteCluster);


router.post('/SHGChoices',partController.SHGChoices);
router.post('/projectChoices',partController.projectChoices);

module.exports = router;  
