const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Получение всех продуктов
router.get('/', async (req, res) => {
    try {
        console.log('Запрос на получение всех продуктов');
        const [rows] = await db.query('SELECT * FROM products');
        console.log(`Получено ${rows.length} продуктов`);
        res.json(rows);
    } catch (error) {
        console.error('Ошибка при получении продуктов:', error);
        res.status(500).json({ 
            error: 'Ошибка при получении продуктов',
            details: error.message,
            code: error.code
        });
    }
});

// Получение продукта по ID
router.get('/:id', async (req, res) => {
    try {
        console.log(`Запрос на получение продукта с ID: ${req.params.id}`);
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);

        if (rows.length === 0) {
            console.log(`Продукт с ID ${req.params.id} не найден`);
            return res.status(404).json({ error: 'Продукт не найден' });
        }

        console.log(`Продукт с ID ${req.params.id} найден`);
        res.json(rows[0]);
    } catch (error) {
        console.error('Ошибка при получении продукта:', error);
        res.status(500).json({ 
            error: 'Ошибка при получении продукта',
            details: error.message,
            code: error.code
        });
    }
});

module.exports = router;