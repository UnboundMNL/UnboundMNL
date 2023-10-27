const mongoose = require('mongoose');


const MemberSchema = new mongoose.Schema({
  name: {
    firstName: String,
    middleName: String,
    lastName: String
  },
  id: String,
  photo: { type: String },

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

  age: Number, //this is a derivable field!
  sex: String,
  birthdate: {type: String, required: true},
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
