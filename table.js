// table.js
export default class Table {
    constructor(tableElement) {
        this.tableBody = tableElement.querySelector('tbody'); // Тело таблицы
    }

    // Очистка таблицы
    clear() {
        this.tableBody.innerHTML = '';
    }

    // Добавление данных в таблицу
    addRow(name, price) {
        const row = document.createElement('tr'); // Создаем строку
        const nameCell = document.createElement('td'); // Ячейка для названия
        const priceCell = document.createElement('td'); // Ячейка для цены

        nameCell.textContent = name; // Заполняем название
        priceCell.textContent = price; // Заполняем цену

        row.appendChild(nameCell); // Добавляем ячейку в строку
        row.appendChild(priceCell); // Добавляем ячейку в строку
        this.tableBody.appendChild(row); // Добавляем строку в таблицу
    }

    // Обновление таблицы новыми данными
    updateTable(data) {
        this.clear(); // Очищаем таблицу

        // Разбиваем данные на строки и добавляем их в таблицу
        data.split('\n').forEach((line) => {
            const [name, price] = line.split(':');
            if (name && price) {
                this.addRow(name.trim(), price.trim());
            }
        });
    }
}
