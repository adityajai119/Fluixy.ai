import React, { useState, useEffect, useCallback } from 'react';

type ToastType = 'success' | 'info' | 'warning' | 'error';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

const ICONS: Record<ToastType, string> = {
    success: '✅',
    info: '💡',
    warning: '⚠️',
    error: '❌',
};

const COLORS: Record<ToastType, string> = {
    success: 'rgba(34, 197, 94, 0.15)',
    info: 'rgba(139, 92, 246, 0.15)',
    warning: 'rgba(245, 158, 11, 0.15)',
    error: 'rgba(239, 68, 68, 0.15)',
};

const BORDER_COLORS: Record<ToastType, string> = {
    success: 'rgba(34, 197, 94, 0.25)',
    info: 'rgba(139, 92, 246, 0.25)',
    warning: 'rgba(245, 158, 11, 0.25)',
    error: 'rgba(239, 68, 68, 0.25)',
};

// Global toast state
let toastListeners: ((toasts: Toast[]) => void)[] = [];
let globalToasts: Toast[] = [];

function notifyListeners() {
    toastListeners.forEach((fn) => fn([...globalToasts]));
}

export function showToast(type: ToastType, message: string, duration = 3000) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    globalToasts.push({ id, type, message, duration });
    notifyListeners();

    if (duration > 0) {
        setTimeout(() => {
            globalToasts = globalToasts.filter((t) => t.id !== id);
            notifyListeners();
        }, duration);
    }
}

export function ToastContainer() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        const listener = (newToasts: Toast[]) => setToasts(newToasts);
        toastListeners.push(listener);
        return () => {
            toastListeners = toastListeners.filter((l) => l !== listener);
        };
    }, []);

    const dismiss = useCallback((id: string) => {
        globalToasts = globalToasts.filter((t) => t.id !== id);
        notifyListeners();
    }, []);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
            {toasts.map((toast, i) => (
                <div
                    key={toast.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer"
                    style={{
                        background: COLORS[toast.type],
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${BORDER_COLORS[toast.type]}`,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                        animation: 'toast-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                        animationDelay: `${i * 0.05}s`,
                    }}
                    onClick={() => dismiss(toast.id)}
                    role="alert"
                >
                    <span className="text-lg flex-shrink-0">{ICONS[toast.type]}</span>
                    <span className="text-sm font-medium text-fluixy-elements-textPrimary">{toast.message}</span>
                </div>
            ))}

            <style>{`
        @keyframes toast-slide-in {
          from { opacity: 0; transform: translateX(100px) scale(0.9); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
        </div>
    );
}
