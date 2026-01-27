import type { ITheme } from '@xterm/xterm';

const style = getComputedStyle(document.documentElement);
const cssVar = (token: string) => style.getPropertyValue(token) || undefined;

export function getTerminalTheme(overrides?: ITheme): ITheme {
  return {
    cursor: cssVar('--fluixy-elements-terminal-cursorColor'),
    cursorAccent: cssVar('--fluixy-elements-terminal-cursorColorAccent'),
    foreground: cssVar('--fluixy-elements-terminal-textColor'),
    background: cssVar('--fluixy-elements-terminal-backgroundColor'),
    selectionBackground: cssVar('--fluixy-elements-terminal-selection-backgroundColor'),
    selectionForeground: cssVar('--fluixy-elements-terminal-selection-textColor'),
    selectionInactiveBackground: cssVar('--fluixy-elements-terminal-selection-backgroundColorInactive'),

    // ansi escape code colors
    black: cssVar('--fluixy-elements-terminal-color-black'),
    red: cssVar('--fluixy-elements-terminal-color-red'),
    green: cssVar('--fluixy-elements-terminal-color-green'),
    yellow: cssVar('--fluixy-elements-terminal-color-yellow'),
    blue: cssVar('--fluixy-elements-terminal-color-blue'),
    magenta: cssVar('--fluixy-elements-terminal-color-magenta'),
    cyan: cssVar('--fluixy-elements-terminal-color-cyan'),
    white: cssVar('--fluixy-elements-terminal-color-white'),
    brightBlack: cssVar('--fluixy-elements-terminal-color-brightBlack'),
    brightRed: cssVar('--fluixy-elements-terminal-color-brightRed'),
    brightGreen: cssVar('--fluixy-elements-terminal-color-brightGreen'),
    brightYellow: cssVar('--fluixy-elements-terminal-color-brightYellow'),
    brightBlue: cssVar('--fluixy-elements-terminal-color-brightBlue'),
    brightMagenta: cssVar('--fluixy-elements-terminal-color-brightMagenta'),
    brightCyan: cssVar('--fluixy-elements-terminal-color-brightCyan'),
    brightWhite: cssVar('--fluixy-elements-terminal-color-brightWhite'),

    ...overrides,
  };
}
