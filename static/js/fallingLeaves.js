function startFallingLeaves(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();

    const NUM = 38;
    const leaves = [];

    // Autumn palette: [hue, sat%, light%]
    const palette = [
        [15, 90, 52], [25, 95, 58], [35, 92, 53],
        [45, 88, 54], [5,  82, 44], [0,  78, 48],
        [50, 85, 58], [355, 73, 43], [20, 95, 50]
    ];

    function pickColor() {
        const [h, s, l] = palette[Math.floor(Math.random() * palette.length)];
        const jitter = (Math.random() - 0.5) * 12;
        return `hsl(${h + jitter},${s}%,${l}%)`;
    }

    function makeLeaf(randomY) {
        const size = 16 + Math.random() * 22;
        return {
            x: Math.random() * canvas.width,
            y: randomY ? Math.random() * canvas.height : -size - Math.random() * canvas.height * 0.4,
            vy: 0.7 + Math.random() * 1.1,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.038,
            swing: Math.random() * Math.PI * 2,
            swingSpeed: 0.018 + Math.random() * 0.022,
            swingAmp: 0.7 + Math.random() * 1.3,
            size,
            color: pickColor(),
            type: Math.floor(Math.random() * 3), // 0=oval, 1=elongated, 2=maple
            alpha: 0.82 + Math.random() * 0.18
        };
    }

    for (let i = 0; i < NUM; i++) leaves.push(makeLeaf(true));

    // ── Leaf shape drawing functions ──────────────────────────────────────────

    function drawOval(s) {
        // Classic oval broadleaf
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.bezierCurveTo( s * 0.68, -s * 0.5,  s * 0.68,  s * 0.5,  0,  s);
        ctx.bezierCurveTo(-s * 0.68,  s * 0.5, -s * 0.68, -s * 0.5,  0, -s);
        ctx.closePath();
    }

    function drawElongated(s) {
        // Narrow willow-style leaf
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.bezierCurveTo( s * 0.38, -s * 0.3,  s * 0.32,  s * 0.55,  0,  s * 1.05);
        ctx.bezierCurveTo(-s * 0.32,  s * 0.55, -s * 0.38, -s * 0.3,  0, -s);
        ctx.closePath();
    }

    function drawMaple(s) {
        // Five-pointed maple / palmate leaf
        ctx.beginPath();
        ctx.moveTo(0, -s);
        // right upper lobe
        ctx.bezierCurveTo( s*0.28, -s*0.88,  s*0.88, -s*0.60,  s*0.68, -s*0.18);
        // right notch indent
        ctx.bezierCurveTo( s*0.52, -s*0.08,  s*0.58,  s*0.08,  s*0.38,  s*0.22);
        // right lower lobe
        ctx.bezierCurveTo( s*0.68,  s*0.10,  s*0.50,  s*0.58,  0,       s*0.68);
        // left lower lobe
        ctx.bezierCurveTo(-s*0.50,  s*0.58, -s*0.68,  s*0.10, -s*0.38,  s*0.22);
        // left notch indent
        ctx.bezierCurveTo(-s*0.58,  s*0.08, -s*0.52, -s*0.08, -s*0.68, -s*0.18);
        // left upper lobe
        ctx.bezierCurveTo(-s*0.88, -s*0.60, -s*0.28, -s*0.88,  0,      -s);
        ctx.closePath();
    }

    function drawLeafShape(type, size) {
        if (type === 0) drawOval(size);
        else if (type === 1) drawElongated(size);
        else drawMaple(size);
    }

    function drawLeaf(leaf) {
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.rotation);
        ctx.globalAlpha = leaf.alpha;

        // Leaf body
        ctx.fillStyle = leaf.color;
        drawLeafShape(leaf.type, leaf.size);
        ctx.fill();

        // Midrib
        ctx.strokeStyle = 'rgba(0,0,0,0.28)';
        ctx.lineWidth = 0.9;
        const tipY = leaf.type === 1 ? leaf.size * 1.02 : leaf.size * 0.88;
        ctx.beginPath();
        ctx.moveTo(0, -leaf.size * 0.88);
        ctx.lineTo(0,  tipY);
        ctx.stroke();

        // Two secondary veins
        ctx.lineWidth = 0.5;
        const vx = leaf.type === 2 ? leaf.size * 0.3 : leaf.size * 0.42;
        ctx.beginPath();
        ctx.moveTo(0, -leaf.size * 0.15);
        ctx.lineTo( vx,  leaf.size * 0.25);
        ctx.moveTo(0, -leaf.size * 0.15);
        ctx.lineTo(-vx,  leaf.size * 0.25);
        ctx.stroke();

        ctx.restore();
    }

    function updateLeaf(leaf) {
        leaf.swing += leaf.swingSpeed;
        const swayX = Math.sin(leaf.swing) * leaf.swingAmp;
        leaf.x += swayX;
        leaf.y += leaf.vy;
        leaf.rotation += leaf.rotSpeed + Math.sin(leaf.swing * 1.4) * 0.008;

        // Occasional gust
        if (Math.random() < 0.002) leaf.swingAmp = 1.5 + Math.random() * 2;
        else leaf.swingAmp += (1.0 - leaf.swingAmp) * 0.005; // drift back

        if (leaf.y > canvas.height + leaf.size * 2) {
            Object.assign(leaf, makeLeaf(false));
        }
        // Horizontal wrap
        if (leaf.x < -leaf.size * 2) leaf.x = canvas.width + leaf.size;
        if (leaf.x > canvas.width + leaf.size * 2) leaf.x = -leaf.size;
    }

    function animate() {
        // Autumn sky: pale blue gradient to warm horizon
        const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
        sky.addColorStop(0,   '#6ab0d8');
        sky.addColorStop(0.55,'#b8d8e8');
        sky.addColorStop(1,   '#e8cfa0');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalAlpha = 1;
        leaves.forEach(leaf => {
            drawLeaf(leaf);
            updateLeaf(leaf);
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    animate();
}

window.startFallingLeaves = startFallingLeaves;
