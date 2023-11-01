const mongoose = require('mongoose');


const MemberSchema = new mongoose.Schema({
  name: {
    firstName: String,
    middleName: String,
    lastName: String, required: true
  },
  id: {type: String, required: true},
  photo: { type: String, required: true, default: 'something' },

  nameFather: {
    firstName: String,
    middleName: String,
    lastName: String
  },
  nameMother: {
    firstName: String,
    middleName: String,
    lastName: String
  },

  sex: {type: String, required: true},
  birthdate: {type: Date, required: true},
  address: {type: String, required: true},

  savings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'saving' }],
  totalSaving: {type: Number, default: 0}, 
  totalMatch: {type: Number, default: 0}, 

                      //Active, Retired with Savings, Retired w/o Savings
  status: {type: String, enum:['Active', 'RwS', 'RwoS'], default: 'Active', required: true},

  

  // loans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'loan' }],
  // totalLoanBal: Number, 
}, {versionKey: false}
);

const Member = mongoose.model('member', MemberSchema);

module.exports = Member;
