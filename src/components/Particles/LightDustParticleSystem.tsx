import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  speedX: number;
  speedY: number;
  pulseSpeed: number;
  pulseOffset: number;
  color: string;
}

export const LightDustParticleSystem: React.FC<{ className?: string; count?: number }> = ({
  className = '',
  count = 42
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const prefersReducedMotion = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    // Soft palette of golden amber, warm champagne, and celestial moonlight
    const colors = [
      '245, 158, 11',  // amber
      '251, 191, 36',  // golden
      '254, 240, 138', // champagne
      '226, 232, 240', // moonlight
      '244, 114, 182'  // soft blush
    ];

    const particles: Particle[] = Array.from({ length: count }, () => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const radius = Math.random() * 2.2 + 0.6;
      const baseAlpha = Math.random() * 0.35 + 0.12;

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        baseAlpha,
        alpha: baseAlpha,
        speedX: (Math.random() - 0.5) * 0.28,
        speedY: -(Math.random() * 0.32 + 0.08), // Gentle upward thermal float
        pulseSpeed: Math.random() * 0.018 + 0.008,
        pulseOffset: Math.random() * Math.PI * 2,
        color
      };
    });

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    let time = 0;
    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          // Slow organic Brownian undulation
          p.x += p.speedX + Math.sin(time + p.pulseOffset) * 0.15;
          p.y += p.speedY;

          // Subtle alpha breathing
          p.alpha = p.baseAlpha + Math.sin(time * p.pulseSpeed * 60 + p.pulseOffset) * 0.15;

          // Wrap edges smoothly
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
        }

        // Draw glowing light dust mote
        const currentAlpha = Math.max(0.04, Math.min(0.7, p.alpha));
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.radius * 3.5
        );
        gradient.addColorStop(0, `rgba(${p.color}, ${currentAlpha})`);
        gradient.addColorStop(0.4, `rgba(${p.color}, ${currentAlpha * 0.55})`);
        gradient.addColorStop(1, `rgba(${p.color}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Core sharp center point for realistic dust catchlight
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.65, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-10 ${className}`}
      aria-hidden="true"
    />
  );
};
