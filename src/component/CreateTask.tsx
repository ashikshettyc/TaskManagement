'use client';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Slider,
  Input,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
interface TaskFormProps {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}
const CreateTask = ({ setRefresh }: TaskFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    progress: 0,
    deadline: '',
    photos: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  if (!user) {
    router.push('/login');
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const readers = Array.from(files).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((photos) => {
      setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...photos] }));
    });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const taskData = {
        title: formData.title,
        description: formData.description,
        progress: formData.progress,
        deadline: formData.deadline,
        photos: formData.photos,
      };

      const response = await fetch('/api/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      setToast({
        open: true,
        message: 'Task created successfully!',
        severity: 'success',
      });

      setFormData({
        title: '',
        description: '',
        progress: 0,
        deadline: '',
        photos: [] as string[],
      });
    } catch (error) {
      console.error('Error creating task:', error);
      setToast({
        open: true,
        message: 'Error creating task',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
      setRefresh(true);
    }
  };

  return (
    <Box display="flex" justifyContent="center">
      <Paper sx={{ p: 4, width: '100%', maxWidth: 600 }}>
        <Typography variant="h5" mb={2}>
          Create Task
        </Typography>

        <TextField
          label="Title"
          fullWidth
          sx={{ mb: 2 }}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 2 }}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <Typography gutterBottom>Progress: {formData.progress}%</Typography>
        <Slider
          value={formData.progress}
          onChange={(e, val) =>
            setFormData({ ...formData, progress: val as number })
          }
          sx={{ mb: 2 }}
        />

        <TextField
          label="Deadline"
          type="date"
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          value={formData.deadline}
          onChange={(e) =>
            setFormData({ ...formData, deadline: e.target.value })
          }
        />

        <Input
          type="file"
          inputProps={{ multiple: true }}
          onChange={handlePhotoUpload}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleSubmit}
          disabled={isLoading}
          startIcon={
            isLoading && <CircularProgress size={20} color="inherit" />
          }
        >
          {isLoading ? 'Creating Task...' : 'Create Task'}
        </Button>
      </Paper>
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity as 'success' | 'error' | 'info' | 'warning'}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateTask;
