/**
 * Power Silicon Technologies — Hyper-Realistic Fast-Moving 2nm Silicon Fabrication Engine
 * Blazing 60 FPS hardware-accelerated semiconductor manufacturing lifecycle:
 * - Stage 1: 13.5nm High-NA EUV Laser Lithography (Extreme Precision Scanning)
 * - Stage 2: High-Speed Multi-Beam Laser Etching & 2nm Nanoscale Routing
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
  let speedMultiplier = 2.0; // Fast-moving default speed
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

  textureImages.forEach((tex, idx) => {
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
      duration: 3.2,
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
      duration: 3.2,
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
      duration: 3.2,
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
      duration: 3.2,
      statName: 'CLOCK CLOSURE',
      statVal: '6.00 GHz+',
      statName2: 'SILICON YIELD',
      statVal2: '99.98%'
    }
  ];

  // Particle System: Sparks & Photon Bursts
  const sparks = [];
  for (let i = 0; i < 110; i++) {
    sparks.push({
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.5) * 18,
      size: Math.random() * 3 + 1,
      life: Math.random(),
      decay: Math.random() * 0.04 + 0.02,
      color: Math.random() > 0.5 ? '#00e5ff' : (Math.random() > 0.5 ? '#f58220' : '#ffffff')
    });
  }

  // Fast Circuit Pulses
  const pulses = [];
  for (let i = 0; i < 28; i++) {
    pulses.push({
      x: Math.random() * 800,
      y: Math.random() * 600,
      len: Math.random() * 80 + 40,
      speed: Math.random() * 8 + 5,
      dir: Math.random() > 0.5 ? 'h' : 'v',
      color: i % 2 === 0 ? '#00e5ff' : '#f58220'
    });
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    width = parent ? (parent.offsetWidth || 540) : 540;
    height = parent ? (parent.offsetHeight || 480) : 480;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resize);
  setTimeout(resize, 50);

  // User Interaction: Switch Stage or Adjust Speed
  canvas.addEventListener('click', function (e) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check if clicked near speed buttons (bottom right)
    if (clickY > height - 42 && clickX > width - 180) {
      if (clickX > width - 60) {
        speedMultiplier = 4.0; // Ultra fast
      } else if (clickX > width - 120) {
        speedMultiplier = 2.5; // Fast
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
    const transitionPhase = Math.max(0, (stageTimer - (stage.duration - 0.75)) / 0.75); // 0 to 1 crossfade

    // 1. Clear Frame
    ctx.fillStyle = '#020614';
    ctx.fillRect(0, 0, width, height);

    // 2. Render High-Resolution Texture Background with Cinematic Pan & Zoom
    const currentTex = textureImages[stage.texIndex];
    const nextTex = textureImages[nextStage.texIndex];

    const zoom = 1.0 + 0.04 * Math.sin(time * 0.8);
    const panX = Math.cos(time * 0.6) * 12;
    const panY = Math.sin(time * 0.9) * 8;

    ctx.save();
    ctx.translate(width / 2 + panX, height / 2 + panY);
    ctx.scale(zoom, zoom);
    ctx.translate(-width / 2, -height / 2);

    if (currentTex && currentTex.loaded) {
      ctx.globalAlpha = 1.0 - transitionPhase * 0.75;
      drawCoverImage(currentTex.img, 0, 0, width, height);
    }

    if (transitionPhase > 0 && nextTex && nextTex.loaded) {
      ctx.globalAlpha = transitionPhase;
      drawCoverImage(nextTex.img, 0, 0, width, height);
    }
    ctx.restore();

    // 3. Dark Futuristic High-Contrast Cleanroom Vignette
    const vignette = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.2, width * 0.5, height * 0.5, width * 0.75);
    vignette.addColorStop(0, 'rgba(2, 6, 20, 0.15)');
    vignette.addColorStop(0.65, 'rgba(2, 6, 20, 0.45)');
    vignette.addColorStop(1, 'rgba(2, 6, 20, 0.92)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    // 4. Fast Dynamic Multi-Beam Laser Scanning Across the Wafer
    const scanProgress = (time * 1.6) % 1.0;
    const scanX = width * 0.15 + scanProgress * (width * 0.7);
    const laserY = height * 0.42 + Math.sin(time * 3.5) * 45;

    // Glowing Laser Line Sweep
    ctx.save();
    ctx.shadowBlur = 18;
    ctx.shadowColor = stage.color;

    const laserGrad = ctx.createLinearGradient(scanX - 35, 0, scanX + 35, 0);
    laserGrad.addColorStop(0, 'rgba(0,0,0,0)');
    laserGrad.addColorStop(0.5, stage.color);
    laserGrad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = laserGrad;
    ctx.fillRect(scanX - 18, 0, 36, height);

    // Ultra-bright core beam
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(scanX, 0);
    ctx.lineTo(scanX, height);
    ctx.stroke();

    // Secondary Crosshair Beam (Horizontal)
    const scanH = height * 0.2 + ((time * 2.2) % 1.0) * (height * 0.6);
    ctx.strokeStyle = 'rgba(245, 130, 32, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, scanH);
    ctx.lineTo(width, scanH);
    ctx.stroke();
    ctx.restore();

    // 5. High-Speed Laser Focal Point & Plasma Glow
    ctx.save();
    const focalX = scanX;
    const focalY = laserY;

    const focalGlow = ctx.createRadialGradient(focalX, focalY, 0, focalX, focalY, 70);
    focalGlow.addColorStop(0, '#ffffff');
    focalGlow.addColorStop(0.2, stage.color);
    focalGlow.addColorStop(0.6, 'rgba(245, 130, 32, 0.35)');
    focalGlow.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = focalGlow;
    ctx.beginPath();
    ctx.arc(focalX, focalY, 70, 0, Math.PI * 2);
    ctx.fill();

    // Concentric Precision Target Ring
    ctx.strokeStyle = stage.accent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(focalX, focalY, 22 + Math.sin(time * 8) * 4, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshairs
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(focalX - 16, focalY);
    ctx.lineTo(focalX + 16, focalY);
    ctx.moveTo(focalX, focalY - 16);
    ctx.lineTo(focalX, focalY + 16);
    ctx.stroke();
    ctx.restore();

    // 6. Real-Time Laser Sparks Spray
    ctx.save();
    sparks.forEach(p => {
      p.life -= p.decay * dt * 60 * speedMultiplier;
      if (p.life <= 0) {
        p.life = 1.0;
        p.x = focalX + (Math.random() - 0.5) * 10;
        p.y = focalY + (Math.random() - 0.5) * 10;
        p.vx = (Math.random() - 0.5) * 18;
        p.vy = (Math.random() - 0.5) * 18 - 2.5; // Slight upward buoyancy
      }

      p.x += p.vx * dt * 45 * speedMultiplier;
      p.y += p.vy * dt * 45 * speedMultiplier;

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life * 0.9;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // 7. Fast Moving Micro-Circuit Nano-Bus Pulses
    ctx.save();
    pulses.forEach(pulse => {
      ctx.strokeStyle = pulse.color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.65;
      ctx.shadowBlur = 6;
      ctx.shadowColor = pulse.color;

      if (pulse.dir === 'h') {
        pulse.x += pulse.speed * dt * 60 * speedMultiplier;
        if (pulse.x > width + 100) pulse.x = -100;
        ctx.beginPath();
        ctx.moveTo(pulse.x, pulse.y);
        ctx.lineTo(pulse.x + pulse.len, pulse.y);
        ctx.stroke();
      } else {
        pulse.y += pulse.speed * dt * 60 * speedMultiplier;
        if (pulse.y > height + 100) pulse.y = -100;
        ctx.beginPath();
        ctx.moveTo(pulse.x, pulse.y);
        ctx.lineTo(pulse.x, pulse.y + pulse.len);
        ctx.stroke();
      }
    });
    ctx.restore();

    // 8. TOP HUD: Real-Time Process Badge & Stage Banner
    drawTopHUD(stage);

    // 9. BOTTOM HUD: Live Telemetry Metrics, Stage Tabs & Speed Toggle
    drawBottomHUD(stage);
  }

  function drawTopHUD(stage) {
    ctx.save();
    // Top Bar Background
    ctx.fillStyle = 'rgba(3, 7, 18, 0.88)';
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(14, 14, width - 28, 48, 8);
    ctx.fill();
    ctx.stroke();

    // Live Pulsing Dot
    const pulseAlpha = 0.5 + 0.5 * Math.sin(time * 6);
    ctx.fillStyle = `rgba(239, 68, 68, ${pulseAlpha})`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ef4444';
    ctx.beginPath();
    ctx.arc(28, 38, 5, 0, Math.PI * 2);
    ctx.fill();

    // Live Text
    ctx.shadowBlur = 0;
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('LIVE FAB 60FPS', 40, 42);

    // Stage Name
    ctx.font = '600 11.5px "Outfit", sans-serif';
    ctx.fillStyle = stage.color;
    ctx.fillText(stage.title, 155, 42);

    // Right Tag
    ctx.font = '700 10.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#f58220';
    ctx.textAlign = 'right';
    ctx.fillText(`[${stage.tag}]`, width - 26, 42);

    // Thin Progress Bar
    const progress = stageTimer / stage.duration;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(14, 60, width - 28, 2.5);

    ctx.fillStyle = stage.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = stage.color;
    ctx.fillRect(14, 60, (width - 28) * progress, 2.5);
    ctx.restore();
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
    const liveX = (120 + Math.sin(time * 4) * 80).toFixed(2);
    const liveY = (340 + Math.cos(time * 3) * 60).toFixed(2);
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

    ctx.fillStyle = speedMultiplier === 2.0 || speedMultiplier === 2.5 ? '#f58220' : '#64748b';
    ctx.fillText('FAST 2.5x', width - 72, hudY + 58);

    ctx.fillStyle = speedMultiplier >= 4.0 ? '#10b981' : '#64748b';
    ctx.fillText('5x ULTRA', width - 26, hudY + 58);

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
