import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  LinearProgress,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { FilterOption, Task } from './TaskList';
import CancelIcon from '@mui/icons-material/Cancel';
import { format } from 'date-fns';
const UserList = ({
  filter,
  setFilter,
  loading,
  filteredTasks,
  loadingTaskId,
  handleSubmission,
  tasks,
}: {
  filter: FilterOption;
  setFilter: Dispatch<SetStateAction<FilterOption>>;
  loading: boolean;
  filteredTasks: Task[];
  tasks: Task[];
  loadingTaskId: string | null;
  handleSubmission: (id: string) => void;
}) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Your Tasks
      </Typography>

      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(_, val) => val && setFilter(val)}
        sx={{
          mb: 3,
          display: 'flex',
          flex: {
            xs: 'wrap',
          },
          flexDirection: {
            xs: 'column',
            md: 'row',
          },
        }}
        color="primary"
      >
        <ToggleButton value="notSubmitted">Not Submitted</ToggleButton>
        <ToggleButton value="submitted">Submitted</ToggleButton>
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
          {filteredTasks.map((task) => (
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
                    image={task.photo}
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
                    Deadline: {format(new Date(task.deadline), 'dd MMM yyyy')}
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

                  <Box sx={{ mt: 2 }}>
                    {!task.submitted && !task.approved && !task.rejected ? (
                      <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        disabled={loadingTaskId === task.id}
                        onClick={() => handleSubmission(task.id)}
                        startIcon={
                          loadingTaskId === task.id ? (
                            <CircularProgress size={18} />
                          ) : null
                        }
                      >
                        {loadingTaskId === task.id
                          ? 'Submitting...'
                          : 'Send for Approval'}
                      </Button>
                    ) : task.approved ? (
                      <CheckCircleIcon color="success" />
                    ) : task.rejected ? (
                      <CancelIcon color="error" />
                    ) : (
                      <CheckCircleIcon color="info" />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default UserList;
