function startCosmicDust(canvas, ctx, clearCanvasAndStop) {
		clearCanvasAndStop();
    const particles = [];
    const numParticles = 100;

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            color: `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`
        };
    }

    for (let i = 0; i < numParticles; i++) {
        particles.push(createParticle());
    }

    function drawParticles() {
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
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
            if (p.x < 0 || p.x > canvas.width) p.vx = -p.vx;
            if (p.y < 0 || p.y > canvas.height) p.vy = -p.vy;
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
				drawParticles();
        updateParticles();
        animationFrameId = requestAnimationFrame(animate);
    }

    clearCanvasAndStop();
    animate();
}

window.startCosmicDust = startCosmicDust;