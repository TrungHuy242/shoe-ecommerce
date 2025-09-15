// src/components/Header/Header.js
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Search, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // Đường dẫn có thể cần điều chỉnh
import "./Header.css";

const Header = () => {
  const { isLoggedIn, userName, logout } = useAuth(); // Loại bỏ checkAuthStatus
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-account-header")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          Foot<span>Fashion</span>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Trang chủ</Link>
          <Link to="/products" className="nav-link">Sản phẩm</Link>
          <Link to="/men" className="nav-link">Nam</Link>
          <Link to="/women" className="nav-link">Nữ</Link>
          <Link to="/sandals" className="nav-link">Dép</Link>
        </nav>
        <div className="user-actions-header">
          <div className="search-box-header">
            <Search className="search-icon-header" size={18} />
            <input type="text" placeholder="Tìm kiếm..." />
          </div>
          <Link to="/wishlist" className="icon-btn-header">
            <Heart size={22} />
          </Link>
          <Link to="/cart" className="icon-btn-header cart-btn-header">
            <ShoppingCart size={22} />
            <span className="cart-count-header">3</span>
          </Link>
          <div className="account-section-header">
            {isLoggedIn ? (
              <div className="user-account-header" onClick={toggleDropdown}>
                <User size={18} />
                <span>{userName}</span>
                {showDropdown && (
                  <div className="account-dropdown-header">
                    <Link to="/account" className="dropdown-item-header" onClick={() => setShowDropdown(false)}>
                      Thông tin tài khoản
                    </Link>
                    <Link to="/orders" className="dropdown-item-header" onClick={() => setShowDropdown(false)}>
                      Đơn hàng của tôi
                    </Link>
                    <Link to="/wishlist" className="dropdown-item-header" onClick={() => setShowDropdown(false)}>
                      Sản phẩm yêu thích
                    </Link>
                    <Link to="/settings" className="dropdown-item-header" onClick={() => setShowDropdown(false)}>
                      Cài đặt tài khoản
                    </Link>
                    <div className="dropdown-item-header" onClick={() => { logout(); setShowDropdown(false); }}>
                      Đăng xuất
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="login-btn-header">
                <User size={18} />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;