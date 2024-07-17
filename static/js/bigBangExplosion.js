function startBigBangExplosion(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const particles = [];
    const numParticles = 1000; // 增加粒子数量
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    function createParticle() {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1 + 0.25; // 扩展范围增加五倍
        return {
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 3 + 1, // 合理的粒子大小
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            alpha: 1
        };
    }

    for (let i = 0; i < numParticles; i++) {
        particles.push(createParticle());
    }

    function drawParticles() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // 黑色背景
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            ctx.fillStyle = `hsla(${Math.random() * 360}, 100%, 50%, ${particle.alpha})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.alpha -= 0.002; // 合理的透明度衰减速度
            if (particle.alpha <= 0) {
                particle.x = centerX;
                particle.y = centerY;
                particle.alpha = 1;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 1 + 0.25; // 扩展范围增加五倍
                particle.vx = Math.cos(angle) * speed;
                particle.vy = Math.sin(angle) * speed;
            }
        });
    }

    function animate() {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = 'black'; // 设置背景为黑色
        ctx.fillRect(0, 0, canvas.width, canvas.height); // 填充背景
        drawParticles();
        updateParticles();
        animationFrameId = requestAnimationFrame(animate);
    }

    animate();
}

window.startBigBangExplosion = startBigBangExplosion;