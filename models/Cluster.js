const mongoose = require('mongoose');

const ClusterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'project' }],
    totalProjects: { type: Number, default: 0 },
    totalGroups: { type: Number, default: 0 },
    totalMembers: { type: Number, default: 0 },
    totalKaban: { type: Number, default: 0 },
}, { versionKey: false });

const Cluster = mongoose.model('cluster', ClusterSchema);

module.exports = Cluster;
