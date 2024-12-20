class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;  // Adjusted to match potential image size
        this.height = 50; // Adjusted to match potential image size
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpForce = -12;
        this.isJumping = false;
        this.movingDirection = 0;
        this.airControl = 0.7;
        
        // Image loading
        this.image = new Image();
        this.image.src = 'images/player.png';
        
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
        // Draw player image with optional invulnerability blinking
        if (!this.isInvulnerable || (this.isInvulnerable && Math.floor((Date.now() - this.invulnerabilityTimer) / this.blinkRate) % 2 === 0)) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
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