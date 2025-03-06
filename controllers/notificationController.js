const redisClient = require('../config/redis');
const { createNotification } = require('../models/notificationModel');

const sendNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ error: 'userId et message required.' });
    }

    // Store notification in database
    const notification = await createNotification(userId, message);

    // Publish notification on Redis
    const channel = `notification:${userId}`;
    await redisClient.publish(channel, JSON.stringify(notification));

    return res.status(200).json({ status: 'Notification sent', notification });
  } catch (error) {
    console.error('Error during notification sending :', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { sendNotification };
