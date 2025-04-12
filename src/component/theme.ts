// theme.ts
import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
            text: {
              primary: '#ffffff',
            },
          }
        : {
            background: {
              default: '#f4f4f4',
              paper: '#ffffff',
            },
            text: {
              primary: '#000000',
            },
          }),
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
    },
  });
