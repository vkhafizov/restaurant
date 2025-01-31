export default class Scanner {
    constructor(videoElement, onScan) {
        this.video = videoElement; // Элемент <video> для отображения камеры
        this.onScan = onScan; // Колбэк, который вызывается при успешном сканировании
        this.canvas = document.createElement('canvas'); // Canvas для обработки изображения
        this.context = this.canvas.getContext('2d'); // Контекст canvas
        this.isScanning = false; // Флаг для отслеживания состояния сканирования
    }

    // Инициализация сканера
    async init() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Ваш браузер не поддерживает доступ к камере.');
        }

        // Запрашиваем доступ к камере
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        this.video.srcObject = stream;
        await this.video.play(); // Запускаем видео
    }

    // Запуск сканирования
    start() {
        if (this.isScanning) return; // Если сканирование уже запущено, выходим

        this.isScanning = true;
        this.scanFrame(); // Запускаем цикл сканирования
    }

    // Остановка сканирования
    stop() {
        this.isScanning = false;
    }

    // Цикл сканирования
    scanFrame() {
        if (!this.isScanning) return; // Если сканирование остановлено, выходим

        // Устанавливаем размеры canvas равными размеру видео
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;

        // Рисуем текущий кадр видео на canvas
        this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

        // Получаем данные изображения с canvas
        const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

        // Используем jsQR для распознавания QR-кода
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
        });

        // Если QR-код распознан, вызываем колбэк
        if (code) {
            this.onScan(code.data); // Передаем данные из QR-кода
        }

        // Рекурсивно вызываем scanFrame для следующего кадра
        requestAnimationFrame(() => this.scanFrame());
    }
}
