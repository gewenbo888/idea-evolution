"use client";
import { useEffect, useRef } from "react";

// Animated neural-network particle field. Particles drift; nearby pairs draw lines whose
// brightness falls off with distance — the visual metaphor for "ideas connecting."
export function BackgroundFX() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let raf = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    type P = { x:number; y:number; vx:number; vy:number; r:number };
    let particles: P[] = [];

    const resize = () => {
      canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + "px"; canvas.style.height = innerHeight + "px";
      const target = Math.min(120, Math.floor((innerWidth * innerHeight) / 18000));
      particles = new Array(target).fill(0).map(() => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25 * dpr, vy: (Math.random() - 0.5) * 0.25 * dpr,
        r: (Math.random() * 1.5 + 0.4) * dpr,
      }));
    };
    resize();
    addEventListener("resize", resize);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const max = 140 * dpr;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d2 = dx*dx + dy*dy;
          if (d2 < max*max) {
            const a = (1 - Math.sqrt(d2)/max) * 0.18;
            ctx.strokeStyle = `rgba(160,107,255,${a})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(56,230,255,0.55)";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="bg-canvas" aria-hidden />;
}
