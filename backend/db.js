const mysql = require("mysql2");

require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Error conectando a la BD:", err);
  } else {
    console.log("🟢 Conectado a Railway MySQL");
    connection.release();
  }
});

module.exports = pool;

console.log(process.env.DB_HOST);