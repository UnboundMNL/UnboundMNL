const mongoose = require('mongoose');
const SavingSchema = new mongoose.Schema({
    year: {type: Number, required: true}, //may improve later on
    //key value pair
    jan: [{type: Number, default: -1}],
    feb
    mar
    apr
    may
    jun
    jul
    aug
    sep
    oct
    nov
    dec
}, {versionKey: false}
);

const Saving = mongoose.model('member', SavingSchema);

module.exports = Saving;
