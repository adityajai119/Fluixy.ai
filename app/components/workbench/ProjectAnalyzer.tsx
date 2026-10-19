import React, { useState, useCallback, useEffect } from 'react';

interface ProjectAnalyzerProps {
    files: Record<string, any>;
    visible: boolean;
    onClose: () => void;
}

interface ScoreCategory {
    name: string;
    icon: string;
    score: number;
    maxScore: number;
    tips: string[];
}

function analyzeFiles(files: Record<string, any>): ScoreCategory[] {
    const fileNames = Object.keys(files || {});
    const totalFiles = fileNames.length;

    // File Structure Analysis
    const hasPackageJson = fileNames.some((f) => f.endsWith('package.json'));
    const hasReadme = fileNames.some((f) => f.toLowerCase().includes('readme'));
    const hasGitignore = fileNames.some((f) => f.includes('.gitignore'));
    const hasSrcFolder = fileNames.some((f) => f.includes('/src/') || f.includes('/app/'));
    const hasComponents = fileNames.some((f) => f.includes('/components/'));

    let structureScore = 0;
    const structureTips: string[] = [];

    if (hasPackageJson) { structureScore += 25; } else { structureTips.push('Add package.json for dependency management'); }
    if (hasReadme) { structureScore += 20; } else { structureTips.push('Add a README.md file'); }
    if (hasSrcFolder) { structureScore += 25; } else { structureTips.push('Organize code into src/ or app/ folder'); }
    if (hasComponents) { structureScore += 15; } else { structureTips.push('Organize UI into a components/ folder'); }
    if (totalFiles > 3) { structureScore += 15; } else { structureTips.push('Split code into multiple files'); }

    // Accessibility Analysis
    let a11yScore = 40; // Base score
    const a11yTips: string[] = [];
    let htmlFileCount = 0;
    let hasAltText = false;
    let hasAriaLabels = false;
    let hasSemanticHTML = false;

    for (const [name, file] of Object.entries(files || {})) {
        const content = typeof file === 'object' && file.content ? String(file.content) : '';

        if (name.endsWith('.html') || name.endsWith('.tsx') || name.endsWith('.jsx')) {
            htmlFileCount++;

            if (content.includes('alt=')) { hasAltText = true; }
            if (content.includes('aria-')) { hasAriaLabels = true; }
            if (content.includes('<main') || content.includes('<nav') || content.includes('<section') || content.includes('<article')) {
                hasSemanticHTML = true;
            }
        }
    }

    if (hasAltText) { a11yScore += 20; } else if (htmlFileCount > 0) { a11yTips.push('Add alt text to images'); }
    if (hasAriaLabels) { a11yScore += 20; } else if (htmlFileCount > 0) { a11yTips.push('Add ARIA labels for accessibility'); }
    if (hasSemanticHTML) { a11yScore += 20; } else if (htmlFileCount > 0) { a11yTips.push('Use semantic HTML elements (<main>, <nav>, <section>)'); }

    // UI Quality Analysis
    let uiScore = 30;
    const uiTips: string[] = [];
    let hasCSS = false;
    let hasResponsive = false;
    let hasDarkMode = false;

    for (const [name, file] of Object.entries(files || {})) {
        const content = typeof file === 'object' && file.content ? String(file.content) : '';

        if (name.endsWith('.css') || name.endsWith('.scss') || name.endsWith('.sass')) {
            hasCSS = true;
        }

        if (content.includes('@media') || content.includes('responsive') || content.includes('flex') || content.includes('grid')) {
            hasResponsive = true;
        }

        if (content.includes('dark') || content.includes('theme') || content.includes('prefers-color-scheme')) {
            hasDarkMode = true;
        }
    }

    if (hasCSS) { uiScore += 25; } else { uiTips.push('Add dedicated CSS/SCSS files'); }
    if (hasResponsive) { uiScore += 25; } else { uiTips.push('Add responsive design with media queries or flexbox'); }
    if (hasDarkMode) { uiScore += 20; } else { uiTips.push('Add dark mode support'); }

    // Performance Analysis
    let perfScore = 40;
    const perfTips: string[] = [];
    let hasLazyLoading = false;
    let hasMinification = false;

    for (const [name, file] of Object.entries(files || {})) {
        const content = typeof file === 'object' && file.content ? String(file.content) : '';

        if (content.includes('lazy') || content.includes('Suspense') || content.includes('dynamic(')) {
            hasLazyLoading = true;
        }

        if (name.includes('vite') || name.includes('webpack') || name.includes('next.config')) {
            hasMinification = true;
        }
    }

    if (hasLazyLoading) { perfScore += 25; } else { perfTips.push('Use lazy loading for components'); }
    if (hasMinification) { perfScore += 20; } else { perfTips.push('Configure build tool for production optimization'); }
    if (totalFiles < 50) { perfScore += 15; } else { perfTips.push('Consider code splitting for large projects'); }

    return [
        { name: 'File Structure', icon: '📁', score: Math.min(structureScore, 100), maxScore: 100, tips: structureTips },
        { name: 'Accessibility', icon: '♿', score: Math.min(a11yScore, 100), maxScore: 100, tips: a11yTips },
        { name: 'UI Quality', icon: '🎨', score: Math.min(uiScore, 100), maxScore: 100, tips: uiTips },
        { name: 'Performance', icon: '⚡', score: Math.min(perfScore, 100), maxScore: 100, tips: perfTips },
    ];
}

function CircularProgress({ score, maxScore, size = 56 }: { score: number; maxScore: number; size?: number }) {
    const percentage = (score / maxScore) * 100;
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const color =
        percentage >= 80 ? '#34D399' : percentage >= 50 ? '#FBBF24' : '#F87171';

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--fluixy-elements-bg-depth-3)"
                    strokeWidth="4"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
            </svg>
            <span
                className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                style={{ color }}
            >
                {score}
            </span>
        </div>
    );
}

export function ProjectAnalyzer({ files, visible, onClose }: ProjectAnalyzerProps) {
    const [scores, setScores] = useState<ScoreCategory[]>([]);
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        if (visible) {
            const results = analyzeFiles(files);
            setScores(results);
            requestAnimationFrame(() => setAnimateIn(true));
        } else {
            setAnimateIn(false);
        }
    }, [visible, files]);

    if (!visible) {
        return null;
    }

    const overallScore = scores.length > 0
        ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
        : 0;

    return (
        <div
            className="absolute top-2 right-2 bottom-2 w-72 z-40 rounded-2xl overflow-hidden flex flex-col"
            style={{
                background: 'var(--fluixy-glass-background)',
                backdropFilter: 'blur(24px)',
                border: '1px solid var(--fluixy-glass-border)',
                transform: animateIn ? 'translateX(0)' : 'translateX(100%)',
                opacity: animateIn ? 1 : 0,
                transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out',
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--fluixy-glass-border)' }}>
                <div className="flex items-center gap-2">
                    <span className="text-base">📊</span>
                    <span className="text-sm font-semibold text-fluixy-elements-textPrimary">Project Analysis</span>
                </div>
                <button
                    onClick={onClose}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-fluixy-elements-textTertiary hover:text-fluixy-elements-textPrimary transition-colors"
                    style={{ background: 'var(--fluixy-elements-bg-depth-4)' }}
                >
                    ✕
                </button>
            </div>

            {/* Overall score */}
            <div className="flex items-center justify-center py-4 border-b" style={{ borderColor: 'var(--fluixy-glass-border)' }}>
                <CircularProgress score={overallScore} maxScore={100} size={72} />
                <div className="ml-3">
                    <p className="text-xs text-fluixy-elements-textTertiary">Overall Score</p>
                    <p className="text-lg font-bold text-fluixy-elements-textPrimary">{overallScore}/100</p>
                </div>
            </div>

            {/* Category scores */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 modern-scrollbar">
                {scores.map((category, index) => (
                    <div
                        key={category.name}
                        className="rounded-xl p-3"
                        style={{
                            background: 'var(--fluixy-elements-bg-depth-4)',
                            animation: `slide-up-fade 0.3s ease-out ${index * 0.1}s forwards`,
                            opacity: 0,
                        }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm">{category.icon}</span>
                                <span className="text-xs font-medium text-fluixy-elements-textPrimary">{category.name}</span>
                            </div>
                            <CircularProgress score={category.score} maxScore={category.maxScore} size={36} />
                        </div>
                        {category.tips.length > 0 && (
                            <ul className="space-y-1">
                                {category.tips.map((tip, i) => (
                                    <li key={i} className="text-[10px] text-fluixy-elements-textTertiary flex items-start gap-1.5">
                                        <span className="text-fluixy-elements-item-contentAccent mt-0.5">•</span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>

            <style>{`
        @keyframes slide-up-fade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
