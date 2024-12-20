class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isFloor = false;  // New flag to identify floor platforms
    }

    draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class PlatformManager {
    constructor(game) {
        this.game = game;
        this.platforms = [];
        this.minPlatformWidth = 100;
        this.maxPlatformWidth = 200;
        this.platformHeight = 20;
        this.minGap = 100;  // Minimum horizontal gap between platforms
        this.maxGap = 200;  // Maximum horizontal gap
        this.heightVariation = 100;  // How much platforms can vary in height
        this.lastPlatformX = 0;  // Track the rightmost platform
        this.floorSegments = [];  // Separate array for floor segments
    }

    generateStartingPlatforms() {
        // Initial floor segment
        this.extendFloor(0, this.game.canvas.width * 3);

        // Generate initial set of platforms
        let currentX = 50;  // Start a bit from the left
        let baseY = this.game.canvas.height - 150;  // Start height for platforms

        while (currentX < this.game.canvas.width * 1.5) {  // Generate beyond screen width
            const width = Math.random() * (this.maxPlatformWidth - this.minPlatformWidth) + this.minPlatformWidth;
            const heightChange = (Math.random() - 0.5) * this.heightVariation;
            const y = Math.max(100, Math.min(baseY + heightChange, this.game.canvas.height - 100));
            
            this.platforms.push(new Platform(currentX, y, width, this.platformHeight));
            
            currentX += width + (Math.random() * (this.maxGap - this.minGap) + this.minGap);
            baseY = y;  // Use last platform's height as new base
            this.lastPlatformX = currentX;
        }
    }

    extendFloor(fromX, toX) {
        const floorPlatform = new Platform(fromX, this.game.canvas.height - 50, toX - fromX, 50);
        floorPlatform.isFloor = true;
        this.floorSegments.push(floorPlatform);
    }

    generateMorePlatforms(upToX) {
        let currentX = this.lastPlatformX;
        let baseY = this.game.canvas.height - 150;

        // If there are platforms, use the last one's height as base
        if (this.platforms.length > 0) {
            const lastPlatform = this.platforms[this.platforms.length - 1];
            baseY = lastPlatform.y;
        }

        // Extend floor if needed
        const lastFloorX = this.floorSegments[this.floorSegments.length - 1].x + 
                          this.floorSegments[this.floorSegments.length - 1].width;
        if (lastFloorX < upToX) {
            this.extendFloor(lastFloorX, upToX + this.game.canvas.width);
        }

        while (currentX < upToX) {
            const width = Math.random() * (this.maxPlatformWidth - this.minPlatformWidth) + this.minPlatformWidth;
            const heightChange = (Math.random() - 0.5) * this.heightVariation;
            const y = Math.max(100, Math.min(baseY + heightChange, this.game.canvas.height - 100));
            
            this.platforms.push(new Platform(currentX, y, width, this.platformHeight));
            
            currentX += width + (Math.random() * (this.maxGap - this.minGap) + this.minGap);
            baseY = y;
        }
        
        this.lastPlatformX = currentX;

        // Remove platforms that are far behind the camera
        this.cleanupPlatforms();
    }

    cleanupPlatforms() {
        // Keep platforms until they're further behind
        const cleanupX = this.lastPlatformX - this.game.canvas.width * 3;  // Increased cleanup distance
        
        // Clean up regular platforms
        this.platforms = this.platforms.filter(platform => 
            platform.x + platform.width > cleanupX
        );

        // Clean up floor segments
        this.floorSegments = this.floorSegments.filter(floor => 
            floor.x + floor.width > cleanupX
        );
    }

    checkGenerateMorePlatforms(viewX) {
        if (this.lastPlatformX < viewX + this.game.canvas.width) {
            this.generateMorePlatforms(viewX + this.game.canvas.width * 1.5);
        }
    }

    draw(ctx) {
        // Draw floor segments first
        this.floorSegments.forEach(floor => floor.draw(ctx));
        // Then draw platforms
        this.platforms.forEach(platform => platform.draw(ctx));
    }
}