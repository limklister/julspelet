class Game {
    constructor() {
        this.initCanvas();
        this.initGameObjects();
        this.initGameSystems();
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

    resetGame() {
        this.gameOver = false;
        this.camera.reset();
        this.player = new Player(100, this.canvas.height - 100);
        this.player.game = this;
        this.platformManager = new PlatformManager(this);
        this.snowmanManager = new SnowmanManager(this);
        this.santaManager = new SantaManager(this);
        this.ui = new UI();
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