export function initGame(canvas) {
    const ctx = canvas.getContext('2d');
    
    // Bird settings
    const bird = {
        x: canvas.width / 4,
        y: canvas.height / 2,
        radius: 20,
        velocity: 0,
        gravity: 0.5,
        jumpStrength: -10
    };
    
    // Pipe settings
    const pipes = [];
    const pipeWidth = 50;
    const pipeGap = 200;
    
    // Game state
    let score = 0;
    let gameOver = false;
    
    // Spawn pipes
    function spawnPipes() {
        const holeHeight = canvas.height / 2;
        const holeY = Math.random() * (canvas.height - holeHeight);
        
        pipes.push({
            x: canvas.width,
            topHeight: holeY,
            bottomY: holeY + pipeGap
        });
    }
    
    // Reset game
    function resetGame() {
        bird.y = canvas.height / 2;
        bird.velocity = 0;
        pipes.length = 0;
        score = 0;
        gameOver = false;
    }
    
    // Game loop
    function gameLoop() {
        if (gameOver) {
            // Game over screen
            ctx.fillStyle = 'red';
            ctx.font = '40px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
            ctx.font = '20px Courier New';
            ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 50);
            return;
        }
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Bird physics
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;
        
        // Spawn pipes periodically
        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
            spawnPipes();
        }
        
        // Move and draw pipes
        pipes.forEach((pipe, index) => {
            pipe.x -= 3;
            
            // Draw pipes
            ctx.fillStyle = '#00FF00';
            ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
            ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);
            
            // Collision detection
            if (
                bird.x + bird.radius > pipe.x && 
                bird.x - bird.radius < pipe.x + pipeWidth
            ) {
                if (
                    bird.y - bird.radius < pipe.topHeight || 
                    bird.y + bird.radius > pipe.bottomY
                ) {
                    gameOver = true;
                }
            }
            
            // Remove off-screen pipes and update score
            if (pipe.x + pipeWidth < 0) {
                pipes.splice(index, 1);
                score++;
            }
        });
        
        // Draw bird
        ctx.beginPath();
        ctx.fillStyle = '#FFFF00';
        ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw score
        ctx.fillStyle = '#00FF00';
        ctx.font = '20px Courier New';
        ctx.fillText(`Score: ${score}`, 10, 30);
        
        // Game over conditions
        if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
            gameOver = true;
        }
        
        requestAnimationFrame(gameLoop);
    }
    
    // Jump control
    function jump() {
        if (!gameOver) {
            bird.velocity = bird.jumpStrength;
        } else {
            resetGame();
        }
    }
    
    // Event listeners
    canvas.addEventListener('click', jump);
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            jump();
        }
    });
    
    // Start game loop
    gameLoop();
}
