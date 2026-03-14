import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Button,
  Avatar,
  Stack,
  alpha,
  IconButton,
  TableCell,
  Tooltip,
  Card,
  CardContent,
  Badge,
  styled
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import { useNavigate } from "react-router-dom";
import CustomSnackbar from '../../../CustomSnackbar';
import useSnackbar from '../../../useSnackbar';

// Styled components for better table design
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  backgroundColor: alpha('#4caf50', 0.05),
  borderBottom: `2px solid ${alpha('#4caf50', 0.2)}`,
}));

export default function ViewOrders() {
  const navigate = useNavigate();
  const admintoken = localStorage.getItem("admintoken");
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/order/orders`, {
        headers: { "admin-token": admintoken }
      });
      
      setOrders(res.data.orders || []);
      const activeOrder = res.data.orders.filter(order => order.status !== "Cancelled");
      setActiveOrders(activeOrder);
    } catch (err) {
      console.log(err);
      showSnackbar("Error fetching orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Delivered": return <CheckCircleIcon fontSize="small" />;
      case "Cancelled": return <CancelIcon fontSize="small" />;
      case "Out for Delivery": return <LocalShippingIcon fontSize="small" />;
      default: return <AccessTimeIcon fontSize="small" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Delivered": return "success";
      case "Cancelled": return "error";
      case "Out for Delivery": return "info";
      case "Shipped": return "primary";
      case "Confirmed": return "secondary";
      default: return "warning";
    }
  };

  // Helper function for payment status color
  const getPaymentStatusColor = (paymentStatus) => {
    return paymentStatus === 'paid' ? 'success' : 'warning';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          border: '1px solid',
          borderColor: 'rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
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
              Order Management
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
              Total {orders.length} {orders.length === 1 ? 'order' : 'orders'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            icon={<ReceiptLongIcon />}
            label={`${orders.filter(o => o.status === 'Delivered').length} Delivered`}
            sx={{ bgcolor: alpha('#4caf50', 0.1), color: '#4caf50', fontWeight: 600 }}
          />
          <Chip
            icon={<PaymentIcon />}
            label={`${orders.filter(o => o.paymentStatus === 'paid').length} Paid`}
            sx={{ bgcolor: alpha('#2196f3', 0.1), color: '#2196f3', fontWeight: 600 }}
          />
        </Box>
      </Paper>

      {/* Orders List */}
      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <Typography>Loading orders...</Typography>
            </Paper>
          </Grid>
        ) : orders.length === 0 ? (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 6,
                borderRadius: 3,
                textAlign: 'center',
                bgcolor: '#f8f9fa',
                border: '2px dashed #e0e0e0',
              }}
            >
              <ShoppingBagIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No orders found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                There are no customer orders to display
              </Typography>
            </Paper>
          </Grid>
        ) : (
          orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: alpha('#4caf50', 0.1),
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Order Header */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    flexWrap: 'wrap', 
                    gap: 2,
                    mb: 2 
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: alpha('#4caf50', 0.1), color: '#4caf50' }}>
                        <ReceiptLongIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: '#666' }}>
                          Order ID
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                          #{order._id.slice(-8)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {order.status !== "Cancelled" && (
                        <Chip
                          icon={<PaymentIcon fontSize="small" />}
                          label={order.paymentStatus || 'pending'}
                          size="small"
                          color={getPaymentStatusColor(order.paymentStatus)}
                          sx={{ 
                            fontWeight: 600, 
                            px: 1,
                            textTransform: 'capitalize'
                          }}
                        />
                      )}
                      <Chip
                        icon={getStatusIcon(order.status)}
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                        sx={{ fontWeight: 600, px: 1 }}
                      />
                      <Tooltip title="View Order Details">
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => navigate(`/admin/manageorder/${order._id}`)}
                          startIcon={<VisibilityIcon />}
                          sx={{
                            bgcolor: '#4caf50',
                            '&:hover': { bgcolor: '#43a047' },
                            textTransform: 'none',
                            borderRadius: 2,
                            boxShadow: 'none',
                          }}
                        >
                          Manage
                        </Button>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2, borderColor: alpha('#4caf50', 0.1) }} />

                  {/* Order Details Grid */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon sx={{ fontSize: 18, color: '#999' }} />
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Order Date
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(order.createdAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ fontSize: 18, color: '#999' }} />
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Customer
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {order.userId?.name || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {order.userId?.email || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ShoppingBagIcon sx={{ fontSize: 18, color: '#999' }} />
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Items
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PaymentIcon sx={{ fontSize: 18, color: '#999' }} />
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            Total Amount
                          </Typography>
                          <Typography variant="h6" fontWeight={700} sx={{ color: '#4caf50' }}>
                            ₹{order.grandTotal?.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Product Preview */}
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: alpha('#4caf50', 0.02), 
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: alpha('#4caf50', 0.05),
                  }}>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1.5 }}>
                      Products in this order:
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {order.items?.slice(0, 5).map((item, index) => (
                        <Tooltip key={index} title={item.productId?.product_name || 'Product'}>
                          <Badge
                            badgeContent={item.qty}
                            color="success"
                            sx={{
                              '& .MuiBadge-badge': {
                                right: -3,
                                top: 3,
                                fontSize: '0.6rem',
                                minWidth: 16,
                                height: 16,
                              }
                            }}
                          >
                            <Avatar
                              variant="rounded"
                              src={
                                item.product_image.startsWith("http")
                                  ? item.product_image
                                  : `${import.meta.env.VITE_API_URL}/api/image/${item.product_image}`}
                              sx={{
                                width: 50,
                                height: 50,
                                border: '2px solid #fff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'scale(1.1)' }
                              }}
                            />
                          </Badge>
                        </Tooltip>
                      ))}
                      
                      {order.items?.length > 5 && (
                        <Tooltip title={`${order.items.length - 5} more items`}>
                          <Avatar
                            variant="rounded"
                            sx={{
                              width: 50,
                              height: 50,
                              bgcolor: alpha('#4caf50', 0.1),
                              color: '#4caf50',
                              fontWeight: 600,
                              fontSize: '0.9rem',
                              border: '2px dashed #4caf50',
                            }}
                          >
                            +{order.items.length - 5}
                          </Avatar>
                        </Tooltip>
                      )}
                    </Stack>
                  </Box>

                  {/* Order Summary */}
                  <Box sx={{ 
                    mt: 2, 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 2,
                    flexWrap: 'wrap',
                  }}>
                    <Typography variant="caption" color="textSecondary">
                      Payment Method: {order.paymentMethod || 'COD'}
                    </Typography>
                    <Chip
                      label={`Delivery: ₹${order.deliveryCharge || 0}`}
                      size="small"
                      sx={{ bgcolor: alpha('#ff9800', 0.1), color: '#ff9800' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Summary Footer */}
      {orders.length > 0 && (
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
          <Typography variant="body2" sx={{ color: '#666' }}>
            <strong style={{ color: '#4caf50' }}>📊 Summary:</strong> Total Orders: {orders.length} | 
            Delivered: {orders.filter(o => o.status === 'Delivered').length} | 
            Pending: {orders.filter(o => o.status === 'Placed').length} | 
            Cancelled: {orders.filter(o => o.status === 'Cancelled').length} |
            <span style={{ color: '#2196f3' }}> Paid: {orders.filter(o => o.paymentStatus === 'paid').length}</span> |
            <span style={{ color: '#ff9800' }}> Unpaid: {activeOrders.filter(o => o.paymentStatus !== 'paid').length}</span>
          </Typography>
          <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
            Total Revenue: ₹{activeOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0).toLocaleString()}
          </Typography>
        </Paper>
      )}

      {/* Snackbar */}
      <CustomSnackbar
        snackbar={snackbar}
        onClose={hideSnackbar}
      />
    </Box>
  );
}