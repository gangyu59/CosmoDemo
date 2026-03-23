function startColorfulWaveAnimation(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();

    // Render at 1/3 resolution then upscale (pixel-shader style)
    const SCALE = 3;
    const W = Math.floor(canvas.width / SCALE);
    const H = Math.floor(canvas.height / SCALE);

    const offscreen = document.createElement('canvas');
    offscreen.width = W;
    offscreen.height = H;
    const offCtx = offscreen.getContext('2d');
    const imgData = offCtx.createImageData(W, H);
    const data = imgData.data;

    let t = 0;

    // Four wave sources that drift around the canvas in Lissajous-like paths
    const sources = [
        { ax: 0.30, ay: 0.30, px: 0.0, py: 0.0, sx: 0.70, sy: 0.50, freq: 0.22, phase: 0 },
        { ax: 0.38, ay: 0.32, px: 1.0, py: 2.0, sx: 0.50, sy: 0.68, freq: 0.18, phase: Math.PI },
        { ax: 0.26, ay: 0.28, px: 2.0, py: 1.0, sx: 0.80, sy: 0.32, freq: 0.26, phase: Math.PI * 0.7 },
        { ax: 0.22, ay: 0.38, px: 0.5, py: 1.5, sx: 0.35, sy: 0.60, freq: 0.15, phase: Math.PI * 1.4 },
    ];

    function hsvToRgb(h, s, v) {
        const i = Math.floor(h * 6) | 0;
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const tk = v * (1 - (1 - f) * s);
        let r, g, b;
        switch (i % 6) {
            case 0: r=v; g=tk; b=p; break;
            case 1: r=q; g=v;  b=p; break;
            case 2: r=p; g=v;  b=tk; break;
            case 3: r=p; g=q;  b=v; break;
            case 4: r=tk;g=p;  b=v; break;
            default:r=v; g=p;  b=q; break;
        }
        return [(r * 255) | 0, (g * 255) | 0, (b * 255) | 0];
    }

    function render() {
        const T = t * 0.012;
        // Pre-compute source positions for this frame
        const spos = sources.map(s => ({
            x: W * (0.5 + s.ax * Math.sin(T * s.sx + s.px)),
            y: H * (0.5 + s.ay * Math.cos(T * s.sy + s.py))
        }));

        const N = sources.length;
        const inv = 1 / N;

        for (let py = 0; py < H; py++) {
            for (let px = 0; px < W; px++) {
                let wave = 0;
                for (let i = 0; i < N; i++) {
                    const dx = px - spos[i].x;
                    const dy = py - spos[i].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    wave += Math.sin(dist * sources[i].freq - t * 0.07 + sources[i].phase);
                }
                wave *= inv; // normalise to ≈ [-1, 1]

                const hue = ((wave * 0.5 + 0.5) + t * 0.0025) % 1.0;
                const sat = 0.82 + 0.18 * Math.abs(wave);
                const val = 0.38 + 0.62 * (wave * 0.5 + 0.5);

                const [r, g, b] = hsvToRgb((hue + 1) % 1, Math.min(1, sat), Math.min(1, val));
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

window.startColorfulWaveAnimation = startColorfulWaveAnimation;
