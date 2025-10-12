import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaBox, FaUsers, FaChartLine, FaComments, FaSignOutAlt, FaList, FaBuilding, FaCaretDown, FaCaretUp, FaRobot } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);

  const toggleProductMenu = () => {
    setIsProductMenuOpen(!isProductMenuOpen);
  };

  return (
    <div className="admin-sidebar">
      <h2 className="admin-logo">FootAdmin</h2>
      <nav className="admin-nav">
        <Link to="/admin/dashboard" className="admin-nav-item">
          <FaTachometerAlt /> Dashboard
        </Link>

        <div className="admin-nav-item has-submenu" onClick={toggleProductMenu}>
          <FaBox /> Sản phẩm
          {isProductMenuOpen ? <FaCaretUp /> : <FaCaretDown />}
        </div>
        {isProductMenuOpen && (
          <div className="admin-nav-submenu">
            <Link to="/admin/products" className="admin-nav-item">
              Quản lý sản phẩm
            </Link>
            <Link to="/admin/categories" className="admin-nav-item">
              Danh mục
            </Link>
            <Link to="/admin/brands" className="admin-nav-item">
              Thương hiệu
            </Link>
           <Link to="/admin/sizes" className="admin-nav-item">
              Kích cỡ
            </Link>
            <Link to="/admin/colors" className="admin-nav-item">
              Màu sắc
            </Link> 
          </div>
        )}

        <Link to="/admin/orders" className="admin-nav-item">
          <FaBox /> Đơn hàng
        </Link>
        <Link to="/admin/customers" className="admin-nav-item">
          <FaUsers /> Khách hàng
        </Link>
        <Link to="/admin/promotions" className="admin-nav-item">
          <FaChartLine /> Khuyến mãi
        </Link>
        <Link to="/admin/ai-chatbot" className="admin-nav-item">
          <FaRobot /> AI Chatbot
        </Link>
        <Link to="/login" className="admin-nav-item logout" onClick={() => localStorage.removeItem("user")}>
          <FaSignOutAlt /> Đăng xuất
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;