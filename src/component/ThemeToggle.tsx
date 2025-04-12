'use client';

import { IconButton } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useThemeStore } from '@/store/useStore';

export default function ThemeToggle() {
  const { mode, toggleTheme } = useThemeStore();
  return (
    <IconButton onClick={toggleTheme} color="inherit" sx={{ width: 50 }}>
      {mode === 'light' ? <DarkMode /> : <LightMode />}
    </IconButton>
  );
}
