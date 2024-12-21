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
