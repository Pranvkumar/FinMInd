/**
 * ParticleBackground.jsx — Interactive canvas background
 *
 * Deep navy base with floating particles, connecting lines,
 * and subtle grid elements that react to mouse position.
 * Matches the FinMind logo aesthetic (navy + cyan/teal).
 */

import { useRef, useEffect, useCallback } from "react";

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);

  const PARTICLE_COUNT = 80;
  const CONNECTION_DISTANCE = 150;
  const MOUSE_RADIUS = 200;

  const createParticles = useCallback((w, h) => {
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 0.5,
        // Cyan-teal spectrum: hsl(175-195, 80-100%, 50-70%)
        hue: 175 + Math.random() * 20,
        saturation: 80 + Math.random() * 20,
        lightness: 50 + Math.random() * 20,
        alpha: 0.3 + Math.random() * 0.5,
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      particlesRef.current = createParticles(w, h);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("mousemove", handleMouse);

    // Handle touch
    const handleTouch = (e) => {
      const touch = e.touches[0];
      if (touch) {
        mouseRef.current = {
          x: touch.clientX,
          y: touch.clientY,
        };
      }
    };

    canvas.addEventListener("touchmove", handleTouch, { passive: true });
    canvas.addEventListener("touchend", handleMouseLeave);

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      ctx.clearRect(0, 0, w, h);

      // Draw subtle grid
      ctx.strokeStyle = "rgba(0, 210, 211, 0.03)";
      ctx.lineWidth = 0.5;
      const gridSize = 60;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse repulsion / attraction
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          const angle = Math.atan2(dy, dx);
          // Gentle push away
          p.vx += Math.cos(angle) * force * 0.15;
          p.vy += Math.sin(angle) * force * 0.15;
        }

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Glow near mouse
        let glow = p.alpha;
        if (dist < MOUSE_RADIUS) {
          glow = Math.min(1, p.alpha + (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.6);
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${glow})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < CONNECTION_DISTANCE) {
            const lineAlpha = (1 - cdist / CONNECTION_DISTANCE) * 0.15;

            // Brighter connections near mouse
            let boost = 0;
            const midX = (p.x + p2.x) / 2;
            const midY = (p.y + p2.y) / 2;
            const mDist = Math.sqrt(
              (midX - mouse.x) ** 2 + (midY - mouse.y) ** 2
            );
            if (mDist < MOUSE_RADIUS) {
              boost = (MOUSE_RADIUS - mDist) / MOUSE_RADIUS * 0.25;
            }

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 210, 211, ${lineAlpha + boost})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Mouse glow effect
      if (mouse.x > 0 && mouse.y > 0) {
        const gradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, MOUSE_RADIUS
        );
        gradient.addColorStop(0, "rgba(0, 210, 211, 0.06)");
        gradient.addColorStop(0.5, "rgba(0, 180, 200, 0.02)");
        gradient.addColorStop(1, "rgba(0, 150, 180, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("touchmove", handleTouch);
      canvas.removeEventListener("touchend", handleMouseLeave);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [createParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
      style={{ background: "linear-gradient(180deg, #050d1a 0%, #081525 30%, #0a1a30 60%, #0d1f3c 100%)" }}
    />
  );
};

export default ParticleBackground;
