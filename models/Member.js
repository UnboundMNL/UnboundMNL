const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
  },
  orgId: { type: String, required: true },
  photo: { type: String, required: true, default: 'something' },
  parentName: { type: String, required: true, default: 'Unknown' },
  sex: { type: String, enum: ['Male', 'Female', 'Other', 'Unknown'], required: true, default: 'Unknown' },
  birthdate: { type: Date },
  address: { type: String },
  savings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'saving' }],
  totalSaving: { type: Number, default: 0 },
  totalMatch: { type: Number, default: 0 },
  totalDeductions: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'RwS', 'RwoS'], default: 'Active', required: true }, //Active, Retired with Savings, Retired w/o Savings
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'project' },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'group' },
  clusterId: { type: mongoose.Schema.Types.ObjectId, ref: 'cluster' },
}, { versionKey: false });

const Member = mongoose.model('member', MemberSchema);

module.exports = Member;
