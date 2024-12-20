class Package {
    // Static cache for the gift image
    static imageCache = null;
    
    // Static counter for collected packages
    static collectedPackagesCount = 0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.velocityY = 0;
        this.collected = false;
        
        // Use static image cache
        if (!Package.imageCache) {
            Package.imageCache = new Image();
            Package.imageCache.src = 'images/gift.png';
        }
        this.image = Package.imageCache;
    }

    update() {
        if (!this.collected) {
            Physics.applyGravity(this);
            this.y += this.velocityY;
        }
    }

    draw(ctx) {
        if (!this.collected) {
            ctx.drawImage(
                this.image, 
                this.x - this.width/2, 
                this.y, 
                this.width, 
                this.height
            );
        }
    }

    collect() {
        if (!this.collected) {
            this.collected = true;
            // Increment the static counter when a package is collected
            Package.collectedPackagesCount++;
            
            // Optional: You might want to update the UI here
            this.updatePackageCountDisplay();
        }
    }

    // Method to update package count display
    updatePackageCountDisplay() {
        const packageCountElement = document.getElementById('package-count');
        if (packageCountElement) {
            packageCountElement.textContent = `Packages Collected: ${Package.collectedPackagesCount}`;
        }
    }

    // Static method to reset package count (useful for game restart)
    static resetPackageCount() {
        Package.collectedPackagesCount = 0;
        const packageCountElement = document.getElementById('package-count');
        if (packageCountElement) {
            packageCountElement.textContent = 'Packages Collected: 0';
        }
    }

    // Static method to get current package count
    static getPackageCount() {
        return Package.collectedPackagesCount;
    }
}