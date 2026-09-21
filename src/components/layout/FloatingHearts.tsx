import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  type: 'heart' | 'sparkle' | 'bokeh';
}

export const FloatingHearts: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle pool (kept light for mobile performance)
    const particleCount = Math.min(24, Math.floor(width / 45));
    const particles: Particle[] = [];

    const createParticle = (initialRandomY = false): Particle => {
      const types: ('heart' | 'sparkle' | 'bokeh')[] = ['heart', 'sparkle', 'bokeh', 'bokeh'];
      return {
        x: Math.random() * width,
        y: initialRandomY ? Math.random() * height : height + 20,
        size: Math.random() * 12 + 8,
        speedY: -(Math.random() * 0.45 + 0.2),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.35 + 0.15,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        type: types[Math.floor(Math.random() * types.length)],
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    const drawHeart = (x: number, y: number, size: number, opacity: number, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.2, 0, size);
      ctx.bezierCurveTo(0, (size + topCurveHeight) / 1.2, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      ctx.fillStyle = `rgba(226, 130, 144, ${opacity})`;
      ctx.fill();
      ctx.restore();
    };

    const drawSparkle = (x: number, y: number, size: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${opacity * 1.3})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
      ctx.fill();
      ctx.restore();
    };

    const drawBokeh = (x: number, y: number, size: number, opacity: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, size * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(251, 236, 238, ${opacity * 0.7})`;
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.type === 'heart') {
          drawHeart(p.x, p.y, p.size, p.opacity, p.rotation);
        } else if (p.type === 'sparkle') {
          drawSparkle(p.x, p.y, p.size, p.opacity);
        } else {
          drawBokeh(p.x, p.y, p.size, p.opacity);
        }

        // Reset if went above screen
        if (p.y < -30) {
          particles[i] = createParticle(false);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
};
