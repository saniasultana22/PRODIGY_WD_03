const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const aiBtn = document.getElementById('aiBtn');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
let aiMode = false;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function handleCellClick(e) {
  const clickedCell = e.target;
  const clickedIndex = parseInt(clickedCell.getAttribute('data-index'));

  if (gameState[clickedIndex] !== '' || !gameActive) return;

  makeMove(clickedIndex, currentPlayer);

  if (aiMode && gameActive && currentPlayer === 'O') {
    setTimeout(aiMove, 500);
  }
}

function makeMove(index, player) {
  gameState[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player.toLowerCase());

  checkResult();
}

function checkResult() {
  let roundWon = false;

  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (
      gameState[a] &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c]
    ) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `🏆 Player ${currentPlayer} Wins!`;
    gameActive = false;
    return;
  }

  if (!gameState.includes('')) {
    statusText.textContent = `🤝 It's a Draw!`;
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function aiMove() {
  let availableSpots = gameState
    .map((val, index) => (val === '' ? index : null))
    .filter(val => val !== null);

  if (availableSpots.length === 0) return;

  let randomIndex = availableSpots[Math.floor(Math.random() * availableSpots.length)];
  makeMove(randomIndex, 'O');
}

function restartGame() {
  currentPlayer = 'X';
  gameActive = true;
  gameState = ['', '', '', '', '', '', '', '', ''];
  statusText.textContent = `Player X's turn`;

  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o');
  });
}

function setMode(isAI) {
  aiMode = isAI;
  twoPlayerBtn.classList.toggle('active', !isAI);
  aiBtn.classList.toggle('active', isAI);
  restartGame();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
twoPlayerBtn.addEventListener('click', () => setMode(false));
aiBtn.addEventListener('click', () => setMode(true));