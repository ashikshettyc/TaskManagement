'use client';

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import Loading from '@/component/Loading';

const Profile = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  const getProfile = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Profile retrieval failed');
      }
      const data = await res.json();
      setFormData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Profile update failed');
      }

      const updatedUser = await res.json();
      console.log(formData);
      setFormData(updatedUser);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        height: 500,
        mt: 5,
        px: 2,
        alignItems: 'center',
        mx: 'auto',
      }}
    >
      {loading ? (
        <Box justifyContent={'center'} alignItems={'center'} width={'100%'}>
          <Loading />
        </Box>
      ) : (
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: 500,
            p: 4,
            backgroundColor: 'background.paper',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h5">Profile</Typography>
            <IconButton onClick={() => setEditing((prev) => !prev)}>
              {editing ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </Box>

          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            disabled={!editing}
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            disabled={!editing}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            disabled={!editing}
          />

          <TextField
            label="Role"
            value={user ? JSON.parse(user)?.role : 'Guest'}
            fullWidth
            disabled
            sx={{ mb: 4 }}
          />

          {editing && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default Profile;
