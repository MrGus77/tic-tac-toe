const boardElement = document.getElementById("board");
const cells = [];

function retrieveUsername() {
  return localStorage.getItem("username");
}

// Create the Tic-Tac-Toe board
for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cells.push(cell);

  cell.addEventListener("click", async () => {
    await makeMove(i);
  });

  boardElement.appendChild(cell);
}

// function updateBoard(board, players, currentPlayer) {
//   for (let i = 0; i < 9; i++) {
//     cells[i].innerText = players[board[i]] || ""; // Use player name instead of 'X' or 'O'
//   }

//   // Highlight current player
//   cells.forEach((cell) => (cell.style.backgroundColor = ""));

//   if (currentPlayer) {
//     const playerCells = board.reduce(
//       (acc, val, index) => (val === currentPlayer ? [...acc, index] : acc),
//       []
//     );
//     playerCells.forEach(
//       (index) => (cells[index].style.backgroundColor = "lightyellow")
//     );
//   }
// }


// function handleGameOver(winner) {
//   if (winner === "T") {
//     alert("It's a tie!");
//   } else {
//     alert(`Player ${winner} wins!`);
//   }
// }

async function makeMove(position) {
  const username = retrieveUsername();

  console.log("makeMove", { position, username });

  const response = await fetch("/move", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      position,
      username,
    }),
  });


  // TO-DO: Handle response...
  console.log(response);

  // updateBoard(
  //   response.state.board,
  //   response.state.players,
  //   response.state.currentPlayer
  // );
}



