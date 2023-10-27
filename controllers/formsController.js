const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const User = require('../models/User');
const SHG = require('../models/Group');

const mongoose = require('mongoose')


const formsController = {

    loadEditClusterForm: async (req, res) => {
        const clusterId = req.params.clusterId;
        const cluster = await Cluster.findOne({_id: clusterId});
        res.render('components/popupFields/ClusterFormFields', {cluster});
    },
    loadEditSubProjectsForm: async (req, res) => {
        const projectId = req.params.projectId;
        const project = await Project.findOne({_id: projectId});
        res.render('components/popupFields/Sub-ProjectsFormFields', {project});
    },
    loadEditSHGForm: async (req, res) => {
        const shgId = req.params.shgId;
        const shg = await SHG.findOne({_id: shgId});
        res.render('components/popupFields/SHGFormFields', {shg});
    },
}

module.exports = formsController;