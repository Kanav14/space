export function initGame(canvas) {
  const ctx = canvas.getContext('2d');

  // Player rocket
  const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 40,
    height: 60,
    speed: 5
  };

  // Stranded astronauts
  const astronauts = [];

  // Create astronaut
  function createAstronaut() {
    return {
      x: Math.random() * (canvas.width - 30),
      y: -30,
      width: 30,
      height: 30,
      speed: Math.random() * 2 + 1
    };
  }

  // Game state
  let score = 0;

  // Game loop
  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Spawn astronauts
    if (Math.random() < 0.03) astronauts.push(createAstronaut());

    // Move and draw astronauts
    astronauts.forEach((astronaut, index) => {
      astronaut.y += astronaut.speed;

      ctx.fillStyle = '#FFFF00';
      ctx.fillRect(astronaut.x, astronaut.y, astronaut.width, astronaut.height);

      // Remove off-screen astronauts
      if (astronaut.y > canvas.height) {
        astronauts.splice(index, 1);
        score++;
      }

      // Collision detection
      if (
        player.x < astronaut.x + astronaut.width &&
        player.x + player.width > astronaut.x &&
        player.y < astronaut.y + astronaut.height &&
        player.y + player.height > astronaut.y
      ) {
        astronauts.splice(index, 1);
        score += 5;
      }
    });

    // Draw score
    ctx.fillStyle = '#00FF00';
    ctx.font = '20px Courier New';
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Player movement
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' && player.x > 0) player.x -= player.speed;
      if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) player.x += player.speed;
    });

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}
