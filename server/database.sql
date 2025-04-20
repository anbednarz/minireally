-- Создание базы данных
CREATE DATABASE IF NOT EXISTS minyreallystore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Использование базы данных
USE minyreallystore;

-- Создание таблицы товаров
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    universe VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Вставка тестовых данных
INSERT INTO products (name, universe, price, image_url, description) VALUES
('Гарри Поттер', 'Гарри Поттер', 1500.00, 'images/harry_potter.png', 'Гарри Поттер из одноименной вселенной'),
('Железный человек', 'Marvel', 2000.00, 'images/iron_man.png', 'Железный человек из вселенной "Marvel"'),
('Шелдон Купер', 'Теория большого взрыва', 1800.00, 'images/sheldon.png', 'Шелдон Купер из сериала "Теория большого взрыва"'),
('Микки Маус', 'Дисней', 1200.00, 'images/mickey.png', 'Микки Маус из мультфильмов "Дисней"'),
('Робаут Жиллиман', 'Warhammer', 2500.00, 'images/robaut.png', 'Робаут Жиллиман из вселенной "Warhammer"'); 