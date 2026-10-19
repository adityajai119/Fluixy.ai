import React, { useState, useEffect } from 'react';

export function SplashScreen() {
    const [visible, setVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Start fade out after 2.5s
        const fadeTimer = setTimeout(() => setFadeOut(true), 2500);
        // Remove from DOM after 3.2s
        const removeTimer = setTimeout(() => setVisible(false), 3200);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    if (!visible) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
            style={{
                background: 'linear-gradient(135deg, #0B0D17 0%, #111827 40%, #0F172A 100%)',
                opacity: fadeOut ? 0 : 1,
                transition: 'opacity 0.7s ease-out',
                pointerEvents: fadeOut ? 'none' : 'auto',
            }}
        >
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute w-[500px] h-[500px] rounded-full"
                    style={{
                        top: '20%',
                        left: '30%',
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                        animation: 'splash-orb 3s ease-in-out infinite',
                    }}
                />
                <div
                    className="absolute w-[400px] h-[400px] rounded-full"
                    style={{
                        bottom: '20%',
                        right: '20%',
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
                        animation: 'splash-orb 3s ease-in-out infinite 1s',
                    }}
                />
            </div>

            {/* Logo + brand */}
            <div
                className="relative flex flex-col items-center gap-4"
                style={{
                    animation: 'splash-content 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}
            >
                {/* Animated logo glow ring */}
                <div className="relative">
                    <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center"
                        style={{
                            background: 'var(--fluixy-accent-gradient, linear-gradient(135deg, #8B5CF6, #3B82F6))',
                            boxShadow: '0 0 60px rgba(139, 92, 246, 0.4), 0 0 120px rgba(139, 92, 246, 0.1)',
                            animation: 'splash-logo-pulse 2s ease-in-out infinite',
                        }}
                    >
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                    </div>
                    {/* Rotating ring */}
                    <div
                        className="absolute -inset-3 rounded-3xl"
                        style={{
                            border: '2px solid transparent',
                            borderTopColor: 'rgba(139, 92, 246, 0.4)',
                            borderRightColor: 'rgba(59, 130, 246, 0.2)',
                            animation: 'splash-ring-spin 2s linear infinite',
                        }}
                    />
                </div>

                {/* Brand name */}
                <h1
                    className="text-3xl font-extrabold tracking-tight"
                    style={{
                        fontFamily: "'Outfit', sans-serif",
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 30%, #3B82F6 70%, #60A5FA 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundSize: '200% 100%',
                        animation: 'splash-gradient-text 3s ease-in-out infinite',
                    }}
                >
                    Fluixy.ai
                </h1>

                {/* Tagline with typewriter */}
                <p
                    className="text-sm font-medium text-gray-400"
                    style={{ animation: 'splash-fade-up 1s ease-out 0.5s forwards', opacity: 0 }}
                >
                    AI-Powered Development • Made for Bharat 🇮🇳
                </p>

                {/* Loading bar */}
                <div
                    className="w-48 h-1 rounded-full overflow-hidden mt-4"
                    style={{ background: 'rgba(139, 92, 246, 0.1)' }}
                >
                    <div
                        className="h-full rounded-full"
                        style={{
                            background: 'linear-gradient(90deg, #8B5CF6, #3B82F6)',
                            animation: 'splash-loading 2.5s ease-in-out forwards',
                        }}
                    />
                </div>
            </div>

            <style>{`
        @keyframes splash-orb {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        @keyframes splash-content {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes splash-logo-pulse {
          0%, 100% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 0 80px rgba(139, 92, 246, 0.5), 0 0 120px rgba(59, 130, 246, 0.2); }
        }
        @keyframes splash-ring-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes splash-gradient-text {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes splash-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes splash-loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
        </div>
    );
}
