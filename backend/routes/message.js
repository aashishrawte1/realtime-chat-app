const router = require('express').Router();
const multer = require('multer');
const Message = require('../models/Message');
const User = require('../models/User');
const { uploadFile } = require('../utils/s3');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get messages for a topic (with sender)
router.get('/:topicId', async (req, res) => {
  try {
    const messages = await Message.find({ topic_id: req.params.topicId })
      .populate('sender_id', 'name avatar')
      .sort({ createdAt: 1 })
      .limit(50);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload media file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const key = `chat_media/${Date.now()}_${req.file.originalname}`;
    const result = await uploadFile(req.file.buffer, key, req.file.mimetype);
    res.json({
      url: result.Location,
      key,
      contentType: req.file.mimetype
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
