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

class SnowballManager {
    constructor(game) {
        this.game = game;
        this.snowballs = [];
        this.throwCooldown = 0;
        this.snowballSound = document.getElementById('snowballSound');
    }

    update() {
        // Update existing snowballs
        this.snowballs = this.snowballs.filter(snowball => {
            snowball.update();
            
            // Remove snowballs that are far off screen
            if (snowball.y > this.game.canvas.height * 2) {
                return false;
            }
            
            // Check collision with player
            if (snowball.checkCollision(this.game.player)) {
                this.game.player.takeDamage();
                return false;
            }
            
            return true;
        });

        // Manage throwing snowballs from snowmen
        this.manageSnowballThrows();
    }

    playSnowballSound() {
        if (this.snowballSound) {
            this.snowballSound.currentTime = 0; // Reset to start
            this.snowballSound.play();
        }
    }

    manageSnowballThrows() {
        // Longer and more randomized cooldown
        this.throwCooldown--;
        
        // Only throw if cooldown is complete
        if (this.throwCooldown <= 0) {
            // Find snowmen near the player
            const nearbySnowmen = this.game.snowmanManager.snowmen.filter(snowman => 
                !snowman.isDead && 
                Math.abs(snowman.x - this.game.player.x) < this.game.canvas.width / 2
            );

            // Randomly decide to throw from one of the nearby snowmen
            if (nearbySnowmen.length > 0 && Math.random() < 0.3) {  // 30% chance to throw
                const snowman = nearbySnowmen[Math.floor(Math.random() * nearbySnowmen.length)];
                
                // Trigger wiggle animation
                snowman.isAboutToThrow = true;
                snowman.throwTimer = 0;

                // Only actually throw after the wiggle animation
                setTimeout(() => {
                    // Add some randomness to the target
                    const targetX = this.game.player.x + 
                        this.game.player.width / 2 + 
                        (Math.random() * 100 - 50);  // Spread target area
                    const targetY = this.game.player.y + 
                        this.game.player.height / 2 + 
                        (Math.random() * 100 - 50);  // Spread target area
                    
                    // Throw snowball
                    this.playSnowballSound();
                    const snowball = new Snowball(
                        snowman.x + snowman.width / 2, 
                        snowman.y + snowman.height / 2,
                        targetX,
                        targetY
                    );
                    
                    this.snowballs.push(snowball);
                }, 500);  // Delay to match wiggle animation
            }

            // Reset cooldown with more variability
            this.throwCooldown = Math.floor(Math.random() * 180) + 120;  // Between 2-5 seconds
        }
    }

    drawAll(ctx) {
        this.snowballs.forEach(snowball => snowball.draw(ctx));
    }
}
