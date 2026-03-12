import { Box, Typography, Button, Paper, Container } from "@mui/material";
import { useNavigate,useLocation, useLoaderData } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  const formattedId = orderId? orderId.slice(-8).toUpperCase() : "UNKNOWN";

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        {/* Success Card */}
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 4,
            textAlign: "center",
            background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
            border: "1px solid #f0f0f0",
            width: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Animated Background Elements */}
          <Box
            sx={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(76,175,80,0.1) 0%, rgba(255,255,255,0) 70%)",
              animation: "pulse 3s infinite",
              "@keyframes pulse": {
                "0%": { transform: "scale(1)", opacity: 0.5 },
                "50%": { transform: "scale(1.2)", opacity: 0.8 },
                "100%": { transform: "scale(1)", opacity: 0.5 },
              },
            }}
          />
          
          <Box
            sx={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(76,175,80,0.08) 0%, rgba(255,255,255,0) 70%)",
              animation: "pulse 4s infinite",
            }}
          />

          {/* Success Icon with Animation */}
          <Box
            sx={{
              mb: 3,
              animation: "bounce 1s ease-in-out",
              "@keyframes bounce": {
                "0%": { transform: "scale(0.8)", opacity: 0 },
                "50%": { transform: "scale(1.1)" },
                "100%": { transform: "scale(1)", opacity: 1 },
              },
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                bgcolor: "#4CAF50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                boxShadow: "0 10px 30px rgba(76, 175, 80, 0.3)",
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 60, color: "white" }} />
            </Box>
          </Box>

          {/* Success Message */}
          <Typography 
            variant="h4" 
            fontWeight={800} 
            sx={{ 
              mb: 1,
              background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Order Placed Successfully!
          </Typography>

          <Typography 
            variant="body1" 
            color="textSecondary" 
            sx={{ 
              mb: 4,
              fontSize: "1.1rem",
              maxWidth: "400px",
              mx: "auto",
            }}
          >
            Thank you for your purchase! Your order has been confirmed and will be delivered soon.
          </Typography>

          {/* Order Info Cards */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 4,
              justifyContent: "center",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                flex: 1,
                borderRadius: 3,
                bgcolor: "#f8f9fa",
                border: "1px solid #e0e0e0",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <LocalShippingIcon sx={{ color: "#4CAF50", fontSize: 30 }} />
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="caption" color="textSecondary">
                  Delivery
                </Typography>
                <Typography fontWeight={600}>
                  Within 10 mins
                </Typography>
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                flex: 1,
                borderRadius: 3,
                bgcolor: "#f8f9fa",
                border: "1px solid #e0e0e0",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <ReceiptLongIcon sx={{ color: "#4CAF50", fontSize: 30 }} />
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="caption" color="textSecondary">
                  Order ID
                </Typography>
                <Typography fontWeight={600} fontSize="0.9rem">
                  #ORD{formattedId}
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/")}
              sx={{
                bgcolor: "#4CAF50",
                "&:hover": { bgcolor: "#45a049" },
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 8px 20px rgba(76, 175, 80, 0.3)",
                flex: { sm: 1 },
              }}
              startIcon={<HomeIcon />}
            >
              Continue Shopping
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/orders")}
              sx={{
                borderColor: "#4CAF50",
                color: "#4CAF50",
                "&:hover": {
                  borderColor: "#45a049",
                  bgcolor: "rgba(76, 175, 80, 0.05)",
                },
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                flex: { sm: 1 },
              }}
              startIcon={<ReceiptLongIcon />}
            >
              View My Orders
            </Button>
          </Box>

        </Paper>
      </Box>
    </Container>
  );
}