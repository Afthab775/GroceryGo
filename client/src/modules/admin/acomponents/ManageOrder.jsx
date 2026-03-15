import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  Avatar,
  MenuItem,
  Select,
  Button,
  Stack,
  alpha,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  styled,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import CustomSnackbar from '../../../CustomSnackbar';
import useSnackbar from '../../../useSnackbar';

// Custom styled components
const StyledStepConnector = styled(StepConnector)(({ theme }) => ({
  [`& .${StepConnector.line}`]: {
    borderColor: alpha('#4caf50', 0.3),
  },
}));

export default function ManageOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const admintoken = localStorage.getItem("admintoken");

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const statusFlow = {
    "Placed": ["Packed"],
    "Packed": ["Out for Delivery"],
    "Out for Delivery": ["Delivered", "Cancelled"]
  };

  const statusSteps = ["Placed", "Packed", "Out for Delivery", "Delivered"];
  const currentStepIndex = statusSteps.indexOf(order?.status || "");

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/order/admin/${id}`, {
      headers: { "admin-token": admintoken }
    })
      .then((res) => {
        setOrder(res.data);
        setStatus(res.data.status);
      })
      .catch((err) => {
        console.log(err);
        showSnackbar("Error loading order details", "error");
      });
  }, [id]);

  const updateStatus = () => {
    if (status === order.status) return;
    
    setLoading(true);
    
    axios.put(`${import.meta.env.VITE_API_URL}/api/order/updatestatus/${id}`,
      { status },
      { headers: { "admin-token": admintoken } }
    )
      .then((res) => {
        showSnackbar("Order status updated successfully", "success");
        setOrder(res.data);
        setStatus(res.data.status);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        showSnackbar(err.response?.data?.message || "Failed to update status", "error");
        setLoading(false);
      });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Placed": return <ReceiptLongIcon />;
      case "Packed": return <InventoryIcon />;
      case "Out for Delivery": return <LocalShippingIcon />;
      case "Delivered": return <CheckCircleIcon />;
      case "Cancelled": return <CancelIcon />;
      default: return <ShoppingBagIcon />;
    }
  };

  if (!order) return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <Typography>Loading order details...</Typography>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Back Button */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          border: '1px solid',
          borderColor: 'rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Tooltip title="Back to Orders">
          <IconButton
            onClick={() => navigate('/admin/vieworders')}
            sx={{
              bgcolor: alpha('#4caf50', 0.1),
              '&:hover': { bgcolor: alpha('#4caf50', 0.2) },
            }}
          >
            <ArrowBackIcon sx={{ color: '#4caf50' }} />
          </IconButton>
        </Tooltip>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha('#4caf50', 0.1),
            display: 'inline-flex'
          }}>
            <ShoppingBagIcon sx={{ color: '#4caf50', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>
              Manage Order
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptLongIcon sx={{ fontSize: 16 }} />
              Order ID: {order._id}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Left Column - Order Status and Timeline */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: alpha('#4caf50', 0.1) }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShippingIcon sx={{ color: '#4caf50' }} />
                Order Status
              </Typography>

              {/* Status Timeline */}
              {order.status !== "Cancelled" ? (
                <Stepper
                  activeStep={currentStepIndex}
                  connector={<StyledStepConnector />}
                  orientation="vertical"
                  sx={{ mb: 3 }}
                >
                  {statusSteps.map((step, index) => (
                    <Step key={step}>
                      <StepLabel
                        StepIconProps={{
                          sx: {
                            color: index <= currentStepIndex ? '#4caf50' : '#ccc',
                            '&.Mui-active': { color: '#4caf50' },
                            '&.Mui-completed': { color: '#4caf50' },
                          }
                        }}
                      >
                        <Typography fontWeight={index <= currentStepIndex ? 600 : 400}>
                          {step}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              ) : (
                <Box sx={{ p: 2, bgcolor: alpha('#f44336', 0.05), borderRadius: 2, mb: 3 }}>
                  <Typography color="error" fontWeight={600} display="flex" alignItems="center" gap={1}>
                    <CancelIcon /> Order Cancelled
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Status Update Section */}
              <Typography fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReceiptLongIcon sx={{ color: '#4caf50' }} />
                Update Status
              </Typography>

              {order.status === "Delivered" ? (
                <Box sx={{ p: 2, bgcolor: alpha('#4caf50', 0.05), borderRadius: 2 }}>
                  <Typography color="success" fontWeight={600} display="flex" alignItems="center" gap={1}>
                    <CheckCircleIcon /> Order has been delivered
                  </Typography>
                </Box>
              ) : order.status === "Cancelled" ? (
                <Box sx={{ p: 2, bgcolor: alpha('#f44336', 0.05), borderRadius: 2 }}>
                  <Typography color="error" fontWeight={600} display="flex" alignItems="center" gap={1}>
                    <CancelIcon /> Order has been cancelled
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    size="small"
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      bgcolor: '#f8f9fa',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4caf50',
                      },
                    }}
                  >
                    <MenuItem value={order.status}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(order.status)}
                        {order.status} (Current)
                      </Box>
                    </MenuItem>
                    {statusFlow[order.status]?.map((s) => (
                      <MenuItem key={s} value={s}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(s)}
                          {s}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>

                  <Button
                    variant="contained"
                    onClick={updateStatus}
                    disabled={status === order.status || loading}
                    startIcon={<SaveIcon />}
                    fullWidth
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                      },
                      '&:disabled': {
                        background: '#ccc',
                      },
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: 2,
                    }}
                  >
                    {loading ? 'Updating...' : 'Update Status'}
                  </Button>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Order Details */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: alpha('#4caf50', 0.1) }}>
            <CardContent sx={{ p: 3 }}>
              {/* Delivery Address */}
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon sx={{ color: '#4caf50' }} />
                Delivery Address
              </Typography>

              <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ fontSize: 18, color: '#999' }} />
                      <Typography variant="body2" fontWeight={500}>
                        {order.address?.type || 'Home'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      {order.address?.building}
                      {order.address?.floor && `, Floor: ${order.address.floor}`}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {order.address?.landmark}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon sx={{ fontSize: 18, color: '#999' }} />
                      <Typography variant="body2">
                        {order.address?.phone}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Ordered Items */}
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShoppingBagIcon sx={{ color: '#4caf50' }} />
                Ordered Items ({order.items?.length || 0})
              </Typography>

              <Stack spacing={2} sx={{ mb: 3 }}>
                {order.items?.map((item, index) => (
                  <Paper
                    key={item.productId || index}
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: '#f8f9fa',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: alpha('#4caf50', 0.1),
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        variant="rounded"
                        src={`${import.meta.env.VITE_API_URL}/api/image/${item.product_image}`}
                        sx={{
                          width: 70,
                          height: 70,
                          border: '2px solid #fff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Box flex={1}>
                        <Typography fontWeight={600} variant="subtitle1">
                          {item.product_name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Unit: {item.product_unit || 'N/A'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                          <Chip
                            label={`Qty: ${item.qty}`}
                            size="small"
                            sx={{ bgcolor: alpha('#4caf50', 0.1), color: '#4caf50' }}
                          />
                          <Typography variant="body2" fontWeight={500}>
                            ₹{item.product_price} each
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="h6" fontWeight={700} sx={{ color: '#4caf50' }}>
                        ₹{item.product_price * item.qty}
                      </Typography>
                    </Stack>
                  </Paper>
                ))}
              </Stack>

              {/* Price Summary */}
              <Paper elevation={0} sx={{ p: 2, bgcolor: alpha('#4caf50', 0.02), borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PaymentIcon sx={{ color: '#4caf50' }} />
                  Payment Summary
                </Typography>

                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="textSecondary">Items Total</Typography>
                    <Typography variant="body2" fontWeight={500}>₹{order.itemsTotal}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="textSecondary">Delivery Charge</Typography>
                    <Typography variant="body2" fontWeight={500}>₹{order.deliveryCharge}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="textSecondary">Handling Charge</Typography>
                    <Typography variant="body2" fontWeight={500}>₹{order.handlingCharge}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight={700}>Grand Total</Typography>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#4caf50' }}>
                      ₹{order.grandTotal}
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ mt: 2, p: 1.5, bgcolor: alpha('#4caf50', 0.05), borderRadius: 1 }}>
                  <Typography variant="caption" color="textSecondary" display="flex" alignItems="center" gap={1}>
                    <PaymentIcon sx={{ fontSize: 16, color: '#4caf50' }} />
                    Payment Method: <strong>{order.paymentMethod || 'Cash on Delivery'}</strong>
                  </Typography>
                </Box>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <CustomSnackbar
        snackbar={snackbar}
        onClose={hideSnackbar}
      />
    </Box>
  );
}