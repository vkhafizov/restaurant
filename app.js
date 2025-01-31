import Scanner from './scanner.js';
import Table from './table.js';

document.addEventListener('DOMContentLoaded', () => {
    const scanButton = document.getElementById('scanButton');
    const preview = document.getElementById('preview');
    const productTable = document.getElementById('productTable');
    const errorDiv = document.getElementById('error');

    let scanner;
    let isCameraReady = false; // Флаг готовности камеры

    // Инициализация камеры при загрузке
    const initScanner = async () => {
        try {
            scanner = new Scanner(preview, (content) => {
                console.log('Данные получены:', content);
                new Table(productTable).updateTable(content);
            });
            
            await scanner.init();
            isCameraReady = true;
            scanButton.disabled = false; // Активируем кнопку
            console.log('Камера инициализирована');

        } catch (error) {
            errorDiv.textContent = `Ошибка: ${error.message}`;
            console.error('Ошибка инициализации:', error);
        }
    };

    // Запускаем инициализацию сразу
    initScanner();

    // Обработчик кнопки
    scanButton.addEventListener('click', () => {
        if (!isCameraReady) {
            console.error('Камера не готова!');
            return;
        }
        
        console.log('Запуск сканирования...');
        scanner.start();
    });
});
