// tetris-game.js
export function initGame(canvas) {
    const ctx = canvas.getContext('2d');
    const gridSize = 30;
    const cols = Math.floor(canvas.width / gridSize);
    const rows = Math.floor(canvas.height / gridSize);

    // Tetris pieces
    const pieces = [
        [[1,1,1,1]],
        [[1,1],[1,1]],
        [[1,1,1],[0,1,0]],
        [[1,1,1],[1,0,0]],
        [[1,1,1],[0,0,1]],
        [[1,1,0],[0,1,1]],
        [[0,1,1],[1,1,0]]
    ];

    // Sound effects (local to avoid import issues)
    const sounds = {
        rotate: new Audio('https://opengameart.org/sites/default/files/Rotate_0.wav'),
        clear: new Audio('https://opengameart.org/sites/default/files/8-bit%20powerup%20finished.wav'),
        gameOver: new Audio('https://freesound.org/data/previews/171/171848_2437798-lq.mp3')
    };

    let board = Array(rows).fill().map(() => Array(cols).fill(0));
    let currentPiece = null;
    let currentPosition = { x: 0, y: 0 };
    let score = 0;
    let gameOver = false;
    let dropSpeed = 1000; // 1 second per drop
    let lastDropTime = 0;

    function drawBoard() {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = '#333';
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                ctx.strokeRect(x * gridSize, y * gridSize, gridSize, gridSize);
            }
        }

        // Draw placed pieces
        board.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    ctx.fillStyle = '#0F0';
                    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
                }
            });
        });

        // Draw current piece
        if (currentPiece) {
            currentPiece.forEach((row, dy) => {
                row.forEach((value, dx) => {
                    if (value) {
                        ctx.fillStyle = '#00F';
                        ctx.fillRect(
                            (currentPosition.x + dx) * gridSize, 
                            (currentPosition.y + dy) * gridSize, 
                            gridSize, 
                            gridSize
                        );
                    }
                });
            });
        }

        // Draw score
        ctx.fillStyle = '#0F0';
        ctx.font = '20px "Press Start 2P"';
        ctx.fillText(`Score: ${score}`, 10, 30);

        // Draw game over
        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#F00';
            ctx.font = '40px "Press Start 2P"';
            ctx.fillText('GAME OVER', canvas.width / 2 - 150, canvas.height / 2);
            ctx.font = '20px "Press Start 2P"';
            ctx.fillText('Click to Restart', canvas.width / 2 - 100, canvas.height / 2 + 50);
        }
    }

    function createPiece() {
        const piece = pieces[Math.floor(Math.random() * pieces.length)];
        currentPiece = piece;
        currentPosition = { 
            x: Math.floor(cols / 2) - Math.floor(piece[0].length / 2), 
            y: 0 
        };

        // Check for game over
        if (checkCollision()) {
            gameOver = true;
            sounds.gameOver.play();
        }
    }

    function movePiece(dx, dy) {
        currentPosition.x += dx;
        currentPosition.y += dy;

        if (checkCollision()) {
            currentPosition.x -= dx;
            currentPosition.y -= dy;

            if (dy > 0) {
                placePiece();
                clearLines();
                createPiece();
            }
        }
    }

    function checkCollision() {
        return currentPiece.some((row, dy) => {
            return row.some((value, dx) => {
                if (!value) return false;
                const newX = currentPosition.x + dx;
                const newY = currentPosition.y + dy;
                return (
                    newX < 0 || 
                    newX >= cols || 
                    newY >= rows || 
                    (newY >= 0 && board[newY][newX])
                );
            });
        });
    }

    function placePiece() {
        currentPiece.forEach((row, dy) => {
            row.forEach((value, dx) => {
                if (value) {
                    board[currentPosition.y + dy][currentPosition.x + dx] = 1;
                }
            });
        });
    }

    function clearLines() {
        let linesCleared = 0;
        for (let y = rows - 1; y >= 0; y--) {
            if (board[y].every(cell => cell)) {
                board.splice(y, 1);
                board.unshift(Array(cols).fill(0));
                linesCleared++;
                y++; // Check the same row again
                
                // Play line clear sound
                sounds.clear.play();
            }
        }

        // Scoring
        switch(linesCleared) {
            case 1: score += 100; break;
            case 2: score += 300; break;
            case 3: score += 500; break;
            case 4: score += 800; break;
        }
    }

    function rotatePiece() {
        const rotated = currentPiece[0].map((_, index) => 
            currentPiece.map(row => row[index]).reverse()
        );
        const prevPiece = currentPiece;
        currentPiece = rotated;

        // Play rotate sound
        sounds.rotate.play();

        if (checkCollision()) {
            currentPiece = prevPiece;
        }
    }

    function gameLoop(timestamp) {
        if (!lastDropTime) lastDropTime = timestamp;
        
        if (timestamp - lastDropTime > dropSpeed) {
            movePiece(0, 1);
            lastDropTime = timestamp;
        }

        drawBoard();
        
        if (!gameOver) {
            requestAnimationFrame(gameLoop);
        }
    }

    // Reset game function
    function resetGame() {
        board = Array(rows).fill().map(() => Array(cols).fill(0));
        score = 0;
        gameOver = false;
        lastDropTime = 0;
        createPiece();
        requestAnimationFrame(gameLoop);
    }

    // Controls
    canvas.addEventListener('click', () => {
        if (gameOver) {
            resetGame();
        } else {
            rotatePiece();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (gameOver) return;

        switch(e.key) {
            case 'ArrowLeft':
                movePiece(-1, 0);
                break;
            case 'ArrowRight':
                movePiece(1, 0);
                break;
            case 'ArrowDown':
                movePiece(0, 1);
                break;
            case 'ArrowUp':
                rotatePiece();
                break;
        }
    });

    // Start the game
    createPiece();
    requestAnimationFrame(gameLoop);
}
