import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Container,
  Paper,
  Chip,
  IconButton,
  Avatar,
  Grid,
  Stack,
  Button,
  alpha,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentIcon from '@mui/icons-material/Payment';
import InventoryIcon from '@mui/icons-material/Inventory';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const token = localStorage.getItem("usertoken")

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/order/${id}`,
        { headers: { "auth-token": token } });
    setOrder(res.data);
    } catch (error) {
        console.log(error.response?.data || error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Placed":
        return "warning";
      case "Confirmed":
        return "info";
      case "Shipped":
        return "primary";
      case "Delivered":
        return "success";
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Placed":
        return <AccessTimeIcon fontSize="small" />;
      case "Confirmed":
        return <CheckCircleIcon fontSize="small" />;
      case "Shipped":
        return <LocalShippingIcon fontSize="small" />;
      case "Delivered":
        return <CheckCircleIcon fontSize="small" />;
      case "Cancelled":
        return <CancelIcon fontSize="small" />;
      default:
        return <ReceiptLongIcon fontSize="small" />;
    }
  };

  if (!order) return (
    <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
      <Typography>Loading order details...</Typography>
    </Container>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header with Back Button */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 3,
          background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <IconButton 
          onClick={() => navigate("/orders")}
          sx={{ 
            color: "white",
            bgcolor: "rgba(255,255,255,0.2)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ bgcolor: "white", color: "#4CAF50", width: 40, height: 40 }}>
            <ReceiptLongIcon fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Order Details
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              #{order._id?.slice(-8).toUpperCase()}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Main Order Card */}
      <Card sx={{ 
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}>
        {/* Status Header */}
        <Box sx={{ 
          p: 2.5, 
          bgcolor: alpha(getStatusColor(order.status) === "warning" ? "#ff9800" :
                          getStatusColor(order.status) === "info" ? "#2196f3" :
                          getStatusColor(order.status) === "primary" ? "#4CAF50" :
                          getStatusColor(order.status) === "success" ? "#4CAF50" :
                          getStatusColor(order.status) === "error" ? "#f44336" : "#9e9e9e", 0.05),
          borderBottom: "1px solid",
          borderColor: alpha("#000", 0.05),
        }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <InventoryIcon sx={{ color: "#666", fontSize: 20 }} />
              <Typography variant="body2" color="textSecondary">Order Status</Typography>
            </Box>
            <Chip
              icon={getStatusIcon(order.status)}
              label={order.status}
              color={getStatusColor(order.status)}
              sx={{ 
                fontWeight: 600,
                borderRadius: 2,
                px: 1,
              }}
            />
          </Box>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Order Summary */}
          <Paper elevation={0} sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: 2, mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <ShoppingBagIcon fontSize="small" sx={{ color: "#4CAF50" }} />
              Order Summary
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="textSecondary">Order Date</Typography>
                <Typography variant="body2" fontWeight={500}>
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="textSecondary">Items</Typography>
                <Typography variant="body2" fontWeight={500}>
                  {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                </Typography>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="textSecondary">Payment</Typography>
                <Typography variant="body2" fontWeight={500} sx={{textTransform:"uppercase"}}>
                  {order.paymentMethod}
                </Typography>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="textSecondary">Total Amount</Typography>
                <Typography variant="h6" fontWeight={700} sx={{ color: "#4CAF50" }}>
                  ₹{order.grandTotal?.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Order Items */}
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <InventoryIcon fontSize="small" sx={{ color: "#4CAF50" }} />
            Ordered Items ({order.items?.length || 0})
          </Typography>

          <Stack spacing={2} sx={{ mb: 3 }}>
            {order.items.map((item, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "#f0f0f0",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#4CAF50",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }
                }}
              >
                <Box sx={{ display: "flex", gap: 2 }}>
                  {/* Product Image */}
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: 2,
                      overflow: "hidden",
                      bgcolor: "#f5f5f5",
                      border: "1px solid #eee",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={
                        item.product_image.startsWith("http")
                          ? item.product_image
                          : `${import.meta.env.VITE_API_URL}/api/image/${item.product_image}`}
                      alt={item.product_name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/70x70?text=No+Image";
                      }}
                    />
                  </Box>

                  {/* Product Details */}
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={600} variant="body1" sx={{ mb: 0.5 }}>
                      {item.product_name}
                    </Typography>
                    
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                      <Typography variant="body2" color="textSecondary">
                        {item.productId?.product_unit}
                      </Typography>
                      
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Chip
                          label={`Qty: ${item.qty}`}
                          size="small"
                          sx={{ 
                            bgcolor: alpha("#4CAF50", 0.1),
                            color: "#4CAF50",
                            fontWeight: 500,
                            fontSize: "0.75rem",
                          }}
                        />
                        
                        <Typography variant="body2" fontWeight={500}>
                          ₹{item.product_price} each
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" fontWeight={600} sx={{ mt: 1, color: "#4CAF50" }}>
                      Subtotal: ₹{(item.product_price * item.qty).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Stack>

          {/* Bill Details */}
          <Paper elevation={0} sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <ReceiptLongIcon fontSize="small" sx={{ color: "#4CAF50" }} />
              Bill Details
            </Typography>

            <Stack spacing={1.5}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="textSecondary">Items Total</Typography>
                <Typography variant="body2" fontWeight={500}>₹{order.itemsTotal?.toLocaleString()}</Typography>
              </Box>
              
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="textSecondary">Delivery Charge</Typography>
                <Typography variant="body2" fontWeight={500}>
                  {order.deliveryCharge === 0 ? "FREE" : `₹${order.deliveryCharge}`}
                </Typography>
              </Box>
              
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="textSecondary">Handling Charge</Typography>
                <Typography variant="body2" fontWeight={500}>₹{order.handlingCharge}</Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle2" fontWeight={600}>Grand Total</Typography>
                <Typography variant="h6" fontWeight={700} sx={{ color: "#4CAF50" }}>
                  ₹{order.grandTotal?.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ 
                mt: 2, 
                p: 1.5, 
                bgcolor: alpha("#4CAF50", 0.05),
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}>
                <PaymentIcon fontSize="small" sx={{ color: "#4CAF50" }} />
                <Typography variant="body2" color="textSecondary">
                  Payment Method: <strong style={{textTransform:"uppercase"}}>{order.paymentMethod}</strong>
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/orders")}
              sx={{
                borderColor: "#4CAF50",
                color: "#4CAF50",
                "&:hover": {
                  borderColor: "#45a049",
                  bgcolor: alpha("#4CAF50", 0.05),
                },
                borderRadius: 2,
                px: 3,
                py: 1,
              }}
              startIcon={<ArrowBackIcon />}
            >
              Back to Orders
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}