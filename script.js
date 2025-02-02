const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const gameContainer = document.getElementById('gameContainer');
const currentScoreDisplay = document.getElementById('currentScore');
const timerDisplay = document.getElementById('timerDisplay');
const message = document.getElementById('message');
const backgroundMusic = document.getElementById('backgroundMusic');
const catchSound = document.getElementById('catchSound');
const missSound = document.getElementById('missSound');

const canvasWidth = 300;
const canvasHeight = 600;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

const platformWidth = 80;
const platformHeight = 10;
const blockSize = 30;
const colors = ['#00ff9f', '#00b8ff', '#001eff', '#bd00ff', '#d600ff'];

let platformX = (canvasWidth - platformWidth) / 2;
let blocks = [];
let score = 0;
let timeLeft = 120; // 2 minutes in seconds
let gameInterval;
let timerInterval;

function drawPlatform() {
  context.fillStyle = '#00ff9f';
  context.fillRect(platformX, canvasHeight - platformHeight, platformWidth, platformHeight);
}

function drawBlocks() {
  blocks.forEach((block, index) => {
    context.fillStyle = block.color;
    context.fillRect(block.x, block.y, blockSize, blockSize);
    block.y += 3; // Block falling speed

    // Check if block is caught
    if (
      block.y + blockSize >= canvasHeight - platformHeight &&
      block.x >= platformX &&
      block.x <= platformX + platformWidth
    ) {
      blocks.splice(index, 1);
      score += 10;
      currentScoreDisplay.textContent = score;
      catchSound.play();
      if (score >= 1000) {
        endGame(true);
      }
    }

    // Check if block is missed
    if (block.y + blockSize >= canvasHeight) {
      blocks.splice(index, 1);
      missSound.play();
      endGame(false);
    }
  });
}

function createBlock() {
  const x = Math.random() * (canvasWidth - blockSize);
  const color = colors[Math.floor(Math.random() * colors.length)];
  blocks.push({ x, y: 0, color });
}

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  if (timeLeft <= 0) {
    endGame(false);
  } else {
    timeLeft--;
  }
}

function endGame(success) {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  if (success) {
    message.style.display = 'block';
    createBalloons();
  } else {
    alert('Game Over! Try again.');
  }
}

function createBalloons() {
  for (let i = 0; i < 50; i++) {
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    balloon.style.left = `${Math.random() * 100}vw`;
    balloon.style.animationDuration = `${Math.random() * 5 + 3}s`;
    document.body.appendChild(balloon);
  }
}

function gameLoop() {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  drawPlatform();
  drawBlocks();
}

startButton.addEventListener('click', () => {
  startButton.style.display = 'none';
  gameContainer.style.display = 'block';
  backgroundMusic.play().catch(() => {
    alert("Tap anywhere to start the music!");
  });
  gameInterval = setInterval(gameLoop, 20);
  timerInterval = setInterval(updateTimer, 1000);
  setInterval(createBlock, 1000); // Create a new block every second
});

// Mobile Controls
let touchStartX = 0;

canvas.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const touchX = e.touches[0].clientX;
  const deltaX = touchX - touchStartX;
  platformX += deltaX;
  platformX = Math.max(0, Math.min(canvasWidth - platformWidth, platformX));
  touchStartX = touchX;
});

// Fix for autoplay policy
document.body.addEventListener('click', () => {
  backgroundMusic.play();
  document.getElementById('loadingScreen').classList.add('hidden');
  document.querySelector('.container').classList.remove('hidden');
});