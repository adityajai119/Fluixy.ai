import React from 'react';

interface KeyboardShortcutsProps {
    isOpen: boolean;
    onClose: () => void;
}

const SHORTCUT_GROUPS = [
    {
        title: 'General',
        shortcuts: [
            { keys: ['Ctrl', 'K'], description: 'Open Command Palette' },
            { keys: ['Ctrl', 'N'], description: 'New Chat' },
            { keys: ['Ctrl', ','], description: 'Open Settings' },
            { keys: ['?'], description: 'Toggle This Panel' },
        ],
    },
    {
        title: 'AI Features',
        shortcuts: [
            { keys: ['Ctrl', 'E'], description: 'Enhance Prompt for Bharat' },
            { keys: ['Ctrl', 'V'], description: 'Voice Input (4 Languages)' },
            { keys: ['Ctrl', 'A'], description: 'Analyze Project Quality' },
        ],
    },
    {
        title: 'Editor',
        shortcuts: [
            { keys: ['Ctrl', 'S'], description: 'Save / Screenshot' },
            { keys: ['Ctrl', 'D'], description: 'Download ZIP' },
            { keys: ['Ctrl', 'M'], description: 'Toggle Mobile Preview' },
            { keys: ['Ctrl', 'T'], description: 'Toggle Theme' },
        ],
    },
    {
        title: 'Navigation',
        shortcuts: [
            { keys: ['Ctrl', '/'], description: 'Focus Chat Input' },
            { keys: ['Esc'], description: 'Close Current Panel' },
            { keys: ['↑', '↓'], description: 'Navigate Commands' },
            { keys: ['Enter'], description: 'Send Message / Confirm' },
        ],
    },
];

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[9997] flex items-center justify-center"
            onClick={onClose}
            style={{
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                animation: 'ks-backdrop 0.15s ease-out forwards',
            }}
        >
            <div
                className="w-[600px] max-w-[90vw] rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'var(--fluixy-elements-bg-depth-1)',
                    border: '1px solid var(--fluixy-glass-border)',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
                    animation: 'ks-modal 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-4 border-b"
                    style={{ borderColor: 'var(--fluixy-glass-border)' }}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-lg">⌨️</span>
                        <h2
                            className="text-base font-bold"
                            style={{
                                fontFamily: "'Outfit', sans-serif",
                                color: 'var(--fluixy-elements-textPrimary)',
                            }}
                        >
                            Keyboard Shortcuts
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-fluixy-elements-textTertiary hover:text-fluixy-elements-textPrimary transition-colors"
                        style={{ background: 'var(--fluixy-elements-bg-depth-3)' }}
                    >
                        ✕
                    </button>
                </div>

                {/* Shortcuts grid */}
                <div className="grid grid-cols-2 gap-0 max-h-[60vh] overflow-y-auto modern-scrollbar">
                    {SHORTCUT_GROUPS.map((group, gi) => (
                        <div
                            key={group.title}
                            className="px-5 py-4"
                            style={{
                                borderRight: gi % 2 === 0 ? '1px solid var(--fluixy-glass-border)' : undefined,
                                borderBottom:
                                    gi < SHORTCUT_GROUPS.length - 2 ? '1px solid var(--fluixy-glass-border)' : undefined,
                            }}
                        >
                            <h3
                                className="text-[10px] font-bold uppercase tracking-widest mb-3"
                                style={{ color: 'var(--fluixy-elements-item-contentAccent)' }}
                            >
                                {group.title}
                            </h3>
                            <div className="space-y-2.5">
                                {group.shortcuts.map((shortcut) => (
                                    <div key={shortcut.description} className="flex items-center justify-between">
                                        <span className="text-xs text-fluixy-elements-textSecondary">{shortcut.description}</span>
                                        <div className="flex items-center gap-1">
                                            {shortcut.keys.map((key) => (
                                                <kbd
                                                    key={key}
                                                    className="min-w-[24px] h-5 px-1.5 rounded flex items-center justify-center text-[10px] font-medium"
                                                    style={{
                                                        background: 'var(--fluixy-elements-bg-depth-3)',
                                                        color: 'var(--fluixy-elements-textPrimary)',
                                                        border: '1px solid var(--fluixy-glass-border)',
                                                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                                    }}
                                                >
                                                    {key}
                                                </kbd>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div
                    className="px-6 py-3 border-t text-center text-[10px] text-fluixy-elements-textTertiary"
                    style={{
                        borderColor: 'var(--fluixy-glass-border)',
                        background: 'var(--fluixy-elements-bg-depth-2)',
                    }}
                >
                    Press <kbd className="px-1 py-0.5 rounded text-[9px] font-medium" style={{ background: 'var(--fluixy-elements-bg-depth-3)', border: '1px solid var(--fluixy-glass-border)' }}>?</kbd> to toggle this panel
                </div>
            </div>

            <style>{`
        @keyframes ks-backdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes ks-modal {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
        </div>
    );
}
