import cloneDeep from "lodash/cloneDeep.js";

export default class GameController {
  constructor() {
    this.board = Array(9).fill(null);
    this.players = [];
    this.currentPlayerIndex = 0;
  }

  addPlayer(player) {
    if (this.players.length < 2 && !this.players.includes(player)) {
      this.players.push(player);
      return true;
    }
    return false;
  }

  getCurrentState() {
    const clonedGame = cloneDeep(this);

    return {
      board: clonedGame.board,
      players: clonedGame.players,
      currentPlayer:
        clonedGame.currentPlayerIndex !== null
          ? clonedGame.players[clonedGame.currentPlayerIndex]
          : null,
    };
  }

  makeMove(playerIndex, position) {
    const isPlayerTurn = this.currentPlayerIndex === playerIndex;
    const isPositionEmpty = !this.board[position];

    console.log("makeMove", {
      playerIndex,
      position,
      currentTurnIndex: this.currentPlayerIndex,
      isPlayerTurn,
      isPositionEmpty,
    });

    if (isPlayerTurn && isPositionEmpty) {
      this.board[position] = this.currentPlayerIndex;
      this.switchPlayer();
      return true;
    }

    return false;
  }

  switchPlayer() {
    this.currentPlayerIndex = 1 - this.currentPlayerIndex;
  }

  checkWinner() {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        this.board[a] !== null &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        return this.players[this.board[a]]; // Return the winner's name
      }
    }
  }
}
