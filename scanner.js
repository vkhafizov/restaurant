export default class Scanner {
    constructor(videoElement, onScan) {
        this.video = videoElement;
        this.onScan = onScan;
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.isScanning = false;
    }

    async init() {
        console.log('[Scanner] Инициализация...');
        if (!navigator.mediaDevices?.getUserMedia) {
            throw new Error('Ваш браузер не поддерживает доступ к камере.');
        }

        try {
            // Запрос доступа к камере
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Используем заднюю камеру
                    width: { ideal: 1280 }, // Оптимальное разрешение
                    height: { ideal: 720 }
                }
            });
            this.video.srcObject = stream;
            
            // Ждем, пока видео начнет воспроизводиться
            await new Promise((resolve) => {
                this.video.onloadedmetadata = resolve;
            });
            await this.video.play().catch((error) => {
                console.error('[Scanner] Ошибка воспроизведения видео:', error);
            });
            console.log('[Scanner] Камера готова.');
        } catch (error) {
            console.error('[Scanner] Ошибка инициализации:', error);
            throw error;
        }
    }

    start() {
        if (this.isScanning) return;
        console.log('[Scanner] Сканирование запущено.');
        this.isScanning = true;
        this.scanFrame(); // Начинаем цикл сканирования
    }

    stop() {
        console.log('[Scanner] Сканирование остановлено.');
        this.isScanning = false;
    }

    scanFrame() {
        if (!this.isScanning) return;

        try {
            // Проверяем, что видео доступно
            if (this.video.readyState < HTMLMediaElement.HAVE_METADATA) {
                console.warn('[Scanner] Видео не готово.');
                requestAnimationFrame(() => this.scanFrame());
                return;
            }

            // Настраиваем canvas
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
            this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

            // Получаем данные изображения
            const imageData = this.context.getImageData(
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );

            // Распознаем QR-код
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
            });

            if (code) {
                console.log('[Scanner] QR-код распознан:', code.data);
                this.onScan(code.data);
            }
        } catch (error) {
            console.error('[Scanner] Ошибка обработки кадра:', error);
        }

        // Запускаем следующий кадр
        requestAnimationFrame(() => this.scanFrame());
    }
}
