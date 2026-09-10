/**
 * Power Silicon Technologies — Hyper-Realistic Cleanroom & 2nm Silicon Process Showcase
 * 60 FPS hardware-accelerated semiconductor manufacturing lifecycle:
 * - Stage 1: 13.5nm High-NA EUV Laser Lithography (Extreme Precision Cleanroom)
 * - Stage 2: High-Speed Multi-Beam Laser Etching & 2nm Nanoscale Wafer Processing
 * - Stage 3: High-Speed Automated Multi-Axis Robotic Die Assembly & 3D Packaging
 * - Stage 4: 16-Layer Interconnect Metallization & 6.0GHz Silicon Timing Signoff
 */

(function () {
  const canvas = document.getElementById('fab-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0, height = 0, dpr = 1;
  let animId = null;
  let time = 0;
  let speedMultiplier = 1.8; // Smooth fast-moving default speed
  let currentStageIndex = 0;
  let stageTimer = 0;
  let isPaused = false;

  // High-Resolution Stage Textures
  const textureImages = [
    { src: 'images/fab-cleanroom-euv.jpg', img: new Image(), loaded: false },
    { src: 'images/fab-euv-fast-scanner.jpg', img: new Image(), loaded: false },
    { src: 'images/fab-cleanroom-robotics.jpg', img: new Image(), loaded: false },
    { src: 'images/fab-cleanroom-wafer.jpg', img: new Image(), loaded: false }
  ];

  textureImages.forEach((tex) => {
    tex.img.onload = () => { tex.loaded = true; };
    tex.img.src = tex.src;
  });

  // Fast-Moving Process Stages
  const STAGES = [
    {
      id: 1,
      title: '01. HIGH-NA 2nm EUV LITHOGRAPHY',
      sub: '13.5nm EXTREME UV LASER • 0.55 HIGH-NA OPTICS',
      tag: 'SUB-2nm SCAN',
      color: '#00e5ff',
      accent: '#38bdf8',
      texIndex: 0,
      duration: 3.5,
      statName: 'LASER WAVELENGTH',
      statVal: '13.5 nm EUV',
      statName2: 'BEAM POWER',
      statVal2: '500 W'
    },
    {
      id: 2,
      title: '02. HIGH-SPEED MULTI-BEAM ETCHING',
      sub: '260,000 CONCURRENT BEAMS • NANO-TRANSISTOR FORMATION',
      tag: 'MULTI-BEAM ETCH',
      color: '#f58220',
      accent: '#ffb74d',
      texIndex: 1,
      duration: 3.5,
      statName: 'SCAN SPEED',
      statVal: '1,450 mm/s',
      statName2: 'BEAM CHANNELS',
      statVal2: '260K BEAMS'
    },
    {
      id: 3,
      title: '03. ROBOTIC DIE PICK & 3D CHIPLET PACKAGING',
      sub: 'MICRO-BUMP BONDING • CO-PACKAGED OPTICS INTERPOSER',
      tag: '3D CHIPLET BOND',
      color: '#a855f7',
      accent: '#c084fc',
      texIndex: 2,
      duration: 3.5,
      statName: 'BUMP PITCH',
      statVal: '9.0 µm 3D',
      statName2: 'PICK RATE',
      statVal2: '3,600 DPH'
    },
    {
      id: 4,
      title: '04. 16-LAYER METALLIZATION & 6.0GHz SIGNOFF',
      sub: 'DUAL-DAMASCENE COPPER • 0.00ps TIMING SLACK',
      tag: 'TAPE-OUT SIGNOFF',
      color: '#10b981',
      accent: '#34d399',
      texIndex: 3,
      duration: 3.5,
      statName: 'CLOCK CLOSURE',
      statVal: '6.00 GHz+',
      statName2: 'SILICON YIELD',
      statVal2: '99.98%'
    }
  ];

  // Subtle Floating Photon Sparkles (No artificial lines)
  const sparkles = [];
  for (let i = 0; i < 45; i++) {
    sparkles.push({
      x: Math.random() * 800,
      y: Math.random() * 600,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -Math.random() * 2 - 0.5,
      size: Math.random() * 2.5 + 0.8,
      life: Math.random(),
      decay: Math.random() * 0.015 + 0.008,
      color: Math.random() > 0.5 ? '#00e5ff' : '#f58220'
    });
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    width = parent ? (parent.offsetWidth || 540) : 540;
    height = parent ? (parent.offsetHeight || 468) : 468;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resize);
  setTimeout(resize, 50);
  setTimeout(resize, 250);

  if (typeof ResizeObserver !== 'undefined' && canvas.parentElement) {
    new ResizeObserver(() => {
      resize();
    }).observe(canvas.parentElement);
  }

  // User Interaction: Switch Stage or Adjust Speed
  canvas.addEventListener('click', function (e) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check if clicked near speed buttons (bottom right)
    if (clickY > height - 42 && clickX > width - 180) {
      if (clickX > width - 60) {
        speedMultiplier = 3.5; // Ultra fast
      } else if (clickX > width - 120) {
        speedMultiplier = 2.0; // Fast
      } else {
        speedMultiplier = 1.0; // Normal
      }
      return;
    }

    // Check if clicked stage tabs (bottom left)
    if (clickY > height - 42 && clickX < 240) {
      const tabIdx = Math.floor(clickX / 60);
      if (tabIdx >= 0 && tabIdx < STAGES.length) {
        currentStageIndex = tabIdx;
        stageTimer = 0;
      }
      return;
    }

    // Otherwise cycle to next stage
    currentStageIndex = (currentStageIndex + 1) % STAGES.length;
    stageTimer = 0;
  });

  let lastTs = performance.now();

  function animate(now) {
    animId = requestAnimationFrame(animate);
    const dt = Math.min((now - lastTs) / 1000, 0.1);
    lastTs = now;

    if (isPaused) return;

    time += dt * speedMultiplier;
    stageTimer += dt * speedMultiplier;

    const stage = STAGES[currentStageIndex];
    if (stageTimer >= stage.duration) {
      stageTimer = 0;
      currentStageIndex = (currentStageIndex + 1) % STAGES.length;
    }

    render(dt);
  }

  function render(dt) {
    if (width === 0 || height === 0) return;

    const stage = STAGES[currentStageIndex];
    const nextStage = STAGES[(currentStageIndex + 1) % STAGES.length];
    const transitionPhase = Math.max(0, (stageTimer - (stage.duration - 0.8)) / 0.8); // Smooth 0.8s crossfade

    // 1. Clear Frame
    ctx.fillStyle = '#020614';
    ctx.fillRect(0, 0, width, height);

    // 2. Render Photorealistic High-Definition Media with Cinematic Motion
    const currentTex = textureImages[stage.texIndex];
    const nextTex = textureImages[nextStage.texIndex];

    const zoom = 1.0 + 0.035 * Math.sin(time * 0.6);
    const panX = Math.cos(time * 0.4) * 10;
    const panY = Math.sin(time * 0.5) * 6;

    ctx.save();
    ctx.translate(width / 2 + panX, height / 2 + panY);
    ctx.scale(zoom, zoom);
    ctx.translate(-width / 2, -height / 2);

    if (currentTex && currentTex.loaded) {
      ctx.globalAlpha = 1.0 - transitionPhase;
      drawCoverImage(currentTex.img, 0, 0, width, height);
    }

    if (transitionPhase > 0 && nextTex && nextTex.loaded) {
      ctx.globalAlpha = transitionPhase;
      drawCoverImage(nextTex.img, 0, 0, width, height);
    }
    ctx.restore();

    // 3. Subtle Cinematic Lighting & Edge Vignette
    ctx.save();
    const vignette = ctx.createRadialGradient(
      width * 0.5, height * 0.5, width * 0.3,
      width * 0.5, height * 0.5, width * 0.78
    );
    vignette.addColorStop(0, 'rgba(2, 6, 20, 0.0)');
    vignette.addColorStop(0.7, 'rgba(2, 6, 20, 0.35)');
    vignette.addColorStop(1, 'rgba(2, 6, 20, 0.88)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // 4. Soft Ambient Laser Glow (Natural, no lines)
    ctx.save();
    const glowX = width * 0.5 + Math.cos(time * 1.2) * (width * 0.25);
    const glowY = height * 0.55 + Math.sin(time * 1.5) * (height * 0.15);
    const ambientGlow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 140);
    ambientGlow.addColorStop(0, 'rgba(0, 229, 255, 0.22)');
    ambientGlow.addColorStop(0.4, 'rgba(245, 130, 32, 0.12)');
    ambientGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = ambientGlow;
    ctx.beginPath();
    ctx.arc(glowX, glowY, 140, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 5. Floating Cleanroom Photon Sparkles
    ctx.save();
    sparkles.forEach(p => {
      p.life -= p.decay * dt * 60 * speedMultiplier;
      if (p.life <= 0) {
        p.life = 1.0;
        p.x = Math.random() * width;
        p.y = height + 10;
        p.vx = (Math.random() - 0.5) * 1.2;
        p.vy = -Math.random() * 2 - 0.5;
      }

      p.x += p.vx * dt * 45;
      p.y += p.vy * dt * 45;

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life * 0.6;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // 6. BOTTOM HUD: Live Telemetry Metrics, Stage Dots & Speed Toggle
    drawBottomHUD(stage);
  }

  function drawBottomHUD(stage) {
    ctx.save();
    // Bottom Telemetry Bar Background
    const hudHeight = 72;
    const hudY = height - hudHeight - 14;

    ctx.fillStyle = 'rgba(3, 7, 18, 0.9)';
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.28)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(14, hudY, width - 28, hudHeight, 8);
    ctx.fill();
    ctx.stroke();

    // Metric 1
    ctx.font = '600 10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'left';
    ctx.fillText(stage.statName, 26, hudY + 22);

    ctx.font = '700 13px "Outfit", sans-serif';
    ctx.fillStyle = '#00e5ff';
    ctx.fillText(stage.statVal, 26, hudY + 40);

    // Metric 2
    const midX = width * 0.38;
    ctx.font = '600 10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(stage.statName2, midX, hudY + 22);

    ctx.font = '700 13px "Outfit", sans-serif';
    ctx.fillStyle = '#f58220';
    ctx.fillText(stage.statVal2, midX, hudY + 40);

    // Live Coordinate Telemetry
    const coordX = width * 0.65;
    ctx.font = '600 9.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748b';
    const liveX = (120 + Math.sin(time * 2) * 80).toFixed(2);
    const liveY = (340 + Math.cos(time * 1.8) * 60).toFixed(2);
    ctx.fillText(`STEPPER: X:${liveX} Y:${liveY}`, coordX, hudY + 22);
    ctx.fillText(`PRECISION: ±0.05nm (GAA-FET)`, coordX, hudY + 38);

    // Interactive Stage Dots (Bottom Row)
    for (let i = 0; i < STAGES.length; i++) {
      const dotX = 28 + i * 22;
      const dotY = hudY + 56;
      ctx.beginPath();
      ctx.arc(dotX, dotY, i === currentStageIndex ? 4.5 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = i === currentStageIndex ? STAGES[i].color : 'rgba(148, 163, 184, 0.4)';
      ctx.fill();
    }

    // Interactive Speed Buttons on the right
    ctx.textAlign = 'right';
    ctx.font = '700 9.5px "JetBrains Mono", monospace';
    ctx.fillStyle = speedMultiplier === 1.0 ? '#00e5ff' : '#64748b';
    ctx.fillText('1x', width - 125, hudY + 58);

    ctx.fillStyle = speedMultiplier >= 1.8 && speedMultiplier < 3.0 ? '#f58220' : '#64748b';
    ctx.fillText('FAST 2x', width - 72, hudY + 58);

    ctx.fillStyle = speedMultiplier >= 3.0 ? '#10b981' : '#64748b';
    ctx.fillText('4x ULTRA', width - 26, hudY + 58);

    ctx.restore();
  }

  // Utility: Cover Aspect Ratio Draw
  function drawCoverImage(img, x, y, w, h) {
    if (!img.complete || img.naturalWidth === 0) return;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;
    let sW, sH, sX, sY;

    if (imgRatio > canvasRatio) {
      sH = img.naturalHeight;
      sW = sH * canvasRatio;
      sX = (img.naturalWidth - sW) / 2;
      sY = 0;
    } else {
      sW = img.naturalWidth;
      sH = sW / canvasRatio;
      sX = 0;
      sY = (img.naturalHeight - sH) / 2;
    }

    ctx.drawImage(img, sX, sY, sW, sH, x, y, w, h);
  }

  // Start Engine
  animId = requestAnimationFrame(animate);

})();
