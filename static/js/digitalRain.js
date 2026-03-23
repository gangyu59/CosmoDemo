function startDigitalRain(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();

    const FONT_SIZE = 18;
    const cols = Math.floor(canvas.width / FONT_SIZE);
    const rows = Math.ceil(canvas.height / FONT_SIZE) + 4;

    // Random Unicode Katakana character (U+30A0 – U+30FF)
    function katakana() {
        return String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
    }

    // Each column maintains its own character grid, head position, speed, and trail length
    const columns = Array.from({ length: cols }, () => {
        const col = {
            head: -Math.floor(Math.random() * rows),
            speed: 0.25 + Math.random() * 0.45,
            trail: 14 + Math.floor(Math.random() * 18),
            chars: Array.from({ length: rows }, katakana)
        };
        return col;
    });

    let t = 0;

    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `bold ${FONT_SIZE}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        columns.forEach((col, ci) => {
            const x = ci * FONT_SIZE + FONT_SIZE / 2;
            const headRow = Math.floor(col.head);

            // Occasionally mutate a character in the column (glitch effect)
            if (Math.random() < 0.04) {
                col.chars[Math.floor(Math.random() * rows)] = katakana();
            }

            for (let row = headRow - col.trail; row <= headRow; row++) {
                if (row < 0 || row >= rows) continue;
                const y = row * FONT_SIZE;
                const distFromHead = headRow - row;

                if (distFromHead === 0) {
                    // Leading character: bright white with soft green halo
                    ctx.shadowColor = '#aaffaa';
                    ctx.shadowBlur = 10;
                    ctx.fillStyle = '#ffffff';
                } else {
                    // Trail: quadratic fade from bright green to near-black
                    const fade = (1 - distFromHead / col.trail);
                    const brightness = (fade * fade * 210 + 15) | 0;
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = `rgb(0,${brightness},${(brightness * 0.18) | 0})`;
                }

                ctx.fillText(col.chars[row % col.chars.length], x, y);
            }
        });
        ctx.shadowBlur = 0;

        // Advance heads every other frame to keep speed manageable
        if (t % 2 === 0) {
            columns.forEach(col => {
                col.head += col.speed;
                if (col.head - col.trail > rows) {
                    col.head = -Math.floor(Math.random() * 12);
                    col.speed = 0.25 + Math.random() * 0.45;
                    col.trail = 14 + Math.floor(Math.random() * 18);
                }
            });
        }
        t++;
    }

    function animate() {
        draw();
        animationFrameId = requestAnimationFrame(animate);
    }

    animate();
}

window.startDigitalRain = startDigitalRain;
