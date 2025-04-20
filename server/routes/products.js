const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Получение всех продуктов
router.get('/', async (req, res) => {
    try {
        console.log('Запрос на получение всех продуктов');
        
        // Проверяем подключение к базе данных
        let connection;
        try {
            connection = await db.getConnection();
            console.log('Подключение к базе данных успешно установлено');
        } catch (connError) {
            console.error('Ошибка подключения к базе данных:', connError);
            return res.status(500).json({ 
                error: 'Ошибка подключения к базе данных',
                details: connError.message,
                code: connError.code
            });
        }
        
        try {
            const [rows] = await connection.query('SELECT * FROM products');
            console.log(`Получено ${rows.length} продуктов`);
            
            // Проверяем, что данные корректны
            if (!Array.isArray(rows)) {
                console.error('Получены некорректные данные:', rows);
                return res.status(500).json({ 
                    error: 'Некорректные данные получены из базы данных',
                    details: 'Данные не являются массивом'
                });
            }
            
            res.json(rows);
        } catch (queryError) {
            console.error('Ошибка при выполнении запроса:', queryError);
            return res.status(500).json({ 
                error: 'Ошибка при выполнении запроса',
                details: queryError.message,
                code: queryError.code
            });
        } finally {
            if (connection) {
                connection.release();
                console.log('Соединение с базой данных освобождено');
            }
        }
    } catch (error) {
        console.error('Неожиданная ошибка:', error);
        res.status(500).json({ 
            error: 'Неожиданная ошибка',
            details: error.message,
            code: error.code
        });
    }
});

// Получение продукта по ID
router.get('/:id', async (req, res) => {
    try {
        console.log(`Запрос на получение продукта с ID: ${req.params.id}`);
        
        // Проверяем подключение к базе данных
        let connection;
        try {
            connection = await db.getConnection();
            console.log('Подключение к базе данных успешно установлено');
        } catch (connError) {
            console.error('Ошибка подключения к базе данных:', connError);
            return res.status(500).json({ 
                error: 'Ошибка подключения к базе данных',
                details: connError.message,
                code: connError.code
            });
        }
        
        try {
            const [rows] = await connection.query('SELECT * FROM products WHERE id = ?', [req.params.id]);

            if (rows.length === 0) {
                console.log(`Продукт с ID ${req.params.id} не найден`);
                return res.status(404).json({ error: 'Продукт не найден' });
            }

            console.log(`Продукт с ID ${req.params.id} найден`);
            res.json(rows[0]);
        } catch (queryError) {
            console.error('Ошибка при выполнении запроса:', queryError);
            return res.status(500).json({ 
                error: 'Ошибка при выполнении запроса',
                details: queryError.message,
                code: queryError.code
            });
        } finally {
            if (connection) {
                connection.release();
                console.log('Соединение с базой данных освобождено');
            }
        }
    } catch (error) {
        console.error('Неожиданная ошибка:', error);
        res.status(500).json({ 
            error: 'Неожиданная ошибка',
            details: error.message,
            code: error.code
        });
    }
});

module.exports = router;