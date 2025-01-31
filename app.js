document.getElementById('scanButton').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    const output = document.getElementById('output');

    if (fileInput.files.length === 0) {
        alert('Пожалуйста, выберите изображение чека.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const image = new Image();
        image.src = e.target.result;

        image.onload = function() {
            Tesseract.recognize(
                image,
                'rus',
                {
                    logger: m => console.log(m)
                }
            ).then(({ data: { text } }) => {
                output.innerHTML = `<pre>${text}</pre>`;
            });
        };
    };

    reader.readAsDataURL(file);
});
