class Santa {
    constructor(x, y, game, speed) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 100;  // Doubled from 50 to 100
        this.height = 100; // Doubled from 50 to 100
        this.speed = speed || 2;
        
        // Image loading
        this.image = new Image();
        this.image.src = 'images/santa.png';
        
        // More randomized package dropping
        this.packageDropInterval = this.randomizePackageDropInterval();
        this.lastPackageDropTime = Date.now();
        this.packageDropChance = 0.5; // Increased to 50% chance to drop a package
    }

    randomizePackageDropInterval() {
        // Random interval between 1 and 5 seconds
        return Math.random() * 4000 + 1000;
    }

    update() {
        // Move horizontally
        this.x += this.speed;
        
        // Drop packages periodically with randomness
        const currentTime = Date.now();
        if (currentTime - this.lastPackageDropTime > this.packageDropInterval) {
            // Increased chance to drop a package
            if (Math.random() < this.packageDropChance) {
                // Create a package right under the Santa
                const newPackage = new Package(
                    this.x + this.width / 2, 
                    this.y + this.height
                );
                
                console.log('Santa dropped a package!', {
                    x: newPackage.x, 
                    y: newPackage.y
                });

                this.lastPackageDropTime = currentTime;
                
                // Randomize next package drop interval
                this.packageDropInterval = this.randomizePackageDropInterval();
                
                return newPackage;
            }
            
            // Reset timer even if no package is dropped
            this.lastPackageDropTime = currentTime;
        }
        
        return null;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}