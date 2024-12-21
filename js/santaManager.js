class SantaManager {
    constructor(game) {
        this.game = game;
        this.santas = [];
        this.packages = [];
        
        // Santa spawn settings
        this.maxSantas = 5; // Maximum number of Santas at a time
        this.spawnChance = 0.1; // Low chance of spawning a Santa
        this.spawnTimer = 0;
        this.minSpawnInterval = 1000; // Minimum 1 second between spawn attempts
        this.maxSpawnInterval = 20000; // Maximum 20 seconds between spawn attempts

        // Santa sound
        this.santaSound = document.getElementById('santaSound');
    }

    generateInitialSantas() {
        // No initial Santas, they will spawn randomly
    }

    updateAll() {
        // Random Santa spawning
        this.spawnTimer += 16; // Assuming 60 FPS
        if (this.spawnTimer >= this.minSpawnInterval) {
            this.trySpawnSanta();
            this.spawnTimer = 0;
        }

        // Update existing Santas
        const cameraX = this.game.camera.x;
        const visibleWidth = this.game.canvas.width;

        this.santas = this.santas.filter(santa => {
            // Remove Santas that have gone far off from the camera view
            if (santa.x < cameraX - 200 || santa.x > cameraX + visibleWidth + 200) {
                return false;
            }
            return true;
        });

        // Update Santas and collect any new packages
        this.santas.forEach(santa => {
            const newPackage = santa.update();
            if (newPackage) {
                this.packages.push(newPackage);
                this.playSantaSound();
            }
        });

        // Update existing packages
        this.packages.forEach(pkg => {
            pkg.update();
        });

        // Remove collected packages
        this.packages = this.packages.filter(pkg => !pkg.collected);
    }

    trySpawnSanta() {
        // Only spawn if less than max Santas and random chance succeeds
        if (this.santas.length < this.maxSantas && Math.random() < this.spawnChance) {
            // Get current camera position
            const cameraX = this.game.camera.x;
            const visibleWidth = this.game.canvas.width;

            // Random side of the screen relative to camera
            const side = Math.random() < 0.5 ? 'left' : 'right';
            
            // Random vertical position
            const yPosition = Math.random() * (this.game.canvas.height / 2);
            
            if (side === 'left') {
                // Spawn from left, moving right
                this.santas.push(new Santa(
                    cameraX - 100, // Start off-screen left of camera
                    yPosition, 
                    this.game, 
                    Math.abs(Math.random() * 3 + 1) // Randomized speed
                ));
            } else {
                // Spawn from right, moving left
                this.santas.push(new Santa(
                    cameraX + visibleWidth + 100, // Start off-screen right of camera
                    yPosition, 
                    this.game, 
                    -Math.abs(Math.random() * 3 + 1) // Randomized speed
                ));
            }
        }
    }

    dropPackage(x, y) {
        const newPackage = new Package(x, y);
        this.packages.push(newPackage);
        this.playSantaSound();
    }

    playSantaSound() {
        if (this.santaSound) {
            this.santaSound.currentTime = 0; // Reset to start
            this.santaSound.play();
        }
    }

    drawAll(ctx) {
        this.santas.forEach(santa => santa.draw(ctx));
        this.packages.forEach(pkg => pkg.draw(ctx));
    }
}