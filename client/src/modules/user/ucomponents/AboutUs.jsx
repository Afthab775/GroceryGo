import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Card,
  CardContent,
  Divider,
  Stack,
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SecurityIcon from '@mui/icons-material/Security';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { useNavigate } from 'react-router-dom';

export default function AboutUs() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
      title: 'Fast Delivery',
      description: 'Get your groceries delivered in 10 minutes from nearby stores.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Quality Assured',
      description: 'We ensure fresh and high-quality products for our customers.',
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
      title: '24/7 Support',
      description: 'Our customer support team is always here to help you.',
    },
    {
      icon: <EmojiEmotionsIcon sx={{ fontSize: 40 }} />,
      title: 'Happy Customers',
      description: 'Thousands of satisfied customers trust us for their daily needs.',
    },
  ];

  const team = [
    {
      name: 'John Doe',
      role: 'Founder & CEO',
      image: 'https://via.placeholder.com/150',
    },
    {
      name: 'Jane Smith',
      role: 'Head of Operations',
      image: 'https://via.placeholder.com/150',
    },
    {
      name: 'Mike Johnson',
      role: 'Technical Director',
      image: 'https://via.placeholder.com/150',
    },
    {
      name: 'Sarah Williams',
      role: 'Customer Experience',
      image: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" fontWeight={700} gutterBottom>
          About Us
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: '800px', mx: 'auto' }}>
          Your trusted partner for fresh groceries and everyday essentials
        </Typography>
      </Paper>

      {/* Our Story */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight={600} sx={{ color: '#333', mb: 2 }}>
            Our Story
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8, mb: 2 }}>
            Founded in 2023, GroceryGo started with a simple mission: to make grocery shopping 
            fast, convenient, and reliable for everyone. What began as a small local delivery 
            service has now grown into a trusted platform serving thousands of happy customers.
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8 }}>
            We believe that getting your daily essentials shouldn't be a hassle. That's why 
            we've built a network of dark stores across the city to ensure delivery in just 
            10 minutes. Our team works tirelessly to bring you the freshest products at the 
            best prices.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Grocery store"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 4,
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            }}
          />
        </Grid>
      </Grid>

      {/* Features */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight={600} sx={{ color: '#333', mb: 4, textAlign: 'center' }}>
          Why Choose Us
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    borderColor: '#4CAF50',
                  },
                }}
              >
                <Box sx={{ color: '#4CAF50', mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Team */}
      <Box>
        <Typography variant="h4" fontWeight={600} sx={{ color: '#333', mb: 4, textAlign: 'center' }}>
          Our Team
        </Typography>
        <Grid container spacing={3}>
          {team.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ borderRadius: 3, textAlign: 'center', p: 2 }}>
                <Avatar
                  src={member.image}
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {member.role}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}