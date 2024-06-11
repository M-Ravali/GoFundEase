const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const campaignRoutes = require('./routes/campaign');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

console.log(`JWT_SECRET: ${process.env.JWT_SECRET}`);

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/campaign', campaignRoutes);

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.set('socketio', io); // Store io instance in app for later use

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
