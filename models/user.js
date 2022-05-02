const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
  },
  reset_password_token: {
    type: String,
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  mobile_no: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: 1
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  deleted_at: {
    type: Date,
    default: null
  }
});

autoIncrement.initialize(mongoose.connection);
UserSchema.plugin(autoIncrement.plugin, 'user');
const user = mongoose.model('user', UserSchema);

module.exports = user;