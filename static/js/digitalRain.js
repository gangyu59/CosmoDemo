function startDigitalRain(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const fontSize = 20;
    const columns = canvas.width / fontSize;
    const drops = Array.from({ length: columns }).fill(100);
    let counter = 0;
    const speedFactor = 8; // 控制速度，值越大速度越慢

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0F0';
        ctx.font = `${fontSize}px monospace`;

        drops.forEach((y, x) => {
            const text = String.fromCharCode(65 + Math.random() * 26); // 使用英文字母
            ctx.fillText(text, x * fontSize, y * fontSize);

            if (y * fontSize > canvas.height && Math.random() > 0.975) {
                drops[x] = 0;
            }

            if (counter % speedFactor === 0) {
                drops[x]++;
            }
        });

        counter++;
    }

    function animate() {
        draw();
        animationFrameId = requestAnimationFrame(animate);
    }

    animate();
}

window.startDigitalRain = startDigitalRain;