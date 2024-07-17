function startFallingLeaves(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();
    const leaves = [];
    const numLeaves = 30;

    function createLeaf() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            vy: Math.random() * 2 + 1,
            size: Math.random() * 20 + 10,
            color: `hsl(${Math.random() * 30 + 30}, 100%, 50%)`,
            angle: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1
        };
    }

    function drawLeaf(leaf) {
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.angle);
        ctx.fillStyle = leaf.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(leaf.size / 2, -leaf.size / 2, leaf.size, leaf.size / 2, 0, leaf.size);
        ctx.bezierCurveTo(-leaf.size, leaf.size / 2, -leaf.size / 2, -leaf.size / 2, 0, 0);
        ctx.fill();
        ctx.restore();
    }

    for (let i = 0; i < numLeaves; i++) {
        leaves.push(createLeaf());
    }

    function drawLeaves() {
        ctx.fillStyle = 'blue'; // 设置背景为天空的蔚蓝色
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        leaves.forEach(leaf => {
            drawLeaf(leaf);
        });
    }

    function updateLeaves() {
        leaves.forEach(leaf => {
            leaf.y += leaf.vy;
            leaf.angle += leaf.rotationSpeed;
            if (leaf.y > canvas.height) {
                leaf.y = Math.random() * -canvas.height;
                leaf.x = Math.random() * canvas.width;
                leaf.angle = Math.random() * Math.PI * 2;
            }
        });
    }

    function animate() {
        drawLeaves();
        updateLeaves();
        animationFrameId = requestAnimationFrame(animate);
    }

    clearCanvasAndStop();
    animate();
}

window.startFallingLeaves = startFallingLeaves;