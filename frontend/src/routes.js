import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './features/user/Home/Home';
import ProductDetail from './features/user/ProductDetail/ProductDetail';
import Product from './features/user/Product/Product';
import ProductRecommendation from './features/user/ProductRecommendation/ProductRecommendation';
import Cart from './features/user/Cart/Cart';
import Wishlist from './features/user/Wishlist/Wishlist';
import OrderHistory from './features/user/OrderHistory/OrderHistory';
import OrderDetail from './features/user/OrderDetail/OrderDetail';
import Dashboard from './features/admin/Dashboard/Dashboard';
import ManageProducts from './features/admin/ManageProducts/ManageProducts';
import AddProduct from './features/admin/ManageProducts/AddProduct/AddProduct';
import EditProduct from './features/admin/ManageProducts/EditProduct/EditProduct';
import ManageOrders from './features/admin/ManageOrders/ManageOrders';
import ManageCustomers from './features/admin/ManageCustomers/ManageCustomers';
import ManageCategories from './features/admin/ManageProducts/ManageCategories/ManageCategories';
import ManageBrands from './features/admin/ManageProducts/ManageBrands/ManageBrands';
import ManageSizes from './features/admin/ManageProducts/ManageSizes/ManageSizes';
import ManageColors from './features/admin/ManageProducts/ManageColors/ManageColors';
import ChatbotDashboard from './features/admin/ChatbotDashboard/ChatbotDashboard';
import Checkout from './features/user/Checkout/Checkout';
import OrderSuccess from './features/user/OrderSuccess/OrderSuccess';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Chatbot from './components/Chatbot/Chatbot';
import AdminLayout from './features/admin/AdminLayout'; // Import the AdminLayout
import Account from './features/user/Account/Account';
import Men from './features/user/Men/Men';
import Women from './features/user/Women/Women';
import Sandals from './features/user/Sandals/Sandals';
import Settings from './features/user/Settings/Settings';
import { useAuth } from './context/AuthContext'; // Import useAuth

function AppRoutes() {
  const { isLoggedIn, role, loading } = useAuth(); // Get isLoggedIn and role from AuthContext
  const isAdmin = role === 1; // Determine isAdmin based on role from context
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  const AdminRoute = ({ children }) => {
    if (!isLoggedIn || !isAdmin) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <>
      {!isAdmin && !isLoginPage && !isRegisterPage && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/products" element={<Product />} />
        <Route path="/product-recommendation" element={<ProductRecommendation />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={isLoggedIn ? <Checkout /> : <Navigate to="/login" />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={isLoggedIn ? <OrderHistory /> : <Navigate to="/login" />} />
        <Route path="/order/:id" element={isLoggedIn ? <OrderDetail /> : <Navigate to="/login" />} />
        <Route path="/account" element={isLoggedIn ? <Account /> : <Navigate to="/login" />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/sandals" element={<Sandals />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="products/add-product" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="customers" element={<ManageCustomers />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="brands" element={<ManageBrands />} />
          <Route path="sizes" element={<ManageSizes />} />
          <Route path="colors" element={<ManageColors />} />
          <Route path="chatbot" element={<ChatbotDashboard />} />
        </Route>
      </Routes>
      {!isAdmin && !isLoginPage && !isRegisterPage && <Footer />}
      {!isAdmin && <Chatbot />}
    </>
  );
}

export default AppRoutes;