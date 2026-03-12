import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import CookieIcon from '@mui/icons-material/Cookie';
import EmailIcon from '@mui/icons-material/Email';
import PaymentIcon from '@mui/icons-material/Payment';

export default function PrivacyPolicy() {
  const policies = [
    {
      icon: <SecurityIcon />,
      title: 'Information We Collect',
      details: [
        'Personal information (name, email, phone number)',
        'Delivery address and location data',
        'Payment information (processed securely)',
        'Order history and preferences',
        'Device and browser information',
      ],
    },
    {
      icon: <LockIcon />,
      title: 'How We Use Your Information',
      details: [
        'To process and deliver your orders',
        'To improve our services and user experience',
        'To send order updates and promotional offers',
        'To prevent fraud and ensure security',
        'To comply with legal obligations',
      ],
    },
    {
      icon: <CookieIcon />,
      title: 'Cookies & Tracking',
      details: [
        'We use cookies to enhance your browsing experience',
        'Analytics cookies help us improve our website',
        'You can disable cookies in your browser settings',
        'Third-party services may use their own cookies',
      ],
    },
    {
      icon: <PaymentIcon />,
      title: 'Payment Security',
      details: [
        'All payments are encrypted and secure',
        'We don\'t store your full payment details',
        'PCI-DSS compliant payment processing',
        'Multiple secure payment options available',
      ],
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
          Privacy Policy
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Your privacy is important to us
        </Typography>
      </Paper>

      {/* Introduction */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3, border: '1px solid #f0f0f0' }}>
        <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8 }}>
          At GroceryGo, we are committed to protecting your privacy and ensuring the security 
          of your personal information. This Privacy Policy explains how we collect, use, 
          and safeguard your data when you use our services.
        </Typography>
      </Paper>

      {/* Policy Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {policies.map((policy, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid #f0f0f0',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: '#4CAF50',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ color: '#4CAF50' }}>{policy.icon}</Box>
                <Typography variant="h6" fontWeight={600}>
                  {policy.title}
                </Typography>
              </Box>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {policy.details.map((detail, idx) => (
                  <Typography
                    key={idx}
                    component="li"
                    variant="body2"
                    sx={{ color: '#666', mb: 1 }}
                  >
                    {detail}
                  </Typography>
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* FAQ Accordion */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #f0f0f0' }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmailIcon sx={{ color: '#4CAF50' }} />
          Frequently Asked Questions
        </Typography>

        <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={500}>How do you protect my personal data?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="textSecondary">
              We use industry-standard encryption and security measures to protect your data. 
              All sensitive information is stored securely and access is restricted.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={500}>Do you share my information with third parties?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="textSecondary">
              We only share necessary information with delivery partners and payment processors 
              to fulfill your orders. We never sell your personal data.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={500}>How can I delete my account?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="textSecondary">
              You can request account deletion by contacting our support team. We'll process 
              your request within 7 business days.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Container>
  );
}