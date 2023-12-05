const ws = new WebSocket('ws://localhost:3000');
const joinEndpoint = 'http://localhost:3000/join';
const stateEndpoint = 'http://localhost:3000/state';

const boardElement = document.getElementById('board');
const cells = [];

// Create the Tic-Tac-Toe board
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cells.push(cell);

    cell.addEventListener('click', () => {
        makeMove(i);
    });

    boardElement.appendChild(cell);
}

function makeMove(position) {
    ws.send(JSON.stringify({ type: 'makeMove', position }));
}

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    switch (data.type) {
        case 'gameState':
            updateBoard(data.data.board, data.data.players, data.data.currentPlayer);
            break;
        case 'gameOver':
            handleGameOver(data.data.winner);
            break;
        default:
            console.error('Unknown message type:', data.type);
    }
};

function updateBoard(board, players, currentPlayer) {
    for (let i = 0; i < 9; i++) {
        cells[i].innerText = players[board[i]] || ''; // Use player name instead of 'X' or 'O'
    }

    // Highlight current player
    cells.forEach(cell => cell.style.backgroundColor = '');

    if (currentPlayer) {
        const playerCells = board.reduce((acc, val, index) => (val === currentPlayer ? [...acc, index] : acc), []);
        playerCells.forEach(index => cells[index].style.backgroundColor = 'lightyellow');
    }

}

function handleGameOver(winner) {
    if (winner === 'T') {
      alert('It\'s a tie!');
    } else {
      alert(`Player ${winner} wins!`);
    }
  }