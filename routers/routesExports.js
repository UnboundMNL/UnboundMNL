//router for exports
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

const { promisify } = require('util');
const archiver = require('archiver');
const fs = require('fs');
const { pipeline } = require('stream');
const pipelineAsync = promisify(pipeline);

const exportsController = require('../controllers/exportsController.js');

router.get("/exportGroup/:id", exportsController.exportGroup);
router.get("/exportProject/:id", exportsController.exportProject);
router.get("/exportCluster/:id", exportsController.exportCluster);
router.get("/exportAdminClusters", exportsController.exportAdminClusters);
router.get("/exportReport", exportsController.exportReport);

module.exports = router;