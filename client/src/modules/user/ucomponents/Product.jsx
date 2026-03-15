import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import b from '../../../assets/b.png'
import d from '../../../assets/db.jpg'
import c from '../../../assets/c.jpg'
import { useCart } from "../../../context/CartContext";
import CustomSnackbar from "../../../CustomSnackbar";
import useSnackbar from "../../../useSnackbar";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [subName, setSubName] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const { cartItems, fetchCart } = useCart();
  const cartMap = cartItems.map;
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  // ADD-TO-CART FUNCTION
  const addToCart = async (productId, type) => {
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

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/product/getproductbyid/${id}`);
      setProduct(res.data.oneproduct);

      const sub = await axios.get(`${import.meta.env.VITE_API_URL}/api/subcategory/getsubcategorybyid/${res.data.oneproduct.subcategoryID}`);
      setSubName(sub.data.subcategory.sub_name);

      const sim = await axios.get(`${import.meta.env.VITE_API_URL}/api/product/getbysub/${res.data.oneproduct.subcategoryID}`);
      const filtered = sim.data.products.filter(p => p._id !== id);
      setSimilarProducts(filtered.slice(0, 6))
    } catch (err) {
      console.log(err);
      showSnackbar("Error loading product details", "error");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!product) return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "80vh",
      fontSize: "1.2rem",
      color: "#666"
    }}>
      Loading...
    </div>
  );

  return (
    <div style={{
      padding: "30px",
      maxWidth: "1400px",
      margin: "0 auto",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh"
    }}>

      {/* MAIN PRODUCT LAYOUT*/}
      <div style={{
        display: "flex",
        gap: "40px",
        backgroundColor: "#fff",
        borderRadius: "24px",
        padding: "30px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
      }}>

        {/* LEFT — IMAGE + VIEW DETAILS */}
        <div style={{ width: "35%" }}>
          <div style={{
            background: "#f8f9fa",
            borderRadius: "20px",
            padding: "20px",
            textAlign: "center",
            border: "1px solid #f0f0f0"
          }}>
            <img
              src={`${import.meta.env.VITE_API_URL}/api/image/${product.product_image}`}
              alt={product.product_name}
              style={{
                width: "100%",
                borderRadius: "16px",
                objectFit: "cover",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            />

            {/* VIEW MORE DETAILS */}
            <p
              onClick={() => setShowDetails(!showDetails)}
              style={{
                marginTop: "20px",
                fontWeight: 600,
                color: "#4CAF50",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "10px",
                borderRadius: "12px",
                backgroundColor: showDetails ? "#e8f5e9" : "transparent",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (!showDetails) {
                  e.currentTarget.style.backgroundColor = "#f5f5f5";
                }
              }}
              onMouseLeave={(e) => {
                if (!showDetails) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              View more details
              <span style={{
                fontSize: "12px",
                transition: "transform 0.3s ease",
                transform: showDetails ? "rotate(180deg)" : "rotate(0)"
              }}>▼</span>
            </p>

            {showDetails && (
              <div style={{
                marginTop: "20px",
                padding: "20px",
                backgroundColor: "#f8f9fa",
                borderRadius: "16px",
                border: "1px solid #e0e0e0",
                textAlign: "left"
              }}>
                <p style={{ margin: "0 0 8px 0" }}>
                  <strong style={{ color: "#333", fontSize: "16px" }}>Description:</strong>
                </p>
                <p style={{
                  margin: "0 0 20px 0",
                  color: "#666",
                  lineHeight: "1.6",
                  fontSize: "14px"
                }}>
                  {product.product_description}
                </p>

                <p style={{ margin: "0 0 8px 0" }}>
                  <strong style={{ color: "#333", fontSize: "16px" }}>Unit:</strong>
                </p>
                <p style={{
                  margin: 0,
                  color: "#666",
                  fontSize: "14px",
                  backgroundColor: "#fff",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  display: "inline-block"
                }}>
                  {product.product_unit}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — DETAILS */}
        <div style={{ flex: 1, paddingLeft: "20px" }}>

          {/* Breadcrumb */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "20px",
            flexWrap: "wrap"
          }}>
            <span
              style={{
                cursor: "pointer",
                color: "#666",
                fontSize: "14px",
                transition: 'color 0.2s',
                padding: "4px 8px",
                borderRadius: "6px",
                backgroundColor: "#f5f5f5"
              }}
              onMouseEnter={e => {
                e.target.style.color = "#4caf50";
                e.target.style.backgroundColor = "#e8f5e9";
              }}
              onMouseLeave={e => {
                e.target.style.color = "#666";
                e.target.style.backgroundColor = "#f5f5f5";
              }}
              onClick={() => navigate("/")}
            >
              Home
            </span>
            <span style={{ color: "#ccc", fontSize: "12px" }}>/</span>
            <span
              style={{
                cursor: "pointer",
                color: "#666",
                fontSize: "14px",
                transition: "color 0.2s",
                padding: "4px 8px",
                borderRadius: "6px",
                backgroundColor: "#f5f5f5"
              }}
              onMouseEnter={e => {
                e.target.style.color = "#4caf50";
                e.target.style.backgroundColor = "#e8f5e9";
              }}
              onMouseLeave={e => {
                e.target.style.color = "#666";
                e.target.style.backgroundColor = "#f5f5f5";
              }}
              onClick={() => navigate(`/category/${product.categoryID}/${product.subcategoryID}`)}
            >
              {subName}
            </span>
            <span style={{ color: "#ccc", fontSize: "12px" }}>/</span>
            <span style={{
              color: "#4CAF50",
              fontSize: "14px",
              fontWeight: 500,
              padding: "4px 8px",
              borderRadius: "6px",
              backgroundColor: "#e8f5e9"
            }}>
              {product.product_name}
            </span>
          </div>

          <h2 style={{
            marginBottom: "10px",
            fontSize: "32px",
            fontWeight: 700,
            color: "#333",
            lineHeight: "1.3"
          }}>
            {product.product_name}
          </h2>

          <div style={{
            display: "inline-block",
            backgroundColor: "#f5f5f5",
            padding: "6px 12px",
            borderRadius: "20px",
            marginBottom: "20px"
          }}>
            <p style={{
              color: "#666",
              fontSize: "14px",
              margin: 0,
              fontWeight: 500
            }}>
              {product.product_unit}
            </p>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "25px",
            marginBottom: "30px",
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "16px",
          }}>
            <div>
              <span style={{
                fontSize: "14px",
                color: "#666",
                display: "block",
                marginBottom: "4px"
              }}>
                Price
              </span>
              <h2 style={{
                margin: 0,
                fontSize: "36px",
                color: "#4CAF50",
                fontWeight: 700
              }}>
                ₹{product.product_price}
              </h2>
            </div>

            {product.product_quantity === 0 ? (
              <div style={{
                padding: "10px 20px",
                backgroundColor: "#ffebee",
                color: "#d32f2f",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <span style={{ fontSize: "20px" }}>⚠️</span>
                Out of Stock
              </div>
            ) : cartMap[product._id] ? (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "2px solid #4CAF50",
                  borderRadius: "12px",
                  overflow: "hidden",
                  backgroundColor: "#fff",
                }}
              >
                <button
                  onClick={() => addToCart(product._id, "dec")}
                  style={{
                    padding: "10px 16px",
                    background: "#fff",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "18px",
                    color: "#4CAF50",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fff"}
                >
                  -
                </button>

                <span style={{
                  padding: "0 16px",
                  fontWeight: 700,
                  fontSize: "16px",
                  color: "#333"
                }}>
                  {cartMap[product._id]}
                </span>

                <button
                  onClick={() => addToCart(product._id, "inc")}
                  style={{
                    padding: "10px 16px",
                    background: "#fff",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "18px",
                    color: "#4CAF50",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fff"}
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product._id, "inc");
                }}
                style={{
                  padding: "14px 32px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#4CAF50",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "16px",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#43a047";
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(76, 175, 80, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#4CAF50";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(76, 175, 80, 0.3)";
                }}
              >
                Add to Cart
              </button>
            )}
          </div>

          {/* WHY SHOP FROM US */}
          <hr style={{
            margin: "40px 0 30px",
            border: "none",
            borderTop: "1px solid #f0f0f0"
          }} />

          <div style={{ marginTop: "30px" }}>
            <h3 style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#333",
              marginBottom: "30px"
            }}>
              Why shop from GroceryGo?
            </h3>

            <div style={{
              display: "flex",
              gap: "30px",
              justifyContent: "space-between"
            }}>

              {/* 1 */}
              <div style={{
                flex: 1,
                textAlign: "center",
                padding: "20px",
                backgroundColor: "#16202e18",
                borderRadius: "16px",
              }}
              >
                <img
                  src={d}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    marginBottom: "15px",
                    objectFit: "cover"
                  }}
                />
                <p style={{
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#333",
                  margin: "0 0 8px 0"
                }}>
                  Superfast Delivery
                </p>
                <p style={{
                  color: "#777",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  margin: 0
                }}>
                  Get your order delivered super fast from nearby dark stores.
                </p>
              </div>

              {/* 2 */}
              <div style={{
                flex: 1,
                textAlign: "center",
                padding: "20px",
                backgroundColor: "#16202e18",
                borderRadius: "16px",
              }}
              >
                <img
                  src={c}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    marginBottom: "15px",
                    objectFit: "cover"
                  }}
                />
                <p style={{
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#333",
                  margin: "0 0 8px 0"
                }}>
                  Best Prices & Offers
                </p>
                <p style={{
                  color: "#777",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  margin: 0
                }}>
                  Best price destination with offers from manufacturers.
                </p>
              </div>

              {/* 3 */}
              <div style={{
                flex: 1,
                textAlign: "center",
                padding: "20px",
                backgroundColor: "#16202e18",
                borderRadius: "16px",
              }}
              >
                <img
                  src={b}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    marginBottom: "15px",
                    objectFit: "cover"
                  }}
                />
                <p style={{
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#333",
                  margin: "0 0 8px 0"
                }}>
                  Wide Assortment
                </p>
                <p style={{
                  color: "#777",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  margin: 0
                }}>
                  5000+ products across all categories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ⭐ SIMILAR PRODUCTS SECTION */}
      <div style={{
        marginTop: "40px",
        padding: "30px",
        background: "#fff",
        borderRadius: "24px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
      }}>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px"
        }}>
          <h2 style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: 600,
            color: "#333"
          }}>
            Similar Products
          </h2>

          <button
            onClick={() => navigate(`/category/${product.categoryID}/${product.subcategoryID}`)}
            style={{
              background: "transparent",
              border: "1px solid #4CAF50",
              color: "#4CAF50",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              padding: "10px 20px",
              borderRadius: "25px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#4CAF50";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#4CAF50";
            }}
          >
            View All →
          </button>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "20px"
        }}>

          {similarProducts.map(item => (
            <div
              key={item._id}
              onClick={() => {
                if (item.product_quantity === 0) return;
                navigate(`/product/${item._id}`);
              }}
              style={{
                opacity: item.product_quantity === 0 ? 0.7 : 1,
                filter: item.product_quantity === 0 ? "grayscale(30%)" : "none",
                cursor: item.product_quantity === 0 ? "not-allowed" : "pointer",
                background: "#fff",
                padding: "12px",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                transition: "all 0.25s ease",
                border: "1px solid #f0f0f0",
              }}
              onMouseEnter={(e) => {
                if (item.product_quantity === 0) return;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
                e.currentTarget.style.borderColor = "#4CAF50";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                e.currentTarget.style.borderColor = "#f0f0f0";
              }}
            >
              <div style={{
                overflow: "hidden",
                borderRadius: "12px",
                marginBottom: "10px",
                backgroundColor: "#f8f9fa"
              }}>
                <img
                  src={`${import.meta.env.VITE_API_URL}/api/image/${item.product_image}`}
                  style={{
                    width: "100%",
                    height: "140px",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                    filter: item.product_quantity === 0 ? "grayscale(50%)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (item.product_quantity === 0) return;
                    e.currentTarget.style.transform = "scale(1.08)";
                  }}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              </div>

              <p style={{
                fontWeight: 600,
                fontSize: "14px",
                margin: "0 0 4px 0",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: "40px",
                color: item.product_quantity === 0 ? "#999" : "#333",
                lineHeight: "1.4"
              }}>
                {item.product_name}
              </p>

              <p style={{
                color: item.product_quantity === 0 ? "#bbb" : "#777",
                fontSize: "12px",
                margin: "0 0 12px 0"
              }}>
                {item.product_unit}
              </p>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "auto",
              }}>
                <p style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: "16px",
                  color: item.product_quantity === 0 ? "#999" : "#4CAF50",
                }}>
                  ₹{item.product_price}
                </p>

                {item.product_quantity === 0 ? (
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "2px"
                  }}>
                    <span
                      style={{
                        color: "#d32f2f",
                        fontWeight: 600,
                        fontSize: "11px",
                        background: "#ffebee",
                        padding: "2px 6px",
                        borderRadius: "8px",
                        display: "inline-block",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ⚠ Out of Stock
                    </span>
                  </div>
                ) : cartMap[item._id] ? (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "16px",
                      background: "#4CAF50",
                      color: "#fff",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={() => addToCart(item._id, "dec")}
                      style={{
                        padding: "4px 8px",
                        background: "transparent",
                        border: "none",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: 700,
                      }}
                    >
                      -
                    </button>

                    <span style={{
                      padding: "0 6px",
                      fontWeight: 700,
                      fontSize: "12px"
                    }}>
                      {cartMap[item._id]}
                    </span>

                    <button
                      onClick={() => addToCart(item._id, "inc")}
                      style={{
                        padding: "4px 8px",
                        background: "transparent",
                        border: "none",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: "14px",
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
                      addToCart(item._id, "inc");
                    }}
                    style={{
                      padding: "5px 12px",
                      border: "none",
                      borderRadius: "16px",
                      background: "#4CAF50",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "12px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#43a047";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#4CAF50";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Snackbar */}
      <CustomSnackbar
        snackbar={snackbar}
        onClose={hideSnackbar}
      />
    </div>
  );
}