const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const { hashPassword } = require('../lib/hashing');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  authority: { type: String, enum: ['Admin', 'SEDO', 'Treasurer'], default: 'Treasurer', required: true },
  photo: { type: String },
  name: {
    firstName: String,
    middleName: String,
    lastName: String
  },
  mobile: String,
  validCluster: { type: mongoose.Schema.Types.ObjectId, ref: 'cluster' },
  validGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'group' }
}, { versionKey: false });

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


