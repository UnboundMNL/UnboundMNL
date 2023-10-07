const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    SPU: {type: String},
    name: {type: String, required: true},
    area: {type: String},

    depositoryBank: String,
    bankAccountType: {type: String, enum:['Savings', 'Checking']},
    bankAccountNum: String,

    signatories: [
        {
          firstName: String,
          middleName: String,
          lastName: String
        }
      ],

      //SHG Leader, SEDP Chairman, Kaban Treasurer, Kaban Auditor
    otherPeople:[
        {
          firstName: String,
          middleName: String,
          lastName: String,
          contatNo: [String],
        }
      ],
    
    member: [{ type: mongoose.Schema.Types.ObjectId, ref: 'member' }],
   
    totalMembers: {type: Number, default: 0},
    totalKaban: {type: Number, default: 0},
    //totalLoans: Number,

    validSEDOs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    validTreasurers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user'}]
    
}, {versionKey: false}
);

const Group = mongoose.model('group', GroupSchema);

module.exports = Group;
