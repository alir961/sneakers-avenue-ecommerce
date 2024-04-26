const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  email: {
    required: true,
    type: String
  },
  fisrtname: {
    required: true,
    type: String
  },
  lastname: {
    required: false,
    type: String
  },
  password: {
    required: true,
    type: String
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
