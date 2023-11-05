const mongoose = require('mongoose');

const SavingSchema = new mongoose.Schema({

    //there is already a FK for this schema in Member.js, choose one nalang
    memberID: { type: mongoose.Schema.Types.ObjectId, ref: 'member', required: true },

    year: {type: Number, required: true},
    jan: {
        savings: {
          type: Number,
          default: 0
        },
        match: {
          type: Number,
          default: 0
        }
      },
    
    feb: {
        savings: {
            type: Number,
            default: 0
        },
        match: {
            type: Number,
            default: 0
        }
    },

    mar: {
        savings: {
            type: Number,
            default: 0
        },
        match: {
            type: Number,
            default: 0
        }
    },

    apr: {
        savings: {
            type: Number,
            default: 0
        },
        match: {
            type: Number,
            default: 0
        }
    },

    may: {
        savings: {
            type: Number,
            default: 0
        },
        match: {
            type: Number,
            default: 0
        }
    },

    jun: {

        savings: {
            type: Number,
            default: 0
        },
        match: {
            type: Number,
            default: 0
        }
    },
    jul: {

        savings: {
            type: Number,
            default: 0
        },
        match: {
            type: Number,
            default: 0
        }
    },

    aug: {
        savings: {
            type: Number,
            default: 0
        },
        match: {
            type: Number,
            default: 0
        }
    },


    sep: {
        savings: {
            type: Number,
            default: 0
        },
        match: {
            type: Number,
            default: 0
        }
    },

    oct: {
        savings: {
            type: Number,
            default: 0
        },
        match: {
            type: Number,
            default: 0
        }


    },

    nov: {
        savings: {
            type: Number,
            default: 0
        },
        match: {
            type: Number,
            default: 0
        }
    },

    dec: {
        savings: {
            type: Number,
            default: 0
        },
        match: {
            type: Number,
            default: 0
        }

    },

    totalSavings: {
        type: Number,
        default: 0
    },

    totalMatch: {
        type: Number,
        default: 0
    },

}, {versionKey: false}
);

const Saving = mongoose.model('saving', SavingSchema);

module.exports = Saving;
