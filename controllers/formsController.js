const Cluster = require('../models/Cluster');


const mongoose = require('mongoose')


const formsController = {

    loadEditClusterForm: async (req, res) => {
        const clusterName = req.params.clusterName;
        const cluster = await Cluster.findOne({name: clusterName});
        res.render('components/popupFields/ClusterFormFields', {cluster});
    }
}

module.exports = formsController;