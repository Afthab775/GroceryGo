import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  alpha
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

export default function ConfirmationDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
          minWidth: 320,
        }
      }}
    >
      <DialogTitle sx={{ 
        fontWeight: 700, 
        color: '#333', 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1 
      }}>
        <WarningIcon sx={{ color: '#ff9800' }} />
        {title || 'Confirm Action'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: '#666' }}>
          {message || 'Are you sure you want to proceed?'}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: '#ccc',
            color: '#666',
            '&:hover': { borderColor: '#999' },
            borderRadius: 2,
            textTransform: 'none',
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          variant="contained"
          color="error"
          sx={{
            borderRadius: 2,
            boxShadow: 'none',
            textTransform: 'none',
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}