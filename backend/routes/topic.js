const router = require('express').Router();
const Topic = require('../models/Topic');

// Create a new topic
router.post('/', async (req, res) => {
  try {
    const topic = await Topic.create(req.body);
    res.json(topic);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all topics
router.get('/', async (req, res) => {
  try {
    const topics = await Topic.find();
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
