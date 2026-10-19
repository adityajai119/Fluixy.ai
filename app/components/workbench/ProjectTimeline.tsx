import React, { useState, useEffect } from 'react';

interface TimelineEvent {
    id: string;
    type: 'create' | 'modify' | 'command' | 'deploy' | 'analyze';
    title: string;
    detail?: string;
    timestamp: number;
}

interface ProjectTimelineProps {
    events: TimelineEvent[];
    visible: boolean;
    onClose: () => void;
}

const TYPE_CONFIG = {
    create: { icon: '📄', color: '#34D399', label: 'Created' },
    modify: { icon: '✏️', color: '#FBBF24', label: 'Modified' },
    command: { icon: '⚡', color: '#A78BFA', label: 'Command' },
    deploy: { icon: '🚀', color: '#3B82F6', label: 'Deployed' },
    analyze: { icon: '📊', color: '#F97316', label: 'Analyzed' },
};

function formatTime(ts: number): string {
    const seconds = Math.floor((Date.now() - ts) / 1000);

    if (seconds < 60) {
        return `${seconds}s ago`;
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    return `${Math.floor(minutes / 60)}h ago`;
}

export function ProjectTimeline({ events, visible, onClose }: ProjectTimelineProps) {
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        if (visible) {
            requestAnimationFrame(() => setAnimateIn(true));
        } else {
            setAnimateIn(false);
        }
    }, [visible]);

    if (!visible) {
        return null;
    }

    return (
        <div
            className="absolute top-2 left-2 bottom-2 w-64 z-40 rounded-2xl overflow-hidden flex flex-col"
            style={{
                background: 'var(--fluixy-glass-background)',
                backdropFilter: 'blur(24px)',
                border: '1px solid var(--fluixy-glass-border)',
                transform: animateIn ? 'translateX(0)' : 'translateX(-100%)',
                opacity: animateIn ? 1 : 0,
                transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out',
            }}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: 'var(--fluixy-glass-border)' }}
            >
                <div className="flex items-center gap-2">
                    <span className="text-base">📋</span>
                    <span className="text-sm font-semibold text-fluixy-elements-textPrimary">AI Timeline</span>
                </div>
                <button
                    onClick={onClose}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-fluixy-elements-textTertiary hover:text-fluixy-elements-textPrimary transition-colors"
                    style={{ background: 'var(--fluixy-elements-bg-depth-4)' }}
                >
                    ✕
                </button>
            </div>

            {/* Timeline */}
            <div className="flex-1 overflow-y-auto px-4 py-3 modern-scrollbar">
                {events.length === 0 ? (
                    <div className="text-center py-8 text-xs text-fluixy-elements-textTertiary">
                        <span className="text-2xl block mb-2">🕐</span>
                        AI actions will appear here as you build
                    </div>
                ) : (
                    <div className="relative">
                        {/* Vertical line */}
                        <div
                            className="absolute left-[11px] top-2 bottom-2 w-px"
                            style={{ background: 'var(--fluixy-glass-border)' }}
                        />

                        <div className="space-y-4">
                            {events.map((event, index) => {
                                const config = TYPE_CONFIG[event.type];

                                return (
                                    <div
                                        key={event.id}
                                        className="relative flex items-start gap-3 pl-1"
                                        style={{
                                            animation: `tl-slide-in 0.3s ease-out ${index * 0.05}s forwards`,
                                            opacity: 0,
                                        }}
                                    >
                                        {/* Dot */}
                                        <div
                                            className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] flex-shrink-0 z-10"
                                            style={{
                                                background: `${config.color}20`,
                                                border: `2px solid ${config.color}`,
                                            }}
                                        >
                                            {config.icon}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 pt-0.5">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: config.color }}>
                                                    {config.label}
                                                </span>
                                                <span className="text-[9px] text-fluixy-elements-textTertiary tabular-nums">
                                                    {formatTime(event.timestamp)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-fluixy-elements-textPrimary mt-0.5 truncate">{event.title}</p>
                                            {event.detail && (
                                                <p className="text-[10px] text-fluixy-elements-textTertiary mt-0.5 truncate">{event.detail}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Stats */}
            {events.length > 0 && (
                <div
                    className="px-4 py-2.5 border-t flex items-center justify-between text-[10px]"
                    style={{ borderColor: 'var(--fluixy-glass-border)' }}
                >
                    <span className="text-fluixy-elements-textTertiary">
                        {events.length} action{events.length !== 1 ? 's' : ''}
                    </span>
                    <span style={{ color: 'var(--fluixy-elements-item-contentAccent)' }}>Fluixy AI</span>
                </div>
            )}

            <style>{`
        @keyframes tl-slide-in {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
        </div>
    );
}
