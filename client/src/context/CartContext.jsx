import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({ map:{}, list:[] });

  const fetchCart = async () => {
    const token = localStorage.getItem("usertoken");
    if (!token) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cart/get`,
        { headers: { "auth-token": token } }
      );

      const cartMap = {};
      (res.data.items || []).forEach((item) => {
        cartMap[item.productId._id] = item.qty;
      });

      setCartItems({
        map: cartMap,
        list: res.data.items || [],
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);