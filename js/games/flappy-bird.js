export function initGame(canvas) {
    const ctx = canvas.getContext('2d');
    
    // Space Shuttle settings
    const shuttle = {
        x: canvas.width / 4,
        y: canvas.height / 2,
        width: 40,
        height: 30,
        velocity: 0,
        gravity: 0.3,  // Reduced gravity
        jumpStrength: -6  // Reduced jump strength
    };
    
    // Space debris settings
    const debris = [];
    const debrisWidth = 50;
    const debrisGap = 200;
    
    // Game state
    let score = 0;
    let gameOver = false;
    
    // Spawn space debris
    function spawnDebris() {
        const holeHeight = 200;  // Fixed hole size
        const holeY = Math.random() * (canvas.height - holeHeight);
        
        debris.push({
            x: canvas.width,
            topHeight: holeY,
            bottomY: holeY + holeHeight
        });
    }
    
    // Reset game
    function resetGame() {
        shuttle.y = canvas.height / 2;
        shuttle.velocity = 0;
        debris.length = 0;
        score = 0;
        gameOver = false;
        gameLoop();  // Restart game loop
    }
    
    // Game loop
    function gameLoop() {
        // Clear canvas with space background
        ctx.fillStyle = '#000033';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Star background
        for (let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.arc(
                Math.random() * canvas.width, 
                Math.random() * canvas.height, 
                Math.random() * 2, 
                0, 
                Math.PI * 2
            );
            ctx.fill();
        }
        
        if (gameOver) {
            // Game over screen
            ctx.fillStyle = '#00FFFF';
            ctx.font = '40px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText('Mission Failed', canvas.width / 2, canvas.height / 2);
            ctx.font = '20px Courier New';
            ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 50);
            ctx.font = '15px Courier New';
            ctx.fillText('Click to Restart', canvas.width / 2, canvas.height / 2 + 90);
            return;
        }
        
        // Shuttle physics
        shuttle.velocity += shuttle.gravity;
        shuttle.y += shuttle.velocity;
        
        // Spawn debris periodically
        if (debris.length === 0 || debris[debris.length - 1].x < canvas.width - 300) {
            spawnDebris();
        }
        
        // Move and draw debris
        debris.forEach((piece, index) => {
            piece.x -= 3;
            
            // Draw debris
            ctx.fillStyle = '#00FF00';
            ctx.fillRect(piece.x, 0, debrisWidth, piece.topHeight);
            ctx.fillRect(piece.x, piece.bottomY, debrisWidth, canvas.height - piece.bottomY);
            
            // Collision detection
            if (
                shuttle.x + shuttle.width > piece.x && 
                shuttle.x < piece.x + debrisWidth
            ) {
                if (
                    shuttle.y < piece.topHeight || 
                    shuttle.y + shuttle.height > piece.bottomY
                ) {
                    gameOver = true;
                }
            }
            
            // Remove off-screen debris and update score
            if (piece.x + debrisWidth < 0) {
                debris.splice(index, 1);
                score++;
            }
        });
        
        // Draw shuttle
        ctx.fillStyle = '#00FFFF';
        ctx.beginPath();
        ctx.moveTo(shuttle.x, shuttle.y);
        ctx.lineTo(shuttle.x - 20, shuttle.y + shuttle.height);
        ctx.lineTo(shuttle.x + shuttle.width, shuttle.y + shuttle.height / 2);
        ctx.closePath();
        ctx.fill();
        
        // Draw score
        ctx.fillStyle = '#00FF00';
        ctx.font = '20px Courier New';
        ctx.fillText(`Mission Progress: ${score}`, 10, 30);
        
        // Game over conditions
        if (shuttle.y + shuttle.height > canvas.height || shuttle.y < 0) {
            gameOver = true;
        }
        
        if (!gameOver) {
            requestAnimationFrame(gameLoop);
        }
    }
    
    // Jump control
    function jump() {
        if (!gameOver) {
            shuttle.velocity = shuttle.jumpStrength;
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
