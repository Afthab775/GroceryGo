import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Container,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import logo from '../../../assets/logo.png';
import CustomSnackbar from '../../../CustomSnackbar';
import useSnackbar from '../../../useSnackbar';

export default function Login() {
  const [admin, setAdmin] = useState({
    aemail: '',
    apassword: ''
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const nav = useNavigate();
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const handlechange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
    console.log({ ...admin, [e.target.name]: e.target.value });
  };

  const handlelogin = () => {
    setLoading(true);
    console.log("Sending login data:", admin);
    
    axios.post(`${import.meta.env.VITE_API_URL}/api/admin/login`, admin)
      .then((res) => {
        console.log("Admin Details", res.data);
        if (res.data.success) {
          localStorage.setItem("admintoken", res.data.Token);
          showSnackbar("Login successful! Redirecting...", "success");
          setTimeout(() => {
            nav('/admin/dashboard', { replace: true });
          }, 1500);
        } else {
          showSnackbar(res.data.message || "Login failed", "error");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        showSnackbar(error.response?.data?.message || "Server error. Please try again.", "error");
        setLoading(false);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlelogin();
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          bgcolor: '#f5f5f5',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            borderRadius: 3,
            bgcolor: '#ffffff',
          }}
        >
          {/* Logo and Brand */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <img 
              src={logo} 
              alt="GroceryGo" 
              style={{ 
                width: '100px', 
                height: '100px', 
                objectFit: 'contain',
                marginBottom: '16px'
              }} 
            />
            
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              <span style={{ color: '#4CAF50' }}>Grocery</span>
              <span style={{ color: '#4670be' }}>Go</span>
            </Typography>
            
            <Typography variant="body2" sx={{ color: '#666' }}>
              Admin Panel Access
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center', color: '#333' }}>
            Admin Login
          </Typography>

          {/* Email Field */}
          <form autoComplete="off" onSubmit={(e) => { e.preventDefault(); handlelogin(); }}>
            <input
              type="text"
              name="fakeusernameremembered"
              autoComplete="username"
              style={{ display: "none" }}
            />
            <input
              type="password"
              name="fakepasswordremembered"
              autoComplete="new-password"
              style={{ display: "none" }}
            />
            <TextField
              fullWidth
              label="Email"
              name="aemail"
              type="email"
              value={admin.aemail}
              onChange={handlechange}
              onKeyDown={handleKeyPress}
              margin="normal"
              autoComplete="new-email"
              inputProps={{
                autoComplete: 'new-email',
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: '#ffffff',
                  '&:hover': {
                    bgcolor: '#fafafa',
                  },
                  '&.Mui-focused': {
                    bgcolor: '#ffffff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4caf50',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#4caf50',
                },
              }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              name="apassword"
              type={show ? 'text' : 'password'}
              value={admin.apassword}
              onChange={handlechange}
              onKeyDown={handleKeyPress}
              margin="normal"
              autoComplete="off"
              inputProps={{
                autoComplete: "new-password",
                form: {
                  autoComplete: "off",
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShow(!show)}
                      edge="end"
                      sx={{
                        color: '#666',
                        '&:hover': { color: '#4caf50' },
                      }}
                    >
                      {show ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: '#ffffff',
                  '& input::-ms-reveal': { display: 'none' },
                  '& input::-ms-clear': { display: 'none' },
                  '& input::-webkit-credentials-auto-fill-button': { visibility: 'hidden', display: 'none' },
                  '&:hover': {
                    bgcolor: '#fafafa',
                  },
                  '&.Mui-focused': {
                    bgcolor: '#ffffff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4caf50',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#4caf50',
                },
              }}
            />
          </form>

          {/* Login Button */}
          <Button
            type='submit'
            fullWidth
            variant="contained"
            onClick={handlelogin}
            disabled={loading}
            sx={{
              py: 1.5,
              bgcolor: '#4caf50',
              '&:hover': {
                bgcolor: '#45a049',
              },
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
              mb: 2,
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          {/* Forgot Password Link */}
          <Typography variant="body2" align="center" sx={{ color: '#666' }}>
            <Link
              to="#"
              style={{
                color: '#4caf50',
                textDecoration: 'none',
                fontWeight: 500,
              }}
              onClick={(e) => {
                e.preventDefault();
                showSnackbar("Please contact your system administrator", "info");
              }}
            >
              Forgot password?
            </Link>
          </Typography>

          {/* Footer Note */}
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 3, color: '#999' }}>
            Secure admin access only
          </Typography>
        </Paper>
      </Box>

      {/* Snackbar for notifications */}
      <CustomSnackbar
        snackbar={snackbar}
        onClose={hideSnackbar}
      />
    </Container>
  );
}