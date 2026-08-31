/**
 * Power Silicon Technologies — Interactive Semiconductor Circuit Canvas
 * High-performance 60fps particle & orthogonal circuit animation
 */

(function () {
  const canvas = document.getElementById('circuit-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let animationFrameId;

  // Mouse state
  const mouse = {
    x: -1000,
    y: -1000,
    radius: 180,
    isHovered: false
  };

  // Node & Packet configurations
  const nodes = [];
  const nodeCount = 50;
  const packets = [];
  const maxPackets = 24;

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
  }

  function initNodes() {
    nodes.length = 0;
    packets.length = 0;

    // Grid-aligned circuit nodes
    const cols = Math.floor(width / 90) + 1;
    const rows = Math.floor(height / 90) + 1;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // Probabilistic grid point placement for tech circuit look
        if (Math.random() > 0.45) {
          const x = i * 90 + (Math.random() * 20 - 10);
          const y = j * 90 + (Math.random() * 20 - 10);
          nodes.push({
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: Math.random() > 0.85 ? 3.5 : 2,
            type: Math.random() > 0.75 ? 'orange' : 'cyan',
            pulse: Math.random() * Math.PI,
            neighbors: []
          });
        }
      }
    }

    // Connect orthogonal & close neighbors
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          nodes[i].neighbors.push(nodes[j]);
        }
      }
    }
  }

  // Spawn circuit packets
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
      speed: 0.012 + Math.random() * 0.015,
      color: Math.random() > 0.3 ? '#00d2ff' : '#f5821f'
    });
  }

  function drawSiliconCore(centerX, centerY) {
    ctx.save();
    ctx.translate(centerX, centerY);

    // Glowing outer IC chip Die
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.fillStyle = 'rgba(11, 25, 46, 0.4)';
    
    ctx.beginPath();
    ctx.roundRect(-80, -80, 160, 160, 16);
    ctx.fill();
    ctx.stroke();

    // Inner Silicon Die
    ctx.strokeStyle = 'rgba(245, 130, 31, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-55, -55, 110, 110, 8);
    ctx.stroke();

    // Circuit Core Glow
    const grad = ctx.createRadialGradient(0, 0, 5, 0, 0, 90);
    grad.addColorStop(0, 'rgba(0, 210, 255, 0.25)');
    grad.addColorStop(0.7, 'rgba(245, 130, 31, 0.08)');
    grad.addColorStop(1, 'rgba(6, 11, 20, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, 90, 0, Math.PI * 2);
    ctx.fill();

    // Microchip Pins
    const pinLen = 14;
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.5)';
    ctx.lineWidth = 2;
    for (let p = -60; p <= 60; p += 20) {
      // Left & Right
      ctx.beginPath();
      ctx.moveTo(-80, p); ctx.lineTo(-80 - pinLen, p);
      ctx.moveTo(80, p); ctx.lineTo(80 + pinLen, p);
      // Top & Bottom
      ctx.moveTo(p, -80); ctx.lineTo(p, -80 - pinLen);
      ctx.moveTo(p, 80); ctx.lineTo(p, 80 + pinLen);
      ctx.stroke();
    }

    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    const centerX = width > 900 ? width * 0.72 : width * 0.5;
    const centerY = height * 0.5;

    // Draw central microchip die
    drawSiliconCore(centerX, centerY);

    // Randomly spawn data packet pulses
    if (Math.random() < 0.08) {
      spawnPacket();
    }

    // Update & Draw Nodes
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      // Slight floating motion
      node.x += node.vx;
      node.y += node.vy;

      if (Math.abs(node.x - node.baseX) > 15) node.vx *= -1;
      if (Math.abs(node.y - node.baseY) > 15) node.vy *= -1;

      // Mouse interactive deflection
      if (mouse.isHovered) {
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          node.x += (dx / dist) * force * 3;
          node.y += (dy / dist) * force * 3;
        }
      }

      // Draw connections
      for (let j = 0; j < node.neighbors.length; j++) {
        const neighbor = node.neighbors[j];
        const dx = node.x - neighbor.x;
        const dy = node.y - neighbor.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.25;
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 1;

          // Draw orthogonal (stepped) or direct circuit trace
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          // 50% chance orthogonal circuit bend
          if (i % 2 === 0) {
            ctx.lineTo(neighbor.x, node.y);
          }
          ctx.lineTo(neighbor.x, neighbor.y);
          ctx.stroke();
        }
      }

      // Draw Node
      node.pulse += 0.03;
      const pulseSize = node.radius + Math.sin(node.pulse) * 0.8;

      ctx.beginPath();
      ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = node.type === 'orange' ? 'rgba(245, 130, 31, 0.85)' : 'rgba(0, 210, 255, 0.85)';
      ctx.fill();

      // Outer glow on larger nodes
      if (node.radius > 2.5) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize + 3, 0, Math.PI * 2);
        ctx.strokeStyle = node.type === 'orange' ? 'rgba(245, 130, 31, 0.3)' : 'rgba(0, 210, 255, 0.3)';
        ctx.stroke();
      }
    }

    // Update & Draw Packets
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.progress += p.speed;

      if (p.progress >= 1) {
        packets.splice(i, 1);
        continue;
      }

      // Interpolate along path
      const currentX = p.source.x + (p.target.x - p.source.x) * p.progress;
      const currentY = p.source.y + (p.target.y - p.source.y) * p.progress;

      ctx.beginPath();
      ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0; // reset
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
  });

  window.addEventListener('mouseleave', function () {
    mouse.isHovered = false;
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Init
  resize();
  render();
})();
