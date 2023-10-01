const mongoose = require('mongoose');
const MemberSchema = new mongoose.Schema({
  partID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'part', required: true }],
  nameFirst: {type: String, required: true},
  nameMiddle: String,
  nameLast: {type: String, required: true},
  
  nameFatherFirst: String,
  nameFatherMiddle: String,
  nameFatherLast: String,

  nameMotherFirst: String,
  nameMotherMiddle: String,
  nameMotherLast: String,

  age: Number, //this is a derivable field!
  sex: String,
  birthdate: {type: String, required: true},
  address: {type: String, required: true},

  savings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'saving' }],
  totalSaving: Number, 
  totalMatch: Number, 

  //id: String, ? i know they have ids dun sa unbound but mongoose auto puts ids (as you all know :) )
  // loans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'loan' }],
  // totalLoanBal: Number, 
}, {versionKey: false}
);

const Member = mongoose.model('member', MemberSchema);

module.exports = Member;
