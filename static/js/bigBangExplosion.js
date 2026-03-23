function startBigBangExplosion(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();

    const CX = canvas.width / 2;
    const CY = canvas.height / 2;
    const NUM = 1400;
    const particles = [];
    let t = 0;
    let shockwaves = [];

    // Temperature → color: white/blue-white = hottest, yellow, orange, deep red = coolest
    function tempToRgba(temp, alpha) {
        let r, g, b;
        if (temp > 0.85) {
            r = (200 + 55 * temp) | 0; g = (210 + 45 * temp) | 0; b = 255;
        } else if (temp > 0.6) {
            const f = (temp - 0.6) / 0.25;
            r = 255; g = (180 + 75 * f) | 0; b = (f * 140) | 0;
        } else if (temp > 0.3) {
            const f = (temp - 0.3) / 0.3;
            r = 255; g = (60 + 120 * f) | 0; b = 0;
        } else {
            const f = temp / 0.3;
            r = (120 + 135 * f) | 0; g = 0; b = 0;
        }
        return `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
    }

    function makeParticle() {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.15 + Math.random() * 3.0;
        const initTemp = 0.55 + Math.random() * 0.45;
        return {
            x: CX, y: CY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 0.6 + Math.random() * 2.2,
            temp: initTemp, initTemp,
            life: 1.0,
            decay: 0.0012 + Math.random() * 0.0018
        };
    }

    for (let i = 0; i < NUM; i++) particles.push(makeParticle());
    shockwaves.push({ r: 2, speed: 5, alpha: 0.85 });

    function drawSingularity() {
        const g1 = ctx.createRadialGradient(CX, CY, 0, CX, CY, 90);
        g1.addColorStop(0,    'rgba(255,255,255,0.95)');
        g1.addColorStop(0.15, 'rgba(220,200,255,0.7)');
        g1.addColorStop(0.45, 'rgba(120,80,255,0.25)');
        g1.addColorStop(1,    'rgba(0,0,0,0)');
        ctx.fillStyle = g1;
        ctx.beginPath();
        ctx.arc(CX, CY, 90, 0, Math.PI * 2);
        ctx.fill();

        const g2 = ctx.createRadialGradient(CX, CY, 0, CX, CY, 12);
        g2.addColorStop(0,   'rgba(255,255,255,1)');
        g2.addColorStop(0.6, 'rgba(255,230,180,0.9)');
        g2.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.arc(CX, CY, 12, 0, Math.PI * 2);
        ctx.fill();
    }

    function animate() {
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Shockwave rings
        shockwaves = shockwaves.filter(sw => sw.alpha > 0.02);
        shockwaves.forEach(sw => {
            ctx.beginPath();
            ctx.arc(CX, CY, sw.r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(180,210,255,${sw.alpha.toFixed(2)})`;
            ctx.lineWidth = 2.5;
            ctx.stroke();
            sw.r += sw.speed;
            sw.speed *= 0.997;
            sw.alpha -= 0.0035;
        });

        // Particles
        particles.forEach(p => {
            ctx.fillStyle = tempToRgba(p.temp, p.life * 0.88);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            p.temp = p.initTemp * Math.pow(p.life, 0.6);

            if (p.life <= 0) Object.assign(p, makeParticle());
        });

        drawSingularity();

        t++;
        if (t % 110 === 0) shockwaves.push({ r: 4, speed: 4.5, alpha: 0.8 });

        animationFrameId = requestAnimationFrame(animate);
    }

    animate();
}

window.startBigBangExplosion = startBigBangExplosion;
