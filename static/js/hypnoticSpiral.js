function startHypnoticSpiral(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();

    // Pixel-shader approach at 1/3 resolution
    const SCALE = 3;
    const W = Math.floor(canvas.width / SCALE);
    const H = Math.floor(canvas.height / SCALE);

    const offscreen = document.createElement('canvas');
    offscreen.width = W;
    offscreen.height = H;
    const offCtx = offscreen.getContext('2d');
    const imgData = offCtx.createImageData(W, H);
    const data = imgData.data;

    const CX = W / 2;
    const CY = H / 2;
    let t = 0;

    function hsvToRgb(h, s, v) {
        const i = Math.floor(h * 6) | 0;
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const tk = v * (1 - (1 - f) * s);
        let r, g, b;
        switch (i % 6) {
            case 0: r=v;  g=tk; b=p;  break;
            case 1: r=q;  g=v;  b=p;  break;
            case 2: r=p;  g=v;  b=tk; break;
            case 3: r=p;  g=q;  b=v;  break;
            case 4: r=tk; g=p;  b=v;  break;
            default:r=v;  g=p;  b=q;  break;
        }
        return [(r * 255) | 0, (g * 255) | 0, (b * 255) | 0];
    }

    function render() {
        const speed = t * 0.022;
        const colorShift = t * 0.0028;

        for (let py = 0; py < H; py++) {
            for (let px = 0; px < W; px++) {
                const dx = px - CX;
                const dy = py - CY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx);

                // Three overlapping spiral wave patterns create depth illusion
                const w1 = Math.sin(dist * 0.14 - speed * 2.0 + angle * 4);
                const w2 = Math.sin(dist * 0.07 - speed * 1.3 + angle * 2);
                const w3 = Math.sin(dist * 0.24 - speed * 3.1 - angle * 6);
                const combined = (w1 + w2 * 0.55 + w3 * 0.3) / 1.85; // ≈ [-1, 1]

                // Hue rotates with angle + time + slight dist offset → rainbow tunnel
                const hue = ((angle / (Math.PI * 2)) + colorShift + dist * 0.004) % 1.0;
                const sat = Math.min(1, 0.78 + 0.22 * Math.abs(combined));
                const val = Math.min(1, Math.max(0.05, 0.32 + 0.68 * (combined * 0.5 + 0.5)));

                const [r, g, b] = hsvToRgb((hue + 1) % 1, sat, val);
                const idx = (py * W + px) * 4;
                data[idx] = r; data[idx+1] = g; data[idx+2] = b; data[idx+3] = 255;
            }
        }

        offCtx.putImageData(imgData, 0, 0);
        ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
        t++;
    }

    function animate() {
        render();
        animationFrameId = requestAnimationFrame(animate);
    }

    animate();
}

window.startHypnoticSpiral = startHypnoticSpiral;
