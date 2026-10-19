import React, { useState, useCallback } from 'react';

interface QuickActionsProps {
    chatStarted: boolean;
    onDownload?: () => void;
    onScreenshot?: () => void;
    onToggleMobile?: () => void;
}

const ACTIONS = [
    { id: 'download', icon: '📥', label: 'Download ZIP', shortcut: 'Ctrl+D' },
    { id: 'mobile', icon: '📱', label: 'Mobile Preview', shortcut: 'Ctrl+M' },
    { id: 'screenshot', icon: '📸', label: 'Screenshot', shortcut: 'Ctrl+S' },
];

export function QuickActions({ chatStarted, onDownload, onScreenshot, onToggleMobile }: QuickActionsProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [hoveredAction, setHoveredAction] = useState<string | null>(null);

    const handleAction = useCallback(
        (actionId: string) => {
            switch (actionId) {
                case 'download':
                    onDownload?.();
                    break;
                case 'mobile':
                    onToggleMobile?.();
                    break;
                case 'screenshot':
                    onScreenshot?.();
                    break;
            }
        },
        [onDownload, onScreenshot, onToggleMobile],
    );

    if (!chatStarted) {
        return null;
    }

    return (
        <div
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => {
                setIsExpanded(false);
                setHoveredAction(null);
            }}
        >
            {/* Expanded actions */}
            {isExpanded && (
                <div
                    className="flex flex-col gap-2"
                    style={{
                        animation: 'scale-in-actions 0.25s ease-out forwards',
                    }}
                >
                    {ACTIONS.map((action, index) => (
                        <div key={action.id} className="relative flex items-center justify-end gap-2">
                            {/* Tooltip */}
                            {hoveredAction === action.id && (
                                <span
                                    className="absolute right-full mr-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap"
                                    style={{
                                        background: 'var(--fluixy-glass-background)',
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid var(--fluixy-glass-border)',
                                        color: 'var(--fluixy-elements-textPrimary)',
                                        animation: 'tooltip-in 0.2s ease-out forwards',
                                    }}
                                >
                                    {action.label}
                                </span>
                            )}
                            <button
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-base transition-all duration-200 hover:scale-110"
                                style={{
                                    background: 'var(--fluixy-glass-background)',
                                    backdropFilter: 'blur(16px)',
                                    border: '1px solid var(--fluixy-glass-border)',
                                    animationDelay: `${index * 0.05}s`,
                                    animation: 'scale-in-actions 0.2s ease-out forwards',
                                    opacity: 0,
                                }}
                                onClick={() => handleAction(action.id)}
                                onMouseEnter={() => setHoveredAction(action.id)}
                                onMouseLeave={() => setHoveredAction(null)}
                                title={action.label}
                            >
                                {action.icon}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Main FAB button */}
            <button
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-all duration-300 hover:scale-110 shadow-lg"
                style={{
                    background: 'var(--fluixy-accent-gradient)',
                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)',
                    transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)',
                }}
                onClick={() => setIsExpanded(!isExpanded)}
                title="Quick Actions"
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
            </button>

            <style>{`
        @keyframes scale-in-actions {
          from { opacity: 0; transform: scale(0.8) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes tooltip-in {
          from { opacity: 0; transform: translateX(8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
        </div>
    );
}
