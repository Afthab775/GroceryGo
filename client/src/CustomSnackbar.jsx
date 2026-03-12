import React from 'react';
import { Snackbar, Alert } from '@mui/material';

export default function CustomSnackbar({ snackbar, onClose }) {
  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={snackbar.severity}
        sx={{
          width: '100%',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontWeight: 500,
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}