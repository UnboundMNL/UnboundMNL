const mongoose = require('mongoose');

const YearSchema = new mongoose.Schema({
    year: {type: Number, required: true},
    

    //option 1
    months: [{type: mongoose.Schema.Types.ObjectId, ref: 'month'}],

    //option2
    // jan: {type: mongoose.Schema.Types.ObjectId, ref: 'month'},
    // feb: {type: mongoose.Schema.Types.ObjectId, ref: 'month'},
    // ...

    //{jan : [savings, match]}

    //option 3 - I have no idea if this works

    // months: { //keys are always strings
    //     type: Map,
    //     of: [BigInt], //variable type of the value
    // }

    // {'Jan' : [savings, match], 'Feb' : [savings, match], ...}

    totalSavings: {type: Number, default: -1},
    totalMatchingGrant: {type: Number, default: -1}
})

// const MonthSchema = new mongoose.Schema({ //only if option 1 is used
//     month: {type: Number, required: true},
//     savings: {type: Number, default: -1},
//     matchingGrant: {type: Number, default: -1}
// })

const SavingSchema = new mongoose.Schema({
    memberID: { type: mongoose.Schema.Types.ObjectId, ref: 'member', required: true },
    // year: {type: Number, required: true}, //may improve later on
    //key value pair

    savings: {
        type: [YearSchema],
        default: [],
        required:true
    },

    // structure: Savings = [ year, year.months[i].[month, month.savings, month.matchingGrant] ]
    // or 

    // {'year' : {'jan' : [savings, grant] , 'feb' : [savings, grant], ...} , 'year' : {'jan' : [savings, grant] , 'feb' : [savings, grant], ...} , ...}

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
