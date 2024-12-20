class Snowman {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 100;
        this.isDead = false;
        this.deathAnimation = 0; // 0 to 1
        this.deathSpeed = 0.1;   // How fast the snowman melts
    }

    draw(ctx) {
        if (this.isDead) {
            this.drawMelting(ctx);
            return;
        }

        // Bottom circle (largest)
        ctx.fillStyle = '#ADD8E6';  // Light blue
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height - 25, 25, 0, Math.PI * 2);
        ctx.fill();

        // Middle circle
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height - 60, 20, 0, Math.PI * 2);
        ctx.fill();

        // Head (smallest)
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height - 90, 15, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2 - 7, this.y + this.height - 93, 3, 0, Math.PI * 2);
        ctx.arc(this.x + this.width/2 + 7, this.y + this.height - 93, 3, 0, Math.PI * 2);
        ctx.fill();

        // Carrot nose
        ctx.fillStyle = 'orange';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2, this.y + this.height - 90);
        ctx.lineTo(this.x + this.width/2 + 15, this.y + this.height - 90);
        ctx.lineTo(this.x + this.width/2, this.y + this.height - 85);
        ctx.closePath();
        ctx.fill();
    }

    drawMelting(ctx) {
        const meltHeight = this.height * (1 - this.deathAnimation);
        const meltWidth = this.width * (1.5 - this.deathAnimation/2); // Spread out as it melts
        
        // Melting puddle
        ctx.fillStyle = '#ADD8E6';
        ctx.beginPath();
        ctx.ellipse(
            this.x + this.width/2, 
            this.y + this.height, 
            meltWidth/2, 
            10 * this.deathAnimation, 
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // Melting snowman body
        if (meltHeight > 0) {
            ctx.beginPath();
            ctx.ellipse(
                this.x + this.width/2,
                this.y + this.height - meltHeight/2,
                meltWidth/2,
                meltHeight/2,
                0, 0, Math.PI * 2
            );
            ctx.fill();
        }
    }

    hit() {
        this.isDead = true;
    }

    update() {
        if (this.isDead) {
            this.deathAnimation = Math.min(1, this.deathAnimation + this.deathSpeed);
            return this.deathAnimation >= 1; // Return true when animation is complete
        }
        return false; // Return false when snowman is still alive
    }
}

class SnowmanManager {
    constructor(game) {
        this.game = game;
        this.snowmen = [];
        this.minSpacing = 300;
        this.maxSpacing = 600;
        this.lastSnowmanX = 0;
    }

    generateInitialSnowmen() {
        let currentX = 400;
        while (currentX < this.game.canvas.width * 1.5) {
            this.addSnowman(currentX);
            currentX += Math.random() * (this.maxSpacing - this.minSpacing) + this.minSpacing;
        }
    }

    addSnowman(x) {
        const snowman = new Snowman(x, this.game.canvas.height - 150);
        this.snowmen.push(snowman);
        this.lastSnowmanX = x;
    }

    generateMoreSnowmen(viewX) {
        while (this.lastSnowmanX < viewX + this.game.canvas.width) {
            const nextX = this.lastSnowmanX + Math.random() * (this.maxSpacing - this.minSpacing) + this.minSpacing;
            this.addSnowman(nextX);
        }

        // Cleanup old snowmen
        this.snowmen = this.snowmen.filter(snowman => 
            snowman.x > viewX - this.game.canvas.width * 2 || snowman.isDead
        );
    }

    drawAll(ctx) {
        this.snowmen.forEach(snowman => snowman.draw(ctx));
    }

    updateAll() {
        // Filter out snowmen whose death animation is complete
        this.snowmen = this.snowmen.filter(snowman => !snowman.update());
    }
}