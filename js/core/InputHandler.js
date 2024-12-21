class InputHandler {
    constructor(game) {
        this.game = game;
        this.setupInputs();
        this.setupTouchControls();
        this.activeKeys = new Set();
    }

    setupInputs() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    setupTouchControls() {
        // Get button elements
        const leftBtn = document.getElementById('btn-left');
        const rightBtn = document.getElementById('btn-right');
        const jumpBtn = document.getElementById('btn-jump');

        // Touch start events
        if (leftBtn) {
            ['touchstart', 'mousedown'].forEach(eventType => {
                leftBtn.addEventListener(eventType, (e) => {
                    e.preventDefault();
                    this.game.player.move(-1);
                });
            });
        }

        if (rightBtn) {
            ['touchstart', 'mousedown'].forEach(eventType => {
                rightBtn.addEventListener(eventType, (e) => {
                    e.preventDefault();
                    this.game.player.move(1);
                });
            });
        }

        if (jumpBtn) {
            ['touchstart', 'mousedown'].forEach(eventType => {
                jumpBtn.addEventListener(eventType, (e) => {
                    e.preventDefault();
                    this.game.player.jump();
                });
            });
        }

        // Touch end events
        if (leftBtn) {
            ['touchend', 'mouseup'].forEach(eventType => {
                leftBtn.addEventListener(eventType, (e) => {
                    e.preventDefault();
                    if (!this.activeKeys.has('ArrowRight')) {
                        this.game.player.move(0);
                    }
                });
            });
        }

        if (rightBtn) {
            ['touchend', 'mouseup'].forEach(eventType => {
                rightBtn.addEventListener(eventType, (e) => {
                    e.preventDefault();
                    if (!this.activeKeys.has('ArrowLeft')) {
                        this.game.player.move(0);
                    }
                });
            });
        }

        // Prevent default touch behaviors
        document.addEventListener('touchmove', (e) => {
            if (e.target.tagName !== 'SELECT' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
            }
        }, { passive: false });
    }

    handleKeyDown(e) {
        if (this.game.gameOver) {
            if (e.key === 'r' || e.key === 'R') {
                this.game.resetGame();
            }
            return;
        }

        this.activeKeys.add(e.key);

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
        this.activeKeys.delete(e.key);
        
        if (!this.game.gameOver && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
            // Only stop if no other movement key is pressed
            if (!this.activeKeys.has('ArrowLeft') && !this.activeKeys.has('ArrowRight')) {
                this.game.player.move(0);
            }
        }
    }
}