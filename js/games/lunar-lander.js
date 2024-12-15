export function initGame(canvas) {
    const ctx = canvas.getContext('2d');
    
    // Lander
    const lander = {
        x: canvas.width / 2,
        y: 50,
        width: 30,
        height: 30,
        velocity: 0,
        fuel: 100
    };

    // Terrain
    const landingZone = {
        x: canvas.width / 2 - 50,
        y: canvas.height - 50,
        width: 100,
        height: 20
    };

    // Game state
    const gravity = 0.1;
    let gameOver = false;

    // Game loop
    function gameLoop() {
        if (gameOver) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Apply gravity
        lander.velocity += gravity;
        lander.y += lander.velocity;

        // Draw lander
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(lander.x, lander.y, lander.width, lander.height);

        // Draw landing zone
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(landingZone.x, landingZone.y, landingZone.width, landingZone.height);

        // Draw fuel
        ctx.fillStyle = '#00FF00';
        ctx.font = '20px Courier New';
        ctx.fillText(`Fuel: ${Math.round(lander.fuel)}`, 10, 30);

        // Thrust control
        document.addEventListener('keydown', (e) => {
            if (lander.fuel > 0) {
                if (e.key === 'ArrowUp') {
                    lander.velocity -= 0.3;
                    lander.fuel -= 1;
                }
            }
        });

        // Collision detection
        if (
            lander.y + lander.height >= landingZone.y &&
            lander.x + lander.width > landingZone.x &&
            lander.x < landingZone.x + landingZone.width
        ) {
            if (Math.abs(lander.velocity) < 2) {
                alert('Successful Landing!');
            } else {
                alert('Crash Landing!');
            }
            gameOver = true;
        }

        // Out of bounds
        if (lander.y + lander.height > canvas.height) {
            alert('Crashed!');
            gameOver = true;
        }

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}
