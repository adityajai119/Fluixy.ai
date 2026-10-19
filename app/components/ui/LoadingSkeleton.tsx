import React from 'react';

export function LoadingSkeleton() {
    return (
        <div className="flex flex-col gap-3 w-full max-w-[600px] mx-auto py-4 px-2">
            {[0.8, 0.6, 0.45].map((width, i) => (
                <div
                    key={i}
                    className="rounded-lg overflow-hidden"
                    style={{
                        width: `${width * 100}%`,
                        height: '14px',
                        background: 'var(--fluixy-elements-bg-depth-3)',
                        position: 'relative',
                        animation: `skeleton-fade 0.4s ease-out ${i * 0.15}s forwards`,
                        opacity: 0,
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background:
                                'linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.08) 50%, transparent 100%)',
                            animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
                        }}
                    />
                </div>
            ))}
            <style>{`
        @keyframes skeleton-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes skeleton-fade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
