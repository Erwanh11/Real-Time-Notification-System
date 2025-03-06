const redisSubscriber = require('../config/redisSubscriber');

function initSocketHandler(io) {
  io.on('connection', (socket) => {
    console.log('New client connected :', socket.id);

    // Client register awith his userId
    socket.on('register', (userId) => {
      console.log(`Socket ${socket.id} register for user ${userId}`);
      socket.join(userId);
    });

    socket.on('disconnect', () => {
      console.log('Client déconnected :', socket.id);
    });
  });

  // Pattern subscribe for every channels "notification:*"
  redisSubscriber.pSubscribe('notification:*', (message, channel) => {
    try {
      // Extract userId from channel (format "notification:{userId}")
      const parts = channel.split(':');
      const userId = parts[1];
      const notification = JSON.parse(message);

      // Emit notification to clients in corresponding room
      io.to(userId).emit('notification', notification);
    } catch (error) {
      console.error('Error during Redis message process :', error);
    }
  });
}

module.exports = { initSocketHandler };
