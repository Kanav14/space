export function initGame(canvas) {
    const ctx = canvas.getContext('2d');
    
    // Player ship
    const player = {
        x: canvas.width / 2,
        y: canvas.height - 50,
        width: 50,
        height: 20,
        speed: 5
    };

    // Aliens
    const aliens = [];
    const alienRows = 5;
    const alienCols = 10;
    const alienWidth = 30;
    const alienHeight = 20;

    // Create aliens
    for (let row = 0; row < alienRows; row++) {
        for (let col = 0; col < alienCols; col++) {
            aliens.push({
                x: col * (alienWidth + 10),
                y: row * (alienHeight + 10),
                width: alienWidth,
                height: alienHeight
            });
        }
    }

    // Game loop
    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw player
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Draw aliens
        aliens.forEach(alien => {
            ctx.fillStyle = '#00FFFF';
            ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
        });

        // Simple player movement
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && player.x > 0) player.x -= player.speed;
            if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) player.x += player.speed;
        });

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}
