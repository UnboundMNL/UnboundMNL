const mongoose = require('mongoose');


const MemberSchema = new mongoose.Schema({

    name: {
      firstName: {type: String, required: true},
      lastName: {type: String, required: true}
    },

  id: {type: String, required: true},
  photo: { type: String, required: true, default: 'something' },

  nameFather: {
    firstName: String,
    lastName: String
  },
  nameMother: {
    firstName: String,
    lastName: String
  },

  sex: {type: String, enum:['Male', 'Female', 'Other'], required: true},
  birthdate: {type: Date, required: true},
  address: {type: String, required: true},

  savings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'saving' }],
  totalSaving: {type: Number, default: 0}, 
  totalMatch: {type: Number, default: 0}, 

                      //Active, Retired with Savings, Retired w/o Savings
  status: {type: String, enum:['Active', 'RwS', 'RwoS'], default: 'Active', required: true},
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'project' },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'group' },
  clusterId: { type: mongoose.Schema.Types.ObjectId, ref: 'cluster' },
  

  // loans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'loan' }],
  // totalLoanBal: Number, 
}, {versionKey: false}
);

const Member = mongoose.model('member', MemberSchema);

module.exports = Member;
