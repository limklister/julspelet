class Portal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 150;
        this.isActive = false;
        
        // Animation properties
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 0.1;
        
        // Hovering animation
        this.hoverOffset = 0;
        this.hoverSpeed = 0.05;
        
        // Portal image
        this.image = new Image();
        this.image.src = 'images/portal.png';
        
        // Shimmer lines properties
        this.numLines = 8;
        this.lineLength = 60;
        this.shimmerOffset = 0;
        this.shimmerSpeed = 0.03;
    }

    update() {
        // Update main animation
        this.animationTimer += this.animationSpeed;
        this.animationFrame = Math.floor(this.animationTimer) % 360;
        
        // Update hover effect
        this.hoverOffset += this.hoverSpeed;
        
        // Update shimmer effect
        this.shimmerOffset += this.shimmerSpeed;
        
        // Calculate hover position
        this.currentY = this.y + Math.sin(this.hoverOffset) * 10;
    }

    draw(ctx) {
        ctx.save();
        
        // Apply hover effect to entire portal
        const baseY = this.currentY;
        
        // Draw purple glow
        if (this.isActive) {
            const gradient = ctx.createRadialGradient(
                this.x + this.width/2, baseY + this.height/2, 0,
                this.x + this.width/2, baseY + this.height/2, this.width
            );
            gradient.addColorStop(0, 'rgba(147, 51, 234, 0.3)');  // Purple glow
            gradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(
                this.x - this.width/2, 
                baseY - this.height/2, 
                this.width * 2, 
                this.height * 2
            );
        }
        
        // Draw shimmering lines
        if (this.isActive) {
            const centerX = this.x + this.width/2;
            const centerY = baseY + this.height/2;
            
            for (let i = 0; i < this.numLines; i++) {
                const angle = (i / this.numLines) * Math.PI * 2 + this.shimmerOffset;
                const shimmerX = Math.cos(angle) * this.lineLength;
                const shimmerY = Math.sin(angle) * this.lineLength;
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(centerX + shimmerX, centerY + shimmerY);
                
                // Create shimmering effect with changing opacity
                const opacity = (Math.sin(this.shimmerOffset * 5 + i) + 1) / 2;
                ctx.strokeStyle = `rgba(147, 51, 234, ${opacity * 0.5})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
        
        // Draw portal image
        if (this.image.complete) {  // Make sure image is loaded
            ctx.drawImage(
                this.image,
                this.x,
                baseY,
                this.width,
                this.height
            );
        }
        
        // Draw indicator text
        if (!this.isActive) {
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(147, 51, 234, 0.7)';
            ctx.fillText('Samla 3 paket', this.x + this.width/2, baseY + this.height + 20);
        }
        
        ctx.restore();
    }

    activate() {
        const snowmanDiesSound = document.getElementById('portalSound');
        if (snowmanDiesSound) {
            snowmanDiesSound.currentTime = 0; // Reset sound to start
            snowmanDiesSound.play();
        }
        this.isActive = true;
    }

    deactivate() {
        this.isActive = false;
    }
}