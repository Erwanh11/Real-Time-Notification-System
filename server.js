require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');

const notificationRoutes = require('./routes/notifications');
const { initSocketHandler } = require('./sockets/socketHandler');

const app = express();
const server = http.createServer(app);

// Initialisation of Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// Middleware to parse JSON
app.use(bodyParser.json());

// Routes
app.use('/notify', notificationRoutes);

// Initialise socket handler
initSocketHandler(io);

// Serve client
app.use(express.static('client'));

// Trust proxy
app.set('trust proxy', true);


// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server start on port ${PORT}`);
});

