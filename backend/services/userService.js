const db = require("../db");

const getUserById = async (userId) => {
  const { rows } = await db.query(
    "SELECT id, username, created_at FROM users WHERE id = $1",
    [userId]
  );

  return rows[0];
};

module.exports = { getUserById };
