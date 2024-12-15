export function initGame(canvas) {
    const ctx = canvas.getContext('2d');
    
    // Radar/communication screen effect
    function drawRadarBackground() {
        ctx.fillStyle = '#000033';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Radar grid
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Scan line effect
        ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        const scanLineY = (Date.now() / 10) % canvas.height;
        ctx.fillRect(0, scanLineY, canvas.width, 5);
    }
    
    // Paddle settings (communication antennas)
    const paddleHeight = 100;
    const paddleWidth = 10;
    
    // Communication signal settings
    const signal = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 10,
        speed: 5,
        dx: 5,
        dy: 5
    };
    
    // Communication antennas
    const leftAntenna = {
        x: 0,
        y: canvas.height / 2 - paddleHeight / 2,
        speed: 10
    };
    
    const rightAntenna = {
        x: canvas.width - paddleWidth,
        y: canvas.height / 2 - paddleHeight / 2,
        speed: 10
    };
    
    // Score
    let groundControlScore = 0;
    let spaceStationScore = 0;
    
    // Game loop
    function gameLoop() {
        // Draw radar background
        drawRadarBackground();
        
        // Draw communication antennas
        ctx.fillStyle = '#00FFFF';
        ctx.fillRect(leftAntenna.x, leftAntenna.y, paddleWidth, paddleHeight);
        ctx.fillRect(rightAntenna.x, rightAntenna.y, paddleWidth, paddleHeight);
        
        // Draw communication signal
        ctx.beginPath();
        ctx.fillStyle = '#FFFFFF';
        ctx.arc(signal.x, signal.y, signal.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Move signal
        signal.x += signal.dx;
        signal.y += signal.dy;
        
        // Signal collision with top and bottom
        if (signal.y - signal.radius < 0 || signal.y + signal.radius > canvas.height) {
            signal.dy *= -1;
        }
        
        // AI antenna movement
        if (rightAntenna.y + paddleHeight / 2 < signal.y) {
            rightAntenna.y += rightAntenna.speed;
        } else {
            rightAntenna.y -= rightAntenna.speed;
        }
        
        // Boundary checks for antennas
        leftAntenna.y = Math.max(0, Math.min(canvas.height - paddleHeight, leftAntenna.y));
        rightAntenna.y = Math.max(0, Math.min(canvas.height - paddleHeight, rightAntenna.y));
        
        // Signal collision with antennas
        if (
            (signal.x - signal.radius < leftAntenna.x + paddleWidth && 
             signal.y > leftAntenna.y && 
             signal.y < leftAntenna.y + paddleHeight) ||
            (signal.x + signal.radius > rightAntenna.x && 
             signal.y > rightAntenna.y && 
             signal.y < rightAntenna.y + paddleHeight)
        ) {
            signal.dx *= -1;
        }
        
        // Score points
        if (signal.x < 0) {
            spaceStationScore++;
            resetSignal();
        }
        if (signal.x > canvas.width) {
            groundControlScore++;
            resetSignal();
        }
        
        // Draw score
        ctx.fillStyle = '#00FF00';
        ctx.font = '20px Courier New';
        ctx.fillText(`Ground Control: ${groundControlScore}  Space Station: ${spaceStationScore}`, 
            canvas.width / 2 - 200, 30);
    }
    
    // Reset signal
    function resetSignal() {
        signal.x = canvas.width / 2;
        signal.y = canvas.height / 2;
        signal.dx *= -1;
    }
    
    // Player antenna control
    document.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        leftAntenna.y = e.clientY - rect.top - paddleHeight / 2;
    });
    
    // Start game loop
    function animate() {
        gameLoop();
        requestAnimationFrame(animate);
    }
    
    animate();
}
