import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from '../ucomponents/Navbar'
import Home from '../ucomponents/Home'
import Register from '../ucomponents/Register'
import Login from '../ucomponents/Login'
import Category from '../ucomponents/Category'
import Product from '../ucomponents/Product'
import CartDrawer from '../ucomponents/CartDrawer'
import AddressScreen from '../ucomponents/AddressScreen'
import EmptyCart from '../ucomponents/EmptyCart'
import Checkout from '../ucomponents/Checkout'
import OrderSuccess from '../ucomponents/OrderSuccess'
import ProtectedCheckout from '../ucomponents/ProtectedCheckout'
import ProtectedSuccess from '../ucomponents/ProtectedSuccess'
import MyOrders from '../ucomponents/Myorders'
import OrderDetails from '../ucomponents/OrderDetails'
import Footer from '../ucomponents/Footer'
import AboutUs from '../ucomponents/AboutUs'
import TermsConditions from '../ucomponents/TermsConditions'
import PrivacyPolicy from '../ucomponents/PrivacyPolicy'
import FAQs from '../ucomponents/FAQs'
import SearchResults from '../ucomponents/SearchResults'
import MyProfile from '../ucomponents/MyProfile'

export default function Userroutes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar/>
      <div style={{ flex: 1 }}>
      <Routes>
        <Route 
          path='/' 
          element={
            <Home/>
          }
        />
        <Route 
          path="/signup" 
          element={
            localStorage.getItem("usertoken")
            ? <Navigate to="/" replace />
            : <Register/>
          }
        />
        <Route 
          path="/login" 
          element={
            localStorage.getItem("usertoken")
            ? <Navigate to="/" replace />
            : <Login/>
          }
        />
        <Route path="/profile" element={<MyProfile/>}/>
        <Route path="/category/:cid" element={<Category/>}/>
        <Route path="/category/:cid/:subid" element={<Category/>}/>
        <Route path="/product/:id" element={<Product/>}/>
        <Route path="/search" element={<SearchResults/>}/>
        <Route path="/cart" element={<CartDrawer/>}/>
        <Route path="/address" element={<AddressScreen/>}/>
        <Route path="/empty" element={<EmptyCart/>}/>
        <Route path="/checkout" element={<ProtectedCheckout><Checkout/></ProtectedCheckout>}/>
        <Route path="/order-success" element={<ProtectedSuccess><OrderSuccess/></ProtectedSuccess>}/>
        <Route 
          path="/orders" 
          element={
            <MyOrders/>
          }
        />
        <Route path="/orders/:id" element={<OrderDetails/>}/>
        <Route path="/about" element={<AboutUs/>}/>
        <Route path="/terms" element={<TermsConditions/>}/>
        <Route path="/privacy" element={<PrivacyPolicy/>}/>
        <Route path="/faqs" element={<FAQs/>}/>
      </Routes>
      </div>
      <Footer/>
    </div>
  )
}
