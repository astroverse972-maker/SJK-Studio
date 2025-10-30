import React, { useRef, useEffect } from 'react';

interface RippleSource {
  x: number | null;
  y: number | null;
  radius: number;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    
    let rippleSources: RippleSource[] = [{ x: null, y: null, radius: 120 }];

    const updateMousePosition = (event: MouseEvent) => {
        rippleSources[0] = { ...rippleSources[0], x: event.x, y: event.y };
    };

    const handleTouch = (event: TouchEvent) => {
        event.preventDefault(); // Prevent scrolling on canvas
        const touches = event.touches;
        // Start with mouse source if it exists, otherwise empty
        const activeTouches: RippleSource[] = rippleSources[0].x !== null ? [rippleSources[0]] : [];
        for (let i = 0; i < touches.length; i++) {
            activeTouches.push({
                x: touches[i].clientX,
                y: touches[i].clientY,
                radius: 100, // Slightly smaller radius for touches
            });
        }
        rippleSources = activeTouches.length > 0 ? activeTouches : [{ x: null, y: null, radius: 120 }];
    };

    const handleMouseOut = () => {
        rippleSources[0] = { ...rippleSources[0], x: null, y: null };
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseout', handleMouseOut);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouch, { passive: false });
    canvas.addEventListener('touchend', (e) => {
        if(e.touches.length === 0) {
            rippleSources = [rippleSources[0]]; // Keep only mouse source
        } else {
            handleTouch(e);
        }
    });

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    };
    window.addEventListener('resize', handleResize);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 1;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
      }
      update() {
        // Interaction with multiple sources
        rippleSources.forEach(source => {
            if (source.x !== null && source.y !== null) {
                let dx = source.x - this.x;
                let dy = source.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < source.radius) {
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let force = (source.radius - distance) / source.radius;
                    let directionX = forceDirectionX * force * -1;
                    let directionY = forceDirectionY * force * -1;
                    
                    this.x += directionX * 2;
                    this.y += directionY * 2;
                }
            }
        });
        
        if (this.x > width || this.x < 0) this.speedX *= -1;
        if (this.y > height || this.y < 0) this.speedY *= -1;

        this.x += this.speedX;
        this.y += this.speedY;
      }
      draw() {
        if (!ctx) return;
        ctx.fillStyle = 'rgba(212, 165, 116, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    let particles: Particle[] = [];
    const init = () => {
      particles = [];
      const numberOfParticles = (width * height) / 18000;
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };
    init();

    const connect = () => {
        if (!ctx) return;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const distance = Math.sqrt(
                    (particles[a].x - particles[b].x) ** 2 +
                    (particles[a].y - particles[b].y) ** 2
                );
                
                if (distance < 120) {
                    const opacityValue = 1 - (distance/120);
                    ctx.strokeStyle = `rgba(212, 165, 116, ${opacityValue * 0.3})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseout', handleMouseOut);
      if(canvas) {
        canvas.removeEventListener('touchstart', handleTouch);
        canvas.removeEventListener('touchmove', handleTouch);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="particle-canvas" ref={canvasRef} style={{ touchAction: 'none' }} />;
};

export default ParticleBackground;