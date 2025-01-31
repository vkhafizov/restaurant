document.addEventListener('DOMContentLoaded', () => {
    const scanButton = document.getElementById('scanButton');
    const preview = document.getElementById('preview');
    const productTableBody = document.querySelector('#productTable tbody');

    let scanner = new Instascan.Scanner({ video: preview });

    scanner.addListener('scan', function (content) {
        // Предполагаем, что QR-код содержит данные в формате "название:цена"
        const products = content.split('\n').map(line => {
            const [name, price] = line.split(':');
            return { name, price };
        });

        // Очищаем таблицу перед добавлением новых данных
        productTableBody.innerHTML = '';

        // Добавляем данные в таблицу
        products.forEach(product => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const priceCell = document.createElement('td');

            nameCell.textContent = product.name;
            priceCell.textContent = product.price;

            row.appendChild(nameCell);
            row.appendChild(priceCell);
            productTableBody.appendChild(row);
        });
    });

    scanButton.addEventListener('click', () => {
        Instascan.Camera.getCameras().then(function (cameras) {
            if (cameras.length > 0) {
                scanner.start(cameras[0]);
            } else {
                alert('Камера не найдена.');
            }
        }).catch(function (e) {
            console.error(e);
            alert('Ошибка при доступе к камере.');
        });
    });
});
