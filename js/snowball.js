class Snowball {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.width = 20;  // Increased size
        this.height = 20; // Increased size
        
        // Calculate trajectory
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Longer trajectory with more initial velocity
        this.velocityX = (dx / distance) * 7;
        this.velocityY = (dy / distance) * 7;
        
        // Reduced gravity for longer arc
        this.gravity = 0.1;
    }

    update() {
        // Move horizontally
        this.x += this.velocityX;
        
        // Apply gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Check collision with player
    checkCollision(player) {
        return (
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y
        );
    }
}

