import React, { useState } from 'react';

interface Template {
    emoji: string;
    title: string;
    prompt: string;
    category: string;
    region?: string;
}

const CATEGORIES = ['All', 'Regional', 'E-Commerce', 'FinTech', 'EdTech', 'HealthTech', 'AgriTech', 'GovTech', 'Social', 'Utility', 'Entertainment'];

const TEMPLATES: Template[] = [
    // Regional
    { emoji: '🗣️', title: 'Tamil News Portal', prompt: 'Build a local news portal in Tamil language with breaking news ticker, district-wise news categories (Chennai, Madurai, Coimbatore), night mode, and social sharing options.', category: 'Regional' },
    { emoji: '🌾', title: 'Telugu Agri Dashboard', prompt: 'Create an agricultural dashboard in Telugu for farmers in Andhra/Telangana. Include crop prices in major mandis, weather forecasts, and pest control advice.', category: 'Regional' },
    { emoji: '🍿', title: 'Tollywood Movie DB', prompt: 'Build a Tollywood movie database app with Telugu UI, latest reviews, box office collections, upcoming releases, and actor profiles.', category: 'Regional' },

    // E-Commerce
    { emoji: '🛒', title: 'Meesho-Style Reseller App', prompt: 'Build a reseller marketplace like Meesho with ₹ pricing, COD support, WhatsApp share buttons, and Shiprocket shipping integration. Hindi + English UI.', category: 'E-Commerce' },
    { emoji: '☕', title: 'Chai Delivery App', prompt: 'Create a chai/coffee delivery app with live order tracking, UPI payment (PhonePe, GPay), multiple chai varieties, and delivery boy assignment. Support Hindi.', category: 'E-Commerce' },
    { emoji: '👗', title: 'Ethnic Wear Store', prompt: 'Build an Indian ethnic wear store with saree, kurta, lehenga categories. ₹ pricing, size chart in Indian sizes, COD option, and festival discount banners.', category: 'E-Commerce' },
    { emoji: '🥗', title: 'Tiffin Service Platform', prompt: 'Create a tiffin/meal subscription platform with daily menu, weekly plans in ₹, delivery zones by pincode, and UPI auto-debit for subscriptions.', category: 'E-Commerce' },
    { emoji: '🛍️', title: 'Kirana Store Online', prompt: 'Build an online kirana store with local inventory, ₹ pricing, weight-based items (kg, gm), UPI + COD payment, and delivery slot selection.', category: 'E-Commerce' },

    // FinTech
    { emoji: '💰', title: 'UPI Payment Dashboard', prompt: 'Build a UPI payment analytics dashboard showing transaction history in ₹, monthly spending charts, merchant categories, and UPI ID management.', category: 'FinTech' },
    { emoji: '📊', title: 'GST Invoice Generator', prompt: 'Create a GST invoice generator with GSTIN validation, HSN code lookup, auto-calculated CGST/SGST/IGST, e-invoice format, and PDF export.', category: 'FinTech' },
    { emoji: '🏦', title: 'Loan EMI Calculator', prompt: 'Build a loan EMI calculator supporting Home Loan, Car Loan, Personal Loan with Indian bank rates, amortization schedule in ₹, and prepayment scenarios.', category: 'FinTech' },
    { emoji: '📈', title: 'Mutual Fund Tracker', prompt: 'Create a mutual fund portfolio tracker with NAV updates, SIP calculator in ₹, CAGR returns, ELSS tax benefits section, and fund comparison.', category: 'FinTech' },
    { emoji: '🧾', title: 'Expense Splitter (Splitwise)', prompt: 'Build an expense splitting app like Splitwise with UPI settlement links, group expenses in ₹, and "Settle via GPay/PhonePe" buttons.', category: 'FinTech' },

    // EdTech
    { emoji: '📚', title: 'UPSC Prep Platform', prompt: 'Build a UPSC preparation platform with current affairs daily, practice MCQs, previous year papers, subject-wise tests, and progress tracking.', category: 'EdTech' },
    { emoji: '🎓', title: 'JEE/NEET Mock Test', prompt: 'Create a JEE/NEET mock test platform with timed tests, negative marking, rank predictor, chapter-wise practice, and detailed solutions.', category: 'EdTech' },
    { emoji: '🏫', title: 'School Management System', prompt: 'Build a school management system with student attendance, fee collection in ₹, exam marks entry, parent SMS alerts, and report card generation.', category: 'EdTech' },
    { emoji: '🗣️', title: 'Language Learning App', prompt: 'Create a language learning app for Hindi, Telugu, Tamil with audio pronunciation, script practice, daily vocabulary, and gamified streaks.', category: 'EdTech' },

    // HealthTech
    { emoji: '🏥', title: 'Doctor Appointment System', prompt: 'Build a doctor appointment booking system with specialist search, clinic timings, ₹ consultation fees, UPI payment, and prescription upload.', category: 'HealthTech' },
    { emoji: '💊', title: 'Ayurveda Wellness App', prompt: 'Create an Ayurveda wellness app with dosha quiz, herbal remedy suggestions, yoga routines, and seasonal diet recommendations based on Ayurvedic principles.', category: 'HealthTech' },
    { emoji: '🧘', title: 'Yoga & Meditation App', prompt: 'Build a yoga and meditation app with guided sessions in Hindi/English, pose tutorials, streak tracking, and calming Indian ambient sounds.', category: 'HealthTech' },

    // AgriTech
    { emoji: '🌾', title: 'Mandi Price Tracker', prompt: 'Build a mandi price tracker showing crop prices from different APMCs, price comparison across mandis, seasonal trends, and best selling time suggestions.', category: 'AgriTech' },
    { emoji: '🚜', title: 'Farm Equipment Rental', prompt: 'Create a farm equipment rental platform with tractor, harvester listings, daily rental rates in ₹, availability calendar, and nearby rental shops.', category: 'AgriTech' },
    { emoji: '🌤️', title: 'Crop Advisory Dashboard', prompt: 'Build a crop advisory dashboard with weather forecasts, soil health tips, fertilizer calculator, pest alerts, and government subsidy information.', category: 'AgriTech' },

    // GovTech
    { emoji: '🆔', title: 'Aadhaar Services Portal', prompt: 'Build a citizen services portal with Aadhaar verification, PAN linking status, Voter ID check, Ration card application tracker, and document upload.', category: 'GovTech' },
    { emoji: '🏛️', title: 'RTI Filing Assistant', prompt: 'Create an RTI filing assistant with department search, auto-drafted RTI applications, filing fee calculator (₹10), and application status tracker.', category: 'GovTech' },
    { emoji: '📋', title: 'Govt Scheme Finder', prompt: 'Build a government scheme finder where users enter age, income, caste, state and get matched with eligible schemes like PM-KISAN, PMAY, Ayushman Bharat.', category: 'GovTech' },

    // Social
    { emoji: '🤝', title: 'Matrimony Platform', prompt: 'Build a matrimony platform with profiles, community filters, kundali matching, privacy controls, and family introduction feature. Hindi + English.', category: 'Social' },
    { emoji: '🎉', title: 'Event & Pooja Booking', prompt: 'Create a platform for booking poojas, havans, and religious ceremonies. Pandit profiles, muhurat suggestions, ₹ pricing, and online dakshina via UPI.', category: 'Social' },

    // Utility
    { emoji: '🚗', title: 'Carpooling App', prompt: 'Build a carpooling app for office commutes in Indian cities. Route matching, ₹ cost splitting, rider ratings, and "Ladies Only" ride option.', category: 'Utility' },
    { emoji: '📱', title: 'Mobile Recharge Portal', prompt: 'Create a mobile recharge portal with all Indian operators (Jio, Airtel, Vi), plan comparison, ₹ pricing, auto-pay setup, and usage analytics.', category: 'Utility' },
    { emoji: '🏠', title: 'PG/Hostel Finder', prompt: 'Build a PG and hostel finder with city/area search, virtual tour photos, ₹ rent with food/without food pricing, and owner contact.', category: 'Utility' },

    // Entertainment
    { emoji: '🏏', title: 'Cricket Score Tracker', prompt: 'Build a live cricket score tracker with ball-by-ball updates, player stats, IPL/International match schedules, and fantasy points calculator.', category: 'Entertainment' },
    { emoji: '🎬', title: 'Bollywood Trivia Game', prompt: 'Create a Bollywood trivia quiz game with movie dialogues, song lyrics completion, actor guessing, daily challenges, and leaderboard.', category: 'Entertainment' },
    { emoji: '📻', title: 'Desi Music Player', prompt: 'Build a music player UI for Indian music with Bollywood, Tollywood, Tamil, Indie categories. Playlist creation, lyrics display, and equalizer.', category: 'Entertainment' },
];

export function PromptLibrary({ onSelectPrompt }: { onSelectPrompt: (prompt: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const filtered = TEMPLATES.filter((t) => {
        const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
        const matchesSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.prompt.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
                style={{
                    background: 'var(--fluixy-glass-background)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid var(--fluixy-glass-border)',
                    color: 'var(--fluixy-elements-item-contentAccent)',
                }}
            >
                <span>📚</span>
                <span>50+ India Templates</span>
            </button>
        );
    }

    return (
        <div
            className="fixed inset-0 z-[9998] flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
        >
            <div
                className="w-full max-w-3xl max-h-[80vh] rounded-2xl overflow-hidden flex flex-col"
                style={{
                    background: 'var(--fluixy-glass-background)',
                    backdropFilter: 'blur(40px)',
                    border: '1px solid var(--fluixy-glass-border)',
                    boxShadow: '0 24px 80px rgba(139, 92, 246, 0.15)',
                    animation: 'prompt-lib-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                {/* Header */}
                <div className="px-5 pt-4 pb-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--fluixy-glass-border)' }}>
                    <div>
                        <h2 className="text-lg font-bold text-fluixy-elements-textPrimary">📚 Prompt Library</h2>
                        <p className="text-xs text-fluixy-elements-textTertiary">{TEMPLATES.length} India-ready templates</p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-fluixy-elements-textTertiary hover:text-fluixy-elements-textPrimary text-xl">&times;</button>
                </div>

                {/* Search */}
                <div className="px-5 py-3">
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-sm bg-transparent outline-none"
                        style={{
                            border: '1px solid var(--fluixy-glass-border)',
                            color: 'var(--fluixy-elements-textPrimary)',
                        }}
                        autoFocus
                    />
                </div>

                {/* Categories */}
                <div className="px-5 pb-2 flex gap-2 flex-wrap">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                            style={{
                                background: activeCategory === cat ? 'var(--fluixy-accent-gradient)' : 'var(--fluixy-elements-bg-depth-3)',
                                color: activeCategory === cat ? 'white' : 'var(--fluixy-elements-textSecondary)',
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Templates grid */}
                <div className="px-5 py-3 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filtered.map((t, i) => (
                        <button
                            key={i}
                            onClick={() => { onSelectPrompt(t.prompt); setIsOpen(false); }}
                            className="text-left p-3 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                            style={{
                                background: 'var(--fluixy-elements-bg-depth-3)',
                                border: '1px solid var(--fluixy-glass-border)',
                            }}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{t.emoji}</span>
                                <span className="text-sm font-semibold text-fluixy-elements-textPrimary">{t.title}</span>
                            </div>
                            <p className="text-xs text-fluixy-elements-textTertiary line-clamp-2">{t.prompt}</p>
                            <span
                                className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium"
                                style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--fluixy-elements-item-contentAccent)' }}
                            >
                                {t.category}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes prompt-lib-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
        </div>
    );
}
