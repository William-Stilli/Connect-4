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
    constructor(rows, cols, ctx, ctxBall, movePlayed) {
        this.rows = rows;
        this.cols = cols;
        this.ctx = ctx;
        this.ctxBall = ctxBall;
        this.movePlayed = movePlayed;
        this.board = [];
        this.currentPlayer = 'R';
        this.winner = null;
        this.moves = 0;
        this.animationIsFinished = true;
        this.createBoard(ctx, ctxBall);
    }


    displayCurrentTurn(col, row) {

        if (this.winner !== null) {
            return movePlayed.innerHTML = (this.winner) === 'Draw' ? "Draw!" : `Player ${this.winner} wins!`;
        } else if (row === -1) {
            return movePlayed.innerHTML = `Column ${col + 1} is full!`;

        }
        return movePlayed.innerHTML = (this.currentPlayer) === 'Y' ? "Player Red turn" : "Player Yellow turn";
    }

    createBoard(ctx, ctxBall) {
        for (let row = 0; row < this.rows; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.board[row][col] = new Cell(row, col);
                ctx.beginPath();
                ctx.rect(col * 100, row * 100, 100, 100);
                ctxBall.stroke();
                ctx.closePath();
            }
        }
    }

    hoverEffect(col, ctx, ctxBall) {
        if (this.getAvailableRow(col) !== -1 && this.winner === null) {
            ctx.clearRect(0, 0, this.cols * 100, 100);

            ctxBall.beginPath();
            ctxBall.arc(col * 100 + 50, 50, 40, 0, 2 * Math.PI);
            ctxBall.stroke();
            ctxBall.closePath();

            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    ctx.beginPath();
                    ctx.rect(c * 100, r * 100, 100, 100);
                    if (!this.board[r][c].isEmpty()) {
                        ctxBall.beginPath();
                        ctxBall.arc(c * 100 + 50, r * 100 + 50, 40, 0, 2 * Math.PI);
                        ctxBall.fillStyle = this.board[r][c].player === 'R' ? 'red' : 'yellow';
                        ctxBall.fill();
                        ctxBall.stroke();
                        ctxBall.closePath();
                    }
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    }

    animateWinningCombination(row, col, ctxBall) {
        let count = 0;
        if (this.checkHorizontal(row)) {
            for (let c = 0; c < this.cols; c++) {
                if (this.board[row][c].player === this.currentPlayer && count < 4 && (this.board[row][c + 1].player === this.currentPlayer || this.board[row][c + 1].player === null)) {
                    ctxBall.beginPath();
                    ctxBall.arc(c * 100 + 50, row * 100 + 50, 40, 0, 2 * Math.PI);
                    ctxBall.strokeStyle = 'Blue';
                    ctxBall.lineWidth = 5;
                    ctxBall.stroke();
                    ctxBall.closePath();
                    count++;
                }
            }
        } else if (this.checkVertical(col)) {
            for (let r = 0; r < this.rows; r++) {
                if (this.board[r][col].player === this.currentPlayer && count < 4) {
                    ctxBall.beginPath();
                    ctxBall.arc(col * 100 + 50, r * 100 + 50, 40, 0, 2 * Math.PI);
                    ctxBall.strokeStyle = 'Blue';
                    ctxBall.lineWidth = 5;
                    ctxBall.stroke();
                    ctxBall.closePath();
                    count++;
                }
            }
        }
        else if (this.checkPositiveSlopeDiagonal(row, col)) {
            let r = row;
            let c = col;
            while (r > 0 && c > 0) {
                r--;
                c--;
            }
            while (r < this.rows && c < this.cols) {
                if (count < 4 && this.board[r][c].player === this.currentPlayer) {
                    console.log("je passe le test positif");
                    ctxBall.beginPath();
                    ctxBall.arc(c * 100 + 50, r * 100 + 50, 40, 0, 2 * Math.PI);
                    ctxBall.strokeStyle = 'Blue';
                    ctxBall.lineWidth = 5;
                    ctxBall.stroke();
                    ctxBall.closePath();
                    count++;
                }
                r++;
                c++;
            }
        }
        else if (this.checkNegativeSlopeDiagonal(row, col)) {
            let r = row;
            let c = col;
            while (r > 0 && c < this.cols - 1) {
                r--;
                c++;
            }
            while (r < this.rows && c >= 0) {
                if (count < 4 && this.board[r][c].player === this.currentPlayer) {
                    console.log("je passe le test negatif");
                    ctxBall.beginPath();
                    ctxBall.arc(c * 100 + 50, r * 100 + 50, 40, 0, 2 * Math.PI);
                    ctxBall.strokeStyle = 'Blue';
                    ctxBall.lineWidth = 5;
                    ctxBall.stroke();
                    ctxBall.closePath();
                    count++;
                }
                r++;
                c--;
            }
        }
    }

    animatePiece(col, ctx, ctxBall) {
        this.animationIsFinished = false;
        const row = this.getAvailableRow(col);
        if (row !== -1) {
            const x = col * 100 + 50;
            let y = -50;
            const radius = 35;
            const speed = 9;
            const animate = () => {
                ctx.clearRect(x - radius - 1, y - radius - 10, radius * 2 + 2, radius * 2);
                ctxBall.beginPath();
                ctxBall.arc(x, y, radius, 0, 2 * Math.PI);
                ctxBall.fillStyle = this.currentPlayer === 'R' ? 'red' : 'yellow';
                ctxBall.fill();
                ctxBall.stroke();
                ctxBall.closePath();

                this.hoverEffect(col, this.ctx, this.ctxBall);

                for (let r = 0; r < this.rows; r++) {
                    for (let c = 0; c < this.cols; c++) {
                        ctx.beginPath();
                        ctx.rect(c * 100, r * 100, 100, 100);
                        if (!this.board[r][c].isEmpty()) {
                            ctxBall.beginPath();
                            ctxBall.arc(c * 100 + 50, r * 100 + 50, 40, 0, 2 * Math.PI);
                            ctxBall.fillStyle = this.board[r][c].player === 'R' ? 'red' : 'yellow';
                            ctxBall.fill();
                            ctxBall.stroke();
                            ctxBall.closePath();
                        }
                        ctx.stroke();
                        ctx.closePath();
                    }
                }

                y += speed;

                if (y < row * 100 + 50) {
                    requestAnimationFrame(animate);
                } else {
                    this.drawPiece(col, row, ctxBall);
                    this.placePiece(col, row);
                    this.displayCurrentTurn(col, row);
                    this.switchPlayer();
                    this.animationIsFinished = true;
                }
            };
            animate();
        }
    }

    play(col, ctx, ctxBall) {
        if (this.animationIsFinished) {
            if (this.winner !== null) {
                return;
            }

            const row = this.getAvailableRow(col);
            if (row === -1) {
                this.displayCurrentTurn(col, row);
                return;
            }

            this.animatePiece(col, ctx, ctxBall);
        }
    }

    drawPiece(col, row, ctxBall) {
        ctxBall.beginPath();
        ctxBall.arc(col * 100 + 50, row * 100 + 50, 40, 0, 2 * Math.PI);
        ctxBall.fillStyle = this.currentPlayer === 'R' ? 'red' : 'yellow';
        ctxBall.fill();
        ctxBall.stroke();
        ctxBall.closePath();
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
        return -1;
    }

    placePiece(col, row) {
        this.board[row][col].player = this.currentPlayer;
        this.moves++;
        return this.checkWinner(row, col);
    }

    checkWinner(row, col) {
        if (this.checkHorizontal(row) || this.checkVertical(col) || this.checkDiagonal(row, col)) {
            this.winner = this.currentPlayer;
            this.animateWinningCombination(row, col, this.ctxBall);
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