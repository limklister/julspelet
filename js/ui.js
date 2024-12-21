class UI {
    constructor() {
        // Preload images
        this.heartImage = new Image();
        this.heartImage.src = 'images/heart.png';
        
        this.packageImage = new Image();
        this.packageImage.src = 'images/gift.png';

        // Add transition properties
        this.showingLevelTransition = false;
        this.transitionTimer = 0;
        this.transitionDuration = 120; // frames (2 seconds at 60fps)
        this.transitionText = '';
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

    drawPackageCount(ctx, canvas, game) {
        const packageSize = 20;
        const packageSpacing = 25;
        const packageY = 20;
        
        // Position packages 100 pixels from the right edge of the canvas
        const startX = canvas.width - 150;

        // Draw current/required packages text
        ctx.font = '20px Arial';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.textAlign = 'right';
        const packagesText = `${game.packagesCollected}/3 paket`;
        ctx.strokeText(packagesText, startX - 10, packageY + 15);
        ctx.fillText(packagesText, startX - 10, packageY + 15);
        
        // Draw package icons for each collected package
        for (let i = 0; i < game.packagesCollected; i++) {
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

    drawLevel(ctx, game) {
        ctx.font = '24px Arial';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.textAlign = 'left';
        const levelText = `Nivå ${game.currentLevel}`;
        ctx.strokeText(levelText, 20, 60);
        ctx.fillText(levelText, 20, 60);
    }

    drawPortalHint(ctx, canvas, game) {
        if (game.packagesCollected >= 3 && game.portal.isActive) {
            ctx.font = '20px Arial';
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.textAlign = 'center';
            const hintText = 'Portalen är öppen! →';
            ctx.strokeText(hintText, canvas.width / 2, 30);
            ctx.fillText(hintText, canvas.width / 2, 30);
        }
    }

    drawGameOverScreen(ctx, canvas) {
        // Semi-transparent black background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Game over text
        ctx.fillStyle = 'red';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Julen är slut!', canvas.width / 2, canvas.height / 2);
        
        // Restart instructions
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.fillText('Tryck på R för nästa jul', canvas.width / 2, canvas.height / 2 + 50);
    }

    // Add new method for level transition
    startLevelTransition(level) {
        this.showingLevelTransition = true;
        this.transitionTimer = this.transitionDuration;
        this.transitionText = `HURRA! NÄSTA NIVÅ!`;
    }

    // Add method to update transition
    update() {
        if (this.showingLevelTransition && this.transitionTimer > 0) {
            this.transitionTimer--;
            if (this.transitionTimer === 0) {
                this.showingLevelTransition = false;
            }
        }
    }

    // Add method to draw transition
    drawLevelTransition(ctx, canvas) {
        if (!this.showingLevelTransition) return;

        const progress = this.transitionTimer / this.transitionDuration;
        const alpha = progress < 0.8 ? progress : (this.transitionTimer / this.transitionDuration);
        
        // Draw semi-transparent overlay
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.7})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate bounce effect
        const bounceOffset = Math.sin(progress * Math.PI * 2) * 20;

        // Draw main text with glow effect
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw glow
        ctx.shadowColor = 'gold';
        ctx.shadowBlur = 20;
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = `rgba(255, 223, 0, ${alpha})`; // Golden yellow
        ctx.fillText(this.transitionText, 
            canvas.width / 2, 
            canvas.height / 2 + bounceOffset);

        // Draw text outline
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeText(this.transitionText, 
            canvas.width / 2, 
            canvas.height / 2 + bounceOffset);
        
        ctx.restore();

        // Draw sparkles
        this.drawSparkles(ctx, canvas, progress);
    }

    drawSparkles(ctx, canvas, progress) {
        const numSparkles = 20;
        const radius = 200;
        
        ctx.save();
        for (let i = 0; i < numSparkles; i++) {
            const angle = (i / numSparkles) * Math.PI * 2 + progress * 5;
            const x = canvas.width / 2 + Math.cos(angle) * radius * progress;
            const y = canvas.height / 2 + Math.sin(angle) * radius * progress;
            
            const sparkleSize = 3 + Math.sin(progress * 10 + i) * 2;
            
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 0, ${progress})`;
            ctx.arc(x, y, sparkleSize, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    draw(ctx, player, canvas) {
        // Save context state
        ctx.save();
        
        // Reset transform for UI elements
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        const game = player.game;
        
        // Draw hearts
        this.drawHearts(ctx, player.hearts);
        
        // Draw package count
        this.drawPackageCount(ctx, canvas, game);
        
        // Draw level number
        this.drawLevel(ctx, game);
        
        // Draw portal hint
        this.drawPortalHint(ctx, canvas, game);
        
        // Draw game over screen if needed
        if (game && game.gameOver) {
            this.drawGameOverScreen(ctx, canvas);
        }

        // Draw level transition if active
        if (this.showingLevelTransition) {
            this.drawLevelTransition(ctx, canvas);
        }
        
        // Restore context state
        ctx.restore();
    }

    reset() {
        // Reset any UI-specific state if needed
        Package.resetPackageCount();
        this.showingLevelTransition = false;
        this.transitionTimer = 0;
    }
}
