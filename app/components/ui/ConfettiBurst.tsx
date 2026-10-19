import React, { useEffect, useRef } from 'react';

interface ConfettiParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    rotationSpeed: number;
    size: number;
    color: string;
    opacity: number;
}

export function ConfettiBurst({ trigger, onComplete }: { trigger: boolean; onComplete?: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!trigger) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = [
            '#8B5CF6', '#A855F7', '#6366F1', '#3B82F6',
            '#EC4899', '#F59E0B', '#10B981', '#F97316',
            '#FF6B35', '#138808', '#FFFFFF', // Indian flag inspired
        ];

        const particles: ConfettiParticle[] = [];
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 3;

        for (let i = 0; i < 120; i++) {
            const angle = (Math.random() * Math.PI * 2);
            const speed = Math.random() * 8 + 3;
            particles.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: 1,
            });
        }

        let frame = 0;
        const maxFrames = 120;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frame++;

            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.15; // gravity
                p.rotation += p.rotationSpeed;
                p.opacity = Math.max(0, 1 - frame / maxFrames);
                p.vx *= 0.99;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;

                // Mix of shapes
                if (Math.random() > 0.5) {
                    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            });

            if (frame < maxFrames) {
                requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                onComplete?.();
            }
        };

        animate();
    }, [trigger, onComplete]);

    if (!trigger) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[99999]"
            aria-hidden="true"
        />
    );
}
