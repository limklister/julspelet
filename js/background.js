class BackgroundManager {
    constructor(game) {
        this.game = game;
        this.spruceTrees = [];
        this.snowflakes = [];
        this.lastGeneratedX = 0;
        this.generateInitialTrees();
        this.generateSnowflakes();
    }

    generateInitialTrees() {
        // Generate initial trees across a wider area
        for (let i = 0; i < 30; i++) {
            this.addTree(Math.random() * this.game.canvas.width * 3);
        }
    }

    generateSnowflakes() {
        // Create initial set of snowflakes
        for (let i = 0; i < 200; i++) {
            this.addSnowflake();
        }
    }

    addSnowflake() {
        const snowflake = {
            x: Math.random() * (this.game.canvas.width * 3),
            y: Math.random() * this.game.canvas.height,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 0.5 + 0.2,
            drift: Math.random() * 0.5 - 0.25
        };
        this.snowflakes.push(snowflake);
    }

    updateSnowflakes(cameraX) {
        this.snowflakes.forEach(flake => {
            // Move snowflake down and slightly sideways
            flake.y += flake.speed;
            flake.x += flake.drift;

            // Regenerate snowflake if it goes below screen
            if (flake.y > this.game.canvas.height) {
                flake.y = 0;
                flake.x = cameraX + Math.random() * this.game.canvas.width;
            }
        });

        // Add more snowflakes if needed
        while (this.snowflakes.length < 200) {
            this.addSnowflake();
        }
    }

    addTree(x) {
        // Randomize tree properties
        const treeHeight = Math.random() * 100 + 150;
        const tree = {
            x: x,
            y: this.game.canvas.height - treeHeight - Math.random() * 100,
            width: Math.random() * 50 + 50,
            height: treeHeight
        };
        this.spruceTrees.push(tree);
    }

    generateMoreTrees(cameraX) {
        // Generate trees to the right of the last generated point
        const viewWidth = this.game.canvas.width;
        const generateUpTo = cameraX + viewWidth * 2;

        while (this.lastGeneratedX < generateUpTo) {
            // Random gap between trees
            const gap = Math.random() * 200 + 100;
            this.addTree(this.lastGeneratedX + gap);
            this.lastGeneratedX += gap;
        }
    }

    cleanupTrees(cameraX) {
        // Remove trees that are far behind the camera
        const cleanupThreshold = cameraX - this.game.canvas.width;
        this.spruceTrees = this.spruceTrees.filter(tree => tree.x > cleanupThreshold);
    }

    update(cameraX) {
        // Generate more trees as we move
        this.generateMoreTrees(cameraX);
        
        // Clean up trees behind the camera
        this.cleanupTrees(cameraX);

        // Update snowflakes
        this.updateSnowflakes(cameraX);
    }

    drawBackgroundTrees(ctx) {
        this.spruceTrees.forEach(tree => {
            // Draw tree trunk
            ctx.fillStyle = '#8B4513';  // Brown trunk
            ctx.fillRect(tree.x, tree.y + tree.height / 2, 10, tree.height / 2);

            // Draw spruce tree shape
            ctx.fillStyle = '#228B22';  // Dark green
            ctx.beginPath();
            ctx.moveTo(tree.x - tree.width / 2, tree.y + tree.height / 2);
            ctx.lineTo(tree.x, tree.y);
            ctx.lineTo(tree.x + tree.width / 2, tree.y + tree.height / 2);
            ctx.closePath();
            ctx.fill();

            // Add snow on tree tops with more visibility
            ctx.fillStyle = 'white';  // Pure white for better visibility
            ctx.beginPath();
            // Create a snow cap that covers more of the top
            ctx.moveTo(tree.x - tree.width / 3, tree.y + tree.height / 2.5);
            ctx.lineTo(tree.x, tree.y);
            ctx.lineTo(tree.x + tree.width / 3, tree.y + tree.height / 2.5);
            ctx.closePath();
            ctx.fill();
        });
    }

    drawSnowflakes(ctx, cameraX) {
        ctx.fillStyle = 'white';
        this.snowflakes.forEach(flake => {
            // Only draw snowflakes within camera view
            if (flake.x >= cameraX && flake.x <= cameraX + this.game.canvas.width) {
                ctx.beginPath();
                ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    draw(ctx, cameraX) {
        // Draw background trees
        this.drawBackgroundTrees(ctx);

        // Draw snowflakes
        this.drawSnowflakes(ctx, cameraX);
    }
}
