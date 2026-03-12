import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import {
  Box, Paper, IconButton, Typography, Avatar,
  Chip, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, alpha, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions,
  TextField, InputAdornment, Tooltip, Stack, Button
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import WarningIcon from '@mui/icons-material/Warning';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import axios from 'axios';
import CustomSnackbar from '../../../CustomSnackbar';
import useSnackbar from '../../../useSnackbar';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#4caf50',
    color: theme.palette.common.white,
    fontWeight: 600,
    fontSize: 14,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: alpha('#4caf50', 0.02),
  },
  '&:hover': {
    backgroundColor: alpha('#4caf50', 0.05),
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function ManageUsers() {
  const admintoken = localStorage.getItem("admintoken");
  const [user, setUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const fetchusers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/getuser`);
      setUser(response.data.getusers);
    } catch (error) {
      console.log(error);
      showSnackbar("Error fetching users", "error");
    }
  };

  useEffect(() => {
    fetchusers();
  }, []);

  const deleteuser = async (uid) => {
    setLoading(true);
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/user/deleteuser/${uid}`, {
        headers: { "admin-token": admintoken }
      });

      if (res.status === 200) {
        showSnackbar("User deleted successfully", "success");
        fetchusers();
        setOpenDialog(false);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        showSnackbar("Unauthorized access. Please login as admin.", "error");
      } else {
        showSnackbar(error.response?.data?.message || "Failed to delete user", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const filteredUsers = user.filter(u => {
    const searchLower = searchTerm.toLowerCase();
    return (
      u.name?.toLowerCase().includes(searchLower) ||
      u.email?.toLowerCase().includes(searchLower) ||
      (u.phone && u.phone.toString().toLowerCase().includes(searchLower))
    );
  });

  // Function to get initials from name
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          border: '1px solid',
          borderColor: 'rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha('#4caf50', 0.1),
            display: 'inline-flex'
          }}>
            <PeopleIcon sx={{ color: '#4caf50', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>
              User Management
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
              Total {user.length} registered users
            </Typography>
          </Box>
        </Box>

        <TextField
          placeholder="Search users by name, email or phone..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: 350,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: '#f8f9fa',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#999' }} />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Users Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'rgba(0,0,0,0.05)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.02)',
          overflowX: 'auto',
        }}
      >
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>#</StyledTableCell>
              <StyledTableCell>User</StyledTableCell>
              <StyledTableCell align="right">Phone</StyledTableCell>
              <StyledTableCell align="right">Email</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <PeopleIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    No users found
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {searchTerm ? `No results for "${searchTerm}"` : 'No users are registered yet'}
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              filteredUsers.map((u, index) => (
                <StyledTableRow key={u._id}>
                  <StyledTableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 45,
                          height: 45,
                          bgcolor: alpha('#4caf50', 0.2),
                          color: '#4caf50',
                          fontWeight: 600,
                          fontSize: '1rem',
                        }}
                      >
                        {getInitials(u.name)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                          {u.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#999', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          ID: {u._id.slice(-8)}
                        </Typography>
                      </Box>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                      <PhoneIcon sx={{ fontSize: 16, color: '#999' }} />
                      <Typography variant="body2">{u.phone || 'N/A'}</Typography>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                      <EmailIcon sx={{ fontSize: 16, color: '#999' }} />
                      <Typography variant="body2">{u.email}</Typography>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Chip
                      label="Active"
                      size="small"
                      sx={{
                        bgcolor: alpha('#4caf50', 0.1),
                        color: '#4caf50',
                        fontWeight: 600,
                        minWidth: 70,
                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Tooltip title="Delete User">
                      <IconButton
                        onClick={() => handleDeleteClick(u)}
                        sx={{
                          color: '#f44336',
                          bgcolor: alpha('#f44336', 0.1),
                          '&:hover': {
                            bgcolor: alpha('#f44336', 0.2),
                          },
                          width: 40,
                          height: 40,
                        }}
                      >
                        <DeleteOutlineOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#333', display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon sx={{ color: '#ff9800' }} />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#666' }}>
            Are you sure you want to delete user{' '}
            <strong>{selectedUser?.name}</strong>? This action cannot be undone and
            all user data will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            disabled={loading}
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
            onClick={() => deleteuser(selectedUser?._id)}
            variant="contained"
            color="error"
            disabled={loading}
            sx={{
              borderRadius: 2,
              boxShadow: 'none',
              textTransform: 'none',
              px: 3,
            }}
          >
            {loading ? 'Deleting...' : 'Delete User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <CustomSnackbar
        snackbar={snackbar}
        onClose={hideSnackbar}
      />
    </Box>
  );
}