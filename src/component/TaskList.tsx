'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  CardMedia,
} from '@mui/material';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import UserList from './UserList';

export interface Task {
  photo: string;
  role: string;
  rejected: boolean;
  id: string;
  title: string;
  description: string;
  deadline: string;
  progress: number;
  submitted: boolean;
  approved?: boolean;
}

export type FilterOption =
  | 'myTask'
  | 'notSubmitted'
  | 'submitted'
  | 'approved'
  | 'rejected';

const TaskList = ({ refresh }: { refresh: boolean }) => {
  const token = localStorage.getItem('token');
  const localUser = localStorage.getItem('user');
  const user = localUser ? JSON.parse(localUser) : null;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterOption>(
    user?.role === 'ADMIN' ? 'submitted' : 'notSubmitted'
  );

  const AllTasks = async () => {
    try {
      const fetchTasks = await fetch('/api/task', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!fetchTasks.ok) {
        throw new Error('Task retrieval failed');
      }
      const data = await fetchTasks.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmission = async (id: string) => {
    try {
      setLoadingTaskId(id);
      const res = await fetch(`/api/task/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ submitted: true }),
      });

      if (!res.ok) throw new Error('Failed to submit task');

      toast.success('Task submitted for approval');

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, submitted: true } : task
        )
      );
    } catch (error) {
      console.error('Error submitting task:', error);
      toast.error('Submission failed');
    } finally {
      setLoadingTaskId(null);
    }
  };
  const handleApproval = async (id: string) => {
    try {
      setLoadingTaskId(id);
      const res = await fetch(`/api/task/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approved: true }),
      });

      if (!res.ok) throw new Error('Failed to submit task');

      toast.success('Task submitted for approval');

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, approved: true } : task
        )
      );
    } catch (error) {
      console.error('Error submitting task:', error);
      toast.error('Submission failed');
    } finally {
      setLoadingTaskId(null);
    }
  };

  const handleRejection = async (id: string) => {
    try {
      setLoadingTaskId(id);
      const res = await fetch(`/api/task/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rejected: true }),
      });

      if (!res.ok) throw new Error('Failed to reject task');

      toast.success('Task rejected');

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, rejected: true } : task
        )
      );
    } catch (error) {
      console.error('Error reject task:', error);
      toast.error('rejection failed');
    } finally {
      setLoadingTaskId(null);
    }
  };
  const AdminFilter = tasks.filter((task) => {
    if (filter === 'submitted')
      return task.submitted && !task.approved && !task.rejected;
    if (filter === 'approved') return task.approved && !task.rejected;
    if (filter === 'rejected') return task.rejected;
    return task.submitted;
  });
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'notSubmitted') return !task.submitted;
    if (filter === 'submitted')
      return task.submitted && !task.approved && !task.rejected;
    if (filter === 'approved') return task.approved;
    if (filter === 'rejected') return task.rejected;
    return true;
  });

  useEffect(() => {
    AllTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <>
      {user.role === 'ADMIN' ? (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            All Tasks
          </Typography>

          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(_, val) => val && setFilter(val)}
            sx={{ mb: 3 }}
            color="primary"
          >
            <ToggleButton value="submitted">All Submitted Tasks</ToggleButton>
            <ToggleButton value="approved">Approved</ToggleButton>
            <ToggleButton value="rejected">Rejected</ToggleButton>
          </ToggleButtonGroup>

          {loading ? (
            <Typography sx={{ px: 3 }}>Loading Task...</Typography>
          ) : tasks.length === 0 ? (
            <Typography sx={{ px: 3 }}>No Task Available</Typography>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
              }}
            >
              {AdminFilter.map((task) => (
                <Box
                  key={task.id}
                  sx={{
                    flex: {
                      xs: '0 0 100%',
                      md: '0 0 48%',
                      lg: '0 0 31%',
                    },
                  }}
                >
                  <Card>
                    <CardContent>
                      <CardMedia
                        component="img"
                        image={task.photo[0]}
                        alt="Task Image"
                        sx={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                          mb: 2,
                        }}
                      />

                      <Typography variant="h6">{task.title}</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {task.description}
                      </Typography>

                      <Typography variant="caption">
                        Deadline: {task.deadline}
                      </Typography>

                      <Box sx={{ mt: 2, mb: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={task.progress}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="caption">
                          {task.progress}% Complete
                        </Typography>
                      </Box>

                      <Chip
                        label={
                          task.approved
                            ? 'Approved'
                            : task.rejected
                            ? 'Rejected'
                            : task.submitted
                            ? 'Submitted'
                            : 'Not Submitted'
                        }
                        color={
                          task.approved
                            ? 'success'
                            : task.rejected
                            ? 'error'
                            : task.submitted
                            ? 'info'
                            : 'warning'
                        }
                        size="small"
                        sx={{ mt: 1 }}
                      />

                      {task.submitted &&
                        !task.approved &&
                        !task.rejected &&
                        user.role === 'ADMIN' && (
                          <Box
                            sx={{
                              mt: 2,
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Button
                              variant="outlined"
                              color="success"
                              onClick={() => handleApproval(task.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleRejection(task.id)}
                            >
                              Reject
                            </Button>
                          </Box>
                        )}
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ) : (
        <UserList
          loading={loading}
          filter={filter}
          setFilter={setFilter}
          filteredTasks={filteredTasks}
          tasks={tasks}
          loadingTaskId={loadingTaskId}
          handleSubmission={handleSubmission}
        />
      )}
    </>
  );
};

export default TaskList;
