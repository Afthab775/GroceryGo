import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  Stack,
  alpha,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
} from "@mui/material";
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useNavigate } from "react-router-dom";

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  backgroundColor: alpha('#4caf50', 0.05),
  borderBottom: `2px solid ${alpha('#4caf50', 0.2)}`,
}));

const StatusChip = styled(Chip)({
  backgroundColor: alpha('#4caf50', 0.1),
  color: '#4caf50',
  fontWeight: 600,
  '& .MuiChip-icon': {
    color: '#4caf50',
  },
});

export default function ViewPayments() {
  const navigate = useNavigate();
  const admintoken = localStorage.getItem("admintoken");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaidOrders();
  }, []);

  const fetchPaidOrders = async () => {
    try {
      // Fetch all orders first
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/order/orders`, {
        headers: { "admin-token": admintoken }
      });
      
      // Filter orders where paymentStatus is "paid"
      const paidOrders = response.data.orders?.filter(order => order.paymentStatus === "paid") || [];
      setPayments(paidOrders);
    } catch (error) {
      console.error("Error fetching paid orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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
            <PaymentIcon sx={{ color: '#4caf50', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>
              Payment Records
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
              Total {payments.length} successful payments
            </Typography>
          </Box>
        </Box>

        <Chip
          icon={<CheckCircleIcon />}
          label="All Payments Received"
          sx={{ bgcolor: alpha('#4caf50', 0.1), color: '#4caf50', fontWeight: 600 }}
        />
      </Paper>

      {/* Payments Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'rgba(0,0,0,0.05)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.02)',
          overflowX: 'auto',
        }}
      >
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>#</StyledTableCell>
              <StyledTableCell>Order ID</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Products</StyledTableCell>
              <StyledTableCell>Mode of Payment</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <Typography>Loading payments...</Typography>
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <PaymentIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    No paid orders found
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    There are no successful payment records to display
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment, index) => (
                <TableRow
                  key={payment._id}
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha('#4caf50', 0.02),
                    },
                  }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>{index + 1}</TableCell>
                  
                  {/* Order ID */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ReceiptLongIcon sx={{ fontSize: 18, color: '#4caf50' }} />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontFamily: 'monospace',
                          cursor: 'pointer',
                          '&:hover': { color: '#4caf50', textDecoration: 'underline' }
                        }}
                        onClick={() => navigate(`/admin/manageorder/${payment._id}`)}
                      >
                        #{payment._id?.slice(-8)}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Date */}
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(payment.createdAt)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(payment.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </TableCell>

                  {/* Products Images */}
                  <TableCell>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      {payment.items?.slice(0, 5).map((item, idx) => (
                        <Tooltip key={idx} title={item.product_name || 'Product'}>
                          <Avatar
                            variant="rounded"
                            src={
                              item.product_image.startsWith("http")
                                ? item.product_image
                                : `${import.meta.env.VITE_API_URL}/api/image/${item.product_image}`}
                            sx={{
                              width: 40,
                              height: 40,
                              border: '2px solid #fff',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              transition: 'transform 0.2s',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                zIndex: 10,
                              },
                            }}
                          />
                        </Tooltip>
                      ))}
                      {payment.items?.length > 5 && (
                        <Tooltip title={`${payment.items.length - 5} more items`}>
                          <Avatar
                            variant="rounded"
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: alpha('#4caf50', 0.1),
                              color: '#4caf50',
                              fontWeight: 600,
                              fontSize: '0.9rem',
                              border: '2px dashed #4caf50',
                            }}
                          >
                            +{payment.items.length - 5}
                          </Avatar>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>

                  {/* Mode of Payment */}
                  <TableCell>
                    <Chip
                      icon={<PaymentIcon />}
                      label={payment.paymentMethod || 'COD'}
                      size="small"
                      sx={{
                        bgcolor: alpha('#4caf50', 0.1),
                        color: '#4caf50',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                      }}
                    />
                  </TableCell>

                  {/* Status - Received with tick mark */}
                  <TableCell align="center">
                    <StatusChip
                      icon={<CheckCircleIcon />}
                      label="Received"
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary Footer */}
      {payments.length > 0 && (
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
            <strong style={{ color: '#4caf50' }}>💰 Summary:</strong> Total Payments: {payments.length} | 
            Total Amount: ₹{payments.reduce((sum, p) => sum + (p.grandTotal || 0), 0).toLocaleString()}
          </Typography>
          <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
            <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
            All payments received successfully
          </Typography>
        </Paper>
      )}
    </Box>
  );
}