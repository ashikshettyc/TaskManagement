// context/ThemeContext.tsx
'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from '@/component/theme';
import { useThemeStore } from '@/store/useStore';

export const ThemeRegistry = ({ children }: { children: React.ReactNode }) => {
  const { mode, hasHydrated } = useThemeStore();

  if (!hasHydrated) return null;
  const theme = getTheme(mode);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
