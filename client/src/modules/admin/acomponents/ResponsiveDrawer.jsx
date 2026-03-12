import React from 'react'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import LocalGroceryStoreRoundedIcon from '@mui/icons-material/LocalGroceryStoreRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import AssuredWorkloadRoundedIcon from '@mui/icons-material/AssuredWorkloadRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png'
import { IconButton, Tooltip, Menu, MenuItem, alpha, Badge, Paper } from '@mui/material';
import ConfirmationDialog from '../../../ConfirmationDialog';
import CustomSnackbar from '../../../CustomSnackbar';
import useSnackbar from '../../../useSnackbar';

const drawerWidth = 280;

export default function ResponsiveDrawer({children}) {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [confirmDialog, setConfirmDialog] = React.useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null
  });
  
  const nav = useNavigate();
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleConfirmClose = () => {
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  const handleSettings = (setting) => {
    handleCloseUserMenu();
    if (setting === "Logout") {
      setConfirmDialog({
        open: true,
        title: "Confirm Logout",
        message: "Are you sure you want to log out?",
        onConfirm: () => {
          localStorage.removeItem("admintoken");
          showSnackbar("Logged out successfully!", "success");
          setTimeout(() => {
            nav("/admin/login");
          }, 1500);
        }
      });
    } else if (setting === "Login") {
      nav("/admin/login");
    }
  };

  const isLoggedIn = !!localStorage.getItem("admintoken");
  const settings = isLoggedIn ? ["Logout"] : ["Login"];

  // Menu items configuration for easier maintenance
  const menuItems = [
    { text: 'Dashboard', icon: <SpaceDashboardRoundedIcon />, path: '/admin/dashboard' },
    { text: 'Manage Users', icon: <PeopleAltRoundedIcon />, path: '/admin/manageusers' },
    { text: 'Manage Categories', icon: <CategoryRoundedIcon />, path: '/admin/viewcategories' },
    { text: 'Manage Products', icon: <LocalGroceryStoreRoundedIcon />, path: '/admin/viewproducts' },
    { text: 'Manage Orders', icon: <ShoppingBagRoundedIcon />, path: '/admin/vieworders' },
    { text: 'View Payments', icon: <AssuredWorkloadRoundedIcon />, path: '/admin/viewpayments' },
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* App Bar - Enhanced Design */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          backdropFilter: "blur(12px)",
          borderBottom: '1px solid',
          borderColor: 'rgba(0,0,0,0.05)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        }}
      >
        <Toolbar sx={{ minHeight: 80, px: { xs: 2, sm: 3 } }}>
          {/* Logo and Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="img"
              src={logo}
              alt='Grocery Store'
              sx={{
                height: '60px',
                width: '70px',
                objectFit: 'contain',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Typography 
                variant="h5" 
                noWrap 
                component="div" 
                sx={{ 
                  fontWeight: 700, 
                  color: "#4caf50",
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: '-0.5px',
                }}
              >
                Grocery
              </Typography>
              <Typography 
                variant="h5" 
                noWrap 
                component="div" 
                sx={{
                  ml: 0.5,
                  fontWeight: 700,
                  color: "#4670be",
                  fontFamily: "Montserrat, sans-serif",
                  letterSpacing: '-0.5px',
                }}
              >
                Go
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          
          {/* Admin Badge and Settings */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Paper
              elevation={0}
              sx={{
                px: 2,
                py: 0.5,
                bgcolor: alpha('#4caf50', 0.1),
                borderRadius: 3,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                Admin Panel
              </Typography>
            </Paper>

            <Tooltip title="Account settings">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{
                  bgcolor: alpha('#4670be', 0.1),
                  p: 1.5,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: alpha('#4670be', 0.2),
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <SettingsRoundedIcon sx={{ color: '#4670be' }} />
              </IconButton>
            </Tooltip>

            <Menu
              sx={{
                mt: 5,
                '& .MuiPaper-root': {
                  borderRadius: 3,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  minWidth: 150,
                },
              }}
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleSettings(setting)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    gap: 1.5,
                    color: setting === 'Logout' ? '#d32f2f' : 'inherit',
                    '&:hover': {
                      bgcolor: setting === 'Logout' ? alpha('#d32f2f', 0.05) : alpha('#4caf50', 0.05),
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                    {setting === 'Logout' ? <LogoutRoundedIcon fontSize="small" /> : <LoginRoundedIcon fontSize="small" />}
                  </ListItemIcon>
                  <Typography textAlign="center" fontWeight={500}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer - Enhanced Design */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: "#ffffff",
            borderRight: '1px solid',
            borderColor: 'rgba(0,0,0,0.05)',
            boxShadow: '4px 0 20px rgba(0,0,0,0.02)',
            top: 0,
          },
        }}
      >
        <Toolbar sx={{ minHeight: 80 }} />
        <Box sx={{ overflow: 'auto', py: 2 }}>
          <List sx={{ px: 1.5 }}>
            {menuItems.map((item, index) => (
              <React.Fragment key={item.text}>
                <ListItem
                  disablePadding
                  component={Link}
                  to={item.path}
                  sx={{
                    color: "inherit",
                    textDecoration: "none",
                    mb: 0.5,
                    '&:hover': { textDecoration: "none" },
                  }}
                >
                  <ListItemButton
                    sx={{
                      borderRadius: 2,
                      py: 1.2,
                      px: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        background: alpha('#4caf50', 0.08),
                        transform: 'translateX(5px)',
                      },
                      // Active state (you can enhance this with useLocation)
                      '&.active': {
                        background: alpha('#4caf50', 0.12),
                        borderLeft: '3px solid #4caf50',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: '#4670be',
                        minWidth: 40,
                        '& .MuiSvgIcon-root': {
                          fontSize: 24,
                        },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: '0.95rem',
                      }}
                    />
                    {/* Optional: Add badge for notifications */}
                    {item.text === 'View Payments' && (
                      <Badge
                        variant="dot"
                        color="success"
                        sx={{
                          '& .MuiBadge-badge': {
                            right: 4,
                            top: 4,
                          },
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
                {index < menuItems.length - 1 && (
                  <Divider sx={{ my: 1, borderColor: 'rgba(0,0,0,0.03)' }} />
                )}
              </React.Fragment>
            ))}
          </List>

          {/* Footer in Sidebar */}
          <Box sx={{ position: 'absolute', bottom: 20, left: 0, right: 0, px: 3 }}>
            <Divider sx={{ mb: 2, borderColor: 'rgba(0,0,0,0.05)' }} />
            <Typography
              variant="caption"
              sx={{
                color: '#999',
                display: 'block',
                textAlign: 'center',
                fontSize: '0.75rem',
              }}
            >
              © {new Date().getFullYear()} GroceryGo
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#ccc',
                display: 'block',
                textAlign: 'center',
                fontSize: '0.7rem',
              }}
            >
              v1.0.0
            </Typography>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
        }}
      >
        <Toolbar sx={{ minHeight: 80 }} />
        {/* Your page content will be rendered here via router */}
        {children}
      </Box>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialog.open}
        onClose={handleConfirmClose}
        onConfirm={() => {
          if (confirmDialog.onConfirm) {
            confirmDialog.onConfirm();
          }
          handleConfirmClose();
        }}
        title={confirmDialog.title}
        message={confirmDialog.message}
      />

      {/* Snackbar */}
      <CustomSnackbar
        snackbar={snackbar}
        onClose={hideSnackbar}
      />
    </Box>
  )
}