class Package {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30; // Adjusted for image
        this.height = 30; // Adjusted for image
        this.velocityY = 0;
        this.collected = false;
        
        // Load the gift image
        this.image = new Image();
        this.image.src = 'images/gift.png';
    }

    update() {
        if (!this.collected) {
            Physics.applyGravity(this);
            this.y += this.velocityY;
        }
    }

    draw(ctx) {
        if (!this.collected) {
            // Draw the gift image instead of a green rectangle
            ctx.drawImage(
                this.image, 
                this.x - this.width/2, 
                this.y, 
                this.width, 
                this.height
            );
        }
    }

    collect() {
        this.collected = true;
    }
}