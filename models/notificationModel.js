const pool = require('../config/db');

const createNotification = async (userId, message) => {
  const query = `
    INSERT INTO notifications (user_id, message, timestamp, status)
    VALUES ($1, $2, NOW(), 'unread')
    RETURNING *;
  `;
  const values = [userId, message];
  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = { createNotification };
