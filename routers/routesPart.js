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

router.post("/newGroup", partController.newGroup);
router.post("/newProject", partController.newProject);
router.post("/newCluster", partController.newCluster);
router.post('/newMember', partController.newMember);

router.get('/group/:id', partController.retrieveGroup);
router.post('/group/:id/edit', partController.editGroup);
router.post('/group/:id/delete', partController.deleteGroup);

router.get('/group/:id/view/:page', partController.retrieveProject);
router.post('/project/:id/edit', partController.editProject);
router.post('/project/:id/delete', partController.deleteProject);

router.get('/project/:id/view/:page', partController.retrieveCluster);
router.post('/cluster/:id/edit', partController.editCluster);
router.post('/cluster/:id/delete', partController.deleteCluster);

router.post('/member/:id/edit', partController.editMember);
router.post('/member/:id/delete', partController.deleteMember);

router.post('/SHGChoices',partController.SHGChoices);
router.post('/projectChoices',partController.projectChoices);
//alternative if we want to do it by name. will have to change some code in the controllers
// router.post("/group", partController.newGroup);
// router.post("/project", partController.newProject);
// router.post("/cluster", partController.newCluster);

// router.get('/groups/:name', partController.retrieveGroup);
// router.post('/groups/:name/edit', partController.editGroup);
// router.post('/groups/:name/delete', partController.deleteGroup);

// router.get('/projects/:name', partController.retrieveProject);
// router.post('/projects/:name/edit', partController.editProject);
// router.post('/projects/:name/delete', partController.deleteProject);


module.exports = router;  
