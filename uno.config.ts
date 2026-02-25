import { globSync } from 'fast-glob';
import fs from 'node:fs/promises';
import { basename } from 'node:path';
import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss';

const iconPaths = globSync('./icons/*.svg');

const collectionName = 'fluixy';

const customIconCollection = iconPaths.reduce(
  (acc, iconPath) => {
    const [iconName] = basename(iconPath).split('.');

    acc[collectionName] ??= {};
    acc[collectionName][iconName] = async () => fs.readFile(iconPath, 'utf8');

    return acc;
  },
  {} as Record<string, Record<string, () => Promise<string>>>,
);

const BASE_COLORS = {
  white: '#FFFFFF',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },
  accent: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
    950: '#083344',
  },
  green: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
    950: '#052E16',
  },
  orange: {
    50: '#FFFAEB',
    100: '#FEEFC7',
    200: '#FEDF89',
    300: '#FEC84B',
    400: '#FDB022',
    500: '#F79009',
    600: '#DC6803',
    700: '#B54708',
    800: '#93370D',
    900: '#792E0D',
  },
  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
    950: '#450A0A',
  },
};

const COLOR_PRIMITIVES = {
  ...BASE_COLORS,
  alpha: {
    white: generateAlphaPalette(BASE_COLORS.white),
    gray: generateAlphaPalette(BASE_COLORS.gray[900]),
    red: generateAlphaPalette(BASE_COLORS.red[500]),
    accent: generateAlphaPalette(BASE_COLORS.accent[500]),
  },
};

export default defineConfig({
  safelist: [
    ...Object.keys(customIconCollection[collectionName] || {}).map((x) => `i-fluixy:${x}`),
    'i-ph:pencil-simple',
    'i-ph:check',
    'i-ph:x',
    'i-ph:key',
    'i-ph:check-circle-fill',
    'i-ph:x-circle-fill',
  ],
  shortcuts: {
    'fluixy-ease-cubic-bezier': 'ease-[cubic-bezier(0.4,0,0.2,1)]',
    'transition-theme': 'transition-[background-color,border-color,color] duration-150 fluixy-ease-cubic-bezier',
    kdb: 'bg-fluixy-elements-code-background text-fluixy-elements-code-text py-1 px-1.5 rounded-md',
    'max-w-chat': 'max-w-[var(--chat-max-width)]',
  },
  rules: [
    /**
     * This shorthand doesn't exist in Tailwind and we overwrite it to avoid
     * any conflicts with minified CSS classes.
     */
    ['b', {}],
  ],
  theme: {
    colors: {
      ...COLOR_PRIMITIVES,
      fluixy: {
        elements: {
          borderColor: 'var(--fluixy-elements-borderColor)',
          borderColorActive: 'var(--fluixy-elements-borderColorActive)',
          background: {
            depth: {
              1: 'var(--fluixy-elements-bg-depth-1)',
              2: 'var(--fluixy-elements-bg-depth-2)',
              3: 'var(--fluixy-elements-bg-depth-3)',
              4: 'var(--fluixy-elements-bg-depth-4)',
            },
          },
          textPrimary: 'var(--fluixy-elements-textPrimary)',
          textSecondary: 'var(--fluixy-elements-textSecondary)',
          textTertiary: 'var(--fluixy-elements-textTertiary)',
          code: {
            background: 'var(--fluixy-elements-code-background)',
            text: 'var(--fluixy-elements-code-text)',
          },
          button: {
            primary: {
              background: 'var(--fluixy-elements-button-primary-background)',
              backgroundHover: 'var(--fluixy-elements-button-primary-backgroundHover)',
              text: 'var(--fluixy-elements-button-primary-text)',
            },
            secondary: {
              background: 'var(--fluixy-elements-button-secondary-background)',
              backgroundHover: 'var(--fluixy-elements-button-secondary-backgroundHover)',
              text: 'var(--fluixy-elements-button-secondary-text)',
            },
            danger: {
              background: 'var(--fluixy-elements-button-danger-background)',
              backgroundHover: 'var(--fluixy-elements-button-danger-backgroundHover)',
              text: 'var(--fluixy-elements-button-danger-text)',
            },
          },
          item: {
            contentDefault: 'var(--fluixy-elements-item-contentDefault)',
            contentActive: 'var(--fluixy-elements-item-contentActive)',
            contentAccent: 'var(--fluixy-elements-item-contentAccent)',
            contentDanger: 'var(--fluixy-elements-item-contentDanger)',
            backgroundDefault: 'var(--fluixy-elements-item-backgroundDefault)',
            backgroundActive: 'var(--fluixy-elements-item-backgroundActive)',
            backgroundAccent: 'var(--fluixy-elements-item-backgroundAccent)',
            backgroundDanger: 'var(--fluixy-elements-item-backgroundDanger)',
          },
          actions: {
            background: 'var(--fluixy-elements-actions-background)',
            code: {
              background: 'var(--fluixy-elements-actions-code-background)',
            },
          },
          artifacts: {
            background: 'var(--fluixy-elements-artifacts-background)',
            backgroundHover: 'var(--fluixy-elements-artifacts-backgroundHover)',
            borderColor: 'var(--fluixy-elements-artifacts-borderColor)',
            inlineCode: {
              background: 'var(--fluixy-elements-artifacts-inlineCode-background)',
              text: 'var(--fluixy-elements-artifacts-inlineCode-text)',
            },
          },
          messages: {
            background: 'var(--fluixy-elements-messages-background)',
            linkColor: 'var(--fluixy-elements-messages-linkColor)',
            code: {
              background: 'var(--fluixy-elements-messages-code-background)',
            },
            inlineCode: {
              background: 'var(--fluixy-elements-messages-inlineCode-background)',
              text: 'var(--fluixy-elements-messages-inlineCode-text)',
            },
          },
          icon: {
            success: 'var(--fluixy-elements-icon-success)',
            error: 'var(--fluixy-elements-icon-error)',
            primary: 'var(--fluixy-elements-icon-primary)',
            secondary: 'var(--fluixy-elements-icon-secondary)',
            tertiary: 'var(--fluixy-elements-icon-tertiary)',
          },
          preview: {
            addressBar: {
              background: 'var(--fluixy-elements-preview-addressBar-background)',
              backgroundHover: 'var(--fluixy-elements-preview-addressBar-backgroundHover)',
              backgroundActive: 'var(--fluixy-elements-preview-addressBar-backgroundActive)',
              text: 'var(--fluixy-elements-preview-addressBar-text)',
              textActive: 'var(--fluixy-elements-preview-addressBar-textActive)',
            },
          },
          terminals: {
            background: 'var(--fluixy-elements-terminals-background)',
            buttonBackground: 'var(--fluixy-elements-terminals-buttonBackground)',
          },
          dividerColor: 'var(--fluixy-elements-dividerColor)',
          loader: {
            background: 'var(--fluixy-elements-loader-background)',
            progress: 'var(--fluixy-elements-loader-progress)',
          },
          prompt: {
            background: 'var(--fluixy-elements-prompt-background)',
          },
          sidebar: {
            dropdownShadow: 'var(--fluixy-elements-sidebar-dropdownShadow)',
            buttonBackgroundDefault: 'var(--fluixy-elements-sidebar-buttonBackgroundDefault)',
            buttonBackgroundHover: 'var(--fluixy-elements-sidebar-buttonBackgroundHover)',
            buttonText: 'var(--fluixy-elements-sidebar-buttonText)',
          },
          cta: {
            background: 'var(--fluixy-elements-cta-background)',
            text: 'var(--fluixy-elements-cta-text)',
          },
        },
      },
    },
  },
  transformers: [transformerDirectives()],
  presets: [
    presetUno({
      dark: {
        light: '[data-theme="light"]',
        dark: '[data-theme="dark"]',
      },
    }),
    presetIcons({
      warn: true,
      collections: {
        ...customIconCollection,
        ph: () => import('@iconify-json/ph/icons.json').then((i) => i.default as any),
      },
      unit: 'em',
    }),
  ],
});

/**
 * Generates an alpha palette for a given hex color.
 *
 * @param hex - The hex color code (without alpha) to generate the palette from.
 * @returns An object where keys are opacity percentages and values are hex colors with alpha.
 *
 * Example:
 *
 * ```
 * {
 *   '1': '#FFFFFF03',
 *   '2': '#FFFFFF05',
 *   '3': '#FFFFFF08',
 * }
 * ```
 */
function generateAlphaPalette(hex: string) {
  return [1, 2, 3, 4, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].reduce(
    (acc, opacity) => {
      const alpha = Math.round((opacity / 100) * 255)
        .toString(16)
        .padStart(2, '0');

      acc[opacity] = `${hex}${alpha}`;

      return acc;
    },
    {} as Record<number, string>,
  );
}
