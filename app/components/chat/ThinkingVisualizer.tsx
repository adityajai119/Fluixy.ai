import React, { useState, useEffect, useMemo } from 'react';

interface ThinkingVisualizerProps {
    isStreaming: boolean;
    messages?: any[];
}

const THINKING_STEPS = [
    { text: 'Understanding your prompt...', icon: '🧠', duration: 2000 },
    { text: 'Planning project architecture...', icon: '📐', duration: 3000 },
    { text: 'Generating code...', icon: '⚡', duration: 0 }, // stays until done
    { text: 'Optimizing & finalizing...', icon: '✨', duration: 2000 },
];

export function ThinkingVisualizer({ isStreaming, messages }: ThinkingVisualizerProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [visible, setVisible] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);

    // Show/hide based on streaming state
    useEffect(() => {
        if (isStreaming) {
            setVisible(true);
            setCurrentStep(0);
            setStartTime(Date.now());
            setElapsedTime(0);
        } else {
            // Delay hiding for graceful animation
            const timeout = setTimeout(() => {
                setVisible(false);
                setCurrentStep(0);
                setStartTime(null);
            }, 1000);

            return () => clearTimeout(timeout);
        }
    }, [isStreaming]);

    // Step progression
    useEffect(() => {
        if (!isStreaming || currentStep >= THINKING_STEPS.length - 1) {
            return;
        }

        const step = THINKING_STEPS[currentStep];

        if (step.duration === 0) {
            return; // This step stays until streaming ends
        }

        const timeout = setTimeout(() => {
            setCurrentStep((prev) => Math.min(prev + 1, THINKING_STEPS.length - 1));
        }, step.duration);

        return () => clearTimeout(timeout);
    }, [isStreaming, currentStep]);

    // Elapsed time counter
    useEffect(() => {
        if (!isStreaming || !startTime) {
            return;
        }

        const interval = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [isStreaming, startTime]);

    if (!visible) {
        return null;
    }

    const step = THINKING_STEPS[currentStep];

    return (
        <div
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl mb-2 transition-all duration-500"
            style={{
                background: 'var(--fluixy-glass-background)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--fluixy-glass-border)',
                animation: 'slide-up-fade 0.4s ease-out forwards',
                opacity: isStreaming ? 1 : 0.5,
            }}
        >
            {/* Animated spinner */}
            <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                style={{
                    background: 'var(--fluixy-accent-gradient)',
                    animation: isStreaming ? 'spin-slow 3s linear infinite' : undefined,
                }}
            >
                <span style={{ animation: 'none' }}>{step.icon}</span>
            </div>

            {/* Step text */}
            <div className="flex-1 min-w-0">
                <p
                    className="text-xs font-medium text-fluixy-elements-textPrimary truncate"
                    style={{ animation: 'fade-in-text 0.3s ease-out forwards' }}
                >
                    {step.text}
                </p>

                {/* Progress dots */}
                <div className="flex items-center gap-1 mt-1">
                    {THINKING_STEPS.map((_, i) => (
                        <div
                            key={i}
                            className="h-1 rounded-full transition-all duration-300"
                            style={{
                                width: i <= currentStep ? '16px' : '6px',
                                background:
                                    i <= currentStep
                                        ? 'var(--fluixy-accent-gradient)'
                                        : 'var(--fluixy-elements-bg-depth-3)',
                                opacity: i <= currentStep ? 1 : 0.4,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Timer */}
            <div className="text-[10px] font-mono text-fluixy-elements-textTertiary flex-shrink-0 tabular-nums">
                {elapsedTime}s
            </div>

            <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in-text {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
        </div>
    );
}
