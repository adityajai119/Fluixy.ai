import React, { useState, useEffect, useCallback, useRef } from 'react';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onAction: (action: string) => void;
}

const COMMANDS = [
    { id: 'new-chat', icon: '💬', label: 'New Chat', shortcut: 'Ctrl+N', category: 'General' },
    { id: 'voice-input', icon: '🎤', label: 'Voice Input (Hindi/English/Telugu/Tamil)', shortcut: 'Ctrl+V', category: 'Input' },
    { id: 'enhance-prompt', icon: '✨', label: 'Enhance Prompt for Bharat', shortcut: 'Ctrl+E', category: 'AI' },
    { id: 'analyze-project', icon: '📊', label: 'Analyze Project Quality', shortcut: 'Ctrl+A', category: 'Tools' },
    { id: 'toggle-theme', icon: '🌓', label: 'Toggle Dark/Light Theme', shortcut: 'Ctrl+T', category: 'General' },
    { id: 'download-zip', icon: '📥', label: 'Download as ZIP', shortcut: 'Ctrl+D', category: 'Export' },
    { id: 'share-whatsapp', icon: '💬', label: 'Share via WhatsApp', shortcut: '', category: 'Share' },
    { id: 'share-twitter', icon: '🐦', label: 'Share on Twitter', shortcut: '', category: 'Share' },
    { id: 'mobile-preview', icon: '📱', label: 'Toggle Mobile Preview', shortcut: 'Ctrl+M', category: 'Tools' },
    { id: 'keyboard-shortcuts', icon: '⌨️', label: 'Show All Shortcuts', shortcut: '?', category: 'Help' },
    { id: 'settings', icon: '⚙️', label: 'Open Settings', shortcut: 'Ctrl+,', category: 'General' },
    { id: 'templates', icon: '🇮🇳', label: 'Bharat Templates Gallery', shortcut: '', category: 'Templates' },
];

export function CommandPalette({ isOpen, onClose, onAction }: CommandPaletteProps) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const filtered = COMMANDS.filter(
        (cmd) =>
            cmd.label.toLowerCase().includes(query.toLowerCase()) ||
            cmd.category.toLowerCase().includes(query.toLowerCase()),
    );

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter' && filtered[selectedIndex]) {
                onAction(filtered[selectedIndex].id);
                onClose();
            } else if (e.key === 'Escape') {
                onClose();
            }
        },
        [filtered, selectedIndex, onAction, onClose],
    );

    if (!isOpen) {
        return null;
    }

    // Group by category
    const categories: Record<string, typeof COMMANDS> = {};

    for (const cmd of filtered) {
        if (!categories[cmd.category]) {
            categories[cmd.category] = [];
        }

        categories[cmd.category].push(cmd);
    }

    let flatIndex = 0;

    return (
        <div
            className="fixed inset-0 z-[9998] flex items-start justify-center pt-[15vh]"
            onClick={onClose}
            style={{
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                animation: 'cmd-backdrop 0.15s ease-out forwards',
            }}
        >
            <div
                className="w-[520px] max-w-[90vw] rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'var(--fluixy-elements-bg-depth-1)',
                    border: '1px solid var(--fluixy-glass-border)',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.4), 0 0 60px rgba(139, 92, 246, 0.08)',
                    animation: 'cmd-modal 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}
            >
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--fluixy-glass-border)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--fluixy-elements-textTertiary)" strokeWidth="2" strokeLinecap="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent text-sm text-fluixy-elements-textPrimary placeholder-fluixy-elements-textTertiary focus:outline-none"
                        placeholder="Type a command or search..."
                        autoComplete="off"
                        spellCheck={false}
                    />
                    <kbd
                        className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{
                            background: 'var(--fluixy-elements-bg-depth-3)',
                            color: 'var(--fluixy-elements-textTertiary)',
                            border: '1px solid var(--fluixy-glass-border)',
                        }}
                    >
                        ESC
                    </kbd>
                </div>

                {/* Results */}
                <div className="max-h-[320px] overflow-y-auto py-2 modern-scrollbar">
                    {Object.entries(categories).map(([category, cmds]) => (
                        <div key={category}>
                            <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-fluixy-elements-textTertiary">
                                {category}
                            </div>
                            {cmds.map((cmd) => {
                                const currentIndex = flatIndex++;
                                const isSelected = currentIndex === selectedIndex;

                                return (
                                    <button
                                        key={cmd.id}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-left transition-colors duration-100"
                                        style={{
                                            background: isSelected ? 'var(--fluixy-elements-bg-depth-3)' : 'transparent',
                                        }}
                                        onClick={() => {
                                            onAction(cmd.id);
                                            onClose();
                                        }}
                                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                                    >
                                        <span className="text-base w-6 text-center">{cmd.icon}</span>
                                        <span className="flex-1 text-sm text-fluixy-elements-textPrimary">{cmd.label}</span>
                                        {cmd.shortcut && (
                                            <kbd
                                                className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                                                style={{
                                                    background: 'var(--fluixy-elements-bg-depth-4)',
                                                    color: 'var(--fluixy-elements-textTertiary)',
                                                    border: '1px solid var(--fluixy-glass-border)',
                                                }}
                                            >
                                                {cmd.shortcut}
                                            </kbd>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div className="px-4 py-8 text-center text-sm text-fluixy-elements-textTertiary">
                            No commands found for "{query}"
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div
                    className="flex items-center justify-between px-4 py-2 border-t text-[10px] text-fluixy-elements-textTertiary"
                    style={{ borderColor: 'var(--fluixy-glass-border)', background: 'var(--fluixy-elements-bg-depth-2)' }}
                >
                    <div className="flex items-center gap-3">
                        <span>↑↓ Navigate</span>
                        <span>↵ Select</span>
                        <span>Esc Close</span>
                    </div>
                    <span style={{ color: 'var(--fluixy-elements-item-contentAccent)' }}>Fluixy.ai</span>
                </div>
            </div>

            <style>{`
        @keyframes cmd-backdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes cmd-modal {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
        </div>
    );
}
