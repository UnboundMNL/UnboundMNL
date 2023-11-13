const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  SPU: { type: String },
  name: { type: String, required: true },
  location: { type: String },
  depositoryBank: String,
  bankAccountType: { type: String, enum: ['Savings', 'Checking',''] },
  bankAccountNum: Number,
  SHGLeader: {
    firstName: String,
    lastName: String,
    contatNo: String
  },
  SEDPChairman: {
    firstName: String,
    lastName: String,
    contatNo: String
  },
  kabanTreasurer: {
    firstName: String,
    lastName: String,
    contatNo: String
  },
  kabanAuditor: {
    firstName: String,
    lastName: String,
    contatNo: String
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'member' }],
  totalMembers: { type: Number, default: 0 },
  totalKaban: { type: Number, default: 0 }

}, { versionKey: false });

const Group = mongoose.model('group', GroupSchema);

module.exports = Group;
