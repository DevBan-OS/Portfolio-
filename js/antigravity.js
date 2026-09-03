/**
 * Google Anti-Gravity Engine & WebGL/Canvas Particle System
 * Design System: Neuform "Next-Gen Execution" (2026)
 * Synergy: Cyber Lime (#9DFF3D), Accent Red (#FF4D4D), Zero-G Dynamics
 */

(function () {
  'use strict';

  const canvas = document.getElementById('gravity-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = {
    x: width / 2,
    y: height / 2,
    radius: 170,
    isHovering: false,
  };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.isHovering = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.isHovering = false;
  });

  // Zero-Gravity state
  let isZeroGravity = false;

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 15;
      this.radius = Math.random() * 2.2 + 1.0;

      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = -(Math.random() * 0.8 + 0.25);

      // Color scheme according to Neuform Next-Gen Execution
      const colors = [
        'rgba(157, 255, 61, ',   // Primary #9DFF3D Cyber Lime
        'rgba(157, 255, 61, ',   // Primary #9DFF3D Cyber Lime (weighted)
        'rgba(255, 77, 77, ',    // Secondary/Accent #FF4D4D
        'rgba(255, 255, 255, ',  // Text Primary White
        'rgba(161, 161, 170, ',  // Zinc 400
      ];
      this.baseColor = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.55 + 0.15;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulseVal = Math.random() * Math.PI * 2;
    }

    update() {
      this.pulseVal += this.pulseSpeed;
      const currentAlpha = Math.max(0.08, this.alpha + Math.sin(this.pulseVal) * 0.15);

      // Mouse Gravitational Interaction
      if (mouse.isHovering) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius);
          const factor = isZeroGravity ? -3.2 : 1.6;
          this.vx += (dx / dist) * force * factor * 0.14;
          this.vy += (dy / dist) * force * factor * 0.14;
        }
      }

      if (isZeroGravity) {
        this.vy -= 0.035; // zero-g float upward
      }

      this.vx *= 0.985;
      this.vy *= 0.985;

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
      if (this.y < -20) {
        this.y = height + 20;
        this.x = Math.random() * width;
      }
      if (this.y > height + 20) {
        this.y = -20;
      }

      this.currentAlpha = currentAlpha;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.baseColor + this.currentAlpha + ')';
      if (this.baseColor.includes('157, 255, 61')) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(157, 255, 61, 0.4)';
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  let particles = [];
  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor(width / 16), 85);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function renderConnections() {
    const maxDist = 110;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(157, 255, 61, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    renderConnections();
    requestAnimationFrame(animate);
  }

  initParticles();
  animate();

  // --- Zero-Gravity Toggle Mode ---
  const antiGravityToggle = document.getElementById('antigravity-toggle');
  const antiGravityBannerBtn = document.getElementById('antigravity-banner-toggle');

  function toggleZeroGravity() {
    isZeroGravity = !isZeroGravity;
    document.body.classList.toggle('zero-gravity-mode', isZeroGravity);

    const labelText = isZeroGravity ? '0-G ACTIVE' : 'ANTI-GRAVITY';
    if (antiGravityToggle) {
      antiGravityToggle.classList.toggle('active', isZeroGravity);
      const textSpan = antiGravityToggle.querySelector('.toggle-label');
      if (textSpan) textSpan.textContent = labelText;
    }

    if (antiGravityBannerBtn) {
      antiGravityBannerBtn.classList.toggle('active', isZeroGravity);
      antiGravityBannerBtn.textContent = isZeroGravity ? 'RESTORE GRAVITY [1.0G]' : 'INITIALIZE ZERO-G [0.0G]';
    }

    particles.forEach((p) => {
      p.vy -= Math.random() * 2.8 + 1.2;
      p.vx += (Math.random() - 0.5) * 3;
    });

    if (window.showToast) {
      window.showToast(
        isZeroGravity
          ? 'SYS // ZERO-GRAVITY ENGAGED: MODULAR PANELS LEVITATING'
          : 'SYS // GRAVITATIONAL EQUILIBRIUM RESTORED'
      );
    }
  }

  if (antiGravityToggle) {
    antiGravityToggle.addEventListener('click', toggleZeroGravity);
  }

  if (antiGravityBannerBtn) {
    antiGravityBannerBtn.addEventListener('click', toggleZeroGravity);
  }

})();
