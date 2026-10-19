import React, { useState, useEffect } from 'react';

export function TypingIndicator({ name = 'Fluixy AI' }: { name?: string }) {
    const [dots, setDots] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev + 1) % 4);
        }, 400);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl max-w-xs"
            style={{
                background: 'var(--fluixy-glass-background)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--fluixy-glass-border)',
                animation: 'typing-fade-in 0.3s ease-out forwards',
            }}
        >
            {/* Avatar */}
            <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{
                    background: 'var(--fluixy-accent-gradient)',
                    boxShadow: '0 0 12px rgba(139, 92, 246, 0.4)',
                    animation: 'typing-pulse 2s ease-in-out infinite',
                }}
            >
                ⚡
            </div>

            {/* Text + dots */}
            <div className="flex flex-col">
                <span
                    className="text-xs font-semibold"
                    style={{ color: 'var(--fluixy-elements-item-contentAccent)' }}
                >
                    {name}
                </span>
                <div className="flex items-center gap-0.5">
                    <span className="text-xs text-fluixy-elements-textTertiary">is thinking</span>
                    <span className="flex gap-0.5 ml-0.5">
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                className="w-1 h-1 rounded-full"
                                style={{
                                    background: 'var(--fluixy-elements-item-contentAccent)',
                                    opacity: i < dots ? 1 : 0.2,
                                    transform: i < dots ? 'scale(1.2)' : 'scale(0.8)',
                                    transition: 'all 0.2s ease',
                                }}
                            />
                        ))}
                    </span>
                </div>
            </div>
        </div>
    );
}

// Inline styles
const typingStyles = `
@keyframes typing-fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes typing-pulse {
  0%, 100% { box-shadow: 0 0 12px rgba(139, 92, 246, 0.4); }
  50% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.7); }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = typingStyles;
    document.head.appendChild(style);
}
