const mongoose = require('mongoose');

const ClusterSchema = new mongoose.Schema({
    name: {type: String, required: true},
    
    // signatories: [
    //     {
    //       firstName: String,
    //       middleName: String,
    //       lastName: String
    //     }
    //   ],
    
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'project' }],

    totalProjects: {type: Number, default: null},
    totalGroups: {type: Number, default: null},
   
    // totalMembers: Number,
    // totalKaban: Number,
    //totalLoans: Number,
    
}, {versionKey: false}
);

const Cluster = mongoose.model('cluster', ClusterSchema);

module.exports = Cluster;
