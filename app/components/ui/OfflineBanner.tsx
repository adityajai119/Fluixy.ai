import React, { useState, useEffect } from 'react';

export function OfflineBanner() {
    const [offline, setOffline] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const goOffline = () => setOffline(true);
        const goOnline = () => {
            setOffline(false);
            setDismissed(false);
        };

        // Check initial state
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            setOffline(true);
        }

        window.addEventListener('offline', goOffline);
        window.addEventListener('online', goOnline);

        return () => {
            window.removeEventListener('offline', goOffline);
            window.removeEventListener('online', goOnline);
        };
    }, []);

    if (!offline || dismissed) return null;

    return (
        <div
            className="flex items-center justify-between px-4 py-2 text-sm font-medium"
            style={{
                background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.15), rgba(239, 68, 68, 0.15))',
                borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
                color: '#F59E0B',
                animation: 'offline-slide-down 0.3s ease-out forwards',
            }}
        >
            <div className="flex items-center gap-2">
                <span className="text-base">📡</span>
                <span>You're offline — AI features paused, but you can still edit code.</span>
            </div>
            <button
                onClick={() => setDismissed(true)}
                className="text-xs px-2 py-0.5 rounded-md hover:bg-white/10 transition-colors"
                style={{ color: '#F59E0B' }}
            >
                Dismiss
            </button>

            <style>{`
        @keyframes offline-slide-down {
          from { opacity: 0; transform: translateY(-100%); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
