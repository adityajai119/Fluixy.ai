import React, { useState } from 'react';

interface ShareButtonsProps {
    visible: boolean;
    onClose: () => void;
    projectUrl?: string;
}

const SHARE_OPTIONS = [
    {
        id: 'whatsapp',
        icon: '💬',
        label: 'WhatsApp',
        color: '#25D366',
        getUrl: (msg: string) => `https://wa.me/?text=${encodeURIComponent(msg)}`,
    },
    {
        id: 'twitter',
        icon: '🐦',
        label: 'Twitter',
        color: '#1DA1F2',
        getUrl: (msg: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`,
    },
    {
        id: 'linkedin',
        icon: '💼',
        label: 'LinkedIn',
        color: '#0A66C2',
        getUrl: (msg: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(msg)}`,
    },
];

export function ShareButtons({ visible, onClose, projectUrl }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    if (!visible) {
        return null;
    }

    const shareMessage = projectUrl
        ? `Check out this app I built with Fluixy.ai! 🚀 ${projectUrl}`
        : `I just built an app using Fluixy.ai — an AI-powered development platform Made in India! 🇮🇳🚀 Try it at fluixy.ai`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareMessage);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className="absolute bottom-full mb-3 right-0 rounded-2xl overflow-hidden min-w-[220px]"
            style={{
                background: 'var(--fluixy-glass-background)',
                backdropFilter: 'blur(24px)',
                border: '1px solid var(--fluixy-glass-border)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                animation: 'share-panel-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-2.5 border-b"
                style={{ borderColor: 'var(--fluixy-glass-border)' }}
            >
                <span className="text-xs font-semibold text-fluixy-elements-textPrimary">Share Project</span>
                <button
                    onClick={onClose}
                    className="w-5 h-5 rounded flex items-center justify-center text-fluixy-elements-textTertiary hover:text-fluixy-elements-textPrimary transition-colors text-xs"
                >
                    ✕
                </button>
            </div>

            {/* Social buttons */}
            <div className="p-2 space-y-1">
                {SHARE_OPTIONS.map((option) => (
                    <a
                        key={option.id}
                        href={option.getUrl(shareMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                        style={{
                            background: 'var(--fluixy-elements-bg-depth-4)',
                        }}
                    >
                        <span className="text-base">{option.icon}</span>
                        <span className="text-xs font-medium text-fluixy-elements-textPrimary">{option.label}</span>
                    </a>
                ))}

                {/* Copy link */}
                <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                    style={{
                        background: copied ? 'rgba(52, 211, 153, 0.15)' : 'var(--fluixy-elements-bg-depth-4)',
                    }}
                >
                    <span className="text-base">{copied ? '✅' : '📋'}</span>
                    <span className="text-xs font-medium text-fluixy-elements-textPrimary">
                        {copied ? 'Copied!' : 'Copy Link'}
                    </span>
                </button>
            </div>

            <style>{`
        @keyframes share-panel-in {
          from { opacity: 0; transform: translateY(8px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
        </div>
    );
}
