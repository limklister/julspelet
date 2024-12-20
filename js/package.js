class Package {
    // Static cache for the gift image
    static imageCache = null;
    
    // Static counter for collected packages
    static collectedPackagesCount = 0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 45;  // Increased from 30 to 45 (50% larger)
        this.height = 45; // Increased from 30 to 45 (50% larger)
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
            Physics.applyGravity(this, true);  // Pass true to use package gravity
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
            
            // Update the visual representation of packages
            this.updatePackageDisplay();
        }
    }

    // Method to update package count display with gift icons
    updatePackageDisplay() {
        const packageDisplayElement = document.getElementById('package-display');
        if (packageDisplayElement) {
            // Clear previous display
            packageDisplayElement.innerHTML = '';
            
            // Create and append gift icons for each collected package
            for (let i = 0; i < Package.collectedPackagesCount; i++) {
                const giftIcon = document.createElement('img');
                giftIcon.src = 'images/gift.png';
                giftIcon.style.width = '30px';  // Smaller size for display
                giftIcon.style.height = '30px';
                giftIcon.style.marginRight = '5px';
                packageDisplayElement.appendChild(giftIcon);
            }
        }
    }

    // Static method to reset package count and display (useful for game restart)
    static resetPackageCount() {
        Package.collectedPackagesCount = 0;
        const packageDisplayElement = document.getElementById('package-display');
        if (packageDisplayElement) {
            packageDisplayElement.innerHTML = '';
        }
    }

    // Static method to get current package count
    static getPackageCount() {
        return Package.collectedPackagesCount;
    }
}