'use client';
import { useThemeStore } from '@/store/useStore';
import { Box, Button, Divider } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

const SideBar = () => {
  const router = useRouter();
  const { mode } = useThemeStore();
  const links = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Calender', path: '/calender' },
    { name: 'Profile', path: '/profile' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const logout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <Box
      sx={{
        width: {
          xs: '100%',
          md: 250,
        },
        minHeight: {
          xs: 'auto',
          md: '100vh',
        },
        position: {
          xs: 'fixed',
          md: 'relative',
        },
        bottom: {
          xs: 0,
          md: 'auto',
        },
        left: 0,
        zIndex: 1000,
        backgroundColor: mode === 'dark' ? 'grey.900' : 'grey.100',
        display: 'flex',
        flexDirection: {
          xs: 'column',
          md: 'column',
        },
        justifyContent: {
          xs: 'space-around',
          md: 'flex-start',
        },
        alignItems: 'center',
        gap: 2,
        p: {
          xs: 1,
          md: 3,
        },
        boxShadow: {
          xs: '0 -2px 10px rgba(0,0,0,0.1)',
          md: 'none',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: {
            xs: 'row',
            md: 'column',
          },
          gap: 2,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.path}
            className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            {link.name}
          </Link>
        ))}
      </Box>

      <Divider
        sx={{
          display: { xs: 'none', md: 'block' },
          my: 2,
        }}
      />

      <Box
        sx={{
          display: {
            xs: 'flex',
            md: 'flex',
          },
          flexDirection: {
            xs: 'row',
            md: 'column',
          },

          gap: 1,
          mt: '0',
        }}
      >
        <Button onClick={logout}>Logout</Button>
        <ThemeToggle />
      </Box>
    </Box>
  );
};

export default SideBar;
