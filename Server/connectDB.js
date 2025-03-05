const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "snm123",
  database: process.env.DB_NAME || "user_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Check MySQL connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Connected Successfully!");
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error("❌ MySQL Connection Failed:", err.message);
    process.exit(1);
  }
})();

module.exports = pool;
