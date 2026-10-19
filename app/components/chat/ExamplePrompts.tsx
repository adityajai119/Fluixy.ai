import React from 'react';

const EXAMPLE_PROMPTS = [
  {
    text: 'Build a modern portfolio website with animations',
    icon: '🎨',
    label: 'Portfolio',
  },
  {
    text: 'Create a UPI payment integration page with Razorpay',
    icon: '🇮🇳',
    label: 'UPI Payments',
  },
  {
    text: 'Build a real-time chat application with React',
    icon: '💬',
    label: 'Chat App',
  },
  {
    text: 'Create a GST invoice generator with PDF export',
    icon: '📄',
    label: 'GST Invoice',
  },
  {
    text: 'Build an AI-powered quiz app with leaderboard',
    icon: '🧠',
    label: 'AI Quiz',
  },
];

const DEMO_PROMPT =
  'Build a stunning portfolio landing page with: glassmorphic navbar, animated hero section with typewriter effect, project cards with hover 3D tilt, skills section with animated progress bars, contact form with validation, dark mode toggle, smooth scroll animations, and fully responsive design using React and TailwindCSS';
export function ExamplePrompts(sendMessage?: { (event: React.UIEvent, messageInput?: string): void | undefined }) {
  const handleDemoClick = (event: React.UIEvent) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;

    if (textarea) {
      let i = 0;
      textarea.focus();

      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value',
      )?.set;

      const typeChar = () => {
        if (i < DEMO_PROMPT.length) {
          nativeInputValueSetter?.call(textarea, DEMO_PROMPT.substring(0, i + 1));
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          i++;
          setTimeout(typeChar, 15 + Math.random() * 20);
        }
      };

      typeChar();
    }
  };

  return (
    <div id="examples" className="relative w-full max-w-3xl mx-auto mt-6">
      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        style={{
          animation: 'slide-up-fade 0.5s ease-out forwards',
          opacity: 0,
        }}
      >
        {EXAMPLE_PROMPTS.map((examplePrompt, index: number) => {
          return (
            <button
              key={index}
              onClick={(event) => {
                sendMessage?.(event, examplePrompt.text);
              }}
              className="group relative flex flex-col items-start gap-1.5 p-4 rounded-xl text-left transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'var(--fluixy-glass-background)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid var(--fluixy-glass-border)',
                animationDelay: `${index * 0.08}s`,
                animation: 'slide-up-fade 0.4s ease-out forwards',
                opacity: 0,
              }}
            >
              {/* Hover glow effect */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
                }}
              />

              <span className="text-xl" role="img" aria-label={examplePrompt.label}>
                {examplePrompt.icon}
              </span>
              <span className="text-xs font-medium text-fluixy-elements-textPrimary group-hover:text-fluixy-elements-item-contentAccent transition-colors duration-200">
                {examplePrompt.label}
              </span>
              <span className="text-[11px] text-fluixy-elements-textTertiary leading-tight line-clamp-2">
                {examplePrompt.text}
              </span>
            </button>
          );
        })}

        {/* Demo Mode Card — auto-types an impressive prompt for hackathon demos */}
        <button
          onClick={handleDemoClick}
          className="group relative flex flex-col items-start gap-1.5 p-4 rounded-xl text-left transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.1))',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            animationDelay: '0.4s',
            animation: 'slide-up-fade 0.4s ease-out forwards',
            opacity: 0,
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.1)',
          }}
        >
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
            }}
          />
          <span className="text-xl">🎬</span>
          <span
            className="text-xs font-bold"
            style={{
              background: 'var(--fluixy-accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Watch Demo
          </span>
          <span className="text-[11px] text-fluixy-elements-textTertiary leading-tight">
            Auto-type a stunning prompt
          </span>
        </button>
      </div>
    </div>
  );
}
