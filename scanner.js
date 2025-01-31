// scanner.js
// Импортируем библиотеку html5-qrcode
import { Html5Qrcode } from "html5-qrcode";

export default class Scanner {
    constructor(videoElement, onScan) {
        this.video = videoElement; // Элемент <video> для отображения камеры
        this.onScan = onScan; // Колбэк, который вызывается при успешном сканировании
        this.scanner = null; // Объект сканера
        this.isScanning = false; // Флаг для отслеживания состояния сканирования
    }

    // Инициализация сканера
    async init() {
        try {
            this.scanner = new Html5Qrcode("reader");
            
            // Добавляем div для html5-qrcode
            const readerDiv = document.createElement('div');
            readerDiv.id = 'reader';
            readerDiv.style.display = 'none';
            document.body.appendChild(readerDiv);
            
        } catch (error) {
            console.error('Ошибка при инициализации сканера:', error);
            throw new Error('Не удалось инициализировать сканер QR-кодов');
        }
    }

    // Запуск сканирования
    async start() {
        if (this.isScanning) {
            return;
        }

        try {
            this.isScanning = true;
            await this.scanner.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                (decodedText) => {
                    if (this.onScan) {
                        this.onScan(decodedText);
                    }
                },
                (errorMessage) => {
                    // Игнорируем ошибки сканирования
                }
            );
        } catch (error) {
            this.isScanning = false;
            console.error('Ошибка при запуске сканера:', error);
            throw new Error('Не удалось запустить сканер');
        }
    }

    // Остановка сканирования
    async stop() {
        if (!this.isScanning) {
            return;
        }

        try {
            await this.scanner.stop();
            this.isScanning = false;
        } catch (error) {
            console.error('Ошибка при остановке сканера:', error);
            throw new Error('Не удалось остановить сканер');
        }
    }
}
