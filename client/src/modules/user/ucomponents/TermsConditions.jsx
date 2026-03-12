import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import GppGoodIcon from '@mui/icons-material/GppGood';
import InfoIcon from '@mui/icons-material/Info';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentIcon from '@mui/icons-material/Assignment';

export default function TermsConditions() {
  const sections = [
    {
      icon: <InfoIcon />,
      title: 'Introduction',
      content: 'By accessing or using GroceryGo, you agree to be bound by these Terms and Conditions. If you disagree with any part, please do not use our services.',
    },
    {
      icon: <AssignmentIcon />,
      title: 'Account Registration',
      content: 'You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials.',
    },
    {
      icon: <PaymentIcon />,
      title: 'Payment Terms',
      content: 'We currently accept Cash on Delivery (COD) for all orders. Card payments, UPI, and net banking will be available soon. All payments are processed securely.',
    },
    {
      icon: <LocalShippingIcon />,
      title: 'Delivery Policy',
      content: 'We aim to deliver within 10 minutes. However, delivery times may vary based on location, weather conditions, and order volume.',
    },
    {
      icon: <GppGoodIcon />,
      title: 'Returns & Refunds',
      content: 'If you receive damaged or incorrect items, please contact us within 24 hours. Refunds will be processed within 5-7 business days.',
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
        }}
      >
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Terms & Conditions
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Last updated: March 2025
        </Typography>
      </Paper>

      {/* Content */}
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #f0f0f0' }}>
        <Typography variant="body1" sx={{ color: '#666', mb: 4, lineHeight: 1.8 }}>
          Please read these Terms and Conditions carefully before using our services. 
          These terms govern your use of GroceryGo and any related services provided by us.
        </Typography>

        <List>
          {sections.map((section, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemIcon sx={{ color: '#4CAF50', minWidth: '40px' }}>
                  {section.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                      {section.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.7 }}>
                      {section.content}
                    </Typography>
                  }
                />
              </ListItem>
              {index < sections.length - 1 && <Divider sx={{ my: 2 }} />}
            </React.Fragment>
          ))}
        </List>

        <Box sx={{ mt: 4, p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            <strong>Contact Us:</strong> If you have any questions about these Terms, 
            please contact us at support@grocerygo.com or call +1 234 567 8900.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}