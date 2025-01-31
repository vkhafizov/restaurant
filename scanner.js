// scanner.js
import Instascan from '@zxing/library';
export default class Scanner {
    constructor(videoElement, onScan) {
        this.video = videoElement; // Элемент <video> для отображения камеры
        this.onScan = onScan; // Колбэк, который вызывается при успешном сканировании
        this.scanner = null; // Объект сканера
    }

    // Инициализация сканера
    init() {
        if (!Instascan) {
            throw new Error('Библиотека Instascan не загружена.');
        }

        this.scanner = new Instascan.Scanner({ video: this.video });

        // Обработчик успешного сканирования
        this.scanner.addListener('scan', (content) => {
            if (this.onScan) {
                this.onScan(content); // Вызываем колбэк с отсканированными данными
            }
        });
    }

    // Запуск сканирования
    start() {
        Instascan.Camera.getCameras()
            .then((cameras) => {
                if (cameras.length > 0) {
                    this.scanner.start(cameras[0]); // Используем первую доступную камеру
                } else {
                    throw new Error('Камера не найдена.');
                }
            })
            .catch((error) => {
                console.error('Ошибка при доступе к камере:', error);
                throw error;
            });
    }

    // Остановка сканирования
    stop() {
        if (this.scanner) {
            this.scanner.stop();
        }
    }
}
