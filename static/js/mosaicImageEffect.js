function startMosaicImageEffect(canvas, ctx, clearCanvasAndStop) {
    const img = new Image();
    img.src = 'image/星空歌剧院.png'; // Provide a valid image path
    img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixelSize = 10;

        function drawMosaic() {
            for (let y = 0; y < imageData.height; y += pixelSize) {
                for (let x = 0; x < imageData.width; x += pixelSize) {
                    const i = (y * 4) * imageData.width + x * 4;
                    const r = imageData.data[i];
                    const g = imageData.data[i + 1];
                    const b = imageData.data[i + 2];
                    ctx.fillStyle = `rgb(${r},${g},${b})`;
                    ctx.fillRect(x, y, pixelSize, pixelSize);
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            drawMosaic();
            animationFrameId = requestAnimationFrame(animate);
        }

        clearCanvasAndStop();
        animate();
    };
}

window.startMosaicImageEffect = startMosaicImageEffect;