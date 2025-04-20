// Конфигурация API
const API_URL = '/api';

// Функция для проверки API
async function testAPI() {
    try {
        console.log('Тестирование API...');
        const response = await fetch(`${API_URL}/test`);
        console.log('Тестовый ответ получен:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`Ошибка при тестировании API: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Тестовые данные:', data);
        
        return true;
    } catch (error) {
        console.error('Ошибка при тестировании API:', error);
        return false;
    }
}

// Функция для загрузки товаров
async function loadProducts() {
    try {
        console.log('Загрузка товаров...');
        console.log('API URL:', API_URL);
        
        // Сначала проверим API
        const apiWorking = await testAPI();
        if (!apiWorking) {
            throw new Error('API не работает');
        }
        
        const response = await fetch(`${API_URL}/products`);
        console.log('Ответ получен:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`Ошибка при загрузке товаров: ${response.status} ${response.statusText}`);
        }
        
        const products = await response.json();
        console.log('Товары загружены:', products);
        
        displayProducts(products);
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        // Показываем сообщение об ошибке пользователю
        const imagesGrid = document.querySelector('.images-grid');
        if (imagesGrid) {
            imagesGrid.innerHTML = `<p class="error-message">Ошибка при загрузке товаров: ${error.message}</p>`;
        }
    }
}

// Функция для отображения товаров
function displayProducts(products) {
    const imagesGrid = document.querySelector('.images-grid');
    if (!imagesGrid) return;

    if (!products || products.length === 0) {
        imagesGrid.innerHTML = '<p class="no-products">Товары не найдены</p>';
        return;
    }

    imagesGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image_url}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.universe}</p>
                <p class="price">${product.price} ₽</p>
            </div>
        </div>
    `).join('');
}

// Добавляем обработчик для перехода на главную страницу при нажатии на логотип
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    // Загружаем товары при загрузке страницы
    loadProducts();
});

