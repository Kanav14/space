document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const snakeBtn = document.getElementById('snake-btn');
    const pongBtn = document.getElementById('pong-btn');
    const memoryBtn = document.getElementById('memory-btn');
    const tetrisBtn = document.getElementById('tetris-btn');
    
    // Add shooting game button
    const shootingBtn = document.createElement('a');
    shootingBtn.href = '#';
    shootingBtn.classList.add('pixelated-button');
    shootingBtn.id = 'shooting-btn';
    shootingBtn.textContent = 'Play Space Shooter';
    
    // Add to game grid
    const gameGrid = document.querySelector('.game-grid');
    const shootingCard = document.createElement('div');
    shootingCard.classList.add('game-card');
    shootingCard.innerHTML = `
        <h2>Space Shooter</h2>
        ${shootingBtn.outerHTML}
        <p>Destroy incoming enemies!</p>
    `;
    gameGrid.appendChild(shootingCard);

    // Import game scripts dynamically
    function loadGame(gameScript) {
        // Clear previous game
        gameContainer.innerHTML = '';
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        gameContainer.appendChild(canvas);

        // Dynamically import and run the game
        import(gameScript)
            .then(module => {
                module.initGame(canvas);
            })
            .catch(err => {
                console.error('Game loading error:', err);
                gameContainer.innerHTML = '<p>Game failed to load</p>';
            });
    }

    // Event listeners for game buttons
    snakeBtn.addEventListener('click', () => loadGame('./games/snake-game.js'));
    pongBtn.addEventListener('click', () => loadGame('./games/pong-game.js'));
    memoryBtn.addEventListener('click', () => loadGame('./games/memory-game.js'));
    tetrisBtn.addEventListener('click', () => loadGame('./games/tetris-game.js'));
    
    // Add shooting game button listener
    document.getElementById('shooting-btn').addEventListener('click', () => loadGame('./games/shooting-game.js'));
});
