const mongoose = require('mongoose');

const ClusterSchema = new mongoose.Schema({
    name: {type: String, required: true},
    location: {type: String, required: true},
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'project' }],

    totalProjects: {type: Number, default: null},
    totalGroups: {type: Number, default: null},
   
    totalMembers: {type: Number, default: 0},
    totalKaban: {type: Number, default: 0},
    //totalLoans: Number,
    
    validSEDOs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user'}]
}, {versionKey: false}
);

const Cluster = mongoose.model('cluster', ClusterSchema);

module.exports = Cluster;
