import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Avatar,
  Stack,
  alpha,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ConfirmationDialog from "../../../ConfirmationDialog";
import CustomSnackbar from "../../../CustomSnackbar";
import useSnackbar from "../../../useSnackbar";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
    orderId: null
  });
  
  const navigate = useNavigate();
  const token = localStorage.getItem("usertoken");
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  useEffect(() => {
    if(!token) {
      showSnackbar("Please login to view your orders", "warning");
      setTimeout(() => {
        navigate('/');
      }, 1500);
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/order/my`,
        { headers: { "auth-token": token } });
      setOrders(res.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
      showSnackbar("Error fetching orders", "error");
    }
  };

  const cancelOrder = async (orderId) => {
    setConfirmDialog({
      open: true,
      title: "Cancel Order",
      message: "Are you sure you want to cancel this order?",
      orderId: orderId,
      onConfirm: async () => {
        try {
          await axios.put(`${import.meta.env.VITE_API_URL}/api/order/cancel/${orderId}`, {}, {
            headers: { "auth-token": token }
          });
          showSnackbar("Order cancelled successfully", "success");
          fetchOrders();
        } catch (error) {
          console.log(error.response?.data || error.message);
          showSnackbar(error.response?.data?.message || "Failed to cancel order", "error");
        }
      }
    });
  };

  const handleConfirmClose = () => {
    setConfirmDialog({ ...confirmDialog, open: false });
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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar sx={{ bgcolor: "white", color: "#4CAF50", width: 56, height: 56 }}>
          <ShoppingBagIcon fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            My Orders
          </Typography>
        </Box>
      </Paper>

      {orders.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 4,
            textAlign: "center",
            bgcolor: "#f8f9fa",
            border: "2px dashed #e0e0e0",
          }}
        >
          <ShoppingBagIcon sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No orders yet
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Looks like you haven't placed any orders yet
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              bgcolor: "#4CAF50",
              "&:hover": { bgcolor: "#45a049" },
              borderRadius: 3,
              px: 4,
              py: 1,
            }}
          >
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {orders.map((order) => (
            <Card
              key={order._id}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                },
              }}
            >
              {/* Order Header */}
              <Box sx={{
                p: 2,
                bgcolor: alpha("#4CAF50", 0.05),
                borderBottom: "1px solid",
                borderColor: alpha("#4CAF50", 0.1),
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ReceiptLongIcon sx={{ color: "#4CAF50", fontSize: 20 }} />
                  <Typography fontWeight="600" color="textSecondary" variant="body2">
                    ORDER
                  </Typography>
                  <Typography fontWeight="700" variant="body2" sx={{ color: "#4CAF50" }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </Typography>
                </Box>

                <Chip
                  icon={getStatusIcon(order.status)}
                  label={order.status}
                  color={getStatusColor(order.status)}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 1,
                  }}
                />
              </Box>

              <CardContent sx={{ p: 3 }}>
                {/* Order Details Grid with Images Next to Items */}
                <Box sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" },
                  gap: 2,
                  mb: 2,
                }}>
                  {/* Date */}
                  <Box>
                    <Typography variant="caption" color="textSecondary" sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 16 }} />
                      Order Date
                    </Typography>
                    <Typography fontWeight="500" variant="body2">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </Box>

                  {/* Total Amount */}
                  <Box>
                    <Typography variant="caption" color="textSecondary" sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                      <ShoppingBagIcon sx={{ fontSize: 16 }} />
                      Total Amount
                    </Typography>
                    <Typography fontWeight="700" variant="h6" sx={{ color: "#4CAF50" }}>
                      ₹{order.grandTotal?.toLocaleString()}
                    </Typography>
                  </Box>

                  {/* Items Count with Images */}
                  <Box sx={{ gridColumn: { sm: "span 2" } }}>
                    <Typography variant="caption" color="textSecondary" sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                      <ReceiptLongIcon sx={{ fontSize: 16 }} />
                      Items
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <Typography fontWeight="500" variant="body2">
                        {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                      </Typography>

                      {/* Product Images - (Overlapping) */}
                      {order.items && order.items.length > 0 && (
                        <Box sx={{ display: "flex", alignItems: "center", position: "relative", height: 40 }}>
                          {/* Show up to 3 images with negative margin for overlap effect */}
                          {order.items.slice(0, 3).map((item, index) => (
                            <Box
                              key={index}
                              sx={{
                                width: 35,
                                height: 35,
                                borderRadius: 1.5,
                                overflow: "hidden",
                                border: "2px solid #fff",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                bgcolor: "#f5f5f5",
                                position: "relative",
                                marginLeft: index === 0 ? 0 : -1.2,
                                zIndex: 3 - index,
                                transition: "transform 0.2s ease, margin 0.2s ease",
                                "&:hover": {
                                  transform: "scale(1.1) translateY(-2px)",
                                  zIndex: 10,
                                },
                              }}
                            >
                              <img
                                src={`${import.meta.env.VITE_API_URL}/api/image/${item.product_image}`}
                                alt={item.productId?.product_name || "Product"}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                onError={(e) => {
                                  e.target.src = "https://via.placeholder.com/35x35?text=No+Image";
                                }}
                              />
                            </Box>
                          ))}

                          {/* If more than 3 items, show +X more badge */}
                          {order.items.length > 3 && (
                            <Box
                              sx={{
                                width: 35,
                                height: 35,
                                borderRadius: 1.5,
                                bgcolor: alpha("#4CAF50", 0.1),
                                border: "2px solid #4CAF50",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                color: "#4CAF50",
                                marginLeft: -1.2,
                                zIndex: 0,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              }}
                            >
                              +{order.items.length - 3}
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* Order Timeline (if delivered or cancelled) */}
                {(order.status === "Delivered" || order.status === "Cancelled") && (
                  <Box sx={{
                    mt: 2,
                    mb: 2,
                    p: 1.5,
                    bgcolor: alpha(order.status === "Delivered" ? "#4CAF50" : "#f44336", 0.05),
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}>
                    {order.status === "Delivered" ? (
                      <CheckCircleIcon sx={{ color: "#4CAF50", fontSize: 20 }} />
                    ) : (
                      <CancelIcon sx={{ color: "#f44336", fontSize: 20 }} />
                    )}
                    <Typography variant="body2" color="textSecondary">
                      {order.status === "Delivered"
                        ? "Your order has been delivered successfully"
                        : "This order has been cancelled"}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Action Button */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                  {order.status === "Placed" && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => cancelOrder(order._id)}
                      startIcon={<HighlightOffIcon />}
                      sx={{
                        borderRadius: 3,
                        px: 3,
                        py: 1,
                        textTransform: "none",
                        fontWeight: 600,
                        borderColor: "#f44336",
                        color: "#f44336",
                        "&:hover": {
                          borderColor: "#d32f2f",
                          bgcolor: alpha("#f44336", 0.05),
                        },
                      }}>
                      Cancel
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/orders/${order._id}`)}
                    sx={{
                      bgcolor: "#4CAF50",
                      "&:hover": { bgcolor: "#45a049" },
                      borderRadius: 3,
                      px: 3,
                      py: 1,
                      textTransform: "none",
                      fontWeight: 600,
                      boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
                    }}
                    startIcon={<ReceiptLongIcon />}
                  >
                    View Order Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

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
    </Container>
  );
}