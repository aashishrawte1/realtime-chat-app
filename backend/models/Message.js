const mongoose = require('mongoose');
module.exports = mongoose.model('Message', new mongoose.Schema({
  topic_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: {
    text: String,
    html: String,
    media: [{ type: Object }]
  },
  read_by: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  deleted: { type: Boolean, default: false },
  edited_at: Date
}, { timestamps: true }));
