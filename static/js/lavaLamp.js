function startLavaLamp(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const particles = [];
    const numParticles = 30;

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 30 + 20,
            color: `hsl(${Math.random() * 40 + 10}, 100%, 50%)`,
            rising: Math.random() > 0.5
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
            if (p.rising) {
                p.vy -= 0.01;
                if (p.vy < -1) {
                    p.vy = -1;
                }
            } else {
                p.vy += 0.01;
                if (p.vy > 1) {
                    p.vy = 1;
                }
            }

            p.x += p.vx;
            p.y += p.vy;

            if (p.y < 0) {
                p.y = 0;
                p.rising = false;
            } else if (p.y > canvas.height) {
                p.y = canvas.height;
                p.rising = true;
            }

            if (p.x < 0 || p.x > canvas.width) {
                p.vx *= -1;
            }
        });

        // 粒子碰撞检测和合并
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < p1.size + p2.size) {
                    const angle = Math.atan2(dy, dx);
                    const sin = Math.sin(angle);
                    const cos = Math.cos(angle);

                    // Rotate particle positions
                    const pos1 = { x: 0, y: 0 };
                    const pos2 = { x: dx * cos + dy * sin, y: dy * cos - dx * sin };

                    // Rotate particle velocities
                    const vel1 = { x: p1.vx * cos + p1.vy * sin, y: p1.vy * cos - p1.vx * sin };
                    const vel2 = { x: p2.vx * cos + p2.vy * sin, y: p2.vy * cos - p2.vx * sin };

                    // Collision reaction
                    const vxTotal = vel1.x - vel2.x;
                    vel1.x = ((p1.size - p2.size) * vel1.x + 2 * p2.size * vel2.x) / (p1.size + p2.size);
                    vel2.x = vxTotal + vel1.x;

                    // Update positions to avoid particles sticking together
                    const absV = Math.abs(vel1.x) + Math.abs(vel2.x);
                    const overlap = (p1.size + p2.size - distance) / absV;
                    pos1.x += vel1.x * overlap;
                    pos2.x += vel2.x * overlap;

                    // Rotate positions back
                    p1.x = p1.x + pos1.x * cos - pos1.y * sin;
                    p1.y = p1.y + pos1.y * cos + pos1.x * sin;
                    p2.x = p1.x + pos2.x * cos - pos2.y * sin;
                    p2.y = p1.y + pos2.y * cos + pos2.x * sin;

                    // Rotate velocities back
                    p1.vx = vel1.x * cos - vel1.y * sin;
                    p1.vy = vel1.y * cos + vel1.x * sin;
                    p2.vx = vel2.x * cos - vel2.y * sin;
                    p2.vy = vel2.y * cos + vel2.x * sin;
                }
            }
        }
    }

    function animate() {
        drawParticles();
        updateParticles();
        animationFrameId = requestAnimationFrame(animate);
    }

    animate();
}

window.startLavaLamp = startLavaLamp;