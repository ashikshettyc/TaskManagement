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
    <>
      <Box
        sx={{
          width: 250,
          minHeight: '100vh',
          backgroundColor: mode === 'dark' ? 'grey.900' : 'grey.100',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 3,
        }}
      >
        <div>
          <h2 className="text-xl font-bold mb-8">Task Manager</h2>
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className="block py-2 px-4 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              {link.name}
            </Link>
          ))}
        </div>
        <Divider className="my-4" />
        <Button onClick={logout}>Logout</Button>
        <ThemeToggle />
      </Box>
    </>
  );
};

export default SideBar;
