import React from 'react';

export function ExportPanel({ isVisible = false, onClose }: { isVisible?: boolean, onClose: () => void }) {
    if (!isVisible) return null;

    const exportOptions = [
        { id: 'zip', icon: '📦', title: 'Download ZIP', sub: 'Get full source code locally' },
        { id: 'github', icon: '🐙', title: 'Push to GitHub', sub: 'Create a new repository' },
        { id: 'codesandbox', icon: '💻', title: 'Open in CodeSandbox', sub: 'Edit in browser IDE' },
    ];

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
            <div
                className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
                style={{
                    background: 'var(--fluixy-glass-background)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid var(--fluixy-glass-border)',
                    animation: 'export-pop-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-5 py-4 flex justify-between items-center" style={{ borderBottom: '1px solid var(--fluixy-glass-border)' }}>
                    <h2 className="text-base font-bold text-fluixy-elements-textPrimary flex items-center gap-2">
                        <span>📤</span> Export Project
                    </h2>
                    <button onClick={onClose} className="text-fluixy-elements-textTertiary hover:text-fluixy-elements-textPrimary transition-colors">&times;</button>
                </div>

                <div className="p-2">
                    {exportOptions.map((opt) => (
                        <button
                            key={opt.id}
                            className="w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all hover:scale-[1.01]"
                            style={{ border: '1px solid transparent' }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--fluixy-elements-bg-depth-3)';
                                e.currentTarget.style.borderColor = 'var(--fluixy-glass-border)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderColor = 'transparent';
                            }}
                        >
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-inner" style={{ background: 'var(--fluixy-elements-bg-depth-2)' }}>
                                {opt.icon}
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-fluixy-elements-textPrimary">{opt.title}</div>
                                <div className="text-xs text-fluixy-elements-textTertiary">{opt.sub}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes export-pop-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
        </div>
    );
}
