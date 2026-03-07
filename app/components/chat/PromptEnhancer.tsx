import React, { useState, useCallback } from 'react';

interface PromptEnhancerProps {
    inputValue: string;
    onEnhanced: (enhanced: string) => void;
}

const INDIA_ENHANCEMENTS: Record<string, string> = {
    'payment': ', use Indian Rupee (₹) as currency, integrate UPI/Razorpay payment gateway, add support for Indian banks',
    'e-commerce': ', use Indian Rupee (₹) pricing, add Cash on Delivery option, integrate with Indian shipping APIs (Shiprocket/Delhivery), support Indian address format with PIN code',
    'form': ', use +91 Indian phone format, add Aadhaar/PAN validation, support Indian state dropdown, use PIN code for address',
    'auth': ', add OTP-based authentication (Indian standard), support +91 phone login, add Aadhaar verification option',
    'invoice': ', add GSTIN field, calculate CGST/SGST/IGST, support Indian date format (DD/MM/YYYY), use Indian Rupee (₹)',
    'dashboard': ', use Indian number format (lakhs/crores), support IST timezone, add regional language labels',
    'chat': ', add Hindi/English language toggle, support Devanagari text input, add regional greeting messages',
    'restaurant': ', add Veg/Non-Veg filter with green/red dots (Indian standard), prices in ₹, support Swiggy/Zomato-style ordering',
    'portfolio': ', optimize for Indian recruiters, add LinkedIn India integration, show projects in IST timezone',
    'quiz': ', add questions in Hindi and English, include India-specific categories, support UPI payment for premium',
};

const GENERAL_INDIA_SUFFIX = '. Use Indian Rupee (₹) for any currency, +91 format for phone numbers, Indian date format (DD/MM/YYYY), and add support for Hindi, Telugu, Tamil, and English text. Include Indian-specific design patterns and color schemes.';

function getEnhancement(prompt: string): string {
    const lower = prompt.toLowerCase();
    let enhancement = '';

    for (const [keyword, suffix] of Object.entries(INDIA_ENHANCEMENTS)) {
        if (lower.includes(keyword)) {
            enhancement += suffix;
        }
    }

    if (!enhancement) {
        enhancement = GENERAL_INDIA_SUFFIX;
    }

    return prompt + enhancement;
}

export function PromptEnhancer({ inputValue, onEnhanced }: PromptEnhancerProps) {
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const handleEnhance = useCallback(() => {
        if (!inputValue.trim()) {
            return;
        }

        setIsEnhancing(true);

        // Brief animation delay for effect
        setTimeout(() => {
            const enhanced = getEnhancement(inputValue);
            onEnhanced(enhanced);
            setIsEnhancing(false);
        }, 600);
    }, [inputValue, onEnhanced]);

    if (!inputValue.trim()) {
        return null;
    }

    return (
        <div
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <button
                onClick={handleEnhance}
                disabled={isEnhancing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                style={{
                    background: isEnhancing
                        ? 'var(--fluixy-accent-gradient)'
                        : 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(245, 158, 11, 0.12))',
                    color: isEnhancing ? 'white' : 'var(--fluixy-elements-item-contentAccent)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    animation: isEnhancing ? 'enhance-shimmer 0.6s ease-in-out' : undefined,
                }}
            >
                <span style={{ animation: isEnhancing ? 'spin 0.6s linear' : undefined }}>
                    {isEnhancing ? '⚡' : '✨'}
                </span>
                <span>Enhance for Bharat</span>
                <span className="text-[10px] opacity-60">🇮🇳</span>
            </button>

            {/* Tooltip */}
            {showTooltip && !isEnhancing && (
                <div
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-2 rounded-xl text-[10px] max-w-[200px] text-center whitespace-normal leading-relaxed"
                    style={{
                        background: 'var(--fluixy-elements-bg-depth-1)',
                        border: '1px solid var(--fluixy-glass-border)',
                        color: 'var(--fluixy-elements-textSecondary)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                        animation: 'tooltip-fade 0.2s ease-out forwards',
                    }}
                >
                    Auto-adds Indian context: ₹, +91, UPI, GST, Hindi support
                </div>
            )}

            <style>{`
        @keyframes enhance-shimmer {
          0% { box-shadow: 0 0 0 rgba(139, 92, 246, 0); }
          50% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
          100% { box-shadow: 0 0 0 rgba(139, 92, 246, 0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes tooltip-fade {
          from { opacity: 0; transform: translate(-50%, 4px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
        </div>
    );
}
