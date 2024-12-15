export function initGame(canvas) {
    const ctx = canvas.getContext('2d');
    
    // Game settings
    const playerWidth = 50;
    const playerHeight = 30;
    const bulletWidth = 5;
    const bulletHeight = 15;
    const enemyWidth = 40;
    const enemyHeight = 40;

    // Player
    const player = {
        x: canvas.width / 2 - playerWidth / 2,
        y: canvas.height - playerHeight - 10,
        speed: 5,
        color: '#00FF00'
    };

    // Bullets and Enemies
    const bullets = [];
    const enemies = [];
    let score = 0;
    let gameOver = false;

    // Sound Effects
    const shootSound = new Audio('https://opengameart.org/sites/default/files/laser4.wav');
    const explosionSound = new Audio('https://opengameart.org/sites/default/files/explosion.wav');

    // Draw player
    function drawPlayer() {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, playerWidth, playerHeight);
    }

    // Draw bullets
    function drawBullets() {
        ctx.fillStyle = '#FFFFFF';
        bullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
        });
    }

    // Draw enemies
    function drawEnemies() {
        ctx.fillStyle = '#FF0000';
        enemies.forEach(enemy => {
            ctx.fillRect(enemy.x, enemy.y, enemyWidth, enemyHeight);
        });
    }

    // Spawn enemies
    function spawnEnemies() {
        if (Math.random() < 0.02) {
            enemies.push({
                x: Math.random() * (canvas.width - enemyWidth),
                y: 0,
                speed: Math.random() * 2 + 1
            });
        }
    }

    // Move bullets and check collisions
    function updateBullets() {
        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].y -= 10;

            // Remove bullets out of screen
            if (bullets[i].y < 0) {
                bullets.splice(i, 1);
                continue;
            }

            // Check enemy collision
            for (let j = enemies.length - 1; j >= 0; j--) {
                if (
                    bullets[i].x < enemies[j].x + enemyWidth &&
                    bullets[i].x + bulletWidth > enemies[j].x &&
                    bullets[i].y < enemies[j].y + enemyHeight &&
                    bullets[i].y + bulletHeight > enemies[j].y
                ) {
                    explosionSound.play();
                    enemies.splice(j, 1);
                    bullets.splice(i, 1);
                    score++;
                    break;
                }
            }
        }
    }

    // Move enemies and check game over
    function updateEnemies() {
        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].y += enemies[i].speed;

            // Game over if enemy reaches bottom
            if (enemies[i].y > canvas.height) {
                enemies.splice(i, 1);
            }

            // Check player collision
            if (
                enemies[i].x < player.x + playerWidth &&
                enemies[i].x + enemyWidth > player.x &&
                enemies[i].y < player.y + playerHeight &&
                enemies[i].y + enemyHeight > player.y
            ) {
                gameOver = true;
            }
        }
    }

    // Game loop
    function gameLoop() {
        if (gameOver) {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#FF0000';
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
            
            ctx.fillStyle = '#00FF00';
            ctx.font = '20px Arial';
            ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 50);
            return;
        }

        // Clear canvas
        ctx.fillStyle = '#000033';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update game elements
        spawnEnemies();
        updateBullets();
        updateEnemies();

        // Draw game elements
        drawPlayer();
        drawBullets();
        drawEnemies();

        // Draw score
        ctx.fillStyle = '#00FF00';
        ctx.font = '20px Courier New';
        ctx.fillText(`Score: ${score}`, 10, 30);

        requestAnimationFrame(gameLoop);
    }

    // Player controls
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
                player.x = Math.max(0, player.x - player.speed);
                break;
            case 'ArrowRight':
                player.x = Math.min(canvas.width - playerWidth, player.x + player.speed);
                break;
            case ' ':
                shootSound.play();
                bullets.push({
                    x: player.x + playerWidth / 2 - bulletWidth / 2,
                    y: player.y
                });
                break;
        }
    });

    // Reset game on canvas click when game is over
    canvas.addEventListener('click', () => {
        if (gameOver) {
            // Reset game state
            player.x = canvas.width / 2 - playerWidth / 2;
            bullets.length = 0;
            enemies.length = 0;
            score = 0;
            gameOver = false;
            gameLoop();
        }
    });

    // Start game loop
    gameLoop();
}
