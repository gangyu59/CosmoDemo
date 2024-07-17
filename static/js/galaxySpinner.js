function startGalaxySpinner(canvas, ctx, clearCanvasAndStop) {
    clearCanvasAndStop();

    const sun = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 30,
        color: 'yellow'
    };

    const planets = [
        { name: 'Mercury', radius: 5, distance: 50, speed: 0.04, color: 'gray', angle: 0 },
        { name: 'Venus', radius: 8, distance: 80, speed: 0.03, color: 'orange', angle: 0 },
        { name: 'Earth', radius: 10, distance: 120, speed: 0.02, color: 'blue', angle: 0 },
        { name: 'Mars', radius: 7, distance: 160, speed: 0.018, color: 'red', angle: 0 },
        { name: 'Jupiter', radius: 20, distance: 200, speed: 0.01, color: 'brown', angle: 0 },
        { name: 'Saturn', radius: 18, distance: 240, speed: 0.009, color: 'yellow', angle: 0 },
        { name: 'Uranus', radius: 15, distance: 280, speed: 0.007, color: 'lightblue', angle: 0 },
        { name: 'Neptune', radius: 15, distance: 320, speed: 0.005, color: 'blue', angle: 0 },
    ];

    function drawSun() {
        ctx.fillStyle = sun.color;
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawPlanets() {
        planets.forEach(planet => {
            const x = sun.x + planet.distance * Math.cos(planet.angle);
            const y = sun.y + planet.distance * Math.sin(planet.angle);
            ctx.fillStyle = planet.color;
            ctx.beginPath();
            ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
            ctx.fill();
            planet.angle += planet.speed;
        });
    }

    function animate() {
        ctx.fillStyle = 'black'; // 设置背景为黑色
        ctx.fillRect(0, 0, canvas.width, canvas.height); // 填充背景
        drawSun();
        drawPlanets();
        animationFrameId = requestAnimationFrame(animate);
    }

    animate();
}

window.startGalaxySpinner = startGalaxySpinner;