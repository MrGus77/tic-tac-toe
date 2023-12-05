class TicTacToeGame {

    constructor() {
        this.board = Array(9).fill(null);
        this.players = [];
        this.currentPlayer = null;
    }

    addPlayer(player) {
        if (this.players.length < 2) {
            this.players.push(player);
            return true;
        }
        return false;
    }

    getCurrentState() {
        return {
            board: this.board,
            currentPlayer: this.currentPlayer,

        };
    }

    makeMove(player, position) {
        if (this.players.length === 2 && player === this.currentPlayer && !this.board[position]) {
            this.board[position] = player;
            this.switchPlayer();
            return true;
        }
        return false;
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;

            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                return this.board[a]; // Return the winner ('X' or 'O')
            }
        }

        // Check for a tie
        if (!this.board.includes(null)) {
            return 'T'; // Tie
        }

        return null; // No winner yet
    }

}

module.exports = TicTacToeGame;