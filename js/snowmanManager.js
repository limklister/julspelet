class SnowmanManager {
    constructor(game) {
        this.game = game;
        this.snowmen = [];
        this.lastGeneratedX = 0;
    }

    generateInitialSnowmen() {
        // Add a few Snowmen at different positions, even further up
        this.snowmen.push(new Snowman(200, this.game.canvas.height - 150));
        this.snowmen.push(new Snowman(400, this.game.canvas.height - 150));
        this.snowmen.push(new Snowman(600, this.game.canvas.height - 150));
        
        // Track the last generated X position
        this.lastGeneratedX = 600;
    }

    updateAll() {
        // Update Snowmen positions and remove dead ones
        this.snowmen = this.snowmen.filter(snowman => {
            return snowman.update(this.game);
        });
    }

    drawAll(ctx) {
        this.snowmen.forEach(snowman => snowman.draw(ctx));
    }

    // New method to generate more snowmen as camera moves
    generateMoreSnowmen(cameraX) {
        // Only generate if we've moved significantly from the last generation point
        if (cameraX > this.lastGeneratedX - this.game.canvas.width) {
            // Generate a new snowman
            const newX = this.lastGeneratedX + Math.random() * 500 + 200;
            const newY = this.game.canvas.height - 150; // Even further up
            
            this.snowmen.push(new Snowman(newX, newY));
            
            // Update the last generated X position
            this.lastGeneratedX = newX;
        }
    }
}