class Renderer {
    constructor(game) {
        this.game = game;
    }

    draw() {
        const ctx = this.game.ctx;
        const canvas = this.game.canvas;
        const camera = this.game.camera;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw winter background gradient
        ctx.save();
        ctx.fillStyle = this.game.backgroundGradient || 'skyblue';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        // Translate for camera movement
        ctx.save();
        ctx.translate(-camera.x, -camera.y);

        // Draw background (trees and snowflakes)
        this.game.backgroundManager.draw(ctx, camera.x);

        // Draw platforms
        this.game.platformManager.draw(ctx);

        // Draw Santas and Packages
        this.game.santaManager.drawAll(ctx);

        // Draw Snowmen
        this.game.snowmanManager.drawAll(ctx);

        // Draw Snowballs
        this.game.snowballManager.drawAll(ctx);

        // Draw portal
        this.game.portal.draw(ctx);

        // Draw player
        this.game.player.draw(ctx);

        // Restore translation
        ctx.restore();

        // Draw UI (always on top, not affected by camera)
        this.game.ui.draw(ctx, this.game.player, canvas);
    }
}