import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './features/user/Home/Home';
import ProductDetail from './features/user/ProductDetail/ProductDetail';
import Product from './features/user/Product/Product';
import Cart from './features/user/Cart/Cart';
import Wishlist from './features/user/Wishlist/Wishlist';
import OrderHistory from './features/user/OrderHistory/OrderHistory';
import Dashboard from './features/admin/Dashboard/Dashboard';
import ManageProducts from './features/admin/ManageProducts/ManageProducts';
import ManageOrders from './features/admin/ManageOrders/ManageOrders';
import ManageCustomers from './features/admin/ManageCustomers/ManageCustomers';
import ChatbotDashboard from './features/admin/ChatbotDashboard/ChatbotDashboard';
import Checkout from './features/user/Checkout/Checkout';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Chatbot from './components/Chatbot/Chatbot';

function AppRoutes() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/products" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/admin/orders" element={<ManageOrders />} />
        <Route path="/admin/customers" element={<ManageCustomers />} />
        <Route path="/admin/chatbot" element={<ChatbotDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
      <Chatbot />
    </>
  );
}

export default AppRoutes;