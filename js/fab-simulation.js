/**
 * Power Silicon Technologies — Fast-Moving Silicon Fabrication & Wafer Simulation Engine
 * Blazing 60 FPS hardware-accelerated semiconductor manufacturing lifecycle:
 * Stage 1: 300mm Raw Silicon Ingot & High-Speed Wafer Spin (12,000 RPM)
 * Stage 2: 13.5nm High-NA EUV Laser Lithography & Sub-2nm Etching
 * Stage 3: 16-Layer Copper Interconnect Metallization & High-Speed Bus Routing
 * Stage 4: High-Speed Robotic Die Pick & 2.5D/3D Chiplet Packaging
 * Stage 5: ATE Wafer Sort, 5.4 GHz Timing Closure & Silicon Signoff
 */

(function () {
  const canvas = document.getElementById('fab-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0, height = 0, dpr = 1;
  let animId = null;
  let time = 0;
  let speedMultiplier = 1.35; // Fast-moving default speed

  // Process Stages
  const STAGES = [
    {
      id: 1,
      name: '01. 300mm WAFER SPIN & ALIGNMENT',
      subtitle: 'CRYSTAL SEED • 12,000 RPM POLISH',
      tag: 'INGOT TO SLICE',
      color: '#00f0ff',
      node: '300mm RAW SILICON',
      duration: 3.2
    },
    {
      id: 2,
      name: '02. 13.5nm HIGH-NA EUV LITHOGRAPHY',
      subtitle: 'SUB-2nm PHOTO-ETCH • 0.55 NA',
      tag: 'EUV LASER SCAN',
      color: '#38bdf8',
      node: '2nm GAA-FET',
      duration: 3.2
    },
    {
      id: 3,
      name: '03. 16-LAYER COPPER METALLIZATION',
      subtitle: '112G PAM4 BUS • DUAL-DAMASCENE',
      tag: 'NANO-ROUTING',
      color: '#f58220',
      node: '16 METAL LAYERS',
      duration: 3.2
    },
    {
      id: 4,
      name: '04. ROBOTIC DIE PICK & 3D PACKAGING',
      subtitle: 'MICRO-BUMP BOND • CO-PACKAGED OPTICS',
      tag: 'FLIP-CHIP 3D',
      color: '#a855f7',
      node: 'CHIPLET ASSEMBLY',
      duration: 3.2
    },
    {
      id: 5,
      name: '05. ATE TIMING CLOSURE & SIGNOFF',
      subtitle: '5.40 GHz CLOSURE • 0.00ps SLACK',
      tag: '100% SIGNOFF',
      color: '#10b981',
      node: 'FIRST-PASS SILICON',
      duration: 3.2
    }
  ];

  const TOTAL_CYCLE = STAGES.reduce((acc, s) => acc + s.duration, 0);

  // Fast Laser Sparks
  const sparks = [];
  for (let i = 0; i < 90; i++) {
    sparks.push({
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.5) * 14,
      size: Math.random() * 3.5 + 1,
      life: Math.random(),
      decay: Math.random() * 0.04 + 0.02,
      color: Math.random() > 0.45 ? '#00f0ff' : (Math.random() > 0.5 ? '#f58220' : '#ffffff')
    });
  }

  // Blazing Bus Packets
  const packets = [];
  for (let i = 0; i < 45; i++) {
    packets.push({
      x: Math.random() * 800,
      y: Math.random() * 600,
      speed: Math.random() * 6 + 4,
      size: Math.random() * 3 + 1.5,
      axis: Math.random() > 0.5 ? 'x' : 'y',
      color: Math.random() > 0.4 ? '#00f0ff' : '#f58220'
    });
  }

  // High-Speed Circuit Traces
  const traces = [];
  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * Math.PI * 2;
    traces.push({
      angle: angle,
      length: 120 + (i % 6) * 35,
      speed: 1.5 + (i % 5) * 0.6,
      color: i % 2 === 0 ? '#00f0ff' : '#f58220'
    });
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    width = parent ? (parent.offsetWidth || 500) : 500;
    height = parent ? (parent.offsetHeight || 460) : 460;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resize);
  setTimeout(resize, 50);

  // Draw 300mm Silicon Wafer with Iridescent Thin-Film Diffraction
  function drawWafer(cx, cy, radius, rotation, stageProgress, stageId) {
    ctx.save();
    ctx.translate(cx, cy);

    // Dynamic 3D tilt perspective based on stage
    const tilt = 0.88 + 0.08 * Math.cos(time * 2);
    ctx.scale(1.0, tilt);
    ctx.rotate(rotation);

    // Wafer Bevel Edge
    const rimGrad = ctx.createRadialGradient(0, 0, radius * 0.85, 0, 0, radius);
    rimGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
    rimGrad.addColorStop(0.7, 'rgba(8, 14, 30, 0.98)');
    rimGrad.addColorStop(0.92, 'rgba(0, 240, 255, 0.25)');
    rimGrad.addColorStop(1, 'rgba(0, 240, 255, 0.7)');

    ctx.fillStyle = rimGrad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.65)';
    ctx.stroke();

    // Alignment Notch
    ctx.beginPath();
    ctx.arc(0, -radius, 7, 0, Math.PI);
    ctx.fillStyle = '#020612';
    ctx.fill();
    ctx.strokeStyle = '#00f0ff';
    ctx.stroke();

    // High-Density Silicon Die Matrix (Grid)
    const dieSize = Math.max(16, Math.floor(radius / 10));
    const cols = Math.floor((radius * 2) / dieSize);
    ctx.lineWidth = 1;

    const fastSweep = (time * 4.5) % (radius * 2) - radius;

    for (let r = -cols / 2; r < cols / 2; r++) {
      for (let c = -cols / 2; c < cols / 2; c++) {
        const dx = c * dieSize;
        const dy = r * dieSize;
        const dist = Math.hypot(dx + dieSize / 2, dy + dieSize / 2);

        if (dist < radius - 10) {
          // Dynamic Die Activity
          const isScanned = (dx - fastSweep) < dieSize * 2 && (dx - fastSweep) > -dieSize * 2;
          const dieSeed = Math.sin(r * 13 + c * 29 + time * 3);

          if (stageId === 2) {
            // Lithography: Laser exposure glow
            if (isScanned) {
              ctx.fillStyle = 'rgba(0, 240, 255, 0.85)';
            } else if (dieSeed > 0.2) {
              ctx.fillStyle = 'rgba(0, 240, 255, 0.28)';
            } else {
              ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
            }
          } else if (stageId === 3) {
            // Metallization: Copper traces glowing
            if ((r + c) % 2 === 0) {
              ctx.fillStyle = 'rgba(245, 130, 32, ' + (0.25 + 0.35 * Math.abs(dieSeed)) + ')';
            } else {
              ctx.fillStyle = 'rgba(0, 240, 255, ' + (0.2 + 0.25 * Math.abs(dieSeed)) + ')';
            }
          } else if (stageId === 4) {
            // Packaging: Gold micro-bump contacts
            ctx.fillStyle = (r * c) % 3 === 0 ? 'rgba(168, 85, 247, 0.4)' : 'rgba(15, 23, 42, 0.55)';
          } else if (stageId === 5) {
            // Testing: 100% Pass Green Flash
            ctx.fillStyle = dieSeed > -0.7 ? 'rgba(16, 185, 129, 0.35)' : 'rgba(0, 240, 255, 0.3)';
          } else {
            // Stage 1: Mirror polished raw silicon
            ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
          }

          ctx.fillRect(dx + 1, dy + 1, dieSize - 2, dieSize - 2);

          // Grid line
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
          ctx.strokeRect(dx, dy, dieSize, dieSize);

          // Micro-core transistor dot
          if ((r + c) % 2 === 0) {
            ctx.fillStyle = stageId === 3 ? '#f58220' : (stageId === 5 ? '#10b981' : '#00f0ff');
            ctx.fillRect(dx + dieSize / 2 - 1, dy + dieSize / 2 - 1, 2, 2);
          }
        }
      }
    }

    // Iridescent Thin-Film Spectral Sheen (Rainbow interference across wafer)
    const sheenGrad = ctx.createLinearGradient(
      Math.cos(time * 1.5) * radius,
      Math.sin(time * 1.5) * radius,
      -Math.cos(time * 1.5) * radius,
      -Math.sin(time * 1.5) * radius
    );
    sheenGrad.addColorStop(0.0, 'rgba(0, 240, 255, 0.04)');
    sheenGrad.addColorStop(0.25, 'rgba(168, 85, 247, 0.14)');
    sheenGrad.addColorStop(0.5, 'rgba(245, 130, 32, 0.12)');
    sheenGrad.addColorStop(0.75, 'rgba(16, 185, 129, 0.14)');
    sheenGrad.addColorStop(1.0, 'rgba(0, 240, 255, 0.04)');

    ctx.fillStyle = sheenGrad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Fast-Moving EUV Laser Lithography Head & Focal Arc
  function drawEUVLaser(cx, cy, radius, currentStage) {
    const scanSpeed = time * 6.5; // Fast high-velocity rastering
    const spotX = cx + Math.sin(scanSpeed) * (radius * 0.75);
    const spotY = cy + Math.cos(scanSpeed * 0.6) * (radius * 0.65);

    // 1. High-Power Overhead EUV Laser Beam
    const beamGrad = ctx.createLinearGradient(spotX, 0, spotX, spotY);
    beamGrad.addColorStop(0.0, 'rgba(0, 240, 255, 0.95)');
    beamGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.65)');
    beamGrad.addColorStop(0.8, 'rgba(168, 85, 247, 0.45)');
    beamGrad.addColorStop(1.0, 'rgba(255, 255, 255, 1.0)');

    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(spotX - 16, 0);
    ctx.lineTo(spotX + 16, 0);
    ctx.lineTo(spotX + 2, spotY);
    ctx.lineTo(spotX - 2, spotY);
    ctx.closePath();
    ctx.fill();

    // Laser Core Beam
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.moveTo(spotX, 0);
    ctx.lineTo(spotX, spotY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 2. High-Energy Plasma Flare on Wafer Surface
    const pulse = 1.0 + 0.35 * Math.sin(time * 24);
    const flare = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, 48 * pulse);
    flare.addColorStop(0.0, '#ffffff');
    flare.addColorStop(0.18, 'rgba(0, 240, 255, 0.95)');
    flare.addColorStop(0.45, 'rgba(245, 130, 32, 0.6)');
    flare.addColorStop(0.8, 'rgba(168, 85, 247, 0.2)');
    flare.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = flare;
    ctx.beginPath();
    ctx.arc(spotX, spotY, 48 * pulse, 0, Math.PI * 2);
    ctx.fill();

    // 3. Laser Targeting Crosshair Reticle
    const b = 18;
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(spotX - b, spotY - b + 6); ctx.lineTo(spotX - b, spotY - b); ctx.lineTo(spotX - b + 6, spotY - b);
    ctx.moveTo(spotX + b - 6, spotY - b); ctx.lineTo(spotX + b, spotY - b); ctx.lineTo(spotX + b, spotY - b + 6);
    ctx.moveTo(spotX - b, spotY + b - 6); ctx.lineTo(spotX - b, spotY + b); ctx.lineTo(spotX - b + 6, spotY + b);
    ctx.moveTo(spotX + b - 6, spotY + b); ctx.lineTo(spotX + b, spotY + b); ctx.lineTo(spotX + b, spotY + b - 6);
    ctx.stroke();

    // 4. Update & Render Fast Sparks / Silicon Ejecta
    sparks.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;

      if (s.life <= 0) {
        s.x = spotX;
        s.y = spotY;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 4;
        s.vx = Math.cos(angle) * speed;
        s.vy = Math.sin(angle) * speed;
        s.life = 1.0;
      }

      ctx.fillStyle = s.color;
      ctx.globalAlpha = Math.max(0, s.life);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;
  }

  // Fast Electrical Signal Bus & Circuit Routing Streams
  function drawHighSpeedSignals() {
    // 1. High-speed perimeter packet streams
    packets.forEach(p => {
      if (p.axis === 'x') {
        p.x += p.speed;
        if (p.x > width) p.x = 0;
      } else {
        p.y += p.speed;
        if (p.y > height) p.y = 0;
      }
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // 2. High-speed circuit traces radiating out
    const cx = width / 2;
    const cy = height / 2;

    traces.forEach(tr => {
      const traceDist = ((time * 70 * tr.speed) % tr.length);
      const px = cx + Math.cos(tr.angle) * (140 + traceDist);
      const py = cy + Math.sin(tr.angle) * (140 + traceDist) * 0.85;

      ctx.fillStyle = tr.color;
      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Live Cleanroom HUD & Real-Time Diagnostics Overlay
  function drawLiveHUD(currentStage, stageProgress) {
    // Top Bar Container
    const topH = 46;
    ctx.fillStyle = 'rgba(2, 6, 18, 0.9)';
    ctx.fillRect(14, 14, width - 28, topH);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(14, 14, width - 28, topH);

    // Blinking REC Status
    const blink = Math.sin(time * 8) > 0;
    ctx.fillStyle = blink ? '#ef4444' : 'rgba(239, 68, 68, 0.4)';
    ctx.beginPath();
    ctx.arc(30, 37, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('LIVE FAB 60FPS', 42, 41);

    // Current Stage Title
    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.fillStyle = currentStage.color;
    const stageTitle = currentStage.name;
    ctx.fillText(stageTitle, 160, 41);

    // Process Tag (Right aligned)
    ctx.fillStyle = '#f58220';
    ctx.font = 'bold 11px "Courier New", monospace';
    const tagText = `[${currentStage.tag}]`;
    const tagW = ctx.measureText(tagText).width;
    ctx.fillText(tagText, width - 24 - tagW, 41);

    // Stage Progress Bar under Top Bar
    ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.fillRect(14, 14 + topH - 3, width - 28, 3);
    ctx.fillStyle = currentStage.color;
    ctx.fillRect(14, 14 + topH - 3, (width - 28) * stageProgress, 3);

    // Bottom Left Telemetry Data Box
    const tbW = Math.min(220, width * 0.46);
    const tbH = 78;
    const tbX = 14;
    const tbY = height - tbH - 14;

    ctx.fillStyle = 'rgba(2, 6, 18, 0.88)';
    ctx.fillRect(tbX, tbY, tbW, tbH);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
    ctx.strokeRect(tbX, tbY, tbW, tbH);

    const curX = (142.0 + Math.sin(time * 4) * 85).toFixed(2);
    const curY = (390.0 + Math.cos(time * 3) * 65).toFixed(2);
    const liveGhz = (5.2 + Math.sin(time * 5) * 0.25).toFixed(2);

    ctx.font = '10px "Courier New", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`• STEPPER: X:${curX} Y:${curY} µm`, tbX + 10, tbY + 20);
    ctx.fillStyle = '#f58220';
    ctx.fillText(`• DIE YIELD: 99.92% (1,198 PASS)`, tbX + 10, tbY + 38);
    ctx.fillStyle = '#10b981';
    ctx.fillText(`• FREQUENCY: ${liveGhz} GHz SIGNOFF`, tbX + 10, tbY + 56);
    ctx.fillStyle = '#a855f7';
    ctx.fillText(`• SLACK: +0.024ps (MET)`, tbX + 10, tbY + 72);

    // Bottom Right High-Speed Oscilloscope Waveform
    const oscW = Math.min(180, width * 0.42);
    const oscH = 54;
    const oscX = width - oscW - 14;
    const oscY = height - oscH - 14;

    ctx.fillStyle = 'rgba(2, 6, 18, 0.88)';
    ctx.fillRect(oscX, oscY, oscW, oscH);
    ctx.strokeStyle = 'rgba(245, 130, 32, 0.4)';
    ctx.strokeRect(oscX, oscY, oscW, oscH);

    ctx.beginPath();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.8;
    for (let x = 0; x < oscW; x += 3) {
      const y = oscY + oscH / 2 +
        Math.sin((x * 0.22) + (time * 18)) * (oscH * 0.28) +
        Math.cos((x * 0.11) - (time * 9)) * (oscH * 0.12);
      if (x === 0) ctx.moveTo(oscX + x, y);
      else ctx.lineTo(oscX + x, y);
    }
    ctx.stroke();

    ctx.font = '9px "Courier New", monospace';
    ctx.fillStyle = '#f58220';
    ctx.fillText('SIGNAL INTEGRITY: 100%', oscX + 8, oscY + 13);
  }

  // Main 60FPS Render Loop
  function loop() {
    time += 0.016 * speedMultiplier;

    ctx.clearRect(0, 0, width, height);

    // Deep high-contrast semiconductor cleanroom background
    ctx.fillStyle = '#020612';
    ctx.fillRect(0, 0, width, height);

    // Calculate current manufacturing stage
    const currentCycleTime = time % TOTAL_CYCLE;
    let accumulated = 0;
    let currentStage = STAGES[0];
    let stageProgress = 0;

    for (let i = 0; i < STAGES.length; i++) {
      if (currentCycleTime >= accumulated && currentCycleTime < accumulated + STAGES[i].duration) {
        currentStage = STAGES[i];
        stageProgress = (currentCycleTime - accumulated) / STAGES[i].duration;
        break;
      }
      accumulated += STAGES[i].duration;
    }

    const cx = width / 2;
    const cy = height / 2;
    const waferRadius = Math.min(width, height) * 0.38;

    // 1. Draw Wafer with rapid rotation & iridescent reflection
    const rotationSpeed = time * 1.8; // Fast spin
    drawWafer(cx, cy, waferRadius, rotationSpeed, stageProgress, currentStage.id);

    // 2. Fast EUV Laser Scanner with Focal Plasma Arc
    drawEUVLaser(cx, cy, waferRadius, currentStage);

    // 3. High-Speed Bus Signals & Circuit Routing Streams
    drawHighSpeedSignals();

    // 4. Live Cleanroom HUD & Diagnostics Overlay
    drawLiveHUD(currentStage, stageProgress);

    animId = requestAnimationFrame(loop);
  }

  loop();
})();
