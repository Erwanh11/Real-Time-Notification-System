const { createClient } = require('redis');

const redisSubscriber = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

redisSubscriber.on('error', (err) => console.error('Redis Error(Subscriber) :', err));

redisSubscriber.connect().then(() => {
  console.log('Connected to Redis (Subscriber)');
});

module.exports = redisSubscriber;
