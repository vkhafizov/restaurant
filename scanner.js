// scanner.js

const statusMessage = document.createElement('div');
statusMessage.id = 'scanner-status';
statusMessage.style.cssText = 'padding: 10px; background: #f0f0f0; margin: 10px 0; border-radius: 4px;';
statusMessage.textContent = 'Инициализация сканера QR-кодов...';
document.body.insertBefore(statusMessage, document.body.firstChild);

import Instascan from '@zxing/library';
export default class Scanner {
    constructor(videoElement, onScan) {
        this.video = videoElement; // Элемент <video> для отображения камеры
        this.onScan = onScan; // Колбэк, который вызывается при успешном сканировании
        this.scanner = null; // Объект сканера
    }

    // Инициализация сканера
    async init() {
        if (!Instascan) {
            throw new Error('Библиотека Instascan не загружена.');
        }

        // Initialize scanner before starting
        this.scanner = new Instascan.Scanner({ 
            video: this.video,
            scanPeriod: 5 // Scan every 5ms for better response
        });

        // Обработчик успешного сканирования
        this.scanner.addListener('scan', (content) => {
            if (this.onScan) {
                this.onScan(content); // Вызываем колбэк с отсканированными данными
            }
        });

        // Start camera immediately after initialization
        try {
            const cameras = await Instascan.Camera.getCameras();
            if (cameras.length > 0) {
                await this.scanner.start(cameras[0]);
            } else {
                throw new Error('Камера не найдена.');
            }
        } catch (error) {
            console.error('Ошибка при инициализации камеры:', error);
            throw error;
        }
    }

    // Запуск сканирования
    async start() {
        if (!this.scanner) {
            await this.init();
            return;
        }

        try {
            const cameras = await Instascan.Camera.getCameras();
            if (cameras.length > 0) {
                await this.scanner.start(cameras[0]); // Используем первую доступную камеру
            } else {
                throw new Error('Камера не найдена.');
            }
        } catch (error) {
            console.error('Ошибка при доступе к камере:', error);
            throw error;
        }
    }

    // Остановка сканирования
    stop() {
        if (this.scanner) {
            this.scanner.stop();
        }
    }
}
