import { theme } from 'antd';
import type { Theme } from './types';

const { darkAlgorithm, defaultAlgorithm } = theme;

/**
 * Generate Ant Design theme configuration based on current theme
 */
export const getAntThemeConfig = (currentTheme: Theme) => {
  return {
    algorithm: currentTheme === 'dark' ? darkAlgorithm : defaultAlgorithm,
    token: {
      colorPrimary: currentTheme === 'dark' ? '#177ddc' : '#1890ff',
      borderRadius: 6,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    components: {
      Layout: {
        siderBg: currentTheme === 'dark' ? '#141414' : '#001529',
        headerBg: currentTheme === 'dark' ? '#1f1f1f' : '#fff',
        headerColor: currentTheme === 'dark' ? '#fff' : '#000',
      },
      Menu: {
        darkItemBg: currentTheme === 'dark' ? '#141414' : '#001529',
      },
      Card: {
        colorBgContainer: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
      },
      Input: {
        colorBgContainer: currentTheme === 'dark' ? '#262626' : '#ffffff',
        colorBorder: currentTheme === 'dark' ? '#434343' : '#d9d9d9',
        colorText: currentTheme === 'dark' ? '#ffffff' : '#000000',
      },
      Table: {
        colorBgContainer: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
        colorBgContainerSecondary: currentTheme === 'dark' ? '#141414' : '#fafafa',
        colorText: currentTheme === 'dark' ? '#ffffff' : '#000000',
      },
      Button: {
        colorBgContainer: currentTheme === 'dark' ? '#262626' : '#ffffff',
        colorBorder: currentTheme === 'dark' ? '#434343' : '#d9d9d9',
      },
      Modal: {
        colorBgElevated: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
        colorBgMask: currentTheme === 'dark' ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.45)',
      },
    },
  };
};

/**
 * Get the default theme from localStorage or system preference
 */
export const getDefaultTheme = (): Theme => {
  // Check localStorage first
  const savedTheme = localStorage.getItem('theme') as Theme;
  if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
    return savedTheme;
  }

  // Check system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Default to light
  return 'light';
};
