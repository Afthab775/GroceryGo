import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
  InputAdornment,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

export default function FAQs() {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { icon: <LocalShippingIcon />, label: 'Delivery', count: 4 },
    { icon: <PaymentIcon />, label: 'Payment', count: 3 },
    { icon: <AssignmentIcon />, label: 'Orders', count: 5 },
    { icon: <SupportAgentIcon />, label: 'Support', count: 3 },
  ];

  const faqs = [
    {
      category: 'Delivery',
      question: 'How fast is the delivery?',
      answer: 'We deliver within 10 minutes! Our dark stores are strategically located to ensure quick delivery to your doorstep.',
    },
    {
      category: 'Delivery',
      question: 'What is the delivery charge?',
      answer: 'Delivery is free on orders above ₹149. For orders below ₹149, a nominal charge of ₹29 applies.',
    },
    {
      category: 'Delivery',
      question: 'Do you deliver to my area?',
      answer: 'We currently serve most areas in major cities. Enter your pincode on the home page to check availability.',
    },
    {
      category: 'Delivery',
      question: 'Can I schedule delivery for later?',
      answer: 'Currently, we offer on-demand delivery only. You can place your order anytime and we\'ll deliver within 10 minutes.',
    },
    {
      category: 'Payment',
      question: 'What payment methods do you accept?',
      answer: 'We currently accept Cash on Delivery (COD) for all orders. Card payments, UPI, and net banking will be available soon!',
    },
    {
      category: 'Payment',
      question: 'Is cash on delivery available?',
      answer: 'Yes, we offer Cash on Delivery for all orders. Other payment options like cards, UPI, and net banking are coming soon!',
    },
    {
      category: 'Payment',
      question: 'Are there any hidden charges?',
      answer: 'No, we believe in transparent pricing. You only pay for the items plus applicable delivery and handling charges.',
    },
    {
      category: 'Orders',
      question: 'How do I track my order?',
      answer: 'You can track your order in real-time from the "My Orders" section after placing an order.',
    },
    {
      category: 'Orders',
      question: 'Can I modify or cancel my order?',
      answer: 'Orders can be modified or cancelled within 2 minutes of placing. After that, they are processed for delivery.',
    },
    {
      category: 'Orders',
      question: 'What if I receive damaged items?',
      answer: 'Please contact our support within 24 hours with photos of damaged items. We\'ll arrange a replacement or refund.',
    },
    {
      category: 'Orders',
      question: 'How do I return items?',
      answer: 'For quality issues, contact support. We\'ll pick up the items and process your refund within 5-7 business days.',
    },
    {
      category: 'Orders',
      question: 'Can I order for someone else?',
      answer: 'Yes, you can place orders for friends or family. Just ensure the delivery address is correct.',
    },
    {
      category: 'Support',
      question: 'How do I contact customer support?',
      answer: 'You can reach us via email at support@grocerygo.com or call us at +1 234 567 8900, 24/7.',
    },
    {
      category: 'Support',
      question: 'What are your support hours?',
      answer: 'Our customer support is available 24/7 to assist you with any queries or concerns.',
    },
    {
      category: 'Support',
      question: 'How do I report a problem?',
      answer: 'You can report issues through the app, website, or directly contact our support team.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <HelpOutlineIcon sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
          Find answers to common questions about our services
        </Typography>
        
        {/* Search Bar */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search your question..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            maxWidth: '600px',
            mx: 'auto',
            '& .MuiOutlinedInput-root': {
              bgcolor: 'white',
              borderRadius: 3,
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

      {/* Category Chips */}
      <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
        {categories.map((cat, index) => (
          <Chip
            key={index}
            icon={cat.icon}
            label={`${cat.label} (${cat.count})`}
            onClick={() => setSearchTerm(cat.label)}
            sx={{
              bgcolor: '#f5f5f5',
              '&:hover': { bgcolor: '#e8f5e9', color: '#4CAF50' },
              borderRadius: 2,
              px: 1,
            }}
          />
        ))}
      </Box>

      {/* FAQs Grid */}
      <Grid container spacing={3}>
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <Grid item xs={12} key={index}>
              <Accordion
                sx={{
                  borderRadius: '12px !important',
                  mb: 1,
                  border: '1px solid #f0f0f0',
                  '&:before': { display: 'none' },
                  boxShadow: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': { borderColor: '#4CAF50' },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box>
                    <Chip
                      label={faq.category}
                      size="small"
                      sx={{
                        bgcolor: '#e8f5e9',
                        color: '#4CAF50',
                        fontWeight: 500,
                        fontSize: '0.7rem',
                        mb: 1,
                      }}
                    />
                    <Typography fontWeight={600}>{faq.question}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="textSecondary" sx={{ pl: 1 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="body1" color="textSecondary">
                No questions found matching "{searchTerm}"
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Still Need Help */}
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          p: 4,
          borderRadius: 3,
          bgcolor: '#f8f9fa',
          textAlign: 'center',
          border: '1px solid #e0e0e0',
        }}
      >
        <SupportAgentIcon sx={{ fontSize: 50, color: '#4CAF50', mb: 2 }} />
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Still Need Help?
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Can't find what you're looking for? Our support team is here to help.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Chip
            label="support@grocerygo.com"
            onClick={() => window.location = 'mailto:support@grocerygo.com'}
            sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#e8f5e9' } }}
          />
          <Chip
            label="+1 234 567 8900"
            onClick={() => window.location = 'tel:+12345678900'}
            sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#e8f5e9' } }}
          />
        </Box>
      </Paper>
    </Container>
  );
}