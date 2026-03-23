function startElectricPlasma(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();

    const CX = canvas.width / 2;
    const CY = canvas.height / 2;
    const ORB_R = Math.min(canvas.width, canvas.height) * 0.12;
    let mouseX = CX + ORB_R * 2.5;
    let mouseY = CY;
    let bolts = [];
    let t = 0;

    function onMove(ex, ey) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        mouseX = (ex - rect.left) * scaleX;
        mouseY = (ey - rect.top) * scaleY;
    }
    canvas.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
    canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });

    // Recursive midpoint displacement to build jagged lightning points
    function buildBolt(x1, y1, x2, y2, displacement, depth, points) {
        if (depth === 0) {
            points.push({ x: x2, y: y2 });
            return;
        }
        const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * displacement;
        const my = (y1 + y2) / 2 + (Math.random() - 0.5) * displacement;
        buildBolt(x1, y1, mx, my, displacement * 0.55, depth - 1, points);
        buildBolt(mx, my, x2, y2, displacement * 0.55, depth - 1, points);
    }

    function spawnBolt(tx, ty, hue) {
        const dx = tx - CX, dy = ty - CY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const sx = CX + (dx / dist) * ORB_R;
        const sy = CY + (dy / dist) * ORB_R;
        const pts = [{ x: sx, y: sy }];
        buildBolt(sx, sy, tx, ty, dist * 0.38, 7, pts);
        return { pts, hue, life: 1.0, decay: 0.06 + Math.random() * 0.08 };
    }

    function drawOrb() {
        // Outer atmospheric glow
        const og = ctx.createRadialGradient(CX, CY, ORB_R * 0.5, CX, CY, ORB_R * 2.8);
        og.addColorStop(0, 'rgba(100,60,255,0.28)');
        og.addColorStop(0.5, 'rgba(60,20,180,0.1)');
        og.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = og;
        ctx.beginPath();
        ctx.arc(CX, CY, ORB_R * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Glass sphere body
        const sg = ctx.createRadialGradient(CX - ORB_R * 0.28, CY - ORB_R * 0.28, 0, CX, CY, ORB_R);
        sg.addColorStop(0,   'rgba(210,210,255,0.55)');
        sg.addColorStop(0.4, 'rgba(80,55,190,0.35)');
        sg.addColorStop(1,   'rgba(25,15,90,0.88)');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(CX, CY, ORB_R, 0, Math.PI * 2);
        ctx.fill();

        // Rim
        ctx.strokeStyle = 'rgba(160,130,255,0.65)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Specular highlight
        const hg = ctx.createRadialGradient(
            CX - ORB_R * 0.35, CY - ORB_R * 0.35, 0,
            CX - ORB_R * 0.35, CY - ORB_R * 0.35, ORB_R * 0.42
        );
        hg.addColorStop(0, 'rgba(255,255,255,0.55)');
        hg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(CX, CY, ORB_R, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawBolt(bolt) {
        const pts = bolt.pts;
        if (pts.length < 2) return;
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Glow halo
        ctx.shadowColor = `hsl(${bolt.hue},100%,65%)`;
        ctx.shadowBlur = 18;
        ctx.strokeStyle = `hsla(${bolt.hue},100%,75%,${(bolt.life * 0.85).toFixed(2)})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();

        // Bright core
        ctx.shadowBlur = 4;
        ctx.strokeStyle = `rgba(255,255,255,${(bolt.life * 0.65).toFixed(2)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
        ctx.restore();
    }

    function animate() {
        t++;
        ctx.fillStyle = 'rgba(2,0,14,0.42)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Bolts toward cursor/touch
        if (t % 4 === 0) {
            bolts.push(spawnBolt(mouseX, mouseY, 210 + Math.random() * 70));
        }
        // Ambient auto-bolts in random directions
        if (t % 14 === 0) {
            const a = Math.random() * Math.PI * 2;
            const d = ORB_R * 3 + Math.random() * Math.min(canvas.width, canvas.height) * 0.38;
            bolts.push(spawnBolt(CX + Math.cos(a) * d, CY + Math.sin(a) * d, 180 + Math.random() * 110));
        }

        bolts = bolts.filter(b => b.life > 0.02);
        bolts.forEach(b => { drawBolt(b); b.life -= b.decay; });

        drawOrb();
        animationFrameId = requestAnimationFrame(animate);
    }

    animate();
}

window.startElectricPlasma = startElectricPlasma;
