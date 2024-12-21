class UI {
  constructor() {
    // Preload images
    this.heartImage = new Image();

    this.packageImage = new Image();
    this.packageImage.src = "images/gift.png";

    // Add transition properties
    this.showingLevelTransition = false;
    this.transitionTimer = 0;
    this.transitionDuration = 120; // frames (2 seconds at 60fps)
    this.transitionText = "";

    // Add end game celebration properties
    this.showingEndGameCelebration = false;
    this.endGameTimer = 300; // 5 seconds at 60fps
  }

  drawHearts(ctx, hearts) {
    const heartSize = 20;
    const heartSpacing = 25;
    const heartY = 20;

    for (let i = 0; i < hearts; i++) {
      const heartX = 20 + i * heartSpacing;

      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.moveTo(heartX + heartSize / 2, heartY + heartSize / 4);
      ctx.bezierCurveTo(
        heartX + heartSize / 2,
        heartY,
        heartX,
        heartY,
        heartX,
        heartY + heartSize / 4
      );
      ctx.bezierCurveTo(
        heartX,
        heartY + heartSize / 2,
        heartX + heartSize / 2,
        heartY + heartSize,
        heartX + heartSize / 2,
        heartY + heartSize
      );
      ctx.bezierCurveTo(
        heartX + heartSize / 2,
        heartY + heartSize,
        heartX + heartSize,
        heartY + heartSize / 2,
        heartX + heartSize,
        heartY + heartSize / 4
      );
      ctx.bezierCurveTo(
        heartX + heartSize,
        heartY,
        heartX + heartSize / 2,
        heartY,
        heartX + heartSize / 2,
        heartY + heartSize / 4
      );
      ctx.fill();
    }
  }

  drawPackageCount(ctx, canvas, game) {
    const packageSize = 20;
    const packageSpacing = 25;
    const packageY = 20;

    const startX = canvas.width - 150;

    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.textAlign = "right";
    const packagesText = `${game.packagesCollected}/3 paket`;
    ctx.strokeText(packagesText, startX - 10, packageY + 15);
    ctx.fillText(packagesText, startX - 10, packageY + 15);

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
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.textAlign = "left";
    const levelText = `Nivå ${game.currentLevel}`;
    ctx.strokeText(levelText, 20, 60);
    ctx.fillText(levelText, 20, 60);
  }

  drawPortalHint(ctx, canvas, game) {
    if (game.packagesCollected >= 3 && game.portal.isActive) {
      ctx.font = "20px Arial";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      ctx.textAlign = "center";
      const hintText = "Portalen är öppen! →";
      ctx.strokeText(hintText, canvas.width / 2, 30);
      ctx.fillText(hintText, canvas.width / 2, 30);
    }
  }

  drawGameOverScreen(ctx, canvas) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Julen är slut!", canvas.width / 2, canvas.height / 2);

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText(
      "Tryck på R för nästa jul",
      canvas.width / 2,
      canvas.height / 2 + 50
    );
  }

  startLevelTransition(level) {
    this.showingLevelTransition = true;
    this.transitionTimer = this.transitionDuration;
    this.transitionText = `HURRA! NÄSTA NIVÅ!`;
  }

  startEndGameCelebration(game) {
    this.showingEndGameCelebration = true;
    this.endGameTimer = 300; // 5 seconds
    setTimeout(() => {
      game.resetGame();
    }, 5000);
  }

  update() {
    if (this.showingLevelTransition && this.transitionTimer > 0) {
      this.transitionTimer--;
      if (this.transitionTimer === 0) {
        this.showingLevelTransition = false;
      }
    }

    if (this.showingEndGameCelebration && this.endGameTimer > 0) {
      this.endGameTimer--;
    }
  }

  drawEndGameCelebration(ctx, canvas) {
    if (!this.showingEndGameCelebration) return;

    const progress = this.endGameTimer / 300;

    // Draw semi-transparent overlay with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "rgba(0, 100, 0, 0.9)"); // Dark green at top
    gradient.addColorStop(1, "rgba(255, 0, 0, 0.9)"); // Red at bottom
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw celebratory text with glow effect
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw glow
    ctx.shadowColor = "gold";
    ctx.shadowBlur = 20;
    ctx.font = "bold 48px Arial";
    ctx.fillStyle = "rgba(255, 223, 0, 1)"; // Golden yellow
    ctx.fillText("God jul önskar", canvas.width / 2, canvas.height / 2 - 40);

    ctx.font = "bold 36px Arial";
    ctx.fillText(
      "Folke, Ellis, Anna och Alex",
      canvas.width / 2,
      canvas.height / 2 + 40
    );

    ctx.restore();

    // Draw sparkles
    this.drawSparkles(ctx, canvas, progress);

    // Draw snowflakes
    this.drawCelebrationSnowflakes(ctx, canvas, progress);
  }

  drawCelebrationSnowflakes(ctx, canvas, progress) {
    const numSnowflakes = 50;
    ctx.fillStyle = "white";

    for (let i = 0; i < numSnowflakes; i++) {
      const x = ((Math.sin(progress * 2 + i) + 1) * canvas.width) / 2;
      const y = ((progress * 2 + i / numSnowflakes) % 1) * canvas.height;
      const size = 2 + Math.sin(progress * 10 + i) * 2;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawLevelTransition(ctx, canvas) {
    if (!this.showingLevelTransition) return;

    const progress = this.transitionTimer / this.transitionDuration;
    const alpha =
      progress < 0.8
        ? progress
        : this.transitionTimer / this.transitionDuration;

    ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.7})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const bounceOffset = Math.sin(progress * Math.PI * 2) * 20;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowColor = "gold";
    ctx.shadowBlur = 20;
    ctx.font = "bold 48px Arial";
    ctx.fillStyle = `rgba(255, 223, 0, ${alpha})`;
    ctx.fillText(
      this.transitionText,
      canvas.width / 2,
      canvas.height / 2 + bounceOffset
    );

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeText(
      this.transitionText,
      canvas.width / 2,
      canvas.height / 2 + bounceOffset
    );

    ctx.restore();

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
    ctx.save();

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const game = player.game;

    this.drawHearts(ctx, player.health);
    this.drawPackageCount(ctx, canvas, game);
    this.drawLevel(ctx, game);
    this.drawPortalHint(ctx, canvas, game);

    if (game && game.gameOver) {
      this.drawGameOverScreen(ctx, canvas);
    }

    if (this.showingLevelTransition) {
      this.drawLevelTransition(ctx, canvas);
    }

    if (this.showingEndGameCelebration) {
      this.drawEndGameCelebration(ctx, canvas);
    }

    ctx.restore();
  }

  reset() {
    Package.resetPackageCount();
    this.showingLevelTransition = false;
    this.showingEndGameCelebration = false;
    this.transitionTimer = 0;
    this.endGameTimer = 0;
  }
}
