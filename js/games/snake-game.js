export function initGame(canvas) {
    const ctx = canvas.getContext('2d');
    
    // Game settings
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    const gameSpeed = 5; // Reduced speed
    let frameCount = 0;
    
    // Snake
    const snake = [{x: 10, y: 10}];
    let dx = 1;
    let dy = 0;
    
    // Space station food
    let food = generateFood();
    
    // Score
    let score = 0;
    
    // Game loop
    function gameLoop() {
        frameCount++;
        if (frameCount % gameSpeed !== 0) {
            requestAnimationFrame(gameLoop);
            return;
        }
        
        // Clear canvas with space background
        ctx.fillStyle = '#000033';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add stars
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
        
        // Draw snake (space rover segments)
        ctx.fillStyle = '#00FFFF';
        snake.forEach(segment => {
            ctx.fillRect(
                segment.x * gridSize, 
                segment.y * gridSize, 
                gridSize - 2, 
                gridSize - 2
            );
        });
        
        // Draw space station food
        ctx.fillStyle = '#00FF00';
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize/2, 
            food.y * gridSize + gridSize/2, 
            gridSize/2 - 2, 
            0, 
            Math.PI * 2
        );
        ctx.fill();
        
        // Draw score
        ctx.fillStyle = '#00FF00';
        ctx.font = '20px Courier New';
        ctx.fillText(`Space Stations Captured: ${score}`, 10, 30);
        
        requestAnimationFrame(gameLoop);
    }
    
    // Generate food (space station)
    function generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
        } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        return newFood;
    }
    
    // Game over
    function gameOver() {
        alert(`Mission Terminated! Space Stations Captured: ${score}`);
        snake.length = 1;
        snake[0] = {x: 10, y: 10};
        dx = 1;
        dy = 0;
        score = 0;
        food = generateFood();
        gameLoop();
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
    gameLoop();
}
