function startMosaicImageEffect(canvas, ctx, clearCanvasAndStop) {
    const img = new Image();
    img.src = 'image/星空歌剧院.png';
    img.onerror = function() {
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f88';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('图片加载失败 Image load failed', canvas.width / 2, canvas.height / 2);
        ctx.fillText('image/星空歌剧院.png', canvas.width / 2, canvas.height / 2 + 30);
    };
    img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixelSize = 10;
        let animationFrameId;

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

        function stopMosaic() {
            cancelAnimationFrame(animationFrameId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }

        canvas.addEventListener('touchstart', stopMosaic, { once: true });
        clearCanvasAndStop();
        animate();
    };
}

window.startMosaicImageEffect = startMosaicImageEffect;