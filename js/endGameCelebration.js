class EndGameCelebration {
    constructor(game) {
        this.game = game;
        this.isShowing = false;
        this.timer = 0;
        this.duration = 300; // 5 seconds at 60fps

        // Snowflake system
        this.snowflakes = [];
        this.initSnowflakes();

        // Text animation properties
        this.textScale = 1;
        this.textAngle = 0;
    }

    initSnowflakes() {
        for (let i = 0; i < 100; i++) {
            this.snowflakes.push({
                x: Math.random() * this.game.canvas.width,
                y: Math.random() * this.game.canvas.height,
                size: Math.random() * 4 + 2,
                speed: Math.random() * 2 + 1,
                drift: Math.random() * 2 - 1
            });
        }
    }

    start() {
        this.isShowing = true;
        this.timer = this.duration;
        setTimeout(() => {
            this.game.resetGame();
        }, 5000);
    }

    update() {
        if (!this.isShowing) return;

        if (this.timer > 0) {
            this.timer--;
        }

        // Update snowflakes
        this.snowflakes.forEach(flake => {
            flake.y += flake.speed;
            flake.x += flake.drift;

            if (flake.y > this.game.canvas.height) {
                flake.y = 0;
                flake.x = Math.random() * this.game.canvas.width;
            }
            if (flake.x > this.game.canvas.width) {
                flake.x = 0;
            }
            if (flake.x < 0) {
                flake.x = this.game.canvas.width;
            }
        });

        // Update text animation
        this.textScale = 1 + Math.sin(Date.now() / 500) * 0.1;
        this.textAngle = Math.sin(Date.now() / 1000) * 0.1;
    }

    drawSparkles(ctx, canvas, progress) {
        const numSparkles = 30;
        const radius = 300;
        
        ctx.save();
        for (let i = 0; i < numSparkles; i++) {
            const angle = (i / numSparkles) * Math.PI * 2 + progress * 5;
            const x = canvas.width / 2 + Math.cos(angle) * radius * progress;
            const y = canvas.height / 2 + Math.sin(angle) * radius * progress;
            
            const sparkleSize = 4 + Math.sin(progress * 10 + i) * 3;
            
            // Create star shape
            ctx.beginPath();
            for (let j = 0; j < 5; j++) {
                const starAngle = (j * 4 * Math.PI / 5) + angle;
                const x1 = x + Math.cos(starAngle) * sparkleSize;
                const y1 = y + Math.sin(starAngle) * sparkleSize;
                if (j === 0) {
                    ctx.moveTo(x1, y1);
                } else {
                    ctx.lineTo(x1, y1);
                }
            }
            ctx.closePath();
            
            // Add gradient fill to sparkles
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, sparkleSize);
            gradient.addColorStop(0, 'rgba(255, 255, 150, ' + progress + ')');
            gradient.addColorStop(1, 'rgba(255, 200, 0, ' + (progress * 0.5) + ')');
            ctx.fillStyle = gradient;
            ctx.fill();
        }
        ctx.restore();
    }

    draw(ctx, canvas) {
        if (!this.isShowing) return;

        const progress = this.timer / this.duration;
        
        // Create festive gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 100, 0, 0.95)');  // Dark green at top
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0.95)');  // Red at bottom
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw snow
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.snowflakes.forEach(flake => {
            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw celebratory text with animation
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(this.textAngle);
        ctx.scale(this.textScale, this.textScale);
        
        // Add glow effect
        ctx.shadowColor = 'gold';
        ctx.shadowBlur = 20;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw main message
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = 'rgba(255, 223, 0, 1)'; // Golden yellow
        ctx.fillText('God jul önskar', 0, -40);

        // Draw names with slight delay and different color
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // White
        ctx.fillText('Folke, Ellis, Anna och Alex', 0, 40);
        
        ctx.restore();

        // Draw sparkles
        this.drawSparkles(ctx, canvas, progress);
    }

    reset() {
        this.isShowing = false;
        this.timer = 0;
        this.initSnowflakes();
    }
}