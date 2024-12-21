class UI {
    constructor() {
        // Preload images
        this.heartImage = new Image();
        this.heartImage.src = 'images/heart.png';
        
        this.packageImage = new Image();
        this.packageImage.src = 'images/gift.png';
    }

    drawHearts(ctx, hearts) {
        const heartSize = 20;
        const heartSpacing = 25;
        const heartY = 20;
        
        for (let i = 0; i < hearts; i++) {
            const heartX = 20 + i * heartSpacing;
            
            // If heart image exists, use it. Otherwise, draw a simple heart
            if (this.heartImage.complete && this.heartImage.naturalHeight !== 0) {
                ctx.drawImage(
                    this.heartImage, 
                    heartX, 
                    heartY, 
                    heartSize, 
                    heartSize
                );
            } else {
                // Fallback to drawing a heart shape
                ctx.fillStyle = 'red';
                ctx.beginPath();
                ctx.moveTo(heartX + heartSize/2, heartY + heartSize/4);
                ctx.bezierCurveTo(heartX + heartSize/2, heartY, heartX, heartY, heartX, heartY + heartSize/4);
                ctx.bezierCurveTo(heartX, heartY + heartSize/2, heartX + heartSize/2, heartY + heartSize, heartX + heartSize/2, heartY + heartSize);
                ctx.bezierCurveTo(heartX + heartSize/2, heartY + heartSize, heartX + heartSize, heartY + heartSize/2, heartX + heartSize, heartY + heartSize/4);
                ctx.bezierCurveTo(heartX + heartSize, heartY, heartX + heartSize/2, heartY, heartX + heartSize/2, heartY + heartSize/4);
                ctx.fill();
            }
        }
    }

    drawPackageCount(ctx, canvas) {
        const packageSize = 20;
        const packageSpacing = 25;
        const packageY = 20;
        const packagesCollected = Package.getPackageCount();
        
        // Position packages 100 pixels from the right edge of the canvas
        const startX = canvas.width - 100;
        
        // Draw package icons for each collected package
        for (let i = 0; i < packagesCollected; i++) {
            const packageX = startX + i * packageSpacing;
            
            if (this.packageImage.complete && this.packageImage.naturalHeight !== 0) {
                ctx.drawImage(
                    this.packageImage, 
                    packageX, 
                    packageY, 
                    packageSize, 
                    packageSize
                );
            }
        }
    }

    drawGameOverScreen(ctx, canvas) {
        // Game over text
        ctx.fillStyle = 'red';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Julen är slut!', canvas.width / 2, canvas.height / 2);
        
        // Restart instructions
        ctx.fillStyle = 'black';
        ctx.font = '24px Arial';
        ctx.fillText('Tryck på R för nästa jul', canvas.width / 2, canvas.height / 2 + 50);
    }

    draw(ctx, player, canvas) {
        // Save context state
        ctx.save();
        
        // Reset transform for UI elements
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // Draw hearts
        this.drawHearts(ctx, player.hearts);
        
        // Draw package count
        this.drawPackageCount(ctx, canvas);
        
        // Draw game over screen if needed
        if (player.game && player.game.gameOver) {
            this.drawGameOverScreen(ctx, canvas);
        }
        
        // Restore context state
        ctx.restore();
    }

    reset() {
        // Reset any UI-specific state if needed
        Package.resetPackageCount();
    }
}