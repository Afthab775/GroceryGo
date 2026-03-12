import React, { useState, useEffect, useRef } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link, useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import logo from '../../../assets/logo.png';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import CartDrawer from './CartDrawer';
import { useCart } from '../../../context/CartContext';
import { Popper } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ConfirmationDialog from '../../../ConfirmationDialog';
import CustomSnackbar from '../../../CustomSnackbar';
import useSnackbar from '../../../useSnackbar';

// Styled Search Components
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '25px',
  backgroundColor: 'white',
  marginLeft: theme.spacing(2),
  width: '450px',
  maxWidth: '50vw',
  display: 'flex',
  alignItems: 'center',
  height: '42px',
  boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
  paddingLeft: theme.spacing(1),
  '&:focus-within': {
    boxShadow: '0 0 0 2px #1976d2',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#333',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    width: '100%',
  },
}));

// Search Suggestions Component
const SearchSuggestions = ({ suggestions, query, anchorEl, onClose, visible }) => {
  const navigate = useNavigate();

  if (!visible || suggestions.length === 0) return null;

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    onClose();
  };

  const handleViewAll = () => {
    navigate(`/search?q=${query}`);
    onClose();
  };

  return (
    <Popper
      open={visible && suggestions.length > 0}
      anchorEl={anchorEl}
      placement='bottom-start'
      style={{ zIndex: 1500 }}
    >
      <Paper
        className='search-suggestions'
        sx={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          width: anchorEl?.offsetWidth || 450,
          mt: 1,
          borderRadius: 3,
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          zIndex: '999999 !important',
          maxHeight: 400,
          overflow: 'auto',
          backgroundColor: 'white',
        }}
        style={{ zIndex: 999999 }}
      >
        <List>
          {suggestions.slice(0, 5).map((product) => (
            <ListItem key={product._id} disablePadding>
              <ListItemButton
                onClick={() => handleProductClick(product._id)}
                sx={{
                  '&:hover': { bgcolor: '#f5f5f5' },
                  transition: '0.2s',
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={`${import.meta.env.VITE_API_URL}/api/image/${product.product_image}`}
                    sx={{ width: 45, height: 45, borderRadius: 2 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography fontWeight={600}>
                      {product.product_name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="textSecondary">
                      {product.product_unit} • ₹{product.product_price}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}

          {suggestions.length > 5 && (
            <>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton onClick={handleViewAll}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#4CAF50' }}>
                      <SearchIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`View all ${suggestions.length} results for "${query}"`}
                    primaryTypographyProps={{ fontWeight: 600, color: '#4CAF50' }}
                  />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Paper>
    </Popper>
  );
};

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null
  });
  
  const searchRef = useRef(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("usertoken");
  const { cartItems } = useCart();
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const cartCount = Object.values(cartItems.map).reduce(
    (total, qty) => total + qty, 0
  );

  // Handle search input
  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/product/search?q=${query}`
      );
      setSuggestions(res.data.products || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // Handle Enter key
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setShowSuggestions(false);
      setSearchQuery('');
    }
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !event.target.closest(".search-suggestions")
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePage = (path) => navigate(path);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

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
          localStorage.removeItem("usertoken");
          showSnackbar("Logged out successfully!", "success");
          setTimeout(() => {
            navigate('/');
          }, 1500);
        }
      });
    } else if (setting === "Login") {
      navigate("/login");
    } else if (setting === "My Profile") {
      navigate("/profile");
    }
  };

  const isLoggedIn = !!localStorage.getItem("usertoken");
  const settings = isLoggedIn ? ["My Profile", "Logout"] : ["Login"];

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(90deg, #FFD600 0%, #FFEA00 100%)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                transition: '0.2s',
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              <img src={logo} alt="logo" style={{ height: '80px', width: '100px', objectFit: 'contain' }} />
              <Typography variant="h6" noWrap component="div" sx={{ mt: 1.5, fontWeight: 600, color: "#4caf50", fontFamily: "Montserrat, sans-serif" }}>
                Grocery
              </Typography>
              <Typography variant="h6" noWrap component="div" sx={{ ml: 0.5, mt: 1.5, fontWeight: 600, color: "#4670beff", fontFamily: "Montserrat, sans-serif" }}>
                Go
              </Typography>
            </Box>

            {/* Search Box with Suggestions */}
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', zIndex: 99999, }} ref={searchRef}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon sx={{ color: "#333" }} />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search for groceries..."
                  value={searchQuery}
                  onChange={(e) => {
                    handleSearch(e.target.value);
                    setAnchorEl(searchRef.current);
                  }}
                  onKeyDown={handleSearchSubmit}
                  onFocus={() => {
                    setAnchorEl(searchRef.current);
                    searchQuery.length >= 2 && setShowSuggestions(true);
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Search>

              <SearchSuggestions
                suggestions={suggestions}
                query={searchQuery}
                visible={showSuggestions}
                anchorEl={anchorEl}
                onClose={() => setShowSuggestions(false)}
              />
            </Box>

            {/* Account and Cart */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open Cart">
                {token && (
                  <IconButton onClick={() => setCartOpen(true)} sx={{ mr: 2, color: 'white' }}>
                    <Badge
                      badgeContent={cartCount}
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: "#0d47a1",
                          color: "white"
                        }
                      }}
                      showZero
                      max={99}
                    >
                      <ShoppingCartIcon sx={{ fontSize: 30 }} />
                    </Badge>
                  </IconButton>
                )}
              </Tooltip>

              <Tooltip title="Account">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, color: 'white' }}>
                  <AccountCircleIcon sx={{ fontSize: 32 }} />
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: '45px' }}
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={() => handleSettings(setting)}>
                    {setting}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      </AppBar>

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
    </>
  );
}