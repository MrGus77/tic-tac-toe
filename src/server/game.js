class TicTacToeGame {

    constructor() {
        this.board = Array(9).fill(null);
        this.players = [];
        this.currentPlayerIndex = null;
    }

    addPlayer(player) {
        if (this.players.length < 2 && !this.players.includes(player)) {
            this.players.push(player);
            return true;
        }
        return false;
    }

    getCurrentState() {
        return {
            board: this.board,
            players: this.players,
            currentPlayer: this.currentPlayerIndex !== null ? this.players[this.currentPlayerIndex] : null,
        };
    }

    makeMove(playerIndex, position) {
        if (this.currentPlayerIndex === playerIndex && !this.board[position]) {
            this.board[position] = this.currentPlayerIndex;
            this.switchPlayer();
            return true;
        }
        return false;
    }

    switchPlayer() {
        this.currentPlayerIndex = 1 - this.currentPlayerIndex; // Switch between 0 and 1
    }

    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ]

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

module.exports = TicTacToeGame;