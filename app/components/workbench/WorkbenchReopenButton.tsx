import type { MouseEventHandler } from 'react';

export function WorkbenchReopenButton({ onClick }: { onClick: MouseEventHandler<HTMLButtonElement> }) {
  return (
    <button
      type="button"
      aria-label="Open workbench"
      title="Open workbench"
      onClick={onClick}
      className="fixed top-[calc(var(--header-height)+1.2rem)] right-6 z-workbench flex items-center gap-2 rounded-md border border-fluixy-elements-borderColor bg-fluixy-elements-background-depth-2 px-3 py-2 text-sm text-fluixy-elements-textPrimary shadow-sm transition-colors hover:bg-fluixy-elements-background-depth-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-500"
    >
      <span className="i-ph:sidebar-simple text-base" aria-hidden="true" />
      Open workbench
    </button>
  );
}
