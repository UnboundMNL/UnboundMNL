const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {type: String, required: true},
    
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'group' }],

    totalGroups: {type: Number, default: null},
   
    totalMembers: Number,
    totalKaban: Number,
    //totalLoans: Number,
    
}, {versionKey: false}
);

const Project = mongoose.model('project', ProjectSchema);

module.exports = Project;
