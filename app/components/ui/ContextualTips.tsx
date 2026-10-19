import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tip {
    id: string;
    title: string;
    message: string;
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
    targetSelector?: string; // Query selector to position near. If not found, defaults to center.
}

const ONBOARDING_TIPS: Tip[] = [
    {
        id: 'tip1',
        title: 'Welcome to Fluixy.ai!',
        message: 'I am your AI full-stack developer. Let\'s build something amazing together.',
        position: 'center',
    },
    {
        id: 'tip2',
        title: 'Prompt Like a Pro',
        message: '💡 Try saying "Build a UPI payment page with React and Tailwind"',
        position: 'bottom',
        targetSelector: 'textarea', // Chat input area
    },
    {
        id: 'tip3',
        title: 'Quick Commands',
        message: '💡 Create complex layouts or use Indian templates from the Prompt Library.',
        position: 'top',
        targetSelector: '.prompt-library-btn', // Assuming this class exists or will be added
    },
    {
        id: 'tip4',
        title: 'Code & Preview',
        message: 'Once generated, you can view the code, preview the app, and export it instantly!',
        position: 'center',
    }
];

export const ContextualTips = () => {
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [completed, setCompleted] = useState(true);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        // Check if onboarding was already completed
        const hasCompleted = localStorage.getItem('fluixy_onboarding_completed');
        const hasOverlayCompleted = localStorage.getItem('fluixy_onboarded');

        if (!hasCompleted) {
            setCompleted(false);

            if (hasOverlayCompleted) {
                // Immediate if overlay already done
                const timer = setTimeout(() => setIsVisible(true), 2000);
                return () => clearTimeout(timer);
            } else {
                // Wait for overlay to finish if not done
                const handleOverlayDone = () => {
                    setTimeout(() => setIsVisible(true), 1500);
                };
                window.addEventListener('fluixy_onboarding_finished', handleOverlayDone);
                return () => window.removeEventListener('fluixy_onboarding_finished', handleOverlayDone);
            }
        }
    }, []);

    useEffect(() => {
        if (!isVisible || completed) return;

        const currentTip = ONBOARDING_TIPS[currentTipIndex];
        if (currentTip.targetSelector) {
            // Small timeout to allow element to render if we just navigated
            const findTarget = () => {
                const el = document.querySelector(currentTip.targetSelector!);
                if (el) {
                    setTargetRect(el.getBoundingClientRect());
                } else {
                    setTargetRect(null); // Fallback to center
                }
            };

            findTarget();

            // Update on resize
            window.addEventListener('resize', findTarget);
            return () => window.removeEventListener('resize', findTarget);
        } else {
            setTargetRect(null);
        }
    }, [currentTipIndex, isVisible, completed]);

    const handleNext = () => {
        if (currentTipIndex < ONBOARDING_TIPS.length - 1) {
            setCurrentTipIndex(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        setCompleted(true);
        localStorage.setItem('fluixy_onboarding_completed', 'true');
    };

    if (completed || !isVisible) return null;

    const currentTip = ONBOARDING_TIPS[currentTipIndex];

    // Calculate positioning if targetRect exists
    let positionStyles: React.CSSProperties = {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    };

    if (targetRect) {
        const spacing = 16;
        switch (currentTip.position) {
            case 'top':
                positionStyles = {
                    bottom: `${window.innerHeight - targetRect.top + spacing}px`,
                    left: `${targetRect.left + targetRect.width / 2}px`,
                    transform: 'translateX(-50%)',
                };
                break;
            case 'bottom':
                positionStyles = {
                    top: `${targetRect.bottom + spacing}px`,
                    left: `${targetRect.left + targetRect.width / 2}px`,
                    transform: 'translateX(-50%)',
                };
                break;
            case 'left':
                positionStyles = {
                    top: `${targetRect.top + targetRect.height / 2}px`,
                    right: `${window.innerWidth - targetRect.left + spacing}px`,
                    transform: 'translateY(-50%)',
                };
                break;
            case 'right':
                positionStyles = {
                    top: `${targetRect.top + targetRect.height / 2}px`,
                    left: `${targetRect.right + spacing}px`,
                    transform: 'translateY(-50%)',
                };
                break;
            default:
                // center fallback already set
                break;
        }
    }

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
            {/* Optional: Add a subtle overlay if we want to focus attention, but the prompt says 5-6 tips across areas. A full overlay might be too intrusive. Let's just do a tooltip arrow */}
            {targetRect && (
                <div
                    className="absolute border-2 border-accent-500 rounded-lg pointer-events-none transition-all duration-300 animate-pulse bg-accent-500/10"
                    style={{
                        top: targetRect.top - 4,
                        left: targetRect.left - 4,
                        width: targetRect.width + 8,
                        height: targetRect.height + 8,
                    }}
                />
            )}

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentTip.id}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="absolute w-72 bg-fluixy-elements-background-depth-2 border border-accent-500/40 shadow-2xl rounded-xl overflow-hidden pointer-events-auto backdrop-blur-xl"
                    style={positionStyles}
                >
                    {/* Progress Bar */}
                    <div className="h-1 w-full bg-fluixy-elements-background-depth-4">
                        <div
                            className="h-full bg-accent-500 transition-all duration-300"
                            style={{ width: `${((currentTipIndex + 1) / ONBOARDING_TIPS.length) * 100}%` }}
                        />
                    </div>

                    <div className="p-4">
                        <h3 className="text-sm font-semibold text-fluixy-elements-textPrimary flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-accent-500/20 text-accent-500 flex items-center justify-center">
                                <div className="i-ph:lightbulb-duotone" />
                            </div>
                            {currentTip.title}
                        </h3>

                        <p className="text-xs text-fluixy-elements-textSecondary leading-relaxed mb-4">
                            {currentTip.message}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] text-fluixy-elements-textTertiary font-medium">
                                Tip {currentTipIndex + 1} of {ONBOARDING_TIPS.length}
                            </span>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleComplete}
                                    className="px-2 py-1 text-xs font-medium text-fluixy-elements-textTertiary hover:text-fluixy-elements-textPrimary transition-colors"
                                >
                                    Skip
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="px-3 py-1 text-xs font-medium bg-accent-500 hover:bg-accent-600 text-white rounded-md transition-colors"
                                >
                                    {currentTipIndex === ONBOARDING_TIPS.length - 1 ? 'Finish' : 'Next'}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
