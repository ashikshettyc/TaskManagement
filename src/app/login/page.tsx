'use client';
import {
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleLogin = async () => {
    setLoading(true);
    setError('');

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/dashboard');
    } catch (error) {
      console.log(error);
      setError('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 ">
      <Paper elevation={4} className="p-8 max-w-md w-full">
        <div className=" mb-10">
          <Typography variant="h5" className="text-center">
            Login
          </Typography>
        </div>

        <div className=" flex flex-col gap-y-10">
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {error && (
            <Typography color="error" className="text-sm mt-2">
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default Login;
