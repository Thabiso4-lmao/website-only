document.addEventListener('DOMContentLoaded', () => {
  const cells = Array.from(document.querySelectorAll('.cell'));
  const statusEl = document.getElementById('status');
  const restartBtn = document.getElementById('restartBtn');
  const resetBtn = document.getElementById('resetBtn');
  const scoreXEl = document.getElementById('scoreX');
  const scoreOEl = document.getElementById('scoreO');
  const scoreDEl = document.getElementById('scoreD');

  const resultScreen = document.getElementById('resultScreen');
  const resultMessage = document.getElementById('resultMessage');
  const newGameBtn = document.getElementById('newGameBtn');

  let board = Array(9).fill(null);
  let current = 'X';
  let running = true;
  let scores = { X: 0, O: 0, D: 0 };

  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  function updateStatus() {
    statusEl.textContent = `Player ${current}'s turn`;
  }

  function updateScores() {
    scoreXEl.textContent = scores.X;
    scoreOEl.textContent = scores.O;
    scoreDEl.textContent = scores.D;
  }

  function resetBoardUI() {
    cells.forEach(c => {
      c.className = 'cell';
      c.textContent = '';
      c.disabled = false;
    });
  }

  function checkResult() {
    for (const combo of wins) {
      const [a,b,c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], combo };
      }
    }
    if (board.every(Boolean)) return { winner: 'D' };
    return null;
  }

  function playAt(index) {
    if (!running || board[index]) return;
    board[index] = current;
    const el = cells[index];
    el.textContent = current;
    el.classList.add(current === 'X' ? 'mark-x' : 'mark-o');
    el.disabled = true;

    const res = checkResult();
    if (res) {
      running = false;
      if (res.winner === 'D') {
        scores.D++;
        resultMessage.textContent = "It's a Draw!";
      } else {
        scores[res.winner]++;
        resultMessage.textContent = `Player ${res.winner} Wins!`;
        res.combo.forEach(i => {
          cells[i].classList.add('win');
          if (res.winner === 'O') cells[i].classList.add('o');
        });
      }
      updateScores();
      resultScreen.classList.remove('hidden');
      return;
    }

    current = current === 'X' ? 'O' : 'X';
    updateStatus();
  }

  // event listeners
  cells.forEach((c, i) => c.addEventListener('click', () => playAt(i)));
  restartBtn.addEventListener('click', () => {
    board.fill(null);
    resetBoardUI();
    current = 'X';
    running = true;
    updateStatus();
  });
  resetBtn.addEventListener('click', () => {
    scores = { X: 0, O: 0, D: 0 };
    updateScores();
    restartBtn.click();
  });
  newGameBtn.addEventListener('click', () => {
    resultScreen.classList.add('hidden');
    restartBtn.click();
  });

  // init
  updateScores();
  resetBoardUI();
  updateStatus();
});
