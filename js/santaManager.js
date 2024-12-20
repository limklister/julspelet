class SantaManager {
    constructor(game) {
        this.game = game;
        this.santas = [];
        this.packages = [];
    }

    generateInitialSantas() {
        // Add a few Santas at different heights
        this.santas.push(new Santa(100, 100, this.game));
        this.santas.push(new Santa(300, 200, this.game));
    }

    updateAll() {
        // Update Santas and collect any new packages
        this.santas.forEach(santa => {
            const newPackage = santa.update();
            if (newPackage) {
                this.packages.push(newPackage);
            }
        });

        // Update existing packages
        this.packages.forEach(pkg => {
            pkg.update();
        });

        // Remove collected packages
        this.packages = this.packages.filter(pkg => !pkg.collected);
    }

    dropPackage(x, y) {
        const newPackage = new Package(x, y);
        this.packages.push(newPackage);
    }

    drawAll(ctx) {
        this.santas.forEach(santa => santa.draw(ctx));
        this.packages.forEach(pkg => pkg.draw(ctx));
    }
}