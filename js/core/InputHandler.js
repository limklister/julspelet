class InputHandler {
    constructor(game) {
        this.game = game;
        this.setupInputs();
    }

    setupInputs() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        if (this.game.gameOver) {
            if (e.key === 'r' || e.key === 'R') {
                this.game.resetGame();
            }
            return;
        }

        switch(e.key) {
            case 'ArrowLeft':
                this.game.player.move(-1);
                break;
            case 'ArrowRight':
                this.game.player.move(1);
                break;
            case ' ':
            case 'ArrowUp':
                this.game.player.jump();
                break;
        }
    }

    handleKeyUp(e) {
        if (!this.game.gameOver && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
            this.game.player.move(0);
        }
    }
}