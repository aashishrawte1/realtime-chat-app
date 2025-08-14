const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  avatar: String,
  status: { type: String, enum: ['online', 'offline'], default: 'offline' }
});
module.exports = mongoose.model('User', schema);
