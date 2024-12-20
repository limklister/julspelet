class Package {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.velocityY = 0;
        this.collected = false;
    }

    update() {
        if (!this.collected) {
            Physics.applyGravity(this);
            this.y += this.velocityY;
        }
    }

    draw(ctx) {
        if (!this.collected) {
            ctx.fillStyle = '#00FF00'; // Green for packages
            ctx.fillRect(this.x - this.width/2, this.y, this.width, this.height);
        }
    }

    collect() {
        this.collected = true;
    }
}