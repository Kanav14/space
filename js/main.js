document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const invadersBtn = document.getElementById('invaders-btn');
    const asteroidBtn = document.getElementById('asteroid-btn');
    const lunarBtn = document.getElementById('lunar-btn');
    const rocketBtn = document.getElementById('rocket-btn');

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
    invadersBtn.addEventListener('click', () => loadGame('./games/space-invaders.js'));
    asteroidBtn.addEventListener('click', () => loadGame('./games/asteroid-dodger.js'));
    lunarBtn.addEventListener('click', () => loadGame('./games/lunar-lander.js'));
    rocketBtn.addEventListener('click', () => loadGame('./games/rocket-rescue.js'));
});
