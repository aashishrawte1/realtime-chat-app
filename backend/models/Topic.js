const mongoose = require('mongoose');
module.exports = mongoose.model('Topic', new mongoose.Schema({
  title: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}));
