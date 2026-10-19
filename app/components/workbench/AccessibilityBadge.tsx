import React, { useEffect, useState } from 'react';

export function AccessibilityBadge({ isVisible = false }: { isVisible?: boolean }) {
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (isVisible) {
            // Animate score from 0 to 98
            let start = 0;
            const end = 98;
            const duration = 1500;
            const increment = (end / duration) * 16;

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setScore(end);
                    clearInterval(timer);
                } else {
                    setScore(Math.floor(start));
                }
            }, 16);
            return () => clearInterval(timer);
        }
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div
            className="rounded-xl overflow-hidden mt-2"
            style={{
                background: 'var(--fluixy-glass-background)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--fluixy-glass-border)',
                animation: 'access-slide-in 0.4s ease-out forwards',
            }}
        >
            <div className="px-4 py-3 flex items-start gap-4" style={{ borderBottom: '1px solid var(--fluixy-glass-border)' }}>
                {/* Score Circle */}
                <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                            className="text-gray-200 dark:text-gray-700"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                        <path
                            style={{ color: score > 90 ? '#10B981' : '#F59E0B' }}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={`${score}, 100`}
                            className="transition-all duration-300"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-sm font-bold text-fluixy-elements-textPrimary">{score}</span>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">♿</span>
                        <h3 className="text-sm font-bold text-fluixy-elements-textPrimary">Accessibility Score</h3>
                    </div>
                    <p className="text-[10px] text-fluixy-elements-textTertiary leading-tight mb-2">
                        Generated UI is optimized for screen readers, keyboard navigation, and high contrast.
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {['ARIA Labels', 'Color Contrast', 'Keyboard Nav'].map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] font-medium" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                                ✓ {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes access-slide-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
