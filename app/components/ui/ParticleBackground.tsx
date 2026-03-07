import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string;
}

export function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const particlesRef = useRef<Particle[]>([]);
    const animFrameRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Create particles
        const colors = [
            'rgba(139, 92, 246,',  // purple
            'rgba(99, 102, 241,',  // indigo
            'rgba(168, 85, 247,',  // violet
            'rgba(59, 130, 246,',  // blue
        ];

        const particles: Particle[] = [];
        const count = Math.min(30, Math.floor(window.innerWidth / 40));
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 1.5, // 5x faster baseline velocity
                vy: (Math.random() - 0.5) * 1.5,
                size: Math.random() * 3.5 + 1.5, // Much larger particles
                opacity: Math.random() * 0.5 + 0.3, // Base opacity strictly higher -> 0.3 to 0.8
                color: colors[Math.floor(Math.random() * colors.length)],
            });
        }
        particlesRef.current = particles;

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {
                // Mouse interaction — gentle push away
                const dx = p.x - mouseRef.current.x;
                const dy = p.y - mouseRef.current.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const force = (120 - dist) / 120 * 0.02;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }

                // Update position
                p.x += p.vx;
                p.y += p.vy;

                // Dampen velocity
                p.vx *= 0.99;
                p.vy *= 0.99;

                // Wrap around
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `${p.color} ${p.opacity})`;
                ctx.fill();

                // Draw connection lines between nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dSq = (p.x - p2.x) ** 2 + (p.y - p2.y) ** 2;
                    if (dSq < 40000) { // 200 * 200 -> increased connection distance
                        const d = Math.sqrt(dSq);
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - d / 200)})`; // Brighter lines, longer draw range
                        ctx.lineWidth = 1.0;
                        ctx.stroke();
                    }
                }
            });

            animFrameRef.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen"
            style={{ opacity: 1 }}
            aria-hidden="true"
        />
    );
}
