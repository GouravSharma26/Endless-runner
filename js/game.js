// SELECTORS
const player = document.getElementById('player');
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const gameOverScreen = document.getElementById('gameOver');
const finalScore = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

// GAME VARIABLES
let isJumping = false;
let gravity = 0.9;
let velocity = 0;
let position = 0;

let gameRunning = false;
let obstacles = [];
let obstacleSpawnInterval;
let score = 0;
let scoreInterval;

// START GAME FUNCTION
function startGame() {
  startBtn.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  player.style.bottom = '50px';
  position = 0;
  velocity = 0;
  score = 0;
  obstacles.forEach(ob => ob.element.remove());
  obstacles = [];
  gameRunning = true;

  scoreInterval = setInterval(updateScore, 100);
  obstacleSpawnInterval = setInterval(createObstacle, 2000);

  requestAnimationFrame(gameLoop);
}

// JUMP FUNCTION
function jump() {
  if (!isJumping) {
    isJumping = true;
    velocity = -20;
    // Optional: play jump sound here
  }
}

// UPDATE SCORE
function updateScore() {
  if (!gameRunning) return;
  score++;
  scoreDisplay.textContent = 'Score: ' + score;
}

// CREATE OBSTACLES
function createObstacle() {
    if (!gameRunning) return;
  
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
  
    // Randomize obstacle size
    const width = Math.floor(Math.random() * 30) + 30;  // Between 30px and 60px
    const height = Math.floor(Math.random() * 30) + 30; // Between 30px and 60px
    obstacle.style.width = width + 'px';
    obstacle.style.height = height + 'px';
  
    // Randomize Y position (optional)
    const groundLevel = 50; // base ground height
    const jumpHeight = 100; // how high obstacles can float above ground
    const bottomPosition = groundLevel + Math.floor(Math.random() * jumpHeight);
    obstacle.style.bottom = bottomPosition + 'px';
  
    // Randomize color/type (can also assign images later)
    const colors = ['#f44336', '#ff9800', '#9c27b0', '#00bcd4'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    obstacle.style.backgroundColor = color;
  
    // Start from the right edge
    obstacle.style.left = '100vw';
  
    gameArea.appendChild(obstacle);
  
    obstacles.push({
      element: obstacle,
      x: window.innerWidth,
      width: width,
      height: height,
      bottom: bottomPosition
    });
  }

// MOVE OBSTACLES & COLLISION DETECTION
function moveObstacles() {
    obstacles.forEach((ob, index) => {
      ob.x -= 5; // move left
      ob.element.style.left = ob.x + 'px';
  
      // Collision detection (improved)
      const playerLeft = 50; // fixed x-position of player
      const playerRight = playerLeft + player.offsetWidth;
      const playerBottom = 50 - position;
      const playerTop = playerBottom + player.offsetHeight;
  
      const obstacleLeft = ob.x;
      const obstacleRight = ob.x + ob.width;
      const obstacleBottom = ob.bottom;
      const obstacleTop = obstacleBottom + ob.height;
  
      const isColliding = !(
        playerRight < obstacleLeft ||
        playerLeft > obstacleRight ||
        playerTop < obstacleBottom ||
        playerBottom > obstacleTop
      );
  
      if (isColliding) {
        endGame();
      }
  
      // Remove off-screen obstacles
      if (ob.x < -ob.width) {
        ob.element.remove();
        obstacles.splice(index, 1);
      }
    });
  }
  

// GAME LOOP (runs every frame)
function gameLoop() {
  if (!gameRunning) return;

  velocity += gravity;
  position += velocity;

  if (position > 0) {
    position = 0;
    isJumping = false;
  }

  player.style.bottom = 50 - position + 'px';

  moveObstacles();

  requestAnimationFrame(gameLoop);
}

// END GAME FUNCTION
function endGame() {
  gameRunning = false;
  clearInterval(obstacleSpawnInterval);
  clearInterval(scoreInterval);

  finalScore.textContent = score;
  gameOverScreen.classList.remove('hidden');

  // Optional: play game over sound here
}

// EVENT LISTENERS
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    jump();
  }
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
