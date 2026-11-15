import React, { useEffect, useRef } from "react";

export const CinematicFlameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particle system: Microgravity spherical flame embers & fluid dynamics
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      hue: number;
      alpha: number;
      maxAlpha: number;
      life: number;
      maxLife: number;
      orbitAngle: number;
      orbitRadius: number;
      orbitSpeed: number;
    }

    const particles: Particle[] = [];
    const count = 55;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 40 + Math.random() * 180;
      particles.push({
        x: width * 0.5 + Math.cos(angle) * r,
        y: height * 0.5 + Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.5,
        radius: 1 + Math.random() * 2.2,
        hue: Math.random() > 0.35 ? 24 + Math.random() * 16 : 195, // Molten orange / amber or cyan
        alpha: 0,
        maxAlpha: 0.25 + Math.random() * 0.45,
        life: Math.random() * 200,
        maxLife: 180 + Math.random() * 220,
        orbitAngle: angle,
        orbitRadius: r,
        orbitSpeed: (Math.random() - 0.5) * 0.008
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.65;
      const centerY = height * 0.48;

      // 1. Ambient deep cosmic & thermal gradients
      const bgGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        20,
        centerX,
        centerY,
        width * 0.55
      );
      bgGrad.addColorStop(0, "rgba(255, 118, 38, 0.12)");
      bgGrad.addColorStop(0.35, "rgba(245, 158, 11, 0.05)");
      bgGrad.addColorStop(0.7, "rgba(57, 197, 232, 0.025)");
      bgGrad.addColorStop(1, "rgba(8, 11, 16, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Microgravity Spherical Flame Core Rings (FLEX droplet flame physics)
      // In 0-g, flames are perfectly spherical rather than teardrop shaped!
      const ringPulse = Math.sin(time * 1.5) * 4;
      
      // Outer blue-shift radiation zone (quenched boundary)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 130 + ringPulse, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.12)";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 12]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Middle luminous reaction sheet (stoichiometric boundary)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 95 + ringPulse * 0.6, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 118, 38, 0.28)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inner vapor fuel droplet core
      const coreGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        5,
        centerX,
        centerY,
        45
      );
      coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.5)");
      coreGrad.addColorStop(0.3, "rgba(255, 181, 71, 0.35)");
      coreGrad.addColorStop(0.8, "rgba(255, 118, 38, 0.1)");
      coreGrad.addColorStop(1, "rgba(239, 68, 68, 0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 45, 0, Math.PI * 2);
      ctx.fill();

      // Delicate concentric scientific measuring crosshairs
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - 160, centerY);
      ctx.lineTo(centerX + 160, centerY);
      ctx.moveTo(centerX, centerY - 160);
      ctx.lineTo(centerX, centerY + 160);
      ctx.stroke();

      // 3. Fluid dynamics ember streams
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;
        p.orbitAngle += p.orbitSpeed;
        
        // Gentle spiraling outward convection/diffusion
        const curR = p.orbitRadius + Math.sin(time + i) * 12;
        p.x = centerX + Math.cos(p.orbitAngle) * curR + p.vx * p.life * 0.15;
        p.y = centerY + Math.sin(p.orbitAngle) * curR + p.vy * p.life * 0.2;

        const half = p.maxLife / 2;
        if (p.life < half) {
          p.alpha = (p.life / half) * p.maxAlpha;
        } else {
          p.alpha = (1 - (p.life - half) / half) * p.maxAlpha;
        }

        if (p.life >= p.maxLife) {
          p.life = 0;
          p.orbitAngle = Math.random() * Math.PI * 2;
          p.orbitRadius = 35 + Math.random() * 160;
          p.maxAlpha = 0.2 + Math.random() * 0.4;
        }

        ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, ${Math.max(0, p.alpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1
      }}
    />
  );
};
