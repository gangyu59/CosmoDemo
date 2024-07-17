function startElectricPlasma(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const particles = [];
    const numParticles = 50;

    function createParticle() {
        return {
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 4 + 2, // 粒子大小增加一倍
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        };
    }

    for (let i = 0; i < numParticles; i++) {
        particles.push(createParticle());
    }

    function drawParticles() {
        ctx.fillStyle = 'black'; // 设置背景为深色
        ctx.fillRect(0, 0, canvas.width, canvas.height); // 填充背景
        particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function updateParticles() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });
    }

    function animate() {
        drawParticles();
        updateParticles();
        animationFrameId = requestAnimationFrame(animate);
    }

    animate();
}

window.startElectricPlasma = startElectricPlasma;