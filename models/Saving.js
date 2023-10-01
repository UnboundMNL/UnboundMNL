const mongoose = require('mongoose');
const SavingSchema = new mongoose.Schema({
    memberID: { type: mongoose.Schema.Types.ObjectId, ref: 'member', required: true },
    year: {type: Number, required: true}, //may improve later on
    //key value pair
    // jan: [{type: Number, default: -1}], [savings, matchingGrant]
    // feb: [{type: Number, default: -1}],
    // mar: [{type: Number, default: -1}],
    // apr: [{type: Number, default: -1}],
    // may: [{type: Number, default: -1}],
    // jun: [{type: Number, default: -1}],
    // jul: [{type: Number, default: -1}],
    // aug: [{type: Number, default: -1}],
    // sep: [{type: Number, default: -1}],
    // oct: [{type: Number, default: -1}],
    // nov: [{type: Number, default: -1}],
    // dec: [{type: Number, default: -1}],

    savingsArr: [{type: Number}],
    matchingArr: [{type: Number}],
}, {versionKey: false}
);

const Saving = mongoose.model('saving', SavingSchema);

module.exports = Saving;
