const Physics = {
    playerGravity: 0.5,
    packageGravity: 0.2,  // Slower gravity for packages
    friction: 0.8,
    playerTerminalVelocity: 10,
    packageTerminalVelocity: 5,

    applyGravity(entity, isPackage = false) {
        const gravity = isPackage ? this.packageGravity : this.playerGravity;
        const terminalVelocity = isPackage ? this.packageTerminalVelocity : this.playerTerminalVelocity;
        
        entity.velocityY = Math.min(entity.velocityY + gravity, terminalVelocity);
    },

    applyFriction(entity) {
        entity.velocityX *= this.friction;
        if (Math.abs(entity.velocityX) < 0.1) entity.velocityX = 0;
    }
};