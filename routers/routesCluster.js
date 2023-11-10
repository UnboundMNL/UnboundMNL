const express = require('express');
const router = express.Router();
const he = require("he");
const mongoose = require('mongoose');

const Member = require('../models/Member');
const Saving = require('../models/Saving');
const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const Group = require('../models/Group');

const clusterController = require('../controllers/clusterController.js');

router.get("/cluster/view/:page", clusterController.cluster);
router.post("/newCluster", clusterController.newCluster);
router.post('/cluster/:id/edit', clusterController.editCluster);
router.post('/cluster/:id/delete', clusterController.deleteCluster);
router.get('/editClusterForm/:clusterId', clusterController.loadEditClusterForm);
router.post("/clusterMiddle", clusterController.clusterMiddle);

module.exports = router;  