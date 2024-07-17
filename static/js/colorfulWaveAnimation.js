function startColorfulWaveAnimation(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    let t = 0;
    const waveCount = 3; // 多个波形
    let waveAmplitude = 50;
    let waveLength = 20;

    // 添加触摸事件监听器
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('mousemove', handleMouseMove);

    function handleTouchMove(event) {
        event.preventDefault(); // 阻止默认的滚动行为
        if (event.touches.length > 0) {
            const touch = event.touches[0];
            adjustWaveParameters(touch.clientX, touch.clientY);
        }
    }

    function handleMouseMove(event) {
        adjustWaveParameters(event.clientX, event.clientY);
    }

    function adjustWaveParameters(x, y) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = x - rect.left;
        const mouseY = y - rect.top;
        waveAmplitude = 50 + (mouseY / canvas.height) * 50; // 根据y坐标调整振幅
        waveLength = 20 + (mouseX / canvas.width) * 30; // 根据x坐标调整波长
    }

    function drawWave() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制渐变背景
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 255, 0.3)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < waveCount; i++) {
            ctx.beginPath();
            for (let x = 0; x < canvas.width; x++) {
                const y = canvas.height / 2 + waveAmplitude * Math.sin((x + t + i * 100) / waveLength);
                ctx.lineTo(x, y);
            }
            const hue = (t + i * 60) % 360;
            ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        t++;
    }

    function animate() {
        drawWave();
        animationFrameId = requestAnimationFrame(animate);
    }

    animate();
}

window.startColorfulWaveAnimation = startColorfulWaveAnimation;