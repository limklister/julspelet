class Camera {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.scrollTriggerX = game.canvas.width * 0.4;
    }

    update() {
        if (this.game.player.x - this.x > this.scrollTriggerX) {
            this.x = this.game.player.x - this.scrollTriggerX;
        }
        
        this.game.platformManager.checkGenerateMorePlatforms(this.x + this.game.canvas.width);
        this.game.snowmanManager.generateMoreSnowmen(this.x);
    }

    reset() {
        this.x = 0;
        this.y = 0;
    }
}