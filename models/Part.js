const mongoose = require('mongoose');
const PartSchema = new mongoose.Schema({
    name: {type: String, required: true},
    type: {type: String, enum:['Cluster', 'Project', 'Group'], default: 'Group', required: true},
    childPart: [],
    parentPart: [],
    totalMembers: Number,
    totalKaban: [Number],
    totalLoans: Number,
    //validUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'member' }],
}, {versionKey: false}
);

const Part = mongoose.model('member', PartSchema);

module.exports = Part;
