export function initGame(canvas) {
    const ctx = canvas.getContext('2d');
    
    // Paddle settings
    const paddleHeight = 100;
    const paddleWidth = 10;
    
    // Ball settings
    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 10,
        speed: 5,
        dx: 5,
        dy: 5
    };
    
    // Paddles
    const leftPaddle = {
        x: 0,
        y: canvas.height / 2 - paddleHeight / 2,
        speed: 10
    };
    
    const rightPaddle = {
        x: canvas.width - paddleWidth,
        y: canvas.height / 2 - paddleHeight / 2,
        speed: 10
    };
    
    // Score
    let playerScore = 0;
    let aiScore = 0;
    
    // Game loop
    function gameLoop() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw paddles
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(leftPaddle.x, leftPaddle.y, paddleWidth, paddleHeight);
        ctx.fillRect(rightPaddle.x, rightPaddle.y, paddleWidth, paddleHeight);
        
        // Draw ball
        ctx.beginPath();
        ctx.fillStyle = '#FFFFFF';
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Move ball
        ball.x += ball.dx;
        ball.y += ball.dy;
        
        // Ball collision with top and bottom
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
            ball.dy *= -1;
        }
        
        // AI paddle movement
        if (rightPaddle.y + paddleHeight / 2 < ball.y) {
            rightPaddle.y += rightPaddle.speed;
        } else {
            rightPaddle.y -= rightPaddle.speed;
        }
        
        // Ball collision with paddles
        if (
            (ball.x - ball.radius < leftPaddle.x + paddleWidth && 
             ball.y > leftPaddle.y && 
             ball.y < leftPaddle.y + paddleHeight) ||
            (ball.x + ball.radius > rightPaddle.x && 
             ball.y > rightPaddle.y && 
             ball.y < rightPaddle.y + paddleHeight)
        ) {
            ball.dx *= -1;
        }
        
        // Score points
        if (ball.x < 0) {
            aiScore++;
            resetBall();
        }
        if (ball.x > canvas.width) {
            playerScore++;
            resetBall();
        }
        
        // Draw score
        ctx.fillStyle = '#00FF00';
        ctx.font = '20px Courier New';
        ctx.fillText(`Player: ${playerScore}  AI: ${aiScore}`, canvas.width / 2 - 100, 30);
    }
    
    // Reset ball
    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx *= -1;
    }
    
    // Player paddle control
    document.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        leftPaddle.y = e.clientY - rect.top - paddleHeight / 2;
        
        // Boundary check
        if (leftPaddle.y < 0) leftPaddle.y = 0;
        if (leftPaddle.y + paddleHeight > canvas.height) {
            leftPaddle.y = canvas.height - paddleHeight;
        }
    });
    
    // Start game loop
    function animate() {
        gameLoop();
        requestAnimationFrame(animate);
    }
    
    animate();
}
