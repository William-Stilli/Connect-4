class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.player = null;
    }

    isEmpty() {
        return this.player === null;
    }

}

class Connect4 {
    constructor(rows, cols, ctx, movePlayed) {
        this.rows = rows;
        this.cols = cols;
        this.ctx = ctx;
        this.movePlayed = movePlayed;
        this.board = [];
        this.currentPlayer = 'R';
        this.winner = null;
        this.moves = 0;
        this.createBoard(ctx);
    }


    showMove(col, row) {

        if (this.winner !== null) {
            return movePlayed.innerHTML = (this.winner) === 'Draw' ? "Draw!" : `Player ${this.winner} wins!`;
        } else if (row === -1) {
            return movePlayed.innerHTML = `Column ${col + 1} is full!`;

        }
        return movePlayed.innerHTML = (this.currentPlayer) === 'Y' ? "Player Red turn" : "Player Yellow turn";
    }

    createBoard(ctx) {
        for (let row = 0; row < this.rows; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.board[row][col] = new Cell(row, col);
                ctx.beginPath();
                ctx.rect(col * 100, row * 100, 100, 100);
                ctx.stroke();
            }
        }
    }

    hoverEffect(col, ctx) {
        if (this.getAvailableRow(col) !== -1) {
            ctx.clearRect(0, 0, this.cols * 100, 100);

            for (let row = 0; row < this.rows; row++) {
                for (let c = 0; c < this.cols; c++) {
                    ctx.beginPath();
                    ctx.rect(c * 100, row * 100, 100, 100);
                    ctx.stroke();
                }
            }
            ctx.beginPath();
            ctx.arc(col * 100 + 50, 50, 40, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }

    play(col, ctx) {
        if (this.winner !== null) {
            return;
        }

        const row = this.getAvailableRow(col);
        if (row === -1) {
            this.showMove(col, row);
            return;
        }

        this.drawPiece(col, row, ctx);

        this.placePiece(col, row);

        this.showMove(col, row);

        this.switchPlayer();
    }

    drawPiece(col, row, ctx) {
        ctx.beginPath();
        ctx.arc(col * 100 + 50, row * 100 + 50, 40, 0, 2 * Math.PI);
        ctx.fillStyle = this.currentPlayer === 'R' ? 'red' : 'yellow';
        ctx.fill();
        ctx.stroke();
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'R' ? 'Y' : 'R';
    }

    getAvailableRow(col) {
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.board[row][col].isEmpty()) {
                return row;
            }
        }
        return -1; //return -1 quand la colonne est pleine
    }

    placePiece(col, row) {
        this.board[row][col].player = this.currentPlayer;
        this.moves++;
        return this.checkWinner(row, col);
    }

    checkWinner(row, col) {
        if (this.checkHorizontal(row) || this.checkVertical(col) || this.checkDiagonal(row, col)) {
            this.winner = this.currentPlayer;
            return true;
        } else if (this.checkGridIsFull()) {
            this.winner = 'Draw';
            return;
        }
        return false;
    }

    checkGridIsFull() {
        return this.moves === this.rows * this.cols;
    }

    checkHorizontal(row) {
        let count = 0;
        for (let col = 0; col < this.cols; col++) {
            if (this.board[row][col].player === this.currentPlayer) {
                count++;
                if (count === 4) {
                    return true;
                }
            } else {
                count = 0;
            }
        }
        return false;
    }

    checkVertical(col) {
        let count = 0;
        for (let row = 0; row < this.rows; row++) {
            if (this.board[row][col].player === this.currentPlayer) {
                count++;
                if (count === 4) {
                    return true;
                }
            } else {
                count = 0;
            }
        }
        return false;
    }

    checkDiagonal(row, col) {
        return this.checkPositiveSlopeDiagonal(row, col) || this.checkNegativeSlopeDiagonal(row, col);
    }

    checkPositiveSlopeDiagonal(row, col) {
        let count = 0;
        let r = row;
        let c = col;
        while (r > 0 && c > 0) {
            r--;
            c--;
        }
        while (r < this.rows && c < this.cols) {
            count = (this.board[r][c].player === this.currentPlayer) ? count + 1 : 0;
            if (count >= 4) return true;
            r++;
            c++;
        }
        return false;
    }

    checkNegativeSlopeDiagonal(row, col) {
        let count = 0;
        let r = row;
        let c = col;
        while (r > 0 && c < this.cols - 1) {
            r--;
            c++;
        }
        while (r < this.rows && c >= 0) {
            count = (this.board[r][c].player === this.currentPlayer) ? count + 1 : 0;
            if (count >= 4) return true;
            r++;
            c--;
        }
        return false;
    }
}

export { Connect4 };
