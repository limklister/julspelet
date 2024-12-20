class Game {
    constructor() {
        this.initCanvas();
        this.initGameObjects();
        this.initGameSystems();
        this.initRestartListener();
        this.gameLoop();
    }

    initCanvas() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
    }

    initGameObjects() {
        this.player = new Player(100, this.canvas.height - 100);
        this.player.game = this; // Give player reference to game
        this.platformManager = new PlatformManager(this);
        this.snowmanManager = new SnowmanManager(this);
        this.santaManager = new SantaManager(this);
        this.ui = new UI();
        
        this.platformManager.generateStartingPlatforms();
        this.snowmanManager.generateInitialSnowmen();
        this.santaManager.generateInitialSantas();
    }

    initGameSystems() {
        this.gameOver = false;
        this.camera = new Camera(this);
        this.inputHandler = new InputHandler(this);
        this.collisionHandler = new CollisionHandler(this);
        this.renderer = new Renderer(this);
    }

    // New method to add restart listener
    initRestartListener() {
        window.addEventListener('keydown', (event) => {
            // Restart game on 'R' or 'r' key when game is over
            if ((this.gameOver) && (event.key === 'r' || event.key === 'R')) {
                this.resetGame();
            }
        });
    }

    resetGame() {
        // Reset all game state
        this.gameOver = false;
        this.camera.reset();
        
        // Reset player
        this.player = new Player(100, this.canvas.height - 100);
        this.player.game = this;
        
        // Regenerate game objects
        this.platformManager = new PlatformManager(this);
        this.snowmanManager = new SnowmanManager(this);
        this.santaManager = new SantaManager(this);
        this.ui = new UI();
        
        // Recreate initial game setup
        this.platformManager.generateStartingPlatforms();
        this.snowmanManager.generateInitialSnowmen();
        this.santaManager.generateInitialSantas();
    }

    update() {
        if (!this.gameOver) {
            this.player.update();
            this.snowmanManager.updateAll();
            this.santaManager.updateAll();
            this.camera.update();
            this.collisionHandler.checkCollisions();
        }
    }

    collectPackage() {
        // Score functionality removed for now
    }

    gameLoop() {
        this.update();
        this.renderer.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the page loads
window.onload = () => {
    new Game();
};