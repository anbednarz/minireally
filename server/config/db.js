const mysql = require('mysql2/promise');
require('dotenv').config();

// Логирование переменных окружения (без пароля)
console.log('Конфигурация базы данных:');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('Database:', process.env.DB_NAME);
console.log('Port:', process.env.MYSQL_ADDON_PORT || 3306);

// Создаем пул соединений с базой данных
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.MYSQL_ADDON_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Проверка подключения
pool.getConnection()
  .then(connection => {
    console.log('Успешное подключение к базе данных!');
    connection.release();
  })
  .catch(err => {
    console.error('Ошибка подключения к базе данных:', err);
  });

module.exports = pool; 