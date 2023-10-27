const Cluster = require('../models/Cluster');
const Project = require('../models/Project');
const User = require('../models/User');

const mongoose = require('mongoose')


const formsController = {

    loadEditClusterForm: async (req, res) => {
        const clusterName = req.params.clusterName;
        const cluster = await Cluster.findOne({name: clusterName});
        res.render('components/popupFields/ClusterFormFields', {cluster});
    },
    loadEditSubProjectsForm: async (req, res) => {
        const projectName = req.params.projectName;
        const project = await Project.findOne({name: projectName});
        res.render('components/popupFields/Sub-ProjectsFormFields', {project});
    }
}

module.exports = formsController;