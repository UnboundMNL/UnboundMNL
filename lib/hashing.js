const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  hashPassword,
};
