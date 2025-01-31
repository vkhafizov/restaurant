import Scanner from './scanner.js';
import Table from './table.js';

document.addEventListener('DOMContentLoaded', () => {
    const scanButton = document.getElementById('scanButton'); // Кнопка "Сканировать"
    const preview = document.getElementById('preview'); // Элемент <video> для камеры
    const productTable = document.getElementById('productTable'); // Таблица

    // Инициализация таблицы
    const table = new Table(productTable);

    // Инициализация сканера
    const scanner = new Scanner(preview, (content) => {
        table.updateTable(content); // Обновляем таблицу данными из QR-кода
    });

    // Инициализация и запуск сканера
    scanner.init()
        .then(() => {
            console.log('Сканер инициализирован.');
        })
        .catch((error) => {
            console.error('Ошибка инициализации сканера:', error);
        });

    // Обработчик нажатия на кнопку "Сканировать"
    scanButton.addEventListener('click', () => {
        scanner.start(); // Запускаем сканирование
    });
});
