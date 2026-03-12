import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";

import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/700.css";

import "@fontsource/ubuntu/400.css";
import "@fontsource/ubuntu/500.css";

import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";

import "@fontsource/nunito/400.css";
import "@fontsource/nunito/600.css";

import "@fontsource/manrope/400.css";
import "@fontsource/manrope/600.css";

/* MUI THEME */
import { ThemeProvider, createTheme } from "@mui/material";
/* CART CONTEXT*/
import { CartProvider } from './context/CartContext.jsx';

const theme = createTheme({
  typography:{
    fontFamily: "Inter, sans-serif",

    h1: { fontFamily: "Inter, sans-serif", fontWeight: 600 },
    h2: { fontFamily: "Inter, sans-serif", fontWeight: 600 },
    h3: { fontFamily: "Inter, sans-serif" },

    body1: { fontFamily: "Inter, sans-serif" },

    button:{
      fontFamily: "Inter, sans-serif",
      textTransform: "none",
      fontWeight: 600,
    }
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CartProvider>
    <App />
    </CartProvider>
    </ThemeProvider>
  </StrictMode>,
)
