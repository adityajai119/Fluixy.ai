import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

const SHARE_OPTIONS = [
    {
        id: 'whatsapp',
        icon: '💬',
        label: 'WhatsApp',
        color: '#25D366',
        getUrl: (url: string, msg: string) => `https://wa.me/?text=${encodeURIComponent(`${msg} ${url}`)}`,
    },
    {
        id: 'twitter',
        icon: '𝕏',
        label: 'Twitter / X',
        color: '#1DA1F2',
        getUrl: (url: string, msg: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}&url=${encodeURIComponent(url)}`,
    },
    {
        id: 'linkedin',
        icon: '💼',
        label: 'LinkedIn',
        color: '#0A66C2',
        getUrl: (url: string, _msg: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
        id: 'telegram',
        icon: '✈️',
        label: 'Telegram',
        color: '#0088cc',
        getUrl: (url: string, msg: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(msg)}`,
    },
    {
        id: 'email',
        icon: '📧',
        label: 'Email',
        color: '#EA4335',
        getUrl: (url: string, msg: string) => `mailto:?subject=${encodeURIComponent('Check out this project on Fluixy.ai!')}&body=${encodeURIComponent(`${msg}\n\n${url}`)}`,
    },
];

export const CollabIndicator = () => {
    const [showPanel, setShowPanel] = useState(false);
    const [copied, setCopied] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    const PRODUCTION_URL = 'https://fluixy.pages.dev';
    const shareUrl = PRODUCTION_URL;
    const shareMessage = `I just built a full-stack app using Fluixy.ai — an AI-powered development platform Made in India! 🇮🇳🚀 Try it yourself:`;

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setShowPanel(false);
            }
        };

        if (showPanel) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showPanel]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Fluixy.ai Project',
                    text: shareMessage,
                    url: shareUrl,
                });
            } catch {
                // User cancelled or error
            }
        } else {
            setShowPanel(!showPanel);
        }
    };

    return (
        <div className="relative flex border border-fluixy-elements-borderColor rounded-md overflow-visible ml-1" ref={panelRef}>
            <button
                onClick={handleNativeShare}
                className="rounded-md items-center justify-center px-2.5 py-1 text-[11px] bg-accent-500 text-white hover:bg-fluixy-elements-button-primary-backgroundHover flex gap-1.5 transition-colors"
            >
                <div className="i-ph:share-network" />
                Share
            </button>

            {showPanel && (
                <div
                    className="absolute top-full mt-2 right-0 z-[200] min-w-[240px] rounded-xl overflow-hidden"
                    style={{
                        background: 'var(--fluixy-elements-bg-depth-2, #1a1a2e)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid var(--fluixy-elements-borderColor)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                        animation: 'share-pop-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-fluixy-elements-borderColor">
                        <span className="text-xs font-semibold text-fluixy-elements-textPrimary">Share Project</span>
                        <button
                            onClick={() => setShowPanel(false)}
                            className="w-5 h-5 rounded flex items-center justify-center text-fluixy-elements-textTertiary hover:text-fluixy-elements-textPrimary transition-colors"
                        >
                            <div className="i-ph:x text-xs" />
                        </button>
                    </div>

                    {/* Share options */}
                    <div className="p-2 space-y-1">
                        {SHARE_OPTIONS.map((option) => (
                            <a
                                key={option.id}
                                href={option.getUrl(shareUrl, shareMessage)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-fluixy-elements-background-depth-3 group"
                                onClick={() => setShowPanel(false)}
                            >
                                <span className="text-base">{option.icon}</span>
                                <span className="text-xs font-medium text-fluixy-elements-textPrimary group-hover:text-white transition-colors">
                                    {option.label}
                                </span>
                            </a>
                        ))}

                        {/* Divider */}
                        <div className="border-t border-fluixy-elements-borderColor my-1" />

                        {/* Copy Link */}
                        <button
                            onClick={handleCopyLink}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-fluixy-elements-background-depth-3"
                        >
                            <span className="text-base">{copied ? '✅' : '🔗'}</span>
                            <span className="text-xs font-medium text-fluixy-elements-textPrimary">
                                {copied ? 'Copied!' : 'Copy Link'}
                            </span>
                        </button>
                    </div>

                    <style>{`
                        @keyframes share-pop-in {
                            from { opacity: 0; transform: translateY(-4px) scale(0.95); }
                            to { opacity: 1; transform: translateY(0) scale(1); }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
};
