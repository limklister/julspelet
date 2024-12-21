class Game {
    constructor() {
        this.initCanvas();
        this.initGameObjects();
        this.initGameSystems();
        this.initRestartListener();
        this.currentLevel = 1;
        this.packagesCollected = 0;
        window.gameInstance = this;
        this.gameLoop();
    }

    initCanvas() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // Winter background gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F6FF');
        this.backgroundGradient = gradient;
    }

    initGameObjects() {
        this.player = new Player(100, this.canvas.height - 100);
        this.player.game = this;
        this.backgroundManager = new BackgroundManager(this);
        this.platformManager = new PlatformManager(this);
        this.snowmanManager = new SnowmanManager(this);
        this.snowballManager = new SnowballManager(this);
        this.santaManager = new SantaManager(this);
        this.ui = new UI();
        this.endGameCelebration = new EndGameCelebration(this);
        
        // Add portal (initially off screen)
        this.portal = new Portal(-1000, 0);
        
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

    initRestartListener() {
        window.addEventListener('keydown', (event) => {
            if ((this.gameOver) && (event.key === 'r' || event.key === 'R')) {
                this.resetGame();
            }
        });
    }

    resetGame() {
        this.gameOver = false;
        this.camera.reset();
        this.currentLevel = 1;
        this.packagesCollected = 0;
        
        this.player = new Player(100, this.canvas.height - 100);
        this.player.game = this;
        
        this.backgroundManager = new BackgroundManager(this);
        this.platformManager = new PlatformManager(this);
        this.snowmanManager = new SnowmanManager(this);
        this.snowballManager = new SnowballManager(this);
        this.santaManager = new SantaManager(this);
        this.ui = new UI();
        this.endGameCelebration = new EndGameCelebration(this);
        
        this.portal = new Portal(-1000, 0);
        
        this.platformManager.generateStartingPlatforms();
        this.snowmanManager.generateInitialSnowmen();
        this.santaManager.generateInitialSantas();
        Package.resetPackageCount();
    }

    nextLevel() {
        if (this.currentLevel === 3) {
            // Show end game celebration
            this.endGameCelebration.start();
            return;
        }

        // Start the transition animation
        this.ui.startLevelTransition(this.currentLevel + 1);

        this.currentLevel++;
        this.packagesCollected = 0;
        
        // Reset player position but keep their health
        const currentHealth = this.player.health;
        this.player = new Player(100, this.canvas.height - 100);
        this.player.game = this;
        this.player.health = currentHealth;
        
        // Reset camera
        this.camera.reset();
        
        // Reset game objects for new level
        this.backgroundManager = new BackgroundManager(this);
        this.platformManager = new PlatformManager(this);
        this.snowmanManager = new SnowmanManager(this);
        this.snowballManager = new SnowballManager(this);
        this.santaManager = new SantaManager(this);
        
        // Reset portal (off screen)
        this.portal = new Portal(-1000, 0);
        
        // Generate new level
        this.platformManager.generateStartingPlatforms();
        this.snowmanManager.generateInitialSnowmen();
        this.santaManager.generateInitialSantas();
        Package.resetPackageCount();
    }

    update() {
        if (!this.gameOver && !this.endGameCelebration.isShowing) {
            this.player.update();
            this.snowmanManager.updateAll();
            this.snowballManager.update();
            this.santaManager.updateAll();
            this.portal.update();
            this.camera.update();
            this.collisionHandler.checkCollisions();

            // Update UI animations
            this.ui.update();
            // Update background
            this.backgroundManager.update(this.camera.x);
        }

        // Always update end game celebration if it's showing
        if (this.endGameCelebration.isShowing) {
            this.endGameCelebration.update();
        }
    }

    collectPackage() {
        this.packagesCollected++;
        
        // When 3 packages are collected, move portal in front of player
        if (this.packagesCollected >= 3) {
            // Position portal a bit ahead of the player
            const portalX = this.player.x + 400; // 400 pixels ahead
            const portalY = this.canvas.height - 200;
            
            // Move portal to new position
            this.portal.x = portalX;
            this.portal.y = portalY;
            this.portal.activate();
            
            // Add a platform under the portal
            this.platformManager.platforms = this.platformManager.platforms.filter(p => !p.isPortalPlatform); // Remove old portal platform if exists
            const portalPlatform = new Platform(portalX - 50, this.canvas.height - 50, 200, 50);
            portalPlatform.isPortalPlatform = true; // Mark this platform as the portal platform
            this.platformManager.platforms.push(portalPlatform);
        }
    }

    gameLoop() {
        this.update();
        this.renderer.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    // Debug method to show portal
    showPortalDebug() {
        const portalX = this.player.x + 400;
        const portalY = this.canvas.height - 200;
        this.portal.x = portalX;
        this.portal.y = portalY;
        this.portal.activate();
        
        // Add a platform under the portal
        this.platformManager.platforms = this.platformManager.platforms.filter(p => !p.isPortalPlatform);
        const portalPlatform = new Platform(portalX - 50, this.canvas.height - 50, 200, 50);
        portalPlatform.isPortalPlatform = true;
        this.platformManager.platforms.push(portalPlatform);
    }
}

// Start the game when the page loads
window.onload = () => {
    new Game();
};