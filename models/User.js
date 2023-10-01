const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const { hashPassword } = require('../lib/hashing');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    authority: {type: String, enum:['Admin', 'SEDO', 'Treasurer'], default: 'Treasurer', required: true},
    //remembered: {type: Boolean, default: false},

    //subUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    //i dont think we need to have user under users but yeah this is for that
    validOrg: [{ type: mongoose.Schema.Types.ObjectId, ref: 'part' }] 
    //??? depends how we wanna point the stuff
}, 
    {versionKey: false}
)

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
  
    try {
      const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
      next();
    } catch (error) {
      return next(error);
    }
  });
  
  UserSchema.pre('findOneAndUpdate', async function (next) {
    if (!this._update.password) return next();
  
    try {
      const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
      const hash = await bcrypt.hash(this._update.password, salt);
      this._update.password = hash;
      next();
    } catch (error) {
      return next(error);
    }
  });
  
  UserSchema.methods.comparePassword = async function (candidatePassword) {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      throw error;
    }
  };

const User = mongoose.model('user', UserSchema)
module.exports = User


