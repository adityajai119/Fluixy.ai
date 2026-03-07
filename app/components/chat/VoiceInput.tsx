import React, { useState, useCallback, useRef, useEffect } from 'react';

interface VoiceInputProps {
    onTranscript: (text: string) => void;
    isListening: boolean;
    onStartListening: () => void;
    onStopListening: () => void;
}

const LANGUAGES = [
    { code: 'en-IN', label: 'EN', flag: '🇬🇧' },
    { code: 'hi-IN', label: 'HI', flag: '🇮🇳' },
];

export function VoiceInput({
    onTranscript,
    isListening,
    onStartListening,
    onStopListening,
}: VoiceInputProps) {
    const [language, setLanguage] = useState(LANGUAGES[0]);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [liveText, setLiveText] = useState('');
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language.code;

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;

                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            setLiveText(interimTranscript || finalTranscript);

            if (finalTranscript) {
                onTranscript(finalTranscript);
            }
        };

        recognition.onerror = () => {
            onStopListening();
            setLiveText('');
        };

        recognition.onend = () => {
            onStopListening();
            setLiveText('');
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.abort();
        };
    }, [language]);

    const toggleListening = useCallback(() => {
        if (!recognitionRef.current) {
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            onStopListening();
            setLiveText('');
        } else {
            recognitionRef.current.lang = language.code;
            recognitionRef.current.start();
            onStartListening();
        }
    }, [isListening, language]);

    const cycleLang = useCallback(() => {
        const currentIndex = LANGUAGES.findIndex((l) => l.code === language.code);
        const nextIndex = (currentIndex + 1) % LANGUAGES.length;
        setLanguage(LANGUAGES[nextIndex]);
    }, [language]);

    // Check for browser support
    if (typeof window !== 'undefined' && !('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
        return null;
    }

    return (
        <div className="relative flex items-center gap-1.5">
            {/* Language toggle */}
            <button
                onClick={cycleLang}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                style={{
                    background: 'var(--fluixy-glass-background)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--fluixy-glass-border)',
                    color: 'var(--fluixy-elements-textSecondary)',
                }}
                title={`Switch language (current: ${language.label})`}
            >
                <span>{language.flag}</span>
                <span>{language.label}</span>
            </button>

            {/* Mic button */}
            <button
                onClick={toggleListening}
                className="relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 hover:scale-110"
                style={{
                    background: isListening
                        ? 'linear-gradient(135deg, #EF4444, #F87171)'
                        : 'var(--fluixy-accent-gradient)',
                    boxShadow: isListening
                        ? '0 0 20px rgba(239, 68, 68, 0.4), 0 0 40px rgba(239, 68, 68, 0.1)'
                        : '0 0 15px rgba(139, 92, 246, 0.2)',
                    animation: isListening ? 'pulse-glow-red 2s ease-in-out infinite' : undefined,
                }}
                title={isListening ? 'Stop listening' : `Start voice input (${language.label})`}
            >
                {/* Pulsing ring when active */}
                {isListening && (
                    <>
                        <span
                            className="absolute inset-0 rounded-full"
                            style={{
                                border: '2px solid rgba(239, 68, 68, 0.4)',
                                animation: 'glow-ring-red 1.5s ease-in-out infinite',
                            }}
                        />
                        <span
                            className="absolute inset-0 rounded-full"
                            style={{
                                border: '2px solid rgba(239, 68, 68, 0.2)',
                                animation: 'glow-ring-red 1.5s ease-in-out infinite 0.75s',
                            }}
                        />
                    </>
                )}

                {/* Mic icon */}
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
            </button>

            {/* Live transcription bubble */}
            {isListening && liveText && (
                <div
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-2 rounded-xl text-xs max-w-[200px] truncate whitespace-nowrap"
                    style={{
                        background: 'var(--fluixy-glass-background)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid var(--fluixy-glass-border)',
                        color: 'var(--fluixy-elements-textPrimary)',
                        animation: 'slide-up-fade 0.3s ease-out forwards',
                    }}
                >
                    <span className="opacity-60">🎤</span> {liveText}
                </div>
            )}

            <style>{`
        @keyframes pulse-glow-red {
          0%, 100% { box-shadow: 0 0 15px rgba(239, 68, 68, 0.3); }
          50% { box-shadow: 0 0 25px rgba(239, 68, 68, 0.5), 0 0 50px rgba(239, 68, 68, 0.15); }
        }
        @keyframes glow-ring-red {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes slide-up-fade {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
        </div>
    );
}
