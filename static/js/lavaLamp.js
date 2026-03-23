function startLavaLamp(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();

    // Render metaballs at reduced resolution then scale up
    const SCALE = 3;
    const W = Math.floor(canvas.width / SCALE);
    const H = Math.floor(canvas.height / SCALE);

    const offscreen = document.createElement('canvas');
    offscreen.width = W;
    offscreen.height = H;
    const offCtx = offscreen.getContext('2d');
    const imgData = offCtx.createImageData(W, H);
    const data = imgData.data;

    // Tube horizontal bounds in low-res coords
    const tubeL = Math.floor(W * 0.18);
    const tubeR = Math.floor(W * 0.82);

    // Blobs with buoyancy
    const blobs = [];
    for (let i = 0; i < 9; i++) {
        blobs.push({
            x: tubeL + Math.random() * (tubeR - tubeL),
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            r: 22 + Math.random() * 22,
            hue: 0 + Math.random() * 45,   // warm red-orange palette
            hot: Math.random() > 0.5        // hot = rises, cold = sinks
        });
    }

    function hslToRgb(h, s, l) {
        h /= 360; s /= 100; l /= 100;
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1; if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
        if (s === 0) return [l * 255 | 0, l * 255 | 0, l * 255 | 0];
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        return [
            (hue2rgb(p, q, h + 1/3) * 255) | 0,
            (hue2rgb(p, q, h)       * 255) | 0,
            (hue2rgb(p, q, h - 1/3) * 255) | 0
        ];
    }

    function render() {
        for (let py = 0; py < H; py++) {
            for (let px = 0; px < W; px++) {
                const inTube = px >= tubeL && px <= tubeR;
                const idx = (py * W + px) * 4;

                if (!inTube) {
                    // Dark enclosure wall
                    data[idx] = 8; data[idx+1] = 6; data[idx+2] = 18; data[idx+3] = 255;
                    continue;
                }

                let sum = 0;
                let rAcc = 0, gAcc = 0, bAcc = 0, wAcc = 0;

                for (let i = 0; i < blobs.length; i++) {
                    const b = blobs[i];
                    const dx = px - b.x, dy = py - b.y;
                    const d2 = dx * dx + dy * dy;
                    const r2 = b.r * b.r;
                    if (d2 < r2 * 5) {
                        const contrib = r2 / (d2 + 1);
                        sum += contrib;
                        const w = contrib * contrib;
                        const [r, g, bl] = hslToRgb(b.hue, 100, 55);
                        rAcc += r * w; gAcc += g * w; bAcc += bl * w; wAcc += w;
                    }
                }

                if (sum > 80) {
                    const bright = Math.min(1.45, sum / 110);
                    const r = wAcc > 0 ? (rAcc / wAcc * bright) | 0 : 255;
                    const g = wAcc > 0 ? (gAcc / wAcc * bright) | 0 : 80;
                    const b = wAcc > 0 ? (bAcc / wAcc * bright) | 0 : 0;
                    data[idx] = Math.min(255, r);
                    data[idx+1] = Math.min(255, g);
                    data[idx+2] = Math.min(255, b);
                    data[idx+3] = 255;
                } else if (sum > 45) {
                    // Soft glowing edge
                    const tt = (sum - 45) / 35;
                    const r = wAcc > 0 ? (rAcc / wAcc) | 0 : 200;
                    const g = wAcc > 0 ? (gAcc / wAcc) | 0 : 60;
                    const b = wAcc > 0 ? (bAcc / wAcc) | 0 : 0;
                    data[idx]   = (r * tt * 0.75) | 0;
                    data[idx+1] = (g * tt * 0.75) | 0;
                    data[idx+2] = (b * tt * 0.75) | 0;
                    data[idx+3] = 255;
                } else {
                    // Fluid background — very dark amber tint
                    data[idx] = 6; data[idx+1] = 3; data[idx+2] = 12; data[idx+3] = 255;
                }
            }
        }

        offCtx.putImageData(imgData, 0, 0);
        ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
        drawGlass();
    }

    function drawGlass() {
        const left  = tubeL * SCALE;
        const right = tubeR * SCALE;
        const w = right - left;

        // Left inner highlight
        const lg = ctx.createLinearGradient(left, 0, left + 18, 0);
        lg.addColorStop(0, 'rgba(255,255,255,0.28)');
        lg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = lg;
        ctx.fillRect(left, 0, 18, canvas.height);

        // Right inner highlight
        const rg = ctx.createLinearGradient(right - 18, 0, right, 0);
        rg.addColorStop(0, 'rgba(255,255,255,0)');
        rg.addColorStop(1, 'rgba(255,255,255,0.18)');
        ctx.fillStyle = rg;
        ctx.fillRect(right - 18, 0, 18, canvas.height);

        // Heat glow at bottom
        const bg = ctx.createLinearGradient(0, canvas.height - 70, 0, canvas.height);
        bg.addColorStop(0, 'rgba(255,120,0,0)');
        bg.addColorStop(1, 'rgba(255,80,0,0.38)');
        ctx.fillStyle = bg;
        ctx.fillRect(left, canvas.height - 70, w, 70);

        // Cool glow at top
        const tg = ctx.createLinearGradient(0, 0, 0, 50);
        tg.addColorStop(0, 'rgba(80,120,255,0.18)');
        tg.addColorStop(1, 'rgba(80,120,255,0)');
        ctx.fillStyle = tg;
        ctx.fillRect(left, 0, w, 50);
    }

    function updateBlobs() {
        blobs.forEach(b => {
            const buoyancy = b.hot ? -0.042 : 0.035;
            b.vy += buoyancy;
            b.vx += (Math.random() - 0.5) * 0.018;
            b.vx *= 0.978; b.vy *= 0.978;

            const spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
            if (spd > 1.3) { b.vx *= 1.3 / spd; b.vy *= 1.3 / spd; }

            b.x += b.vx; b.y += b.vy;

            if (b.x - b.r < tubeL)  { b.x = tubeL + b.r;  b.vx =  Math.abs(b.vx) * 0.4; }
            if (b.x + b.r > tubeR)  { b.x = tubeR - b.r;  b.vx = -Math.abs(b.vx) * 0.4; }
            if (b.y < b.r * 0.4)    { b.y = b.r * 0.4;    b.vy = Math.abs(b.vy) * 0.4; b.hot = false; }
            if (b.y > H - b.r * 0.4){ b.y = H - b.r * 0.4; b.vy = -Math.abs(b.vy) * 0.4; b.hot = true; }
        });
    }

    function animate() {
        updateBlobs();
        render();
        animationFrameId = requestAnimationFrame(animate);
    }

    animate();
}

window.startLavaLamp = startLavaLamp;
