import React, { createContext, useContext, useEffect, useState } from 'react';
import { ConfigProvider } from 'antd';
import { getAntThemeConfig, getDefaultTheme } from './themeConfig';
import type { Theme, ThemeContextType, ThemeProviderProps } from './types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getDefaultTheme);

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('theme', theme);

    // Update document class for global theme (Tailwind compatibility)
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Generate Ant Design theme configuration
  const antTheme = getAntThemeConfig(theme);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ConfigProvider theme={antTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};