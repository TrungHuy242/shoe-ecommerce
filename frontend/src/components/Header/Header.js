import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Search, User } from "lucide-react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          Foot<span>Fashion</span>
        </Link>

        {/* Navigation */}
        <nav className="nav">
          <Link to="/" className="nav-link">Trang chủ</Link>
          <Link to="/products" className="nav-link">Sản phẩm</Link>
          <Link to="/men" className="nav-link">Nam</Link>
          <Link to="/women" className="nav-link">Nữ</Link>
          <Link to="/sandals" className="nav-link">Dép</Link>
        </nav>

        {/* User actions */}
        <div className="user-actions-header">
          {/* Search */}
          <div className="search-box-header">
            <Search className="search-icon-header" size={18} />
            <input type="text" placeholder="Tìm kiếm..." />
          </div>

          {/* Wishlist */}
          <Link to="/wishlist" className="icon-btn-header">
            <Heart size={22} />
          </Link>

          {/* Cart */}
          <Link to="/cart" className="icon-btn-header cart-btn-header">
            <ShoppingCart size={22} />
            <span className="cart-count-header">3</span>
          </Link>

          {/* Login */}
          <Link to="/login" className="login-btn-header">
            <User size={18} />
            <span>Đăng nhập</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
