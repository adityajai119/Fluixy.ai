import React, { useState, useEffect, useRef } from 'react';

const STATS = [
    { label: 'AI Models', value: 19, suffix: '+', icon: '🤖' },
    { label: 'Languages', value: 4, suffix: '', icon: '🌐' },
];

function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    setStarted(true);
                }
            },
            { threshold: 0.5 },
        );

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) {
            return;
        }

        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;

            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [started, target, duration]);

    return <span ref={ref}>{count}</span>;
}

export function FooterStats() {
    return (
        <div
            className="flex items-center justify-center gap-6 py-2.5 px-4 text-xs"
            style={{
                background: 'var(--fluixy-glass-background)',
                backdropFilter: 'blur(12px)',
                borderTop: '1px solid var(--fluixy-glass-border)',
            }}
        >
            {STATS.map((stat, i) => (
                <React.Fragment key={stat.label}>
                    {i > 0 && (
                        <div className="w-px h-3" style={{ background: 'var(--fluixy-glass-border)' }} />
                    )}
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs">{stat.icon}</span>
                        <span className="font-bold tabular-nums" style={{ color: 'var(--fluixy-elements-item-contentAccent)' }}>
                            <AnimatedCounter target={stat.value} />
                            {stat.suffix}
                        </span>
                        <span className="text-fluixy-elements-textTertiary">{stat.label}</span>
                    </div>
                </React.Fragment>
            ))}
            <div className="w-px h-3" style={{ background: 'var(--fluixy-glass-border)' }} />
            <div className="flex items-center gap-1 group relative cursor-pointer">
                <span className="text-xs">🛡️</span>
                <span className="text-accent-500 font-medium">Security Audit: Pass</span>

                {/* Easter Egg Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-fluixy-elements-background-depth-3 text-fluixy-elements-textPrimary text-[10px] px-2 py-1 rounded border border-accent-500/30 whitespace-nowrap pointer-events-none z-50">
                    Zero critical vulnerabilities detected. God Mode active.
                </div>
            </div>
            <div className="w-px h-3" style={{ background: 'var(--fluixy-glass-border)' }} />
            <div className="flex items-center gap-1">
                <span className="text-xs">🇮🇳</span>
                <span className="text-fluixy-elements-textTertiary font-medium">Made in India</span>
            </div>
        </div>
    );
}
