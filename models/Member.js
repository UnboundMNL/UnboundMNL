const mongoose = require('mongoose');

const NameSchema = new mongoose.Schema({
  firstName: { type: String },
  middleName: { type: String },
  lastName: { type: String },
});

const Name = mongoose.model('Name', NameSchema);


const MemberSchema = new mongoose.Schema({
  partID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'part', required: true }],
  name: { type: NameSchema, required: true },
  id: String,
  photo: { type: String },

  nameFather: { type: NameSchema },
  nameMother: { type: NameSchema },

  age: Number, //this is a derivable field!
  sex: String,
  birthdate: {type: String, required: true},
  address: {type: String, required: true},

  savings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'saving' }],
  totalSaving: Number, 
  totalMatch: Number, 

                      //Active, Retired with Savings, Retired w/o Savings
  status: {type: String, enum:['Active', 'RwS', 'RwoS'], default: 'Active', required: true},

  

  // loans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'loan' }],
  // totalLoanBal: Number, 
}, {versionKey: false}
);

const Member = mongoose.model('member', MemberSchema);

module.exports = Member;
