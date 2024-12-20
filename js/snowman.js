class Snowman {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        
        // Image loading
        this.image = new Image();
        this.image.src = 'images/snowman.png';
        
        // New properties for defeat mechanism
        this.isDead = false;
        this.deathAnimation = 0;
        
        // Throwing animation
        this.throwTimer = 0;
        this.maxThrowTimer = 30; // Shorter wiggle duration
        this.isAboutToThrow = false; // Flag for pre-throw wiggle
    }

    update(game) {
        if (!this.isDead) {
            // Manage throwing preparation
            if (this.isAboutToThrow) {
                this.throwTimer++;

                // Stop wiggling after a short period
                if (this.throwTimer >= this.maxThrowTimer) {
                    this.isAboutToThrow = false;
                    this.throwTimer = 0;
                }
            }
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
            // Save context to apply transformations
            ctx.save();

            // Wiggle animation only when about to throw
            let wiggleRotation = 0;
            if (this.isAboutToThrow) {
                // Create a quick, subtle back-and-forth wiggle
                wiggleRotation = Math.sin(this.throwTimer * 0.5) * 0.1;
            }
            
            // Translate to snowman's center
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(wiggleRotation);
            ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));

            // Normal drawing
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            
            // Restore context
            ctx.restore();
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
