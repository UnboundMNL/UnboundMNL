const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: {type: String, required: true},
    
    // signatories: [
    //     {
    //       firstName: String,
    //       middleName: String,
    //       lastName: String
    //     }
    //   ],
    
    member: [{ type: mongoose.Schema.Types.ObjectId, ref: 'member' }],
   
    // totalMembers: Number,
    totalKaban: Number,
    //totalLoans: Number,
    
}, {versionKey: false}
);

const Group = mongoose.model('group', GroupSchema);

module.exports = Group;
