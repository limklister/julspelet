class Snowman {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 100;  // Even larger (previously 75)
        this.height = 100; // Even larger (previously 75)
        
        // Image loading
        this.image = new Image();
        this.image.src = 'images/snowman.png';
        
        // New properties for defeat mechanism
        this.isDead = false;
        this.deathAnimation = 0;
    }

    update(game) {
        if (!this.isDead) {
            // Snowmen now stand still on the ground
            // Any additional idle behavior can be added here if needed
        } else {
            // Simple death animation
            this.deathAnimation++;
            
            // Remove the snowman after a short animation
            if (this.deathAnimation > 30) {
                return false; // Signal to remove from the list
            }
        }
        
        return true;
    }

    draw(ctx) {
        if (!this.isDead) {
            // Normal drawing
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            // Death animation (fading out)
            ctx.globalAlpha = 1 - (this.deathAnimation / 30);
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.globalAlpha = 1; // Reset alpha
        }
    }

    hit() {
        // Called when snowman is defeated
        this.isDead = true;
        this.deathAnimation = 0;
    }
}