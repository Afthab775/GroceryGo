import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Divider,
  Button,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import CustomSnackbar from "../../../CustomSnackbar";
import useSnackbar from "../../../useSnackbar";

export default function Checkout() {
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const { cartItems, fetchCart } = useCart();

  const token = localStorage.getItem("usertoken");
  const navigate = useNavigate();

  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  useEffect(() => {
    fetchCart();
    fetchAddress();
  }, []);

  const fetchAddress = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/address/get`,
        { headers: { "auth-token": token } }
      );

      const list = res.data.addresses || [];
      const def = list.find((a) => a.isDefault);
      setDefaultAddress(def || null);
    } catch (error) {
      console.log(error);
      showSnackbar("Error fetching address", "error");
    }
  };

  const handlePlaceOrder = async () => {
    try {
      if (!selectedPayment) {
        showSnackbar("Please select a payment method", "warning");
        return;
      }

      if (!defaultAddress) {
        showSnackbar("Please add a delivery address", "warning");
        return;
      }

      const orderData = {
        address: defaultAddress,
        paymentMethod: selectedPayment,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/order/create`,
        orderData,
        {
          headers: { "auth-token": token },
        }
      );

      if (res.data.success) {
        await fetchCart();
        const order = res.data.order;
        showSnackbar("Order placed successfully!", "success");
        setTimeout(() => {
          navigate("/order-success", { state: { orderId: order._id, fromOrder: true } });
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      showSnackbar(error.response?.data?.message || "Failed to place order", "error");
    }
  };

  const itemsTotal = cartItems.list.reduce(
    (sum, i) => sum + i.productId.product_price * i.qty,
    0
  );
  
  console.log(cartItems);
  
  const freeDel = 149;
  const deliveryCharge = itemsTotal >= freeDel ? 0 : 29;
  const handlingCharge = 2;
  const grandTotal = itemsTotal + deliveryCharge + handlingCharge;

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", p: 3 }}>
      <Typography variant="h6" fontWeight={700} mb={3}>
        Checkout
      </Typography>

      {/* ADDRESS - FULL WIDTH */}
      <Card sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Typography fontWeight={700} mb={1}>
          Delivering to
        </Typography>

        {defaultAddress ? (
          <>
            <Typography fontWeight={600}>
              {defaultAddress.type}
            </Typography>
            <Typography fontSize={13} color="gray">
              {defaultAddress.building}, {defaultAddress.landmark}
            </Typography>
          </>
        ) : (
          <Typography fontSize={13} color="gray">
            No default address selected. Please add an address.
          </Typography>
        )}
      </Card>

      {/* 2 COLUMN LAYOUT */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 3,
        }}
      >
        {/* LEFT SIDE - PAYMENT */}
        <Card sx={{ borderRadius: 3, p: 2 }}>
          <Typography fontWeight={700} mb={2}>
            Select Payment Method
          </Typography>

          {/* CASH ON DELIVERY */}
          <PaymentOption
            title="Cash on Delivery"
            value="cod"
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
            expanded={expanded}
            setExpanded={setExpanded}
          >
            ✔ Please keep exact change ready for faster delivery.
          </PaymentOption>

          {/* UPI */}
          <PaymentOption
            title="UPI"
            value="upi"
            disabled
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
            expanded={expanded}
            setExpanded={setExpanded}
          >
            Pay using any UPI app like Google Pay, PhonePe, Paytm.
          </PaymentOption>

          {/* NETBANKING */}
          <PaymentOption
            title="Net Banking"
            value="netbanking"
            disabled
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
            expanded={expanded}
            setExpanded={setExpanded}
          >
            Pay securely using your bank account.
          </PaymentOption>

          {/* CREDIT / DEBIT CARD - DISABLED */}
          <PaymentOption
            title="Credit / Debit Card"
            value="card"
            disabled
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
            expanded={expanded}
            setExpanded={setExpanded}
          >
            Add Credit / Debit Card
          </PaymentOption>
        </Card>

        {/* RIGHT SIDE - MY CART */}
        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Typography fontWeight={700} mb={2}>
            My Cart
          </Typography>

          {cartItems.list.map((item) => (
            <Box
              key={item.productId._id}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                gap: 2,
                borderBottom: "1px solid #eee",
                pb: 2,
              }}
            >
              <Typography fontSize={13} mt={0.5}>
                {item.qty}
              </Typography>

              {/* Product Image */}
              <img
                src={
                  item.productId.product_image.startsWith("http")
                    ? item.productId.product_image
                    : `${import.meta.env.VITE_API_URL}/api/image/${item.productId.product_image}`}
                alt=""
                style={{
                  width: 60,
                  height: 60,
                  objectFit: "contain",
                }}
              />

              {/* Product Info */}
              <Box sx={{ flex: 1 }}>
                <Typography fontSize={14} fontWeight={600}>
                  {item.productId.product_name}
                </Typography>

                <Typography fontSize={12} color="gray">
                  {item.productId.product_unit}
                </Typography>
              </Box>

              {/* Price */}
              <Typography fontWeight={600}>
                ₹{item.productId.product_price * item.qty}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Row label="Items total" value={`₹${itemsTotal}`} />
          <Row label="Delivery charge" value={deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`} />
          <Row label="Handling charge" value="₹2" />

          <Divider sx={{ my: 1 }} />

          <Row
            label={<strong>Grand total</strong>}
            value={<strong>₹{grandTotal}</strong>}
          />

          <Button
            fullWidth
            disabled={!selectedPayment}
            onClick={handlePlaceOrder}
            sx={{
              mt: 3,
              bgcolor: selectedPayment ? "#1b5e20" : "#9e9e9e",
              color: "#fff",
              py: 1.3,
              borderRadius: 2,
              fontWeight: 700,
              "&:hover": { bgcolor: selectedPayment ? "#145a32" : "#9e9e9e" },
            }}
          >
            PLACE ORDER
          </Button>
        </Card>
      </Box>

      {/* Snackbar */}
      <CustomSnackbar
        snackbar={snackbar}
        onClose={hideSnackbar}
      />
    </Box>
  );
}

const Row = ({ label, value }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
    <Typography fontSize={14}>{label}</Typography>
    <Typography fontSize={14}>{value}</Typography>
  </Box>
);

const PaymentOption = ({
  title,
  value,
  selectedPayment,
  setSelectedPayment,
  expanded,
  setExpanded,
  disabled = false,
  children,
}) => {
  const isExpanded = expanded === value;

  return (
    <Box
      onClick={() => {
        if (disabled) return;
        const newValue = isExpanded ? null : value;
        setSelectedPayment(newValue);
        setExpanded(newValue);
      }}
      sx={{
        border: selectedPayment === value ? "2px solid #1b5e20" : "1px solid #eee",
        borderRadius: 2,
        p: 2,
        mb: 1,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "0.2s",
        bgcolor: disabled ? "#f5f5f5" : "#fff",
      }}
    >
      <Typography fontWeight={600}>
        {title}
      </Typography>

      {disabled && (
        <Typography fontSize={12} color="gray" mt={1}>
          This payment method is not available at the moment
        </Typography>
      )}

      {!disabled && isExpanded && (
        <Typography fontSize={13} color="gray" mt={1}>
          {children}
        </Typography>
      )}
    </Box>
  );
};