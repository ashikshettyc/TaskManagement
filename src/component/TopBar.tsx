'use client';
import { AppBar, Toolbar, Typography, useTheme } from '@mui/material';
import ThemeToggle from './ThemeToggle';

const TopBar = () => {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: 'theme.palette.background.paper',
        color: theme.palette.text.primary,
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5">Task Manager</Typography>
        <ThemeToggle />
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
