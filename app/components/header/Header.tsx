import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { ThemeSwitch } from '~/components/ui/ThemeSwitch';
import { RTLToggle } from '~/components/ui/RTLToggle';

export function Header() {
  const chat = useStore(chatStore);

  return (
    <header
      className={classNames(
        'flex items-center px-4 h-[var(--header-height)] relative z-20 transition-all duration-300',
        {
          'border-transparent': !chat.started,
          'border-b border-fluixy-elements-borderColor': chat.started,
        },
      )}
      style={{
        background: 'var(--fluixy-glass-background)',
        backdropFilter: 'blur(20px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
      }}
    >
      {/* Animated gradient bottom border */}
      {chat.started && (
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{
            background: 'var(--fluixy-accent-gradient)',
            opacity: 0.4,
          }}
        />
      )}

      {/* Logo area */}
      <div className="flex items-center gap-2 z-logo text-fluixy-elements-textPrimary cursor-pointer">
        <div className="i-ph:sidebar-simple-duotone text-xl hover:text-fluixy-elements-item-contentAccent transition-colors duration-200" />
        <a href="/" className="text-2xl font-semibold flex items-center group">
          <img
            src="/logo-light-styled.png"
            alt="Fluixy.ai"
            className="h-[40px] w-auto inline-block dark:hidden transition-transform duration-300 group-hover:scale-105"
          />
          <img
            src="/logo-dark-styled.png"
            alt="Fluixy.ai"
            className="h-[40px] w-auto inline-block hidden dark:block transition-transform duration-300 group-hover:scale-105"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(139, 92, 246, 0.3))',
            }}
          />
        </a>
      </div>

      {/* Theme switch + status badge */}
      <div className="ml-auto flex items-center gap-3">
        {!chat.started && (
          <>
            <span
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(139, 92, 246, 0.12)',
                color: 'var(--fluixy-elements-item-contentAccent)',
                border: '1px solid rgba(139, 92, 246, 0.15)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              AI Ready
            </span>
            <button
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(139, 92, 246, 0.08)',
                color: 'var(--fluixy-elements-textTertiary)',
                border: '1px solid rgba(139, 92, 246, 0.1)',
              }}
              onClick={() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
              }}
              title="Open Command Palette"
            >
              <kbd style={{ fontFamily: 'inherit', fontSize: 'inherit' }}>Ctrl+K</kbd>
            </button>
          </>
        )}
        <div className="flex items-center">
          <ClientOnly>{() => <RTLToggle className="mr-1" />}</ClientOnly>
          <ClientOnly>{() => <ThemeSwitch className="" />}</ClientOnly>
        </div>
      </div>

      {/* Chat description + action buttons (only when chat started) */}
      {chat.started && (
        <>
          <span className="flex-1 px-4 truncate text-center text-fluixy-elements-textPrimary">
            <ClientOnly>{() => <ChatDescription />}</ClientOnly>
          </span>
          <ClientOnly>
            {() => (
              <div className="">
                <HeaderActionButtons chatStarted={chat.started} />
              </div>
            )}
          </ClientOnly>
        </>
      )}
    </header>
  );
}
