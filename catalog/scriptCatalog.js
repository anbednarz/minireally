let currentPage = 1;
const totalPages = 20;
const localImages = Array.from({length:10}, (_,i)=>`images/${i+1}.png`);
// История посещенных страниц для кнопки возврата
let pageHistory = [];
// Объект для хранения предварительно сгненерированного порядка
let preGeneratedOrder = {};

// Немедленно вызываемая функция для инициализации данных (IIFE)
(function init(){
    //Генерация случайного порядка изображений для всех страниц
    for(let page = 1; page <= totalPages; page++) {
        preGeneratedOrder[page] = Array.from({length:50},() =>
            localImages[Math.floor(Math.random()*localImages.length)] // Выбор случайного изображения
        );
    }
    // Загрузка первой страницы при открытии каталога
    generatePagination();
    loadPage(1);
})();

// Получаем элементы DOM
const modal = document.getElementById('modal-container');
const modalImage = document.getElementById('modalImage');
const closeModal = document.querySelector('.close-button');

// Обработчики событий для элементов управления
document.getElementById('returnToMain').addEventListener('click', () => {
    window.location.href = 'index.html';
});
document.getElementById('backButton').addEventListener('click', goBack);
document.getElementById('nextButton').addEventListener('click', goNext);

// Обработчики событий для всплывающего окна
closeModal.addEventListener('click', ()=>modal.classList.add('hidden')); // Закрытие по крестику
window.addEventListener('click',(e)=>{ // Закрытие по клику вне изображения
    if(e.target === modal) modal.classList.add('hidden'); // Являеся ли точка клика окном
});
document.addEventListener('keydown', (e)=> {
    if(e.key === 'Escape') modal.classList.add('hidden'); // Закрытие по escape
});

function generatePagination(){
    // Получить контейнер пагинации
    const paginationDiv = document.querySelector('.pagination');
    paginationDiv.innerHTML = ''; // Очистить содержимое контейнера

    // Создать кнопки для каждой страницы
    for(let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button'); // Создание кнопки
        pageButton.textContent = i; // Текст кнопки = номеру страницы
        // Обработчик клика для загрузкии страницы
        pageButton.addEventListener('click',(e)=> loadPage(i));
        paginationDiv.appendChild(pageButton); // Добавление кнопки в контейнер пагинации
    }
}

function loadPage(page, addToHistory = true) {
    // Сохранение текущей страницы в историю
    if (addToHistory) {
        pageHistory.push(currentPage);
    }

    currentPage = page; // Обновить номер текущей страницы
    // Получить контейнер сетки изображений
    const imagesGrid = document.querySelector('.images-grid');
    // Очистить текущее содержимое сетки
    imagesGrid.innerHTML = '';

    // Перебрать все изображения для текущей страницы
    preGeneratedOrder[page].forEach((imageSrc, index) => {
        // Создание элемента
        const img = document.createElement('img');
        img.src = imageSrc; // Путь
        // Альтернативный текст
        img.alt = `Image ${(page - 1) * 50 + index +1 }`;

        // Обработчик клика для открытия всплывающего окна
        img.addEventListener('click',(e)=> {
            // Установить источник изображения в окно
            modalImage.src = imageSrc;
            modal.classList.remove('hidden'); // Отобразить
        });

        // Добавить изображение в сетку
        imagesGrid.appendChild(img);
    });

    // Обновить кнопки навигации
    updateNavigation();
    // Прокрутка страницы вверх
    window.scrollTo(0,0);
}

function goBack() {
    // Проверить наличие элементов в истории
    if(pageHistory.length > 0){
        const prevPage = pageHistory.pop(); // Последний элемент
        // Загрузить предыдущую страницу без добавления в историю
        loadPage(prevPage, false);
    }
}

function goNext() {
    // Проверить возможность перехода
    if(currentPage < totalPages){
        loadPage(currentPage + 1);
    }
}

function updateNavigation(){
    // Получить все кнопки пагинации
    const buttons = document.querySelectorAll('.pagination button');
    // Перебор всех кнопок пагинации
    buttons.forEach(button => {
        // Переключить активность для текущей страницы
        button.classList.toggle('active', parseInt(button.textContent) === currentPage);
    });

    // Заблокировать кнопки, если история пустая / страница последняя
    document.getElementById('backButton').disabled = pageHistory.length === 0;
    document.getElementById('nextButton').disabled = currentPage === totalPages;

    // Скрыть кнопку "Назад", если на первой странице
    document.getElementById('backButton').style.display = currentPage === 1 ? 'none' : 'inline-block';

    // Скрыть кнопку "Вперёд", если на последней странице
    document.getElementById('nextButton').style.display = currentPage === totalPages ? 'none' : 'inline-block';
}