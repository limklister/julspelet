class Santa {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.width = 40;
        this.height = 40;
        this.velocityX = 2; // Santa moves side to side
        this.dropCooldown = 3000; // 3 seconds between drops
        this.lastDropTime = 0;
    }

    update() {
        // Move side to side
        this.x += this.velocityX;
        
        // Reverse direction at screen edges
        if (this.x <= 0 || this.x + this.width >= this.game.canvas.width) {
            this.velocityX = -this.velocityX;
        }
        
        // Check if it's time to drop a package
        if (Date.now() - this.lastDropTime > this.dropCooldown) {
            this.lastDropTime = Date.now();
            return new Package(this.x + this.width / 2, this.y + this.height);
        }
        
        return null;
    }

    draw(ctx) {
        ctx.fillStyle = '#FF0000'; // Red for Santa
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}