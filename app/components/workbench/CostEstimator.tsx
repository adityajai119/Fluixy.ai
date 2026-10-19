import React from 'react';

interface CostEstimate {
    provider: string;
    tier: string;
    monthlyCost: string;
    icon: string;
}

const STACK_COSTS: Record<string, CostEstimate[]> = {
    default: [
        { provider: 'Vercel', tier: 'Hobby (Free)', monthlyCost: '₹0', icon: '▲' },
        { provider: 'Netlify', tier: 'Free Tier', monthlyCost: '₹0', icon: '◆' },
        { provider: 'AWS Amplify', tier: 'Free Tier (12 mo)', monthlyCost: '₹0', icon: '☁️' },
        { provider: 'Cloudflare Pages', tier: 'Free', monthlyCost: '₹0', icon: '🔶' },
        { provider: 'Railway', tier: 'Starter', monthlyCost: '₹420/mo', icon: '🚂' },
        { provider: 'DigitalOcean', tier: 'Basic Droplet', monthlyCost: '₹350/mo', icon: '🌊' },
    ],
};

export function CostEstimator({ isVisible = false }: { isVisible?: boolean }) {
    if (!isVisible) return null;

    const estimates = STACK_COSTS.default;
    const freeOptions = estimates.filter((e) => e.monthlyCost === '₹0');
    const paidOptions = estimates.filter((e) => e.monthlyCost !== '₹0');

    return (
        <div
            className="rounded-xl overflow-hidden"
            style={{
                background: 'var(--fluixy-glass-background)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--fluixy-glass-border)',
                animation: 'cost-slide-in 0.4s ease-out forwards',
            }}
        >
            {/* Header */}
            <div
                className="px-4 py-3 flex items-center gap-2"
                style={{ borderBottom: '1px solid var(--fluixy-glass-border)' }}
            >
                <span className="text-lg">💰</span>
                <div>
                    <h3 className="text-sm font-bold text-fluixy-elements-textPrimary">Hosting Cost Estimate</h3>
                    <p className="text-[10px] text-fluixy-elements-textTertiary">Based on your generated project</p>
                </div>
            </div>

            {/* Free options */}
            <div className="px-4 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#22C55E' }}>
                    ✅ Free Options
                </p>
                <div className="flex flex-wrap gap-2">
                    {freeOptions.map((e) => (
                        <span
                            key={e.provider}
                            className="px-2 py-1 rounded-lg text-xs font-medium"
                            style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E', border: '1px solid rgba(34, 197, 94, 0.15)' }}
                        >
                            {e.icon} {e.provider} — {e.tier}
                        </span>
                    ))}
                </div>
            </div>

            {/* Paid options */}
            <div className="px-4 py-2 pb-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--fluixy-elements-item-contentAccent)' }}>
                    💎 Paid Options
                </p>
                <div className="flex flex-wrap gap-2">
                    {paidOptions.map((e) => (
                        <span
                            key={e.provider}
                            className="px-2 py-1 rounded-lg text-xs font-medium"
                            style={{
                                background: 'rgba(139, 92, 246, 0.1)',
                                color: 'var(--fluixy-elements-item-contentAccent)',
                                border: '1px solid rgba(139, 92, 246, 0.15)',
                            }}
                        >
                            {e.icon} {e.provider} — {e.monthlyCost}
                        </span>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes cost-slide-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
