import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../../context/CartContext';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { cartItems, fetchCart } = useCart();
  const cartMap = cartItems.map;

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/product/search?q=${query}`
      );
      setResults(res.data.products || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCart = async (productId, type) => {
    const token = localStorage.getItem("usertoken");
    if (!token) {
      alert("Please login first");
      return;
    }
    try {
      const currentQty = cartMap[productId] || 0;
      if (currentQty === 0 && type === "inc") {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/cart/add`,
          { productId },
          { headers: { "auth-token": token } }
        );
      } else {
        const newQty = type === "inc" ? currentQty + 1 : currentQty - 1;
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/cart/update`,
          { productId, qty: newQty },
          { headers: { "auth-token": token } }
        );
      }
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ 
      padding: "30px", 
      maxWidth: "1400px", 
      margin: "0 auto", 
      backgroundColor: "#f8f9fa", 
      minHeight: "100vh" 
    }}>
      {/* Header */}
      <div style={{ 
        marginBottom: "30px", 
        padding: "20px", 
        background: "#fff", 
        borderRadius: "16px", 
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)" 
      }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: "24px", 
          fontWeight: 600, 
          color: "#333" 
        }}>
          Search Results for: 
          <span style={{ 
            color: "#4CAF50", 
            background: "#e8f5e9", 
            padding: "4px 12px", 
            borderRadius: "20px", 
            fontSize: "20px", 
            marginLeft: "10px" 
          }}>
            "{query}"
          </span>
        </h2>
        <p style={{ 
          margin: "10px 0 0 0", 
          color: "#666", 
          fontSize: "14px" 
        }}>
          {results.length} {results.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      {/* Results */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading...</p>
        </div>
      ) : results.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "60px", 
          background: "#fff", 
          borderRadius: "20px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
        }}>
          <p style={{ color: "#999", fontSize: "16px" }}>
            No products found matching "{query}"
          </p>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
          gap: "20px" 
        }}>
          {results.map((prod) => (
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
  );
}