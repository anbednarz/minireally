const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Получение всех продуктов
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        console.error('Ошибка при получении продуктов:', error);
        res.status(500).json({ error: 'Ошибка при получении продуктов' });
    }
});

// Получение продукта по ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Продукт не найден' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Ошибка при получении продукта:', error);
        res.status(500).json({ error: 'Ошибка при получении продукта' });
    }
});

module.exports = router;