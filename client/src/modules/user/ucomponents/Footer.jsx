import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import axios from 'axios';
import logo from '../../../assets/logo.png'

export default function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
  ];

  const customerService = [
    { name: 'My Account', path: '/profile' },
    { name: 'My Orders', path: '/orders' },
    { name: 'FAQs', path: '/faqs' },
  ];

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/category/getcategory`)
      .then((res) => {
        // Limit to only 4 categories
        setCategories(res.data.categories.slice(0, 4));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#f8f9fa',
        color: '#333',
        mt: 8,
        pt: 6,
        pb: 3,
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              {/* Logo instead of bag icon */}
              <img 
                src={logo} 
                alt="GroceryGo" 
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  objectFit: 'contain',
                  borderRadius: '8px',
                }} 
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" noWrap component="div" sx={{ 
                  fontWeight: 600, 
                  color: "#4caf50",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: '1.25rem',
                }}>
                  Grocery 
                </Typography>
                <Typography variant="h6" noWrap component="div" sx={{
                  ml: 0.5,
                  fontWeight: 600, 
                  color: "#4670beff",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: '1.25rem',
                }}>
                  Go
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: '#666', mb: 2, lineHeight: 1.7 }}>
              Your one-stop destination for fresh groceries and everyday essentials. 
              We deliver quality products right to your doorstep.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton 
                sx={{ 
                  color: '#666', 
                  bgcolor: 'rgba(0,0,0,0.04)',
                  '&:hover': { bgcolor: '#4CAF50', color: '#fff' }
                }}
                size="small"
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: '#666', 
                  bgcolor: 'rgba(0,0,0,0.04)',
                  '&:hover': { bgcolor: '#4CAF50', color: '#fff' }
                }}
                size="small"
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: '#666', 
                  bgcolor: 'rgba(0,0,0,0.04)',
                  '&:hover': { bgcolor: '#4CAF50', color: '#fff' }
                }}
                size="small"
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: '#666', 
                  bgcolor: 'rgba(0,0,0,0.04)',
                  '&:hover': { bgcolor: '#4CAF50', color: '#fff' }
                }}
                size="small"
              >
                <YouTubeIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: '#333' }}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  onClick={() => navigate(link.path)}
                  sx={{
                    color: '#666',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#4CAF50' },
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Categories */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: '#333' }}>
              Categories
            </Typography>
            <Stack spacing={1}>
              {categories.map((category) => (
                <Link
                  key={category._id}
                  onClick={() => navigate(`/category/${category._id}`)}
                  sx={{
                    color: '#666',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#4CAF50' },
                  }}
                >
                  {category.category_name}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: '#333' }}>
              Customer Service
            </Typography>
            <Stack spacing={1}>
              {customerService.map((service) => (
                <Link
                  key={service.name}
                  onClick={() => navigate(service.path)}
                  sx={{
                    color: '#666',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#4CAF50' },
                  }}
                >
                  {service.name}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12}>
            <Divider sx={{ borderColor: '#e0e0e0', my: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    123 Grocery Street, Food City, FC 12345
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    +1 234 567 8900
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    support@grocerygo.com
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Divider sx={{ borderColor: '#e0e0e0', my: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            © {currentYear} GroceryGo. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link
              onClick={() => navigate('/privacy')}
              sx={{
                color: '#666',
                textDecoration: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                '&:hover': { color: '#4CAF50' },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              onClick={() => navigate('/terms')}
              sx={{
                color: '#666',
                textDecoration: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                '&:hover': { color: '#4CAF50' },
              }}
            >
              Terms of Use
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}