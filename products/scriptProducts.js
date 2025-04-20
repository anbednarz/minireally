document.addEventListener('DOMContentLoaded', () => {
    // Обработчик для кнопки "на главную"
    document.getElementById('returnToMain').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Загрузка товаров с сервера
    loadProducts();
});

// Функция для загрузки товаров с сервера
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) {
            throw new Error('Ошибка при загрузке товаров');
        }
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Ошибка:', error);
        document.getElementById('products-table-body').innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 20px;">
                    Ошибка при загрузке товаров. Пожалуйста, попробуйте позже.
                </td>
            </tr>
        `;
    }
}

// Функция для отображения товаров в таблице
function displayProducts(products) {
    const tableBody = document.getElementById('products-table-body');
    tableBody.innerHTML = '';

    if (products.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 20px;">
                    Товары не найдены.
                </td>
            </tr>
        `;
        return;
    }

    products.forEach(product => {
        const row = document.createElement('tr');
        
        // Изображение
        const imageCell = document.createElement('td');
        imageCell.setAttribute('data-label', 'Изображение');
        const image = document.createElement('img');
        image.src = product.image_url || 'images/placeholder.png';
        image.alt = product.name;
        imageCell.appendChild(image);
        
        // Название
        const nameCell = document.createElement('td');
        nameCell.setAttribute('data-label', 'Название');
        nameCell.textContent = product.name;
        
        // Вселенная
        const universeCell = document.createElement('td');
        universeCell.setAttribute('data-label', 'Вселенная');
        universeCell.textContent = product.universe;
        
        // Описание
        const descriptionCell = document.createElement('td');
        descriptionCell.setAttribute('data-label', 'Описание');
        descriptionCell.textContent = product.description || 'Нет описания';
        
        // Цена
        const priceCell = document.createElement('td');
        priceCell.setAttribute('data-label', 'Цена');
        priceCell.textContent = `${product.price} ₽`;
        priceCell.classList.add('price');
        
        // Добавление ячеек в строку
        row.appendChild(imageCell);
        row.appendChild(nameCell);
        row.appendChild(universeCell);
        row.appendChild(descriptionCell);
        row.appendChild(priceCell);
        
        // Добавление строки в таблицу
        tableBody.appendChild(row);
    });
}

// Функция для отображения деталей товара в модальном окне
function showProductDetails(product) {
    // Создаем модальное окно, если его еще нет
    let modal = document.getElementById('product-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'product-modal';
        modal.className = 'product-modal';
        document.body.appendChild(modal);
    }
    
    // Заполняем модальное окно данными о товаре
    modal.innerHTML = `
        <div class="product-modal-content">
            <span class="product-modal-close">&times;</span>
            <h2 class="product-modal-title">${product.name}</h2>
            <div class="product-modal-details">
                <p><strong>Произведение:</strong> ${product.source}</p>
                <p><strong>Стоимость:</strong> <span class="product-modal-price">${product.price} ₽</span></p>
                <p><strong>Описание:</strong> ${product.description || 'Подробное описание отсутствует.'}</p>
            </div>
            <img src="${product.image}" alt="${product.name}" class="product-modal-image">
            <button class="product-modal-buy-btn">Заказать</button>
        </div>
    `;
    
    // Показываем модальное окно
    modal.style.display = 'block';
    
    // Обработчик для закрытия модального окна
    const closeBtn = modal.querySelector('.product-modal-close');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Закрытие по клику вне модального окна
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Обработчик для кнопки "Заказать"
    const buyBtn = modal.querySelector('.product-modal-buy-btn');
    buyBtn.addEventListener('click', () => {
        alert(`Заказ на товар "${product.name}" оформлен!`);
        modal.style.display = 'none';
    });
} 