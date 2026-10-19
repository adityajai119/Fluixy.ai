import type { MetaFunction } from 'react-router';
import { ClientOnly } from 'remix-utils/client-only';
import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import BackgroundRays from '~/components/ui/BackgroundRays';
import { themeStore } from '~/lib/stores/theme';
import { ParticleBackground } from '~/components/ui/ParticleBackground';

// Lazy load non-critical shell components for next-gen performance
const Header = lazy(() => import('~/components/header/Header').then(module => ({ default: module.Header })));
const OnboardingOverlay = lazy(() => import('~/components/ui/OnboardingOverlay').then(module => ({ default: module.OnboardingOverlay })));
const FooterStats = lazy(() => import('~/components/ui/FooterStats').then(module => ({ default: module.FooterStats })));
const CommandPalette = lazy(() => import('~/components/ui/CommandPalette').then(module => ({ default: module.CommandPalette })));
const KeyboardShortcuts = lazy(() => import('~/components/ui/KeyboardShortcuts').then(module => ({ default: module.KeyboardShortcuts })));
const ToastContainer = lazy(() => import('~/components/ui/ToastSystem').then(module => ({ default: module.ToastContainer })));
const OfflineBanner = lazy(() => import('~/components/ui/OfflineBanner').then(module => ({ default: module.OfflineBanner })));

export const meta: MetaFunction = () => {
  return [
    { title: 'Fluixy.Ai' },
    {
      name: 'description',
      content:
        'Build full-stack web applications using AI. Describe your idea in English, Hindi, Telugu, or Tamil and Fluixy.ai generates the complete code, preview, and deploys instantly. Made in India.',
    },
    {
      name: 'keywords',
      content: 'AI, web development, code generator, Fluixy, Made in India, Bharat, full-stack, AI builder',
    },
  ];
};

export const loader = () => Response.json({});

/**
 * Landing page component for Fluixy.ai
 * Features: Splash screen, command palette (Ctrl+K), keyboard shortcuts (?),
 * onboarding overlay (first visit), footer stats bar, and background animations.
 */
export default function Index() {
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const handleCommandAction = useCallback((actionId: string) => {
    switch (actionId) {
      case 'new-chat':
        window.location.href = '/';
        break;
      case 'toggle-theme': {
        const current = themeStore.get();
        themeStore.set(current === 'dark' ? 'light' : 'dark');
        break;
      }
      case 'keyboard-shortcuts':
        setShortcutsOpen(true);
        break;
      case 'enhance-prompt': {
        // Focus textarea and trigger enhance
        const textarea = document.querySelector('textarea');
        textarea?.focus();
        break;
      }
      case 'voice-input': {
        // Trigger voice input button click
        const voiceBtn = document.querySelector('[title*="voice"]') as HTMLButtonElement;
        voiceBtn?.click();
        break;
      }
      case 'share-whatsapp': {
        const msg = encodeURIComponent('Check out Fluixy.ai — AI-Powered Development Made for Bharat! 🇮🇳🚀');
        window.open(`https://wa.me/?text=${msg}`, '_blank');
        break;
      }
      case 'share-twitter': {
        const tweet = encodeURIComponent('Just discovered Fluixy.ai — build full-stack apps with AI in seconds! Made in India 🇮🇳 #AIforBharat #Fluixy');
        window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank');
        break;
      }
      case 'settings': {
        // Move mouse to left edge to open sidebar, then click settings
        break;
      }
    }
  }, []);

  // Global keyboard listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ctrl+K or Cmd+K → Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdPaletteOpen((prev) => !prev);
      }

      // ? key → Keyboard Shortcuts (only when not typing)
      if (e.key === '?' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
      }

      // Ctrl+/ → Focus chat input
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        const textarea = document.querySelector('textarea');
        textarea?.focus();
      }

      // Ctrl+T → Toggle theme
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        const current = themeStore.get();
        themeStore.set(current === 'dark' ? 'light' : 'dark');
      }

      // Ctrl+N → New chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        window.location.href = '/';
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col h-full w-full bg-fluixy-elements-background-depth-1"
    >
      <ParticleBackground />
      <BackgroundRays />

      <Suspense fallback={null}>
        <ClientOnly>{() => <OnboardingOverlay />}</ClientOnly>
        <ClientOnly>{() => <OfflineBanner />}</ClientOnly>
        <Header />
      </Suspense>

      <ClientOnly fallback={<BaseChat />}>{() => <Chat />}</ClientOnly>

      <Suspense fallback={null}>
        <FooterStats />
        <ClientOnly>{() => <ToastContainer />}</ClientOnly>
        <ClientOnly>
          {() => (
            <>
              <CommandPalette
                isOpen={cmdPaletteOpen}
                onClose={() => setCmdPaletteOpen(false)}
                onAction={handleCommandAction}
              />
              <KeyboardShortcuts isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
            </>
          )}
        </ClientOnly>
      </Suspense>
    </motion.div>
  );
}
