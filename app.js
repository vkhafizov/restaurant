import Scanner from './scanner.js';
import Table from './table.js';

document.addEventListener('DOMContentLoaded', () => {
    const scanButton = document.getElementById('scanButton'); // Кнопка "Сканировать"
    const preview = document.getElementById('preview'); // Элемент <video> для камеры
    const errorDiv = document.getElementById('error'); // Блок для вывода ошибок
    const productTable = document.getElementById('productTable'); // Таблица

    // Инициализация таблицы
    const table = new Table(productTable);

    // Инициализация сканера
    const scanner = new Scanner(preview, (content) => {
        errorDiv.textContent = ''; // Очищаем сообщение об ошибке
        table.updateTable(content); // Обновляем таблицу данными из QR-кода
    });

    try {
        scanner.init(); // Инициализируем сканер
    } catch (error) {
        errorDiv.textContent = error.message; // Выводим ошибку, если что-то пошло не так
    }

    // Обработчик нажатия на кнопку "Сканировать"
    scanButton.addEventListener('click', () => {
        try {
            scanner.start(); // Запускаем сканирование
        } catch (error) {
            errorDiv.textContent = error.message; // Выводим ошибку, если что-то пошло не так
        }
    });
});
