export default class Scanner {
    constructor(videoElement, onScan) {
        this.video = videoElement;
        this.onScan = onScan;
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d', { willReadFrequently: true }); // Важное исправление!
        this.isScanning = false;
    }

    // ... остальной код без изменений ...

    scanFrame() {
        if (!this.isScanning) return;

        try {
            // Явная проверка размеров видео
            if (this.video.videoWidth === 0 || this.video.videoHeight === 0) {
                return requestAnimationFrame(() => this.scanFrame());
            }

            // Принудительная синхронизация размеров
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
            
            this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
            
            // Оптимизация для мобильных устройств
            const imageData = this.context.getImageData(
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );

            const code = jsQR(
                imageData.data,
                imageData.width,
                imageData.height,
                {
                    inversionAttempts: 'attemptBoth', // Исправлено!
                    maxScansPerSecond: 15 // Ограничение частоты сканирования
                }
            );

            if (code) {
                this.stop(); // Останавливаем после успешного сканирования
                this.onScan(code.data);
            }
        } catch (error) {
            console.error('scanFrame error:', error);
        }

        requestAnimationFrame(() => this.scanFrame());
    }
}
