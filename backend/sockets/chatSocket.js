const Message = require('../models/Message');

module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log(`⚡ User connected: ${socket.id}`);

    // User joins a topic room
    socket.on('join_topic', ({ topicId, userId }) => {
      socket.join(topicId);
      io.to(topicId).emit('user_joined', userId);
    });

    // Send message + broadcast
    socket.on('send_message', async (msg) => {
      const saved = await Message.create(msg);
      const populated = await saved.populate('sender_id', 'name avatar');
      io.to(msg.topic_id).emit('new_message', populated);
    });

    // Typing indicator
    socket.on('typing', ({ topicId, userId }) => {
      socket.to(topicId).emit('user_typing', userId);
    });

    // Stop typing indicator
    socket.on('stop_typing', ({ topicId, userId }) => {
      socket.to(topicId).emit('user_stop_typing', userId);
    });

    // Read receipt
    socket.on('read_message', async ({ messageId, userId, topicId }) => {
      await Message.findByIdAndUpdate(
        messageId,
        { $addToSet: { read_by: userId } },
        { new: true }
      );
      io.to(topicId).emit('message_read', { messageId, userId });
    });

    // Edit message
    socket.on('edit_message', async (msg) => {
      const updated = await Message.findByIdAndUpdate(msg._id, msg, { new: true });
      io.to(msg.topic_id).emit('message_edited', updated);
    });

    // Delete message
    socket.on('delete_message', async ({ topicId, messageId }) => {
      await Message.findByIdAndUpdate(messageId, { deleted: true });
      io.to(topicId).emit('message_deleted', messageId);
    });

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};
