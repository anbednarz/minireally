const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const productsRouter = require('./routes/products');

// CORS configuration
app.use(cors({
  origin: '*', // В продакшене замените на конкретный домен
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Тестовый маршрут для проверки API
app.get('/api/test', (req, res) => {
  res.json({ message: 'API работает!' });
});

// API Routes
app.use('/api/products', productsRouter);

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Что-то пошло не так!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
}); 