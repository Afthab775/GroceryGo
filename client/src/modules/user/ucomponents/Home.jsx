import React, { useState, useEffect } from 'react';
import banner from '../../../assets/banner.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {

  const navigate = useNavigate();
  const [categories, Setcategories] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/category/getcategory`)
      .then((res) => {
        Setcategories(res.data.categories);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div style={{ position: "relative", padding: "20px" }}>

      {/* Banner */}
      <div style={{ position: "relative", marginBottom: "40px" }}>

        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "12px",
            filter: "blur(25px)",
            background: "rgba(255,255,255,0.5)",
            zIndex: 0
          }}
        ></div>

        <img
          src={banner}
          alt="Grocery Banner"
          style={{
            width: "100%",
            borderRadius: "12px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
            position: "relative",
            zIndex: 1
          }}
        />

        {/* Overlay Content */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "20%",
            transform: "translateY(-50%)",
            color: "#000",
            maxWidth: "500px",
            zIndex: 2
          }}
        >
          <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>
            <span style={{ color: "#4CAF50" }}>Grocery</span>
            <span style={{ color: "#4670BE", marginLeft: "5px" }}>Go</span>
          </h1>

          <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
            Fresh groceries delivered fast to your doorstep!
          </p>
        </div>

      </div>

      {/* Category Cards Section */}
      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "15px" }}>
        Shop By Category
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: "20px"
        }}
      >
        {categories.map((cat) => (
          <div
            key={cat._id}
            style={{
              minWidth: "150px",
              background: "#fff",
              borderRadius: "20px",
              padding: "10px",
              boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.2s"
            }}
            onClick={() => navigate(`/category/${cat._id}`)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src={
                cat.category_image.startsWith("http")
                  ? cat.category_image
                  : `${import.meta.env.VITE_API_URL}/api/image/${cat.category_image}`}
              alt={cat.category_name}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                borderRadius: "15px",
                marginBottom: "10px"
              }}
            />

            {/* <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>{cat.category_name}</p> */}
          </div>
        ))}
      </div>

    </div>
  );
}