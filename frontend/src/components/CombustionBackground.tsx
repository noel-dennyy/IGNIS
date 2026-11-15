import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  curveOffset: number;
}

export const CombustionBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle Palette
    const emberColors = [
      "255, 118, 38", // Molten orange #FF7626
      "255, 181, 71", // Amber #FFB547
      "239, 68, 68",  // Flame red #EF4444
      "57, 197, 232", // Scientific cyan #39C5E8 (sporadic ionization)
    ];

    const particleCount = prefersReducedMotion ? 20 : 55;
    const particles: Particle[] = [];

    const spawnParticle = (bottomOnly = false): Particle => {
      const color = emberColors[Math.random() < 0.85 ? (Math.random() < 0.6 ? 0 : 1) : (Math.random() < 0.5 ? 2 : 3)];
      const maxLife = 180 + Math.random() * 220;
      return {
        x: Math.random() * width,
        y: bottomOnly ? height + Math.random() * 40 : Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.35 - Math.random() * 0.65,
        radius: 0.8 + Math.random() * 2.2,
        color,
        alpha: 0,
        maxAlpha: 0.25 + Math.random() * 0.55,
        life: bottomOnly ? 0 : Math.random() * maxLife,
        maxLife,
        curveOffset: Math.random() * 1000,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(spawnParticle(false));
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle ambient fluid stream ribbons (microgravity laminar flow)
      if (!prefersReducedMotion) {
        ctx.save();
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          const startY = height * (0.35 + i * 0.25);
          ctx.moveTo(-50, startY);

          for (let x = 0; x <= width + 60; x += 80) {
            const waveY =
              startY +
              Math.sin(x * 0.0025 + time * 0.6 + i * 1.8) * 38 +
              Math.cos(x * 0.004 - time * 0.4) * 22;
            ctx.lineTo(x, waveY);
          }

          const strokeAlpha = 0.025 + Math.sin(time + i) * 0.01;
          ctx.strokeStyle = i === 1 
            ? `rgba(57, 197, 232, ${strokeAlpha})` 
            : `rgba(255, 118, 38, ${strokeAlpha * 1.2})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.restore();
      }

      // 2. Futuristic Wireframe Combustion Chamber Structure (Orthographic Isometric Ribs)
      ctx.save();
      const chamberX = width * 0.82;
      const chamberY = height * 0.48;
      const radiusX = Math.min(width * 0.16, 220);
      const radiusY = radiusX * 0.42;
      const cylinderHeight = radiusX * 1.8;

      ctx.strokeStyle = "rgba(57, 197, 232, 0.045)";
      ctx.lineWidth = 1;

      // Draw cylindrical rings along height
      const ringSteps = 7;
      for (let r = 0; r <= ringSteps; r++) {
        const currY = chamberY - cylinderHeight / 2 + (cylinderHeight / ringSteps) * r;
        ctx.beginPath();
        ctx.ellipse(chamberX, currY, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Axial connecting ribs (slowly rotating)
      const ribCount = 8;
      const rot = prefersReducedMotion ? 0 : time * 0.08;
      for (let j = 0; j < ribCount; j++) {
        const angle = rot + (j * (Math.PI * 2)) / ribCount;
        const ribTopX = chamberX + Math.cos(angle) * radiusX;
        const ribTopY = chamberY - cylinderHeight / 2 + Math.sin(angle) * radiusY;
        const ribBottomX = chamberX + Math.cos(angle) * radiusX;
        const ribBottomY = chamberY + cylinderHeight / 2 + Math.sin(angle) * radiusY;

        ctx.beginPath();
        ctx.moveTo(ribTopX, ribTopY);
        ctx.lineTo(ribBottomX, ribBottomY);
        ctx.strokeStyle = (j % 2 === 0) ? "rgba(255, 118, 38, 0.04)" : "rgba(57, 197, 232, 0.035)";
        ctx.stroke();
      }

      // Central chamber focal indicator
      ctx.beginPath();
      ctx.arc(chamberX, chamberY, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 118, 38, 0.18)";
      ctx.fill();

      // Technical circular markings
      ctx.beginPath();
      ctx.arc(chamberX, chamberY, radiusX * 0.4, 0, Math.PI * 2);
      ctx.setLineDash([4, 8]);
      ctx.strokeStyle = "rgba(57, 197, 232, 0.06)";
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // 3. Render and update glowing ember particles
      particles.forEach((p, idx) => {
        p.life++;
        if (p.life > p.maxLife || p.y < -30) {
          particles[idx] = spawnParticle(true);
          return;
        }

        // Fade in / fade out curve
        const lifeFraction = p.life / p.maxLife;
        if (lifeFraction < 0.2) {
          p.alpha = (lifeFraction / 0.2) * p.maxAlpha;
        } else if (lifeFraction > 0.8) {
          p.alpha = ((1 - lifeFraction) / 0.2) * p.maxAlpha;
        } else {
          p.alpha = p.maxAlpha;
        }

        // Buoyant sway motion (gentle harmonic curve)
        const curve = Math.sin((time * 30 + p.curveOffset) * 0.035) * 0.35;
        p.x += p.vx + curve;
        p.y += p.vy;

        // Draw particle with gentle glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.5);
        grad.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
        grad.addColorStop(0.5, `rgba(${p.color}, ${p.alpha * 0.4})`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="combustion-bg-container"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
      {/* Subtle HUD technical grid pattern overlay */}
      <div className="hud-grid-overlay" />
      {/* Moving scanline sweep effect */}
      <div className="hud-scanline-sweep" />
    </div>
  );
};
