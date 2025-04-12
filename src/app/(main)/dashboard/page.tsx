'use client';

import CreateTask from '@/component/CreateTask';
import TaskList from '@/component/TaskList';
import {
  Box,
  Button,
  Modal,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import React, { useState } from 'react';

const Page = () => {
  const [open, setOpen] = useState(false);
  const handleTasks = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [refresh, setRefresh] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        px: isMobile ? 2 : 6,
        py: 4,
        bgcolor: '#f9fafb',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Stack
        direction={isMobile ? 'column' : 'row'}
        justifyContent="space-between"
        alignItems={isMobile ? 'flex-start' : 'center'}
        spacing={2}
        mb={4}
      >
        <Typography variant="h4" fontWeight={600}>
          Task Dashboard
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleTasks}>
            Create Task
          </Button>
          <Button variant="outlined" href="/calender">
            Calendar
          </Button>
        </Stack>
      </Stack>

      <TaskList refresh={refresh} />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 4,
            boxShadow: 24,
            width: '90%',
            maxWidth: 500,
          }}
        >
          <Typography variant="h6" mb={2}>
            Create a New Task
          </Typography>
          <CreateTask setRefresh={setRefresh} />
        </Box>
      </Modal>
    </Box>
  );
};

export default Page;
