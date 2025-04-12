import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const Loading = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
      }}
    >
      <CircularProgress size={50} />
      <span style={{ marginTop: '20px', fontSize: '1.2rem', color: '#3498db' }}>
        Loading...
      </span>
    </Box>
  );
};

export default Loading;
