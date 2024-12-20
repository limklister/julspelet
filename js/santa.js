class Santa {
    constructor(x, y, game) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 50;  // Adjusted to match potential image size
        this.height = 50; // Adjusted to match potential image size
        this.speed = 2;
        
        // Image loading
        this.image = new Image();
        this.image.src = 'images/santa.png';
        
        this.packageDropInterval = 3000; // Drop package every 3 seconds
        this.lastPackageDropTime = Date.now();
    }

    update() {
        // Move horizontally
        this.x += this.speed;
        
        // Reverse direction if hitting canvas boundaries
        if (this.x <= 0 || this.x + this.width >= this.game.canvas.width) {
            this.speed *= -1;
        }
        
        // Drop packages periodically
        const currentTime = Date.now();
        if (currentTime - this.lastPackageDropTime > this.packageDropInterval) {
            // Return a new package instead of directly adding to game
            const newPackage = new Package(this.x + this.width / 2, this.y + this.height);
            this.lastPackageDropTime = currentTime;
            return newPackage;
        }
        
        return null;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}