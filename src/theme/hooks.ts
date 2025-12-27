import { useTheme } from './ThemeProvider';
import type { Theme } from './types';

/**
 * Hook for theme-related operations
 */
export const useThemeMode = () => {
  const { theme, toggleTheme } = useTheme();

  const setTheme = (newTheme: Theme) => {
    if (newTheme !== theme) {
      toggleTheme();
    }
  };

  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  return {
    theme,
    isDark,
    isLight,
    toggleTheme,
    setTheme,
    setLight: () => setTheme('light'),
    setDark: () => setTheme('dark'),
  };
};

/**
 * Hook for theme-aware styling
 */
export const useThemeStyles = () => {
  const { isDark } = useThemeMode();

  const getThemeClass = (lightClass: string, darkClass: string) => {
    return isDark ? darkClass : lightClass;
  };

  const getThemeValue = <T>(lightValue: T, darkValue: T): T => {
    return isDark ? darkValue : lightValue;
  };

  return {
    isDark,
    themeClass: getThemeClass,
    themeValue: getThemeValue,
    // Common theme-aware classes
    bg: getThemeClass('bg-white', 'bg-gray-900'),
    text: getThemeClass('text-gray-900', 'text-white'),
    border: getThemeClass('border-gray-200', 'border-gray-700'),
    card: getThemeClass('bg-white border-gray-200', 'bg-gray-800 border-gray-700'),
  };
};
