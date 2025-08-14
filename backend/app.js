const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { createClient } = require('redis');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error(err));

const redisClient = createClient({
  socket: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT }
});
redisClient.connect().catch(console.error);

app.use('/api/topic', require('./routes/topic'));
app.use('/api/message', require('./routes/message'));

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: process.env.CORS_ORIGIN } });

require('./sockets/chatSocket')(io);

server.listen(process.env.PORT, () =>
  console.log(`🚀 Backend running on port ${process.env.PORT}`)
);
