class CollisionHandler {
    constructor(game) {
        this.game = game;
    }

    checkCollisions() {
        this.checkPlatformCollisions();
        this.checkSnowmanCollisions();
        this.checkPackageCollisions();
        this.checkPortalCollision();
    }

    checkPlatformCollisions() {
        const player = this.game.player;

        // Check regular platforms
        this.game.platformManager.platforms.forEach(platform => {
            if (this.detectCollision(player, platform)) {
                if (player.velocityY > 0 && player.y + player.height - player.velocityY <= platform.y) {
                    player.y = platform.y - player.height;
                    player.velocityY = 0;
                    player.isJumping = false;
                }
            }
        });

        // Check floor segments
        this.game.platformManager.floorSegments.forEach(floor => {
            if (this.detectCollision(player, floor)) {
                if (player.velocityY > 0 && player.y + player.height - player.velocityY <= floor.y) {
                    player.y = floor.y - player.height;
                    player.velocityY = 0;
                    player.isJumping = false;
                }
            }
        });
    }

    checkSnowmanCollisions() {
        const player = this.game.player;
        
        this.game.snowmanManager.snowmen.forEach(snowman => {
            if (!snowman.isDead && this.detectCollision(player, snowman)) {
                const playerBottom = player.y + player.height;
                const snowmanTop = snowman.y;
                
                if (player.velocityY > 0 && playerBottom - player.velocityY <= snowmanTop + 20) {
                    // Player is above the snowman - kill snowman and bounce
                    snowman.hit();
                    player.velocityY = -12; // Bounce up
                } else if (!player.isInvulnerable) {
                    // Player hits snowman from side or below - take damage
                    player.takeDamage();
                    // Add knockback
                    const knockbackDirection = player.x < snowman.x ? -1 : 1;
                    player.velocityX = knockbackDirection * 10;
                    player.velocityY = -5;
                }
            }
        });
    }

    checkPackageCollisions() {
        this.game.santaManager.packages.forEach(pkg => {
            if (!pkg.collected && this.detectCollision(this.game.player, pkg)) {
                pkg.collect();
                this.game.collectPackage();
            }
        });
    }

    checkPortalCollision() {
        const portal = this.game.portal;
        if (portal.isActive && this.detectCollision(this.game.player, portal)) {
            this.game.nextLevel();
        }
    }

    detectCollision(rect1, rect2) {
        return (rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.y + rect1.height > rect2.y);
    }
}