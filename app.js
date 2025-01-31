document.addEventListener('DOMContentLoaded', () => {
    const scanButton = document.getElementById('scanButton'); // Кнопка "Сканировать"
    const preview = document.getElementById('preview'); // Элемент <video> для камеры
    const productTableBody = document.querySelector('#productTable tbody'); // Тело таблицы
    const errorDiv = document.getElementById('error'); // Блок для вывода ошибок

    let scanner; // Объект сканера

    // Проверяем, загружена ли библиотека Instascan
    if (!Instascan) {
        errorDiv.textContent = 'Библиотека Instascan не загружена. Проверьте подключение к интернету.';
        return;
    }

    // Создаем экземпляр сканера
    scanner = new Instascan.Scanner({ video: preview });

    // Обработчик успешного сканирования QR-кода
    scanner.addListener('scan', function (content) {
        errorDiv.textContent = ''; // Очищаем сообщение об ошибке

        // Предполагаем, что QR-код содержит данные в формате "название:цена"
        const products = content.split('\n').map(line => {
            const [name, price] = line.split(':');
            return { name: name.trim(), price: price.trim() }; // Удаляем лишние пробелы
        });

        // Очищаем таблицу перед добавлением новых данных
        productTableBody.innerHTML = '';

        // Добавляем данные в таблицу
        products.forEach(product => {
            const row = document.createElement('tr'); // Создаем строку таблицы
            const nameCell = document.createElement('td'); // Ячейка для названия
            const priceCell = document.createElement('td'); // Ячейка для цены

            nameCell.textContent = product.name; // Заполняем название
            priceCell.textContent = product.price; // Заполняем цену

            row.appendChild(nameCell); // Добавляем ячейку с названием в строку
            row.appendChild(priceCell); // Добавляем ячейку с ценой в строку
            productTableBody.appendChild(row); // Добавляем строку в таблицу
        });
    });

    // Обработчик нажатия на кнопку "Сканировать"
    scanButton.addEventListener('click', () => {
        // Получаем доступ к камерам устройства
        Instascan.Camera.getCameras()
            .then(cameras => {
                if (cameras.length > 0) {
                    // Запускаем сканирование с использованием первой доступной камеры
                    scanner.start(cameras[0]);
                } else {
                    // Если камеры не найдены
                    errorDiv.textContent = 'Камера не найдена. Убедитесь, что у вас есть доступ к камере.';
                }
            })
            .catch(error => {
                // Обработка ошибок при доступе к камере
                console.error('Ошибка при доступе к камере:', error);
                errorDiv.textContent = 'Ошибка при доступе к камере. Убедитесь, что у вас есть разрешение на использование камеры.';
            });
    });
});
