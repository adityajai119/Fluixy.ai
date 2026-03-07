import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { workbenchStore } from '~/lib/stores/workbench';
import { DEFAULT_MODEL, DEFAULT_PROVIDER } from '~/utils/constants';

interface DPDPComplianceCheckerProps {
    isVisible: boolean;
    onClose: () => void;
    onFixAction?: (prompt: string) => void;
    code?: string;
}

const DPDP_CHECKS = [
    { id: 'data-minimalism', label: 'Data Minimization', desc: 'Ensuring only necessary user data is collected.' },
    { id: 'consent-manager', label: 'Verifiable Consent', desc: 'Validating explicit consent mechanisms.' },
    { id: 'localization', label: 'Data Localization', desc: 'Verifying data storage within Indian boundaries.' },
    { id: 'encryption', label: 'Encryption & Security', desc: 'Checking for industry-standard encryption practices.' },
    { id: 'right-to-forget', label: 'Right to be Forgotten', desc: 'Ensuring data deletion mechanisms exist.' },
];

export function DPDPComplianceChecker({ isVisible, onClose, onFixAction }: DPDPComplianceCheckerProps) {
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [scannedItems, setScannedItems] = useState<string[]>([]);
    const [failedItems, setFailedItems] = useState<string[]>([]);
    const [reasons, setReasons] = useState<Record<string, string>>({});
    const [scanComplete, setScanComplete] = useState(false);
    const [overallScore, setOverallScore] = useState(0);

    useEffect(() => {
        if (isVisible) {
            let isMounted = true;
            setIsScanning(true);
            setScanProgress(0);
            setScannedItems([]);
            setFailedItems([]);
            setReasons({});
            setOverallScore(0);
            setScanComplete(false);

            // Fake progress animation while waiting for API
            const progressInterval = setInterval(() => {
                setScanProgress((prev) => {
                    if (prev >= 90) return prev; // Hold at 90% until API responds
                    return prev + Math.floor(Math.random() * 15);
                });
            }, 800);

            const runScan = async () => {
                const filesMap = workbenchStore.files.get();
                const codeFiles: Record<string, string> = {};

                // Only send text files, skip node_modules to avoid flooding context
                for (const [path, dirent] of Object.entries(filesMap)) {
                    if (dirent?.type === 'file' && !dirent.isBinary && !path.includes('node_modules')) {
                        codeFiles[path] = dirent.content;
                    }
                }

                try {
                    const res = await fetch('/api/dpdp', {
                        method: 'POST',
                        body: JSON.stringify({
                            codeFiles,
                            model: DEFAULT_MODEL,
                            provider: DEFAULT_PROVIDER.name
                        })
                    });

                    const data = await res.json() as {
                        overallScore: number;
                        checks: Record<string, { passed: boolean; reason: string }>;
                    };

                    if (!isMounted) return;

                    clearInterval(progressInterval);
                    setScanProgress(100);

                    // Parse Results
                    const passed: string[] = [];
                    const failed: string[] = [];
                    const failureReasons: Record<string, string> = {};

                    if (data.checks) {
                        Object.keys(data.checks).forEach((key) => {
                            if (data.checks[key].passed) {
                                passed.push(key);
                            } else {
                                failed.push(key);
                                failureReasons[key] = data.checks[key].reason;
                            }
                        });
                    }

                    // Cascade reveal the results visually instead of instant snap
                    let currentIndex = 0;
                    const revealInterval = setInterval(() => {
                        if (currentIndex < DPDP_CHECKS.length) {
                            const checkId = DPDP_CHECKS[currentIndex].id;
                            if (passed.includes(checkId)) {
                                setScannedItems(prev => [...prev, checkId]);
                            } else {
                                setFailedItems(prev => [...prev, checkId]);
                            }
                            currentIndex++;
                        } else {
                            clearInterval(revealInterval);
                            setReasons(failureReasons);
                            setScanComplete(true);
                            setIsScanning(false);
                            animateScore(0, data.overallScore || 0, 1000);
                        }
                    }, 400);

                } catch (error) {
                    console.error("DPDP API Error", error);
                    clearInterval(progressInterval);
                    if (isMounted) {
                        setIsScanning(false);
                        setScanComplete(true);
                        setScanProgress(100);
                    }
                }
            };

            runScan();

            return () => {
                isMounted = false;
                clearInterval(progressInterval);
            };
        } else {
            // Reset state when closed
            setScanComplete(false);
            setIsScanning(false);
            setScanProgress(0);
            setScannedItems([]);
            setFailedItems([]);
            setReasons({});
            setOverallScore(0);
        }
    }, [isVisible]);

    const animateScore = (start: number, end: number, duration: number) => {
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setOverallScore(Math.floor(progress * (end - start) + start));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };


    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[240] bg-transparent"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="absolute z-[250] top-[calc(100%+0.5rem)] right-0 w-[380px] max-w-[90vw] max-h-[50vh] overflow-hidden
                     bg-fluixy-elements-background-depth-1 border border-fluixy-elements-borderColor rounded-xl shadow-2xl flex flex-col"
                        style={{
                            boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.15)',
                            transformOrigin: 'top right'
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-fluixy-elements-borderColor/50 bg-fluixy-elements-background-depth-2 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
                                    <div className="i-ph:scales-duotone text-lg" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-fluixy-elements-textPrimary flex items-center gap-2">
                                        DPDP Act Compliance
                                        {scanComplete && (
                                            <span className="px-2 py-0.5 text-[10px] rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                                                Verified
                                            </span>
                                        )}
                                    </h2>
                                    <p className="text-[10px] text-fluixy-elements-textTertiary">Digital Personal Data Protection Act (India)</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg text-fluixy-elements-textTertiary hover:text-fluixy-elements-textPrimary hover:bg-fluixy-elements-background-depth-3 transition-colors"
                            >
                                <div className="i-ph:x text-lg" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4 flex flex-col gap-5 relative overflow-y-auto overflow-x-hidden scrollbar-thin">

                            {/* Score Circular Progress (Absolute center top) */}
                            {scanComplete && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", damping: 15, delay: 0.2 }}
                                    className="absolute top-2 right-4 w-16 h-16 rounded-full bg-fluixy-elements-background-depth-1 border-[3px] border-fluixy-elements-background-depth-2 shadow-xl flex items-center justify-center z-10"
                                    style={{
                                        background: `conic-gradient(var(--fluixy-accent-500) ${overallScore}%, transparent 0)`
                                    }}
                                >
                                    <div className="w-14 h-14 rounded-full bg-fluixy-elements-background-depth-1 flex items-center justify-center flex-col shadow-inner">
                                        <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-br from-green-400 to-emerald-600">
                                            {overallScore}%
                                        </span>
                                    </div>
                                </motion.div>
                            )}

                            {/* Scanning Status Bar */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-fluixy-elements-textSecondary">
                                        {isScanning ? 'Analyzing Application Architecture...' : 'Scan Complete'}
                                    </span>
                                    <span className="text-accent-500 font-mono">{scanProgress}%</span>
                                </div>
                                <div className="h-2 w-full bg-fluixy-elements-background-depth-3 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-orange-400 via-accent-500 to-purple-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${scanProgress}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>

                            {/* Checklist */}
                            <div className="flex flex-col gap-3">
                                {DPDP_CHECKS.map((check, index) => {
                                    const isPassed = scannedItems.includes(check.id);
                                    const isFailed = failedItems.includes(check.id);
                                    const isProcessed = isPassed || isFailed;
                                    const isActive = isScanning && !isProcessed && (scannedItems.length + failedItems.length) === index;

                                    return (
                                        <div
                                            key={check.id}
                                            className={`flex items-start gap-4 p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-accent-500/5 border border-accent-500/20' :
                                                isPassed ? 'bg-fluixy-elements-background-depth-2 border border-green-500/10' :
                                                    isFailed ? 'bg-red-500/5 border border-red-500/20' : 'opacity-40'
                                                }`}
                                        >
                                            <div className="mt-0.5">
                                                {isPassed ? (
                                                    <motion.div
                                                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                        className="w-5 h-5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center"
                                                    >
                                                        <div className="i-ph:check-bold text-xs" />
                                                    </motion.div>
                                                ) : isFailed ? (
                                                    <motion.div
                                                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                        className="w-5 h-5 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center"
                                                    >
                                                        <div className="i-ph:x-bold text-xs" />
                                                    </motion.div>
                                                ) : isActive ? (
                                                    <div className="w-5 h-5 rounded-full border-2 border-accent-500/30 border-t-accent-500 animate-spin" />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full border-2 border-fluixy-elements-borderColor" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`text-sm font-medium ${isPassed ? 'text-fluixy-elements-textPrimary' : isFailed ? 'text-red-400' : 'text-fluixy-elements-textSecondary'}`}>
                                                    {check.label}
                                                </h4>
                                                <p className="text-xs text-fluixy-elements-textTertiary mt-0.5">
                                                    {isFailed && reasons[check.id] ? reasons[check.id] : check.desc}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Footer Actions */}
                            {scanComplete && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="pt-3 border-t border-fluixy-elements-borderColor flex justify-end shrink-0 gap-2"
                                >
                                    {failedItems.length > 0 ? (
                                        <button
                                            onClick={() => {
                                                if (onFixAction) {
                                                    const formattedReasons = failedItems.map(id => `- ${DPDP_CHECKS.find(c => c.id === id)?.label}: ${reasons[id]}`).join('\n');
                                                    onFixAction(`Please fix the following DPDP compliance issues in my code:\n${formattedReasons}\nMake the necessary architectural and code changes to secure the app.`);
                                                    onClose();
                                                }
                                            }}
                                            className="px-4 py-1.5 rounded-lg bg-red-500/10 text-red-500 font-medium text-xs hover:bg-red-500/20 transition-colors border border-red-500/20 flex items-center gap-1.5"
                                        >
                                            <div className="i-ph:wrench-duotone text-base" />
                                            Auto-Fix Issues
                                        </button>
                                    ) : (
                                        <button
                                            onClick={onClose}
                                            className="px-4 py-1.5 rounded-lg bg-green-500/10 text-green-500 font-medium text-xs hover:bg-green-500/20 transition-colors border border-green-500/20 flex items-center gap-1.5"
                                        >
                                            <div className="i-ph:shield-check-duotone text-base" />
                                            Certify Application
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
