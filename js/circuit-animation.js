/**
 * Power Silicon Technologies — Interactive 3D Semiconductor Circuit Canvas
 * High-performance 60fps 3D multi-layer silicon die, holographic rings, & particle physics
 */

(function () {
  const canvas = document.getElementById('circuit-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let animationFrameId;

  // Mouse & Parallax state
  const mouse = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    tiltX: 0,
    tiltY: 0,
    targetTiltX: 0,
    targetTiltY: 0,
    radius: 220,
    isHovered: false
  };

  // 3D Die & Holographic Ring properties
  let chipAngle = 0;
  let ringAngle1 = 0;
  let ringAngle2 = 0;
  let time = 0;

  // Node & Packet configurations
  const nodes = [];
  const nodeCount = 55;
  const packets = [];
  const maxPackets = 28;

  // Soft Background Floating 3D Bokeh Orbs
  const orbs = [];
  const orbCount = 18;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = canvas.parentElement.offsetWidth;
    height = canvas.parentElement.offsetHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.scale(dpr, dpr);
    initNodes();
    initOrbs();
  }

  function initOrbs() {
    orbs.length = 0;
    for (let i = 0; i < orbCount; i++) {
      orbs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.8 + 0.2, // depth factor
        radius: Math.random() * 60 + 20,
        color: Math.random() > 0.4 ? 'rgba(0, 210, 255, ' : 'rgba(245, 130, 31, ',
        alpha: Math.random() * 0.05 + 0.02,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4
      });
    }
  }

  function initNodes() {
    nodes.length = 0;
    packets.length = 0;

    const cols = Math.floor(width / 85) + 1;
    const rows = Math.floor(height / 85) + 1;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (Math.random() > 0.42) {
          const x = i * 85 + (Math.random() * 24 - 12);
          const y = j * 85 + (Math.random() * 24 - 12);
          nodes.push({
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            z: Math.random() * 0.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            radius: Math.random() > 0.82 ? 3.5 : 2,
            type: Math.random() > 0.72 ? 'orange' : 'cyan',
            pulse: Math.random() * Math.PI * 2,
            neighbors: []
          });
        }
      }
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 135) {
          nodes[i].neighbors.push(nodes[j]);
        }
      }
    }
  }

  function spawnPacket() {
    if (nodes.length < 2 || packets.length >= maxPackets) return;
    const sourceNode = nodes[Math.floor(Math.random() * nodes.length)];
    if (sourceNode.neighbors.length === 0) return;
    const targetNode = sourceNode.neighbors[Math.floor(Math.random() * sourceNode.neighbors.length)];

    packets.push({
      x: sourceNode.x,
      y: sourceNode.y,
      source: sourceNode,
      target: targetNode,
      progress: 0,
      speed: 0.012 + Math.random() * 0.018,
      color: Math.random() > 0.35 ? '#00d2ff' : '#f5821f',
      size: Math.random() > 0.7 ? 3.5 : 2.5
    });
  }

  // Draw 3D Floating Silicon Multi-Layer Die & Holographic Rings
  function draw3DSiliconDie(centerX, centerY) {
    ctx.save();
    ctx.translate(centerX, centerY);

    // Smooth 3D tilt transformation
    const tiltScaleX = Math.cos(mouse.tiltY * 0.003);
    const tiltOffsetY = Math.sin(mouse.tiltX * 0.003) * 20;

    // 1. Holographic Outer Orbit Ring 1 (Rotates in 3D perspective)
    ctx.save();
    ctx.rotate(ringAngle1);
    ctx.scale(1, 0.45);
    ctx.beginPath();
    ctx.arc(0, 0, 160, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.18)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Orbit Node on Ring 1
    const node1X = Math.cos(ringAngle1 * 2) * 160;
    const node1Y = Math.sin(ringAngle1 * 2) * 160;
    ctx.beginPath();
    ctx.arc(node1X, node1Y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#00d2ff';
    ctx.shadowColor = '#00d2ff';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();

    // 2. Holographic Outer Orbit Ring 2 (Tilted in counter-rotation)
    ctx.save();
    ctx.rotate(-ringAngle2 + 0.8);
    ctx.scale(0.85, 0.35);
    ctx.beginPath();
    ctx.arc(0, 0, 190, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(245, 130, 31, 0.16)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 12]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Orbit Node on Ring 2
    const node2X = Math.cos(-ringAngle2 * 1.5) * 190;
    const node2Y = Math.sin(-ringAngle2 * 1.5) * 190;
    ctx.beginPath();
    ctx.arc(node2X, node2Y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#f5821f';
    ctx.shadowColor = '#f5821f';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();

    // Dynamic 3D Floating Offset
    const floatY = Math.sin(time * 0.002) * 12 + tiltOffsetY;
    ctx.translate(0, floatY);

    // 3. Bottom Die Substrate Layer (3D Shadow & Base)
    const baseOffset = 18;
    ctx.fillStyle = 'rgba(3, 8, 18, 0.85)';
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-90, -90 + baseOffset, 180, 180, 18);
    ctx.fill();
    ctx.stroke();

    // 3D Extrusion Side Edges (Depth lines)
    ctx.fillStyle = 'rgba(11, 25, 46, 0.7)';
    ctx.beginPath();
    // Left edge
    ctx.moveTo(-90, -90);
    ctx.lineTo(-90, -90 + baseOffset);
    ctx.lineTo(-90, 90 + baseOffset);
    ctx.lineTo(-90, 90);
    ctx.closePath();
    ctx.fill();

    // Right edge
    ctx.beginPath();
    ctx.moveTo(90, -90);
    ctx.lineTo(90, -90 + baseOffset);
    ctx.lineTo(90, 90 + baseOffset);
    ctx.lineTo(90, 90);
    ctx.closePath();
    ctx.fill();

    // 4. Main Silicon Active Die Surface
    const dieGrad = ctx.createLinearGradient(-90, -90, 90, 90);
    dieGrad.addColorStop(0, 'rgba(16, 35, 65, 0.9)');
    dieGrad.addColorStop(0.5, 'rgba(8, 20, 38, 0.95)');
    dieGrad.addColorStop(1, 'rgba(5, 12, 24, 0.98)');
    ctx.fillStyle = dieGrad;
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-90, -90, 180, 180, 18);
    ctx.fill();
    ctx.stroke();

    // 5. Gold Wirebonds & Perimeter Contact Pins
    const pinCount = 7;
    const pinSpacing = 20;
    ctx.lineWidth = 2;
    for (let p = -pinCount * 10 + 10; p <= pinCount * 10 - 10; p += pinSpacing) {
      // Top Pins
      ctx.strokeStyle = '#c9a24b';
      ctx.beginPath();
      ctx.moveTo(p, -90);
      ctx.lineTo(p, -106);
      ctx.stroke();

      // Bottom Pins
      ctx.beginPath();
      ctx.moveTo(p, 90);
      ctx.lineTo(p, 106 + baseOffset * 0.5);
      ctx.stroke();

      // Left Pins
      ctx.strokeStyle = '#00d2ff';
      ctx.beginPath();
      ctx.moveTo(-90, p);
      ctx.lineTo(-106, p);
      ctx.stroke();

      // Right Pins
      ctx.beginPath();
      ctx.moveTo(90, p);
      ctx.lineTo(106, p);
      ctx.stroke();
    }

    // 6. Inner Circuit Core (Gold Border & AI Substrate)
    ctx.strokeStyle = 'rgba(229, 184, 76, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.fillStyle = 'rgba(4, 10, 20, 0.9)';
    ctx.beginPath();
    ctx.roundRect(-58, -58, 116, 116, 10);
    ctx.fill();
    ctx.stroke();

    // Inner Silicon Wafer Mesh Grid
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let g = -40; g <= 40; g += 16) {
      ctx.beginPath();
      ctx.moveTo(-50, g); ctx.lineTo(50, g);
      ctx.moveTo(g, -50); ctx.lineTo(g, 50);
      ctx.stroke();
    }

    // Glowing Central Core Pulsing Aura
    const corePulse = Math.sin(time * 0.0035) * 12 + 35;
    const coreGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, corePulse);
    coreGrad.addColorStop(0, 'rgba(0, 210, 255, 0.8)');
    coreGrad.addColorStop(0.5, 'rgba(245, 130, 31, 0.4)');
    coreGrad.addColorStop(1, 'rgba(6, 11, 20, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, 0, corePulse, 0, Math.PI * 2);
    ctx.fill();

    // AI Core Die Center Logo
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 18px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#00d2ff';
    ctx.shadowBlur = 10;
    ctx.fillText('AI', 0, -2);
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#e5b84c';
    ctx.font = '600 9px "JetBrains Mono", monospace';
    ctx.fillText('5nm CORE', 0, 16);

    ctx.restore();
  }

  function render(timestamp) {
    time = timestamp || 0;
    ringAngle1 += 0.006;
    ringAngle2 += 0.004;

    // Smooth mouse tilt damping
    mouse.tiltX += (mouse.targetTiltX - mouse.tiltX) * 0.05;
    mouse.tiltY += (mouse.targetTiltY - mouse.tiltY) * 0.05;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Soft Background 3D Bokeh Orbs
    for (let i = 0; i < orbs.length; i++) {
      const orb = orbs[i];
      orb.x += orb.speedX;
      orb.y += orb.speedY;

      if (orb.x < -orb.radius) orb.x = width + orb.radius;
      if (orb.x > width + orb.radius) orb.x = -orb.radius;
      if (orb.y < -orb.radius) orb.y = height + orb.radius;
      if (orb.y > height + orb.radius) orb.y = -orb.radius;

      const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
      grad.addColorStop(0, orb.color + orb.alpha + ')');
      grad.addColorStop(1, orb.color + '0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Draw Central 3D Silicon Processor Die
    const centerX = width > 960 ? width * 0.72 : width * 0.5;
    const centerY = height * 0.5;
    draw3DSiliconDie(centerX, centerY);

    // 3. Random Packet Spawn
    if (Math.random() < 0.09) {
      spawnPacket();
    }

    // 4. Update & Draw Circuit Nodes & Interconnects
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      node.x += node.vx;
      node.y += node.vy;

      if (Math.abs(node.x - node.baseX) > 16) node.vx *= -1;
      if (Math.abs(node.y - node.baseY) > 16) node.vy *= -1;

      // Mouse interactive deflection with 3D depth
      if (mouse.isHovered) {
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = ((mouse.radius - dist) / mouse.radius) * node.z;
          node.x += (dx / dist) * force * 3.5;
          node.y += (dy / dist) * force * 3.5;
        }
      }

      // Draw Orthogonal Circuit Connections
      for (let j = 0; j < node.neighbors.length; j++) {
        const neighbor = node.neighbors[j];
        const dx = node.x - neighbor.x;
        const dy = node.y - neighbor.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 135) {
          const alpha = (1 - dist / 135) * 0.28 * node.z;
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 1;

          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          if (i % 2 === 0) {
            ctx.lineTo(neighbor.x, node.y);
          }
          ctx.lineTo(neighbor.x, neighbor.y);
          ctx.stroke();
        }
      }

      // Draw Glowing Circuit Node
      node.pulse += 0.035;
      const pulseSize = node.radius + Math.sin(node.pulse) * 0.85;

      ctx.beginPath();
      ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = node.type === 'orange' ? 'rgba(245, 130, 31, 0.9)' : 'rgba(0, 210, 255, 0.9)';
      ctx.fill();

      // Soft halo on accent nodes
      if (node.radius > 2.5) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize + 4, 0, Math.PI * 2);
        ctx.strokeStyle = node.type === 'orange' ? 'rgba(245, 130, 31, 0.35)' : 'rgba(0, 210, 255, 0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // 5. Update & Draw 3D Data Packets
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.progress += p.speed;

      if (p.progress >= 1) {
        packets.splice(i, 1);
        continue;
      }

      const currentX = p.source.x + (p.target.x - p.source.x) * p.progress;
      const currentY = p.source.y + (p.target.y - p.source.y) * p.progress;

      ctx.beginPath();
      ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    animationFrameId = requestAnimationFrame(render);
  }

  // Event Listeners
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.isHovered = (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    );

    // Calculate normalized tilt (-1 to 1)
    const normX = (mouse.x / width) * 2 - 1;
    const normY = (mouse.y / height) * 2 - 1;
    mouse.targetTiltX = normY * 15;
    mouse.targetTiltY = normX * 15;
  });

  window.addEventListener('mouseleave', function () {
    mouse.isHovered = false;
    mouse.x = -1000;
    mouse.y = -1000;
    mouse.targetTiltX = 0;
    mouse.targetTiltY = 0;
  });

  // Initialize & Start
  resize();
  render(0);
})();
