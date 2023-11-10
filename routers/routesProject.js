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

const projectController = require('../controllers/projectController.js');

router.get('/project/view/:page', projectController.project);
router.post("/newProject", projectController.newProject);
router.post('/project/:id/edit', projectController.editProject);
router.post('/project/:id/delete', projectController.deleteProject);
router.get('/editSubProjectsForm/:projectId', projectController.loadEditSubProjectsForm);
router.post("/projectMiddle", projectController.projectMiddle);

module.exports = router;  