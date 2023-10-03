const mongoose = require('mongoose');

const NameSchema = new mongoose.Schema({
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
});

const Name = mongoose.model('Name', NameSchema);

const PartSchema = new mongoose.Schema({
    SPU: String,
    name: {type: String, required: true},
    
    signatories: [NameSchema], 
    depositoryBank: String,
    bankAccountType: String,
    bankAccountNum: String,
    treasurer: NameSchema, 


    type: {type: String, enum:['Cluster', 'Project', 'Group'], default: 'Group', required: true},
    childPart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'part' }],
    //parentPart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'part'}],

    totalProjects: {type: Number, default: null},
    totalGroups: {type: Number, default: null},
    totalMembers: Number,
    totalKaban: Number,
    //totalLoans: Number,
    validUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }], // i think we should use this field na rin.
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'member' }],
    
    
}, {versionKey: false}
);

const Part = mongoose.model('part', PartSchema);

module.exports = Part;
