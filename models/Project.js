const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'group' }],
    location: { type: String },
    totalGroups: { type: Number, default: 0 },
    totalMembers: { type: Number, default: 0 },
    totalKaban: { type: Number, default: 0 },
}, { versionKey: false });

const Project = mongoose.model('project', ProjectSchema);

module.exports = Project;
