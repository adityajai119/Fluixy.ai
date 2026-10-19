import { useStore } from '@nanostores/react';
import { memo, useEffect, useState } from 'react';
import { IconButton } from './IconButton';
import { themeStore, toggleTheme } from '~/lib/stores/theme';
import { getThemeMode } from '~/types/theme';

interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch = memo(({ className }: ThemeSwitchProps) => {
  const theme = useStore(themeStore);
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    domLoaded && (
      <IconButton
        className={className}
        icon={
          theme === 'dark' ? 'i-ph-moon-stars-duotone' :
            theme === 'saffron' ? 'i-ph-fire-duotone' :
              'i-ph-sun-dim-duotone'
        }
        size="xl"
        title={`Toggle Theme (Current: ${theme})`}
        onClick={toggleTheme}
      />
    )
  );
});
