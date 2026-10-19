import React, { useState, useEffect } from 'react';

const SLIDES = [
    {
        emoji: '💡',
        title: 'Describe Your Idea',
        titleHi: 'अपना आइडिया बताएं',
        titleTe: 'మీ ఆలోచనను చెప్పండి',
        titleTa: 'உங்கள் யோசனையை சொல்லுங்கள்',
        description: 'Describe what you want to build in English, Hindi, Telugu, or Tamil — Fluixy.ai understands all!',
    },
    {
        emoji: '⚡',
        title: 'AI Builds It Instantly',
        titleHi: 'AI तुरंत बनाए',
        titleTe: 'AI వెంటనే నిర్మిస్తుంది',
        titleTa: 'AI உடனடியாக உருவாக்கும்',
        description: 'Our AI generates full-stack code, sets up the project, and shows you a live preview — all in seconds.',
    },
    {
        emoji: '🚀',
        title: 'Deploy & Share',
        titleHi: 'डिप्लॉय करें और शेयर करें',
        titleTe: 'డిప్లాయ్ చేసి షేర్ చేయండి',
        titleTa: 'டெப்ளாய் செய்து பகிரவும்',
        description: 'One-click deploy to Netlify, Vercel, or Cloudflare. Share your creation with the world!',
    },
];

export function OnboardingOverlay() {
    const [visible, setVisible] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const hasOnboarded = localStorage.getItem('fluixy_onboarded');

        if (!hasOnboarded) {
            setVisible(true);
        }
    }, []);

    const dismiss = () => {
        setVisible(false);
        localStorage.setItem('fluixy_onboarded', 'true');
        // Notify ContextualTips that onboarding is done
        window.dispatchEvent(new Event('fluixy_onboarding_finished'));
    };

    const nextSlide = () => {
        if (currentSlide >= SLIDES.length - 1) {
            dismiss();
            return;
        }

        setAnimating(true);
        setTimeout(() => {
            setCurrentSlide((prev) => prev + 1);
            setAnimating(false);
        }, 200);
    };

    if (!visible) {
        return null;
    }

    const slide = SLIDES[currentSlide];

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
                animation: 'onboard-backdrop 0.4s ease-out forwards',
            }}
        >
            <div
                className="relative w-[420px] max-w-[90vw] rounded-3xl overflow-hidden"
                style={{
                    background: 'var(--fluixy-glass-background)',
                    backdropFilter: 'blur(32px)',
                    border: '1px solid var(--fluixy-glass-border)',
                    boxShadow: '0 24px 80px rgba(139, 92, 246, 0.15), 0 0 60px rgba(139, 92, 246, 0.08)',
                    animation: 'onboard-modal 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}
            >
                {/* Header */}
                <div
                    className="px-6 pt-6 pb-2 text-center"
                    style={{
                        background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.12) 0%, transparent 100%)',
                    }}
                >
                    <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--fluixy-elements-item-contentAccent)' }}>
                        Welcome to
                    </div>
                    <h2
                        className="text-2xl font-bold mb-1"
                        style={{
                            background: 'var(--fluixy-accent-gradient)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Fluixy.ai 🇮🇳
                    </h2>
                    <p className="text-xs text-fluixy-elements-textTertiary">AI-Powered Development, Made for Bharat</p>
                </div>

                {/* Slide content */}
                <div
                    className="px-8 py-6 text-center"
                    style={{
                        opacity: animating ? 0 : 1,
                        transform: animating ? 'translateX(-20px)' : 'translateX(0)',
                        transition: 'opacity 0.2s, transform 0.2s',
                    }}
                >
                    <div
                        className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
                        style={{
                            background: 'var(--fluixy-accent-gradient)',
                            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
                        }}
                    >
                        {slide.emoji}
                    </div>
                    <h3 className="text-lg font-bold text-fluixy-elements-textPrimary mb-1">{slide.title}</h3>
                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 mb-2">
                        <span className="text-xs font-medium" style={{ color: 'var(--fluixy-elements-item-contentAccent)' }}>{slide.titleHi}</span>
                        <span className="text-[10px] text-fluixy-elements-textTertiary">•</span>
                        <span className="text-xs font-medium" style={{ color: 'var(--fluixy-elements-item-contentAccent)', opacity: 0.8 }}>{slide.titleTe}</span>
                        <span className="text-[10px] text-fluixy-elements-textTertiary">•</span>
                        <span className="text-xs font-medium" style={{ color: 'var(--fluixy-elements-item-contentAccent)', opacity: 0.8 }}>{slide.titleTa}</span>
                    </div>
                    <p className="text-sm text-fluixy-elements-textSecondary leading-relaxed">{slide.description}</p>
                </div>

                {/* Progress dots + buttons */}
                <div className="px-6 pb-6 flex items-center justify-between">
                    <div className="flex gap-2">
                        {SLIDES.map((_, i) => (
                            <div
                                key={i}
                                className="h-1.5 rounded-full transition-all duration-300"
                                style={{
                                    width: i === currentSlide ? '24px' : '8px',
                                    background: i === currentSlide ? 'var(--fluixy-accent-gradient)' : 'var(--fluixy-elements-bg-depth-3)',
                                }}
                            />
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={dismiss}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                            style={{
                                color: 'var(--fluixy-elements-textTertiary)',
                                background: 'var(--fluixy-elements-bg-depth-4)',
                            }}
                        >
                            Skip
                        </button>
                        <button
                            onClick={nextSlide}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-200 hover:scale-105"
                            style={{
                                background: 'var(--fluixy-accent-gradient)',
                                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                            }}
                        >
                            {currentSlide >= SLIDES.length - 1 ? "Let's Go! 🚀" : 'Next →'}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes onboard-backdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes onboard-modal {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
        </div>
    );
}
