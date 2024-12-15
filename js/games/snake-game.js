export function initGame(canvas) {
    const ctx = canvas.getContext('2d');
    
    // Game settings
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    
    // Snake
    const snake = [{x: 10, y: 10}];
    let dx = 1;
    let dy = 0;
    
    // Food
    let food = generateFood();
    
    // Score
    let score = 0;
    
    // Game loop
    function gameLoop() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Move snake
        const newHead = {
            x: (snake[0].x + dx + tileCount) % tileCount,
            y: (snake[0].y + dy + tileCount) % tileCount
        };
        
        // Check self-collision
        if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            gameOver();
            return;
        }
        
        snake.unshift(newHead);
        
        // Check food collision
        if (snake[0].x === food.x && snake[0].y === food.y) {
            score++;
            food = generateFood();
        } else {
            snake.pop();
        }
        
        // Draw snake
        ctx.fillStyle = '#00FF00';
        snake.forEach(segment => {
            ctx.fillRect(
                segment.x * gridSize, 
                segment.y * gridSize, 
                gridSize - 2, 
                gridSize - 2
            );
        });
        
        // Draw food
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(
            food.x * gridSize, 
            food.y * gridSize, 
            gridSize - 2, 
            gridSize - 2
        );
        
        // Draw score
        ctx.fillStyle = '#00FF00';
        ctx.font = '20px Courier New';
        ctx.fillText(`Score: ${score}`, 10, 30);
    }
    
    // Generate food
    function generateFood() {
        return {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    }
    
    // Game over
    function gameOver() {
        alert(`Game Over! Score: ${score}`);
        snake.length = 1;
        snake[0] = {x: 10, y: 10};
        dx = 1;
        dy = 0;
        score = 0;
        food = generateFood();
    }
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp':    if (dy !== 1)  { dx = 0; dy = -1; } break;
            case 'ArrowDown':  if (dy !== -1) { dx = 0; dy = 1;  } break;
            case 'ArrowLeft':  if (dx !== 1)  { dx = -1; dy = 0; } break;
            case 'ArrowRight': if (dx !== -1) { dx = 1; dy = 0;  } break;
        }
    });
    
    // Start game loop
    function animate() {
        gameLoop();
        requestAnimationFrame(animate);
    }
    
    animate();
}
