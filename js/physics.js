const Physics = {
    gravity: 0.5,
    friction: 0.8,
    terminalVelocity: 10,

    applyGravity(entity) {
        entity.velocityY = Math.min(entity.velocityY + this.gravity, this.terminalVelocity);
    },

    applyFriction(entity) {
        entity.velocityX *= this.friction;
        if (Math.abs(entity.velocityX) < 0.1) entity.velocityX = 0;
    }
};