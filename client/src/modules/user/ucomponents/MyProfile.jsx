import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  alpha
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

export default function MyProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("usertoken");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Form state for editing
  const [formData, setFormData] = useState({
    uname: '',
    uemail: '',
    uphone: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/getprofile`,
        { headers: { "auth-token": token } }
      );
      const userData = response.data.userp;
      setProfile(userData);
      setFormData({
        uname: userData.name || '',
        uemail: userData.email || '',
        uphone: userData.phone || ''
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setSnackbar({
        open: true,
        message: "Failed to load profile",
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/updateprofile`,
        formData,
        { headers: { "auth-token": token } }
      );

      setProfile(response.data.user);
      setIsEditing(false);
      setSnackbar({
        open: true,
        message: "Profile updated successfully",
        severity: 'success'
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbar({
        open: true,
        message: "Failed to update profile",
        severity: 'error'
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      uname: profile.name || '',
      uemail: profile.email || '',
      uphone: profile.phone || ''
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: '#4caf50' }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      p: 3,
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Avatar sx={{ bgcolor: "white", color: "#4CAF50", width: 56, height: 56 }}>
          <PersonIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            My Profile
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Manage your personal information
          </Typography>
        </Box>
      </Paper>

      {/* Profile Card */}
      <Card sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'rgba(0,0,0,0.05)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.02)',
      }}>
        <CardContent sx={{ p: 4 }}>
          {/* Profile Header with Avatar */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            mb: 3,
            flexWrap: 'wrap'
          }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: alpha('#4caf50', 0.1),
                color: '#4caf50',
                fontSize: '3rem',
                fontWeight: 600,
                border: '3px solid #4caf50'
              }}
            >
              {profile?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight={700} color="#333">
                {profile?.name}
              </Typography>
              <Typography variant="body2" color="#666" sx={{ mt: 0.5 }}>
                Member since {new Date(profile?.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>
            {!isEditing && (
              <Tooltip title="Edit Profile">
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{
                    borderColor: '#4caf50',
                    color: '#4caf50',
                    '&:hover': {
                      borderColor: '#45a049',
                      bgcolor: alpha('#4caf50', 0.02),
                    },
                    textTransform: 'none',
                    borderRadius: 2,
                  }}
                >
                  Edit Profile
                </Button>
              </Tooltip>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Profile Fields */}
          <Grid container spacing={3}>
            {/* Name Field */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <PersonIcon sx={{ color: '#4caf50', mt: 1 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="textSecondary" gutterBottom>
                    Full Name
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      name="uname"
                      value={formData.uname}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          '&:hover': { bgcolor: '#fff' },
                          '&.Mui-focused': {
                            bgcolor: '#fff',
                            boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4caf50',
                            borderWidth: 2,
                          },
                        },
                      }}
                    />
                  ) : (
                    <Typography variant="body1" fontWeight={500}>
                      {profile?.name}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Email Field */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <EmailIcon sx={{ color: '#4caf50', mt: 1 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="textSecondary" gutterBottom>
                    Email Address
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      name="uemail"
                      value={formData.uemail}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      size="small"
                      type="email"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          '&:hover': { bgcolor: '#fff' },
                          '&.Mui-focused': {
                            bgcolor: '#fff',
                            boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4caf50',
                            borderWidth: 2,
                          },
                        },
                      }}
                    />
                  ) : (
                    <Typography variant="body1" fontWeight={500}>
                      {profile?.email}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Phone Field */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <PhoneIcon sx={{ color: '#4caf50', mt: 1 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="textSecondary" gutterBottom>
                    Phone Number
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      name="uphone"
                      value={formData.uphone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          '&:hover': { bgcolor: '#fff' },
                          '&.Mui-focused': {
                            bgcolor: '#fff',
                            boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4caf50',
                            borderWidth: 2,
                          },
                        },
                      }}
                    />
                  ) : (
                    <Typography variant="body1" fontWeight={500}>
                      {profile?.phone || 'Not provided'}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Action Buttons for Edit Mode */}
            {isEditing && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    startIcon={<CloseIcon />}
                    sx={{
                      borderColor: '#ccc',
                      color: '#666',
                      '&:hover': {
                        borderColor: '#999',
                        bgcolor: alpha('#999', 0.02),
                      },
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 3,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleUpdate}
                    startIcon={<SaveIcon />}
                    sx={{
                      bgcolor: '#4caf50',
                      '&:hover': { bgcolor: '#45a049' },
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 3,
                      boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: alpha('#4caf50', 0.03),
          border: '1px solid',
          borderColor: alpha('#4caf50', 0.1),
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ShoppingBagIcon sx={{ color: '#4caf50' }} />
          <Typography variant="body2" sx={{ color: '#666' }}>
            View your order history and track deliveries
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={() => navigate('/orders')}
          sx={{
            borderColor: '#4caf50',
            color: '#4caf50',
            '&:hover': {
              borderColor: '#45a049',
              bgcolor: alpha('#4caf50', 0.02),
            },
            textTransform: 'none',
            borderRadius: 2,
          }}
        >
          My Orders
        </Button>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}