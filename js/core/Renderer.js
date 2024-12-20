class Renderer {
    constructor(game) {
        this.game = game;
        this.ctx = game.ctx;
    }

    draw() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        
        // Save the current context state
        this.ctx.save();
        
        // Apply camera transformation
        this.ctx.translate(-this.game.camera.x, -this.game.camera.y);
        
        // Draw game elements
        this.game.platformManager.draw(this.ctx);  // This will draw both floor and platforms
        
        this.game.snowmanManager.drawAll(this.ctx);
        this.game.santaManager.drawAll(this.ctx);
        this.game.player.draw(this.ctx);
        
        // Restore the context state
        this.ctx.restore();
        
        // Draw UI elements (not affected by camera)
        this.game.ui.draw(
            this.ctx, 
            this.game.player, 
            this.game.canvas
        );
    }
}