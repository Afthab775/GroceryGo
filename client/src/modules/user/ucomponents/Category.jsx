import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import CustomSnackbar from "../../../CustomSnackbar";
import useSnackbar from "../../../useSnackbar";

export default function Category() {
  const { cid, subid } = useParams();
  const navigate = useNavigate();

  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const { cartItems, fetchCart } = useCart();
  const cartMap = cartItems.map;
  const [activeSub, setActiveSub] = useState(null);
  const [activeSubName, setActiveSubName] = useState("");

  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  // ADD-TO-CART FUNCTION
  const updateCart = async (productId, type) => {
    const token = localStorage.getItem("usertoken");

    if (!token) {
      showSnackbar("Please login first", "warning");
      return;
    }

    try {
      const currentQty = cartMap[productId] || 0;

      if (currentQty === 0 && type === "inc") {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/add`, { productId },
          { headers: { "auth-token": token } });
      } else {
        const newQty = type === "inc" ? currentQty + 1 : currentQty - 1;
        await axios.put(`${import.meta.env.VITE_API_URL}/api/cart/update`, { productId, qty: newQty },
          { headers: { "auth-token": token } });
      }
      fetchCart();
    } catch (error) {
      console.log(error);
      showSnackbar("Failed to add to cart", "error");
    }
  };

  // Fetch subcategories for this category
  const fetchSubcategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/subcategory/getbycategory/${cid}`);
      const subcats = res.data.subcats || [];
      setSubcategories(subcats);

      if (subcats.length === 0) {
        // no subcategories — clear state and return
        setActiveSub(null);
        setActiveSubName("");
        setProducts([]);
        return;
      }

      // If URL already contains a subcategory id -> select it
      if (subid) {
        const selected = subcats.find((s) => s._id === subid);
        if (selected) {
          setActiveSub(selected._id);
          setActiveSubName(selected.sub_name);
          await fetchProducts(selected._id);
          return;
        }
      }

      // Otherwise -> choose first subcategory and update URL to include it
      const first = subcats[0];
      setActiveSub(first._id);
      setActiveSubName(first.sub_name);
      // update URL so it's canonical: /category/:cid/:subid
      navigate(`/category/${cid}/${first._id}`, { replace: true });
      await fetchProducts(first._id);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      showSnackbar("Error loading categories", "error");
    }
  };

  // Fetch products for a given subcategory id
  const fetchProducts = async (subID) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/product/getbysub/${subID}`);
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      showSnackbar("Error loading products", "error");
    }
  };

  // When category id or subid (URL) changes, re-run
  useEffect(() => {
    if (!cid) return;
    fetchSubcategories();
    fetchCart();
  }, [cid, subid]);

  return (
    <div style={{
      display: "flex",
      padding: "20px",
      gap: "20px",
      maxWidth: "1400px",
      margin: "0 auto",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh"
    }}>
      {/* LEFT — subcategory list */}
      <div
        style={{
          width: "150px",
          height: "80vh",
          overflowY: "auto",
          borderRight: "1px solid #ddd",
          paddingRight: "10px",
          position: "sticky",
          top: "20px",
          scrollbarWidth: "thin",
          scrollbarColor: "#4CAF50 #f0f0f0",
        }}
      >
        {subcategories.map((sub) => (
          <div
            key={sub._id}
            onClick={() => {
              // update URL to selected subcategory and fetch products
              navigate(`/category/${cid}/${sub._id}`);
              setActiveSub(sub._id);
              setActiveSubName(sub.sub_name);
              fetchProducts(sub._id);
            }}
            style={{
              padding: "10px",
              borderRadius: "10px",
              cursor: "pointer",
              background: activeSub === sub._id ? "#d9eba9" : "#fff",
              border: activeSub === sub._id ? "2px solid #4CAF50" : "2px solid transparent",
              marginBottom: "10px",
              transition: "all 0.3s ease",
              textAlign: "center",
              boxShadow: activeSub === sub._id
                ? "0 4px 12px rgba(76, 175, 80, 0.2)"
                : "0 2px 4px rgba(0,0,0,0.02)",
            }}
            onMouseEnter={(e) => {
              if (activeSub !== sub._id) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeSub !== sub._id) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)";
              }
            }}
          >
            <img
              src={`${import.meta.env.VITE_API_URL}/api/image/${sub.sub_image}`}
              alt={sub.sub_name}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "8px",
                objectFit: "cover",
                display: "block",
                margin: "0 auto 8px",
                background: "#f5f5f5",
                padding: "4px",
                border: activeSub === sub._id ? "2px solid #fff" : "2px solid transparent",
                transition: "all 0.3s ease",
              }}
            />
            <p style={{
              margin: 0,
              fontWeight: activeSub === sub._id ? 700 : 600,
              fontSize: "0.9rem",
              color: activeSub === sub._id ? "#30343f" : "#333",
            }}>
              {sub.sub_name}
            </p>
          </div>
        ))}
      </div>

      {/* RIGHT — products */}
      <div style={{ flex: 1 }}>
        {/* Header with breadcrumb style */}
        <div style={{
          marginBottom: "20px",
          padding: "15px 20px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          <h2 style={{
            margin: 0,
            fontSize: "24px",
            fontWeight: 600,
            color: "#333"
          }}>
            Shop for <span style={{
              color: "#4CAF50",
              background: "#e8f5e9",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "20px",
              marginLeft: "5px"
            }}>{activeSubName}</span>
          </h2>
        </div>

        {/* Products grid */}
        {products.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "40px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
          }}>
            <p style={{ color: "#999", fontSize: "16px" }}>No products found in this category</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px"
          }}>
            {products.map((prod) => (
              <div
                key={prod._id}
                onClick={() => {
                  if (prod.product_quantity === 0) return;
                  navigate(`/product/${prod._id}`);
                }}
                style={{
                  opacity: prod.product_quantity === 0 ? 0.7 : 1,
                  filter: prod.product_quantity === 0 ? "grayscale(30%)" : "none",
                  cursor: prod.product_quantity === 0 ? "not-allowed" : "pointer",
                  background: "#fff",
                  padding: "12px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  transition: "all 0.25s ease",
                  border: "1px solid #f0f0f0",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (prod.product_quantity === 0) return;
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
                  e.currentTarget.style.borderColor = "#4CAF50";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                  e.currentTarget.style.borderColor = "#f0f0f0";
                }}
              >
                {/* Product Image Container */}
                <div style={{
                  overflow: "hidden",
                  borderRadius: "8px",
                  backgroundColor: "#f8f9fa",
                  position: "relative",
                }}>
                  {/* Only X left badge */}
                  {prod.product_quantity > 0 && prod.product_quantity < 10 && (
                    <span style={{
                      position: "absolute",
                      top: "8px",
                      left: "8px",
                      background: "#ff9800",
                      color: "#fff",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: "12px",
                      zIndex: 1,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}>
                      Only {prod.product_quantity} left
                    </span>
                  )}

                  <img
                    src={`${import.meta.env.VITE_API_URL}/api/image/${prod.product_image}`}
                    alt={prod.product_name}
                    style={{
                      width: "100%",
                      height: "160px",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                      filter: prod.product_quantity === 0 ? "grayscale(50%)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (prod.product_quantity === 0) return;
                      e.currentTarget.style.transform = "scale(1.08)";
                    }}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>

                {/* Product Info */}
                <p style={{
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  margin: "8px 0 4px",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  minHeight: "44px",
                  color: prod.product_quantity === 0 ? "#999" : "#333",
                  lineHeight: "1.4"
                }}>
                  {prod.product_name}
                </p>

                <p style={{
                  color: prod.product_quantity === 0 ? "#bbb" : "#777",
                  fontSize: "0.85rem",
                  margin: "0 0 12px 0",
                  background: "#f5f5f5",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  display: "inline-block",
                  alignSelf: "flex-start"
                }}>
                  {prod.product_unit}
                </p>

                {/* Price and Cart Section */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "auto",
                }}>
                  <p style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: prod.product_quantity === 0 ? "#999" : "#4CAF50",
                  }}>
                    ₹{prod.product_price}
                  </p>

                  {prod.product_quantity === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
                      <span
                        style={{
                          color: "#d32f2f",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          background: "#ffebee",
                          padding: "3px 6px",
                          borderRadius: "10px",
                          display: "inline-block",
                          whiteSpace: "nowrap",
                        }}
                      >
                        ⚠ Out of Stock
                      </span>
                    </div>
                  ) : cartMap[prod._id] ? (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "20px",
                        background: "#4CAF50",
                        color: "#fff",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(76, 175, 80, 0.2)",
                      }}
                    >
                      <button
                        onClick={() => updateCart(prod._id, "dec")}
                        style={{
                          padding: "6px 12px",
                          background: "transparent",
                          border: "none",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: "16px",
                          fontWeight: 700,
                        }}
                      >
                        -
                      </button>

                      <span style={{
                        padding: "0 10px",
                        fontWeight: 700,
                        fontSize: "14px"
                      }}>
                        {cartMap[prod._id]}
                      </span>

                      <button
                        onClick={() => updateCart(prod._id, "inc")}
                        style={{
                          padding: "6px 12px",
                          background: "transparent",
                          border: "none",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: "16px",
                          fontWeight: 700,
                        }}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateCart(prod._id, "inc");
                      }}
                      style={{
                        padding: "7px 16px",
                        border: "none",
                        borderRadius: "20px",
                        background: "#4CAF50",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "13px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 8px rgba(76, 175, 80, 0.2)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#43a047";
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(76, 175, 80, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#4CAF50";
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(76, 175, 80, 0.2)";
                      }}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Snackbar */}
      <CustomSnackbar
        snackbar={snackbar}
        onClose={hideSnackbar}
      />
    </div>
  );
}