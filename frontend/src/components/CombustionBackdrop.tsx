import React, { useEffect, useRef } from "react";

export const CombustionBackdrop: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particle parameters for subtle moving ember structures
    const particleCount = 28;
    interface Ember {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      maxAlpha: number;
      hue: number;
      life: number;
      maxLife: number;
    }

    const embers: Ember[] = [];
    for (let i = 0; i < particleCount; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.2 - Math.random() * 0.45,
        radius: 0.8 + Math.random() * 1.6,
        alpha: 0.1,
        maxAlpha: 0.18 + Math.random() * 0.25,
        hue: Math.random() > 0.4 ? 24 : 195, // Warm orange (24) or scientific cyan (195)
        life: Math.random() * 200,
        maxLife: 200 + Math.random() * 300
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Faint atmospheric thermal gradient at the bottom corners
      const radGrad = ctx.createRadialGradient(
        width * 0.15,
        height * 0.9,
        10,
        width * 0.15,
        height * 0.9,
        width * 0.45
      );
      radGrad.addColorStop(0, "rgba(255, 118, 38, 0.045)");
      radGrad.addColorStop(0.6, "rgba(245, 158, 11, 0.015)");
      radGrad.addColorStop(1, "rgba(8, 11, 16, 0)");
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);

      const radGradCyan = ctx.createRadialGradient(
        width * 0.85,
        height * 0.15,
        10,
        width * 0.85,
        height * 0.15,
        width * 0.4
      );
      radGradCyan.addColorStop(0, "rgba(56, 189, 248, 0.03)");
      radGradCyan.addColorStop(1, "rgba(8, 11, 16, 0)");
      ctx.fillStyle = radGradCyan;
      ctx.fillRect(0, 0, width, height);

      // Subtle scientific grid lines (faint)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.lineWidth = 1;
      const step = 64;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw embers
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.x += e.vx;
        e.y += e.vy;
        e.life++;

        // Fade in and out
        const halfLife = e.maxLife / 2;
        if (e.life < halfLife) {
          e.alpha = (e.life / halfLife) * e.maxAlpha;
        } else {
          e.alpha = (1 - (e.life - halfLife) / halfLife) * e.maxAlpha;
        }

        if (e.y < -20 || e.life >= e.maxLife) {
          e.x = Math.random() * width;
          e.y = height + 10;
          e.life = 0;
          e.maxLife = 200 + Math.random() * 300;
          e.maxAlpha = 0.18 + Math.random() * 0.25;
        }

        ctx.fillStyle = `hsla(${e.hue}, 95%, 60%, ${Math.max(0, e.alpha)})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
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
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        background: "transparent"
      }}
    />
  );
};
