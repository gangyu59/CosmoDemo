function startHypnoticSpiral(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    let angle = 0;

    function drawSpiral() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.beginPath();
        for (let i = 0; i < 2000; i++) { // 增加循环次数
            const t = i / 15; // 调整 t 值来控制间距
            const x = t * Math.cos(angle + t) * 10; // 扩大半径
            const y = t * Math.sin(angle + t) * 10; // 扩大半径
            ctx.lineTo(x, y);

            // 增加线条宽度变化范围
            ctx.lineWidth = t / 3; // 增加粗细差距
        }
        ctx.strokeStyle = `hsl(${angle % 360}, 100%, 50%)`;
        ctx.stroke();
        ctx.resetTransform();
    }

    function animate() {
        drawSpiral();
        angle += 0.1; // 加快旋转速度
        animationFrameId = requestAnimationFrame(animate);
    }

    clearCanvasAndStop();
    animate();
}

window.startHypnoticSpiral = startHypnoticSpiral;