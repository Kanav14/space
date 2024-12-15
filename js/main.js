document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const snakeBtn = document.getElementById('snake-btn');
    const pongBtn = document.getElementById('pong-btn');
    const memoryBtn = document.getElementById('memory-btn');
    const flappyBtn = document.getElementById('flappy-btn');

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
    flappyBtn.addEventListener('click', () => loadGame('./games/flappy-bird.js'));
});
