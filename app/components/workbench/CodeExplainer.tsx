import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { IconButton } from '~/components/ui/IconButton';
import Cookies from 'js-cookie';

interface CodeExplainerProps {
    isVisible: boolean;
    onClose: () => void;
    fileName?: string;
    code?: string;
}

interface ExplainSection {
    title: string;
    description: string;
    lineRange: string;
}

interface ExplainResult {
    summary: string;
    componentType: string;
    patterns: string[];
    dependencies: string[];
    sections: ExplainSection[];
    insights: string;
    usedModel?: string;
    usedProvider?: string;
}

const SECTION_COLORS = [
    { border: 'border-green-500/30', hover: 'hover:border-green-500', dot: 'bg-green-500' },
    { border: 'border-yellow-500/30', hover: 'hover:border-yellow-500', dot: 'bg-yellow-500' },
    { border: 'border-purple-500/30', hover: 'hover:border-purple-500', dot: 'bg-purple-500' },
    { border: 'border-blue-500/30', hover: 'hover:border-blue-500', dot: 'bg-blue-500' },
    { border: 'border-pink-500/30', hover: 'hover:border-pink-500', dot: 'bg-pink-500' },
    { border: 'border-cyan-500/30', hover: 'hover:border-cyan-500', dot: 'bg-cyan-500' },
    { border: 'border-orange-500/30', hover: 'hover:border-orange-500', dot: 'bg-orange-500' },
    { border: 'border-red-500/30', hover: 'hover:border-red-500', dot: 'bg-red-500' },
];

export const CodeExplainer = ({ isVisible, onClose, fileName = "Component.tsx", code }: CodeExplainerProps) => {
    const [activeTab, setActiveTab] = useState<'flow' | 'explanation'>('flow');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ExplainResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const lastCodeRef = useRef<string>('');

    useEffect(() => {
        if (!isVisible || !code || code.trim() === '') {
            return;
        }

        // Only re-fetch if the code actually changed or we don't have a result
        if (lastCodeRef.current === code && result) {
            return;
        }

        lastCodeRef.current = code;
        setIsLoading(true);
        setError(null);

        const selectedModel = Cookies.get('selectedModel') || 'gemini-2.5-flash';
        const selectedProvider = Cookies.get('selectedProvider') || 'Google';

        fetch('/api/explain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, fileName, model: selectedModel, provider: selectedProvider }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errData = (await res.json()) as { error?: string };
                    throw new Error(errData.error || 'Failed to analyze code');
                }

                return res.json() as Promise<ExplainResult>;
            })
            .then((data: ExplainResult) => {
                setResult(data);
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err.message || 'Failed to analyze code');
                setIsLoading(false);
            });
    }, [isVisible, code, fileName, result]);

    const handleRetry = () => {
        if (!code) return;
        lastCodeRef.current = '';
        setError(null);
        setIsLoading(true);

        const selectedModel = Cookies.get('selectedModel') || 'gemini-2.5-flash';
        const selectedProvider = Cookies.get('selectedProvider') || 'Google';

        fetch('/api/explain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, fileName, model: selectedModel, provider: selectedProvider }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errData = (await res.json()) as { error?: string };
                    throw new Error(errData.error || 'Failed to analyze code');
                }
                return res.json() as Promise<ExplainResult>;
            })
            .then((data: ExplainResult) => {
                setResult(data);
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setIsLoading(false);
            });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="absolute right-4 top-20 bottom-24 w-80 z-[100] flex flex-col bg-fluixy-elements-background-depth-3/90 backdrop-blur-xl border border-fluixy-elements-borderColor shadow-2xl rounded-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 flex-shrink-0 border-b border-fluixy-elements-borderColor/50 bg-gradient-to-r from-accent-500/10 to-transparent">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-accent-500/20 text-accent-500 flex items-center justify-center">
                                <div className="i-ph:magic-wand-fill text-lg" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-fluixy-elements-textPrimary">AI Explainer</h3>
                                <p className="text-[10px] text-fluixy-elements-textTertiary uppercase tracking-wider">{fileName}</p>
                            </div>
                        </div>
                        <IconButton icon="i-ph:x-circle" onClick={onClose} className="text-fluixy-elements-textTertiary hover:text-fluixy-elements-textPrimary" />
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-fluixy-elements-borderColor/50 p-1 bg-fluixy-elements-background-depth-2">
                        <button
                            onClick={() => setActiveTab('flow')}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'flow'
                                ? 'bg-fluixy-elements-background-depth-4 shadow-sm text-fluixy-elements-textPrimary'
                                : 'text-fluixy-elements-textTertiary hover:text-fluixy-elements-textSecondary'
                                }`}
                        >
                            Architecture Flow
                        </button>
                        <button
                            onClick={() => setActiveTab('explanation')}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'explanation'
                                ? 'bg-fluixy-elements-background-depth-4 shadow-sm text-fluixy-elements-textPrimary'
                                : 'text-fluixy-elements-textTertiary hover:text-fluixy-elements-textSecondary'
                                }`}
                        >
                            Line-by-Line
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3 opacity-60">
                                <motion.div
                                    className="w-12 h-12 border-4 border-accent-500/30 border-t-accent-500 rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                <p className="text-xs text-fluixy-elements-textTertiary animate-pulse">Analyzing specialized logic...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-4">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                                    <div className="i-ph:warning-circle text-2xl" />
                                </div>
                                <h4 className="text-xs font-semibold text-fluixy-elements-textPrimary">Analysis Failed</h4>
                                <p className="text-[11px] text-fluixy-elements-textTertiary leading-relaxed">{error}</p>
                                <button
                                    onClick={handleRetry}
                                    className="mt-2 text-[11px] px-4 py-1.5 rounded-lg bg-accent-500 text-white hover:bg-accent-600 transition-colors shadow-sm"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : !result ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50 text-center">
                                {fileName !== "File" ? (
                                    <>
                                        <div className="i-ph:spinner animate-spin text-4xl text-accent-500" />
                                        <p className="text-xs text-fluixy-elements-textSecondary font-medium">Waiting for code contents...</p>
                                        <p className="text-[10px] text-fluixy-elements-textTertiary px-8 italic">The editor is still loading this file. Analysis will start automatically once content is available.</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="i-ph:code-bold text-4xl text-fluixy-elements-textTertiary opacity-30" />
                                        <p className="text-xs text-fluixy-elements-textTertiary">Select a file in the sidebar to analyze</p>
                                    </>
                                )}
                            </div>
                        ) : activeTab === 'flow' ? (
                            <div className="flex flex-col gap-4">
                                {/* Component Card */}
                                <div className="p-3 bg-fluixy-elements-background-depth-1 rounded-xl border border-fluixy-elements-borderColor/50 flex flex-col items-center gap-2 relative">
                                    <div className="absolute top-2 left-2 text-[10px] text-accent-500 bg-accent-500/10 px-1.5 py-0.5 rounded font-mono">
                                        {result.componentType}
                                    </div>
                                    <div className="i-ph:puzzle-piece text-3xl text-fluixy-elements-textSecondary mt-4" />
                                    <span className="text-sm font-medium text-fluixy-elements-textPrimary">{fileName.replace(/\.[^.]+$/, '')}</span>
                                    <p className="text-[11px] text-fluixy-elements-textTertiary text-center px-2">{result.summary}</p>
                                </div>

                                {/* Patterns */}
                                {result.patterns && result.patterns.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {result.patterns.map((p, i) => (
                                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-500 border border-accent-500/20">
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Dependencies */}
                                {result.dependencies && result.dependencies.length > 0 && (
                                    <div className="p-3 bg-fluixy-elements-background-depth-1 rounded-xl border border-fluixy-elements-borderColor/50">
                                        <h4 className="text-[10px] font-semibold text-fluixy-elements-textTertiary uppercase tracking-wider mb-2">Dependencies</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {result.dependencies.map((dep, i) => (
                                                <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-fluixy-elements-background-depth-2 text-fluixy-elements-textSecondary border border-fluixy-elements-borderColor">
                                                    {dep}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Connection line */}
                                <div className="flex flex-col items-center">
                                    <div className="w-[2px] h-4 bg-gradient-to-b from-fluixy-elements-textTertiary to-transparent" />
                                </div>

                                {/* Architecture sections */}
                                <div className="w-full grid grid-cols-2 gap-2">
                                    {result.sections.slice(0, 4).map((section, i) => (
                                        <div key={i} className="bg-fluixy-elements-background-depth-2 p-2 rounded-lg text-center text-[10px] border border-fluixy-elements-borderColor">
                                            <div className={`w-2 h-2 rounded-full ${SECTION_COLORS[i % SECTION_COLORS.length].dot} mx-auto mb-1`} />
                                            <span className="text-fluixy-elements-textSecondary font-medium">{section.title}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* AI Insight */}
                                {result.insights && (
                                    <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                                        <h4 className="text-xs font-semibold text-blue-400 mb-1 flex items-center gap-1">
                                            <div className="i-ph:lightbulb" /> AI Insight
                                        </h4>
                                        <p className="text-xs text-fluixy-elements-textSecondary leading-relaxed">
                                            {result.insights}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Line-by-Line Tab */
                            <div className="flex flex-col gap-3">
                                <div className="space-y-3">
                                    {result.sections.map((section, i) => {
                                        const color = SECTION_COLORS[i % SECTION_COLORS.length];

                                        return (
                                            <div key={i} className={`group relative pl-4 border-l-2 ${color.border} ${color.hover} transition-colors`}>
                                                <div className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full ${color.dot} scale-0 group-hover:scale-100 transition-transform`} />
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="text-xs font-mono text-fluixy-elements-textPrimary">{section.title}</h4>
                                                    {section.lineRange && (
                                                        <span className="text-[9px] text-fluixy-elements-textTertiary bg-fluixy-elements-background-depth-2 px-1.5 py-0.5 rounded font-mono">
                                                            L{section.lineRange}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-fluixy-elements-textTertiary leading-relaxed">{section.description}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-2 border-t border-fluixy-elements-borderColor/50 bg-fluixy-elements-background-depth-2 text-center text-[10px] text-fluixy-elements-textTertiary">
                        Powered by {result?.usedProvider || Cookies.get('selectedProvider') || 'AI'} — {result?.usedModel || Cookies.get('selectedModel') || 'LLM'} ✨
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
