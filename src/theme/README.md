# Theme System

This directory contains the centralized theme management system for the BitTorrent Tracker application.

## 📁 Structure

```
src/theme/
├── index.ts           # Main exports
├── ThemeProvider.tsx  # React context provider
├── hooks.ts           # Custom hooks for theme operations
├── themeConfig.ts     # Ant Design theme configuration
├── constants.ts       # Design tokens and constants
├── types.ts           # TypeScript type definitions
└── README.md          # This file
```

## 🚀 Usage

### Basic Theme Provider

```tsx
import { ThemeProvider } from './theme';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### Using Theme Hooks

```tsx
import { useThemeMode, useThemeStyles } from './theme';

function MyComponent() {
  const { theme, isDark, toggleTheme } = useThemeMode();
  const { themeClass, themeValue } = useThemeStyles();

  return (
    <div className={themeClass('bg-white', 'bg-gray-900')}>
      <button onClick={toggleTheme}>
        Switch to {isDark ? 'Light' : 'Dark'} Mode
      </button>
      <p className={themeClass('text-gray-900', 'text-white')}>
        Current theme: {theme}
      </p>
    </div>
  );
}
```

### Theme Constants

```tsx
import { THEME_COLORS, SPACING, BORDER_RADIUS } from './theme';

const styles = {
  backgroundColor: THEME_COLORS.background.light,
  padding: SPACING.md,
  borderRadius: BORDER_RADIUS.md,
};
```

## 🎨 Theme Features

### Supported Themes
- **Light Theme**: Default theme with light backgrounds
- **Dark Theme**: Dark theme with dark backgrounds and light text

### Automatic Detection
- **localStorage**: Persists user theme preference
- **System Preference**: Falls back to system dark/light mode preference

### Ant Design Integration
- **ConfigProvider**: Automatically configures Ant Design components
- **Component Themes**: Custom styling for cards, inputs, tables, etc.
- **Responsive**: Adapts to theme changes instantly

## 🔧 Customization

### Adding New Theme Colors

```typescript
// In constants.ts
export const THEME_COLORS = {
  // ... existing colors
  accent: {
    light: '#ff6b6b',
    dark: '#ff5252',
  },
};
```

### Extending Ant Design Theme

```typescript
// In themeConfig.ts
export const getAntThemeConfig = (currentTheme: Theme) => {
  return {
    // ... existing config
    token: {
      // ... existing tokens
      colorSuccess: currentTheme === 'dark' ? '#52c41a' : '#389e0d',
    },
  };
};
```

## 📱 Responsive Design

The theme system works seamlessly with Tailwind CSS responsive utilities:

```tsx
<div className={themeClass(
  'bg-white md:bg-gray-50',
  'bg-gray-900 md:bg-gray-800'
)}>
  Responsive themed content
</div>
```

## 🔄 Migration from Old System

If migrating from the old context-based system:

1. Replace `import { ThemeProvider } from './contexts/ThemeContext'` with `import { ThemeProvider } from './theme'`
2. Update any `useTheme` imports to use the new location
3. The API remains the same, so no other changes are needed

## 🎯 Best Practices

1. **Use Theme Hooks**: Prefer `useThemeMode()` and `useThemeStyles()` for theme-aware logic
2. **Consistent Naming**: Use Tailwind's dark: prefix for dark mode styles
3. **Design Tokens**: Use constants from `constants.ts` for consistent values
4. **Type Safety**: All theme operations are fully typed

## 🐛 Troubleshooting

### Theme Not Applying
- Check that `ThemeProvider` wraps your entire app
- Verify Tailwind's dark mode is set to 'class' in `tailwind.config.js`
- Ensure `document.documentElement` has the correct class

### Ant Design Components Not Themed
- Make sure components are inside the `ThemeProvider`
- Check that `getAntThemeConfig` includes styling for the component type
- Verify the component supports Ant Design's theme system
