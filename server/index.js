const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        // origin: 'http://localhost:3000', // In production, replace with your client URL
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
    res.send('Live Polling Backend is running!');
});

// HTTP Routes
const pollRoutes = require('./routes/pollRoutes');
app.use('/api/polls', pollRoutes);

// Register Socket.IO Handlers
const socketHandlers = require('./utils/socketHandlers');
socketHandlers(io);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
