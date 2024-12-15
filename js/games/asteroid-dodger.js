export function initGame(canvas) {
    const ctx = canvas.getContext('2d');
    
    // Player ship
    const player = {
        x: canvas.width / 2,
        y: canvas.height - 50,
        width: 30,
        height: 30,
        speed: 5
    };

    // Asteroids
    const asteroids = [];

    // Create asteroid
    function createAsteroid() {
        return {
            x: Math.random() * (canvas.width - 30),
            y: -30,
            width: 30,
            height: 30,
            speed: Math.random() * 3 + 1
        };
    }

    // Game state
    let score = 0;

    // Game loop
    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw player
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Spawn asteroids
        if (Math.random() < 0.02) asteroids.push(createAsteroid());

        // Move and draw asteroids
        asteroids.forEach((asteroid, index) => {
            asteroid.y += asteroid.speed;
            
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(asteroid.x, asteroid.y, asteroid.width, asteroid.height);

            // Remove off-screen asteroids
            if (asteroid.y > canvas.height) {
                asteroids.splice(index, 1);
                score++;
            }

            // Collision detection
            if (
                player.x < asteroid.x + asteroid.width &&
                player.x + player.width > asteroid.x &&
                player.y < asteroid.y + asteroid.height &&
                player.y + player.height > asteroid.y
            ) {
                alert(`Game Over! Score: ${score}`);
                score = 0;
            }
        });

        // Draw score
        ctx.fillStyle = '#00FF00';
        ctx.font = '20px Courier New';
        ctx.fillText(`Score: ${score}`, 10, 30);

        // Player movement
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && player.x > 0) player.x -= player.speed;
            if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) player.x += player.speed;
        });

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}
