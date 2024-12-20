class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpForce = -12;
        this.isJumping = false;
        this.movingDirection = 0;
        this.airControl = 0.7;
        
        // Health system
        this.hearts = 3;
        
        // Invulnerability properties
        this.isInvulnerable = false;
        this.invulnerabilityTime = 1500; // 1.5 seconds
        this.invulnerabilityTimer = 0;
        this.blinkRate = 100; // Blink every 100ms when invulnerable
    }

    move(direction) {
        this.movingDirection = direction;
        
        if (this.isJumping) {
            this.velocityX += direction * this.speed * this.airControl;
            this.velocityX = Math.max(-this.speed, Math.min(this.speed, this.velocityX));
        } else {
            this.velocityX = direction * this.speed;
        }
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
            if (this.movingDirection !== 0) {
                this.velocityX = this.movingDirection * this.speed;
            }
        }
    }

    makeInvulnerable() {
        this.isInvulnerable = true;
        this.invulnerabilityTimer = Date.now();
    }

    update() {
        Physics.applyGravity(this);
        if (!this.isJumping && this.movingDirection === 0) {
            Physics.applyFriction(this);
        }
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Update invulnerability
        if (this.isInvulnerable && Date.now() - this.invulnerabilityTimer > this.invulnerabilityTime) {
            this.isInvulnerable = false;
        }

        // Check for death with falling out of the world handling
        if (this.hearts <= 0 || this.y > this.game.canvas.height) {
            this.game.gameOver = true;
        }
    }

    takeDamage() {
        if (!this.isInvulnerable) {
            this.hearts--;
            this.makeInvulnerable();
            
            // Optional: Add a knockback effect
            this.velocityY = this.jumpForce / 2;
            this.velocityX = this.movingDirection * -this.speed;
        }
    }

    draw(ctx) {
        // Game over text rendering
        if (this.game && this.game.gameOver) {
            // Save context state
            ctx.save();
            
            // Reset transform for UI elements
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            
            // Game over text
            ctx.fillStyle = 'red';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over', this.game.canvas.width / 2, this.game.canvas.height / 2);
            
            // Restart instructions
            ctx.fillStyle = 'red';
            ctx.font = '24px Arial';
            ctx.fillText('Press R to Restart', this.game.canvas.width / 2, this.game.canvas.height / 2 + 50);
            
            // Restore context state
            ctx.restore();
        }
        
        // Original drawing logic remains the same
        if (!this.isInvulnerable || (this.isInvulnerable && Math.floor((Date.now() - this.invulnerabilityTimer) / this.blinkRate) % 2 === 0)) {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        
        // Draw hearts
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        const heartSize = 20;
        const heartSpacing = 25;
        const heartY = 20;
        
        ctx.fillStyle = 'red';
        for (let i = 0; i < this.hearts; i++) {
            const heartX = 20 + i * heartSpacing;
            // Simple heart shape
            ctx.beginPath();
            ctx.moveTo(heartX + heartSize/2, heartY + heartSize/4);
            ctx.bezierCurveTo(heartX + heartSize/2, heartY, heartX, heartY, heartX, heartY + heartSize/4);
            ctx.bezierCurveTo(heartX, heartY + heartSize/2, heartX + heartSize/2, heartY + heartSize, heartX + heartSize/2, heartY + heartSize);
            ctx.bezierCurveTo(heartX + heartSize/2, heartY + heartSize, heartX + heartSize, heartY + heartSize/2, heartX + heartSize, heartY + heartSize/4);
            ctx.bezierCurveTo(heartX + heartSize, heartY, heartX + heartSize/2, heartY, heartX + heartSize/2, heartY + heartSize/4);
            ctx.fill();
        }
        
        ctx.restore();
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isInvulnerable = false;
        this.hearts = 3;
    }
}