import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Card,
  Button,
  Divider,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom"
import CloseIcon from "@mui/icons-material/Close";
import AlarmIcon from "@mui/icons-material/Alarm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import axios from "axios";
import { useCart } from "../../../context/CartContext";

import EmptyCart from "./EmptyCart";
import AddressScreen from "./AddressScreen";

export default function CartDrawer({ open, onClose }) {
  const {cartItems,fetchCart} = useCart();
  const [step, setStep] = useState("cart");
  const [addresses, setAddresses] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [editingQty, setEditingQty] = useState({});

  const navigate = useNavigate();

  const token = localStorage.getItem("usertoken");

  /* ===================== EFFECTS ===================== */

  useEffect(() => {
    if (open && token) {
      fetchCart();
      fetchAddresses();
    }
  }, [open]);

  useEffect(() => {
    if (!open) setStep("cart");
  }, [open]);

  useEffect(() => {
    if (!cartItems?.list) return;
    const initial = {};
    cartItems.list.forEach(item => {
      initial[item.productId._id] = item.qty.toString();
    });
    setEditingQty(initial);
  }, [cartItems]);

  const hasOutOfStockItem = cartItems?.list?.some(
    (item) => item.productId.product_quantity === 0
  );

  /* ===================== API CALLS ===================== */

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/address/get`,
        { headers: { "auth-token": token } }
      );

      const list = res.data.addresses || [];
      setAddresses(list);

      const def = list.find((a) => a.isDefault);
      setDefaultAddress(def || null);
    } catch (error) {
      console.log(error);
    }
  };

  const updateQty = async (productId, newQty) => {
    try {
      if (newQty <= 0) {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/cart/remove/${productId}`,
          { headers: { "auth-token": token } }
        );
      } else {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/cart/update`,
          { productId, qty: newQty },
          { headers: { "auth-token": token } }
        );
      }
      fetchCart();
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cart/remove/${productId}`,
        { headers: { "auth-token": token } }
      );
      fetchCart();
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  /* ===================== CALCULATIONS ===================== */

  const itemsTotal = cartItems.list?.reduce(
    (sum, i) => sum + i.productId.product_price * i.qty,
    0
  ) || 0;

  const freeDel = 149;
  const deliveryCharge = itemsTotal >= freeDel ? 0 : 29;
  const handlingCharge = 2;
  const grandTotal = itemsTotal + deliveryCharge + handlingCharge;

  /* ===================== RENDER ===================== */

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 420,
          bgcolor: "#fff",
          display: "flex",
          flexDirection: "column",
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      {/* HEADER */}
      {step === "cart" ? (
        <Box sx={{ 
          p: 2, 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #f0f0f0",
          bgcolor: "#fff",
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ShoppingBagIcon sx={{ color: "#1b5e20" }} />
            <Typography fontWeight={700} fontSize={18}>My Cart</Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ bgcolor: "#f5f5f5", "&:hover": { bgcolor: "#e0e0e0" } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ 
          p: 2, 
          display: "flex", 
          alignItems: "center", 
          gap: 1,
          borderBottom: "1px solid #f0f0f0",
          bgcolor: "#fff",
        }}>
          <IconButton 
            onClick={() => setStep("cart")}
            sx={{ bgcolor: "#f5f5f5", "&:hover": { bgcolor: "#e0e0e0" } }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography fontWeight={700} fontSize={16}>
            Select delivery address
          </Typography>
        </Box>
      )}

      {step === "cart" ? (
        !cartItems.list || cartItems.list.length === 0 ? (
          <EmptyCart onClose={onClose} />
        ) : (
          <>
            <Box sx={{ 
              flex: 1,
              overflowY: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              bgcolor: "#f8f9fa",
            }}>
              {/* DELIVERY INFO */}
              <Box sx={{
                m: 2,
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                bgcolor: "#e8f5e9",
                borderRadius: 3,
                border: "1px solid #c8e6c9",
              }}>
                <AlarmIcon sx={{ color: "#2e7d32", fontSize: 28 }} />
                <Box>
                  <Typography fontWeight={700} fontSize={14} color="#1b5e20">
                    Delivery in 10 minutes
                  </Typography>
                  <Typography fontSize={13} color="#2e7d32">
                    Delivery of {cartItems.list.length} {cartItems.list.length === 1 ? 'item' : 'items'}
                  </Typography>
                </Box>
              </Box>

              {/* PRODUCTS - SINGLE CARD */}
              <Card sx={{ 
                mx: 2, 
                mb: 2, 
                borderRadius: 3,
                border: "1px solid #f0f0f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                bgcolor: "#fff",
                overflow: "hidden",
              }}>
                {cartItems.list.map((item, index) => (
                  <React.Fragment key={item.productId._id}>
                    <Box sx={{ p: 2, position: "relative" }}>
                      <IconButton
                        size="small"
                        onClick={() => removeItem(item.productId._id)}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: "#d32f2f",
                          bgcolor: "#ffebee",
                          "&:hover": { bgcolor: "#ffcdd2" },
                          zIndex: 1,
                        }}
                      >
                        <DeleteOutlineOutlinedIcon fontSize="small" />
                      </IconButton>
                      
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ 
                          width: 80, 
                          height: 80, 
                          bgcolor: "#f8f9fa",
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                          <img
                            src={
                              item.productId.product_image.startsWith("http")
                                ? item.productId.product_image
                                : `${import.meta.env.VITE_API_URL}/api/image/${item.productId.product_image}`}
                            alt={item.productId.product_name}
                            style={{
                              width: 70,
                              height: 70,
                              objectFit: "contain",
                            }}
                          />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                          <Typography fontSize={15} fontWeight={600} lineHeight={1.3}>
                            {item.productId.product_name}
                          </Typography>
                          
                          <Typography fontSize={13} color="#666" sx={{ mt: 0.5 }}>
                            {item.productId.product_unit}
                          </Typography>
                          
                          <Typography fontSize={16} fontWeight={700} color="#1b5e20" sx={{ mt: 0.5 }}>
                            ₹{item.productId.product_price}
                          </Typography>
                          
                          {item.productId.product_quantity === 0 && (
                            <Typography color="#d32f2f" fontSize={12} fontWeight={600} sx={{ mt: 0.5 }}>
                              Out of Stock!
                            </Typography>
                          )}
                          {item.productId.product_quantity > 0 && 
                           item.qty >= item.productId.product_quantity && (
                            <Typography fontSize={12} color="#ed6c02" fontWeight={600} sx={{ mt: 0.5 }}>
                              Only {item.productId.product_quantity} left!
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "flex-end",
                        mt: 1.5,
                      }}>
                        <Box sx={{ 
                          display: "flex", 
                          alignItems: "center",
                          bgcolor: "#f5f5f5",
                          borderRadius: 2,
                          border: "1px solid #e0e0e0",
                        }}>
                          <Button
                            size="small"
                            onClick={() => updateQty(item.productId._id, item.qty - 1)}
                            sx={{ 
                              minWidth: 32, 
                              height: 36,
                              color: "#1b5e20",
                              fontWeight: 700,
                              fontSize: 18,
                            }}
                          >
                            −
                          </Button>
                          <TextField
                            type="text"
                            value={editingQty[item.productId._id] || ""}
                            inputProps={{
                              inputMode: "numeric",
                              pattern: "[0-9]*",
                              style: { 
                                textAlign: "center", 
                                padding: "4px 0",
                                fontSize: "14px",
                                fontWeight: 600,
                                width: "40px",
                              }
                            }}
                            sx={{
                              width: 40,
                              "& .MuiInputBase-root": {
                                height: 36,
                                borderRadius: 0,
                                backgroundColor: "#fff",
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                border: "none",
                              },
                            }}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || /^[0-9]+$/.test(value)) {
                                setEditingQty(prev => ({
                                  ...prev,
                                  [item.productId._id]: value
                                }));
                              }
                            }}
                            onBlur={() => {
                              let value = Number(editingQty[item.productId._id]);
                              if (!value || value <= 0) {
                                value = 1;
                              }
                              if (value > item.productId.product_quantity) {
                                value = item.productId.product_quantity;
                              }
                              updateQty(item.productId._id, value);
                            }}
                          />
                          <Button
                            size="small"
                            disabled={item.qty >= item.productId.product_quantity}
                            onClick={() => updateQty(item.productId._id, item.qty + 1)}
                            sx={{ 
                              minWidth: 32, 
                              height: 36,
                              color: "#1b5e20",
                              fontWeight: 700,
                              fontSize: 18,
                              "&.Mui-disabled": {
                                color: "#ccc",
                              },
                            }}
                          >
                            +
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                    {index < cartItems.list.length - 1 && (
                      <Divider sx={{ mx: 2 }} />
                    )}
                  </React.Fragment>
                ))}
              </Card>

              {/* BILL DETAILS */}
              <Box sx={{ mx: 2, mb: 2 }}>
                <Card sx={{ p: 2, borderRadius: 3, bgcolor: "#fff" }}>
                  <Typography fontWeight={700} fontSize={16} sx={{ mb: 1.5 }}>
                    Bill Details
                  </Typography>

                  <Row label="Items total" value={`₹${itemsTotal}`} />
                  <Box sx={{ mb: 1 }}>
                    <Row
                      label="Delivery charge"
                      value={
                        <Typography
                          fontSize={14}
                          fontWeight={600}
                          color={deliveryCharge === 0 ? "success.main" : "inherit"}
                        >
                          {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                        </Typography>
                      }
                    />
                    {deliveryCharge !== 0 && (
                      <Typography fontSize={12} color="#666" sx={{ mt: 0.5, ml: 1 }}>
                        Add ₹{freeDel - itemsTotal} more for FREE delivery
                      </Typography>
                    )}
                  </Box>
                  <Row label="Handling charge" value="₹2" />

                  <Divider sx={{ my: 1.5 }} />

                  <Row
                    label={<Typography fontWeight={700}>Grand total</Typography>}
                    value={<Typography fontWeight={700} color="#1b5e20">₹{grandTotal}</Typography>}
                  />
                </Card>
              </Box>
            </Box>

            {/* BOTTOM BAR */}
            <Box sx={{ 
              borderTop: "1px solid #f0f0f0",
              bgcolor: "#fff",
              boxShadow: "0 -4px 10px rgba(0,0,0,0.05)",
            }}>
              {addresses.length > 0 && defaultAddress ? (
                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: "#f8f9fa",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOnIcon sx={{ color: "#1b5e20", fontSize: 20 }} />
                    <Box>
                      <Typography fontWeight={600} fontSize={13} color="#1b5e20">
                        Delivering to {defaultAddress.type}
                      </Typography>
                      <Typography fontSize={12} color="#666">
                        {defaultAddress.building}, {defaultAddress.landmark}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    onClick={() => setStep("address")}
                    sx={{
                      color: "#1b5e20",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: 13,
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Change
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: "#f8f9fa",
                    borderBottom: "1px solid #f0f0f0",
                    cursor: "pointer",
                  }}
                  onClick={() => setStep("address")}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOnIcon sx={{ color: "#666", fontSize: 20 }} />
                    <Typography fontSize={13} color="#666">
                      No delivery address selected
                    </Typography>
                  </Box>
                  <Typography sx={{ color: "#1b5e20", fontWeight: 600, fontSize: 13 }}>
                    Add
                  </Typography>
                </Box>
              )}

              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  disabled={hasOutOfStockItem}
                  onClick={() => {
                    if(!defaultAddress){
                      setStep("address");
                    } else {
                      onClose();
                      navigate("/checkout", { state: { fromCart: true } });
                    }
                  }}
                  sx={{
                    bgcolor: hasOutOfStockItem ? "#ccc" : "#1b5e20",
                    color: "#fff",
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: 15,
                    textTransform: "none",
                    boxShadow: "0 4px 10px rgba(27,94,32,0.2)",
                    "&:hover": { 
                      bgcolor: hasOutOfStockItem ? "#ccc" : "#145a32",
                    },
                  }}
                >
                  {hasOutOfStockItem ? "Remove out of stock items" : `PROCEED • ₹${grandTotal}`}
                </Button>
              </Box>
            </Box>
          </>
        )
      ) : (
        <AddressScreen refreshAddresses={fetchAddresses} />
      )}
    </Drawer>
  );
}

/* ================= ROW COMPONENT ================= */

const Row = ({ label, value }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.8 }}>
    <Typography fontSize={14} color="#666">{label}</Typography>
    <Typography fontSize={14} fontWeight={500}>{value}</Typography>
  </Box>
);