// src/components/Header/Header.js
import { Link, useNavigate } from "react-router-dom";
import { Bell, ShoppingCart, Search, User, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import api from "../../services/api";
import "./Header.css";

const Header = () => {
  const { isLoggedIn, userName, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  
  // Notification states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Search functionality
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length > 2) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await api.get(`products/?search=${encodeURIComponent(query)}&page_size=5`);
          const results = Array.isArray(response.data) ? response.data : (response.data.results || []);
          setSearchResults(results);
          setShowSearchResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300); // Debounce 300ms
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setSearchQuery("");
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // Notification functions
  const fetchNotifications = async () => {
    if (!isLoggedIn) return;
    
    try {
      const response = await api.get('notifications/?page_size=5');
      const notificationsData = response.data.results || response.data;
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    if (!isLoggedIn) return;
    
    try {
      const response = await api.get('notifications/unread_count/');
      const count = response.data.unread_count || 0;
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.post(`notifications/${notificationId}/mark_read/`);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('notifications/mark_all_read/');
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-account-header")) {
        setShowDropdown(false);
      }
      if (!event.target.closest(".search-container")) {
        setShowSearchResults(false);
      }
      // Đóng notification dropdown khi click bên ngoài
      if (!event.target.closest(".notification-section-header")) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load notifications when user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
      fetchUnreadCount();
      
      // Refresh notifications every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);
      
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isLoggedIn]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
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
          <Link to="/deals" className="nav-link">Săn mã</Link>
        </nav>
        <div className="user-actions-header">
          <div className="search-container">
            <form className="search-box-header" onSubmit={handleSearchSubmit}>
              <Search className="search-icon-header" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm sản phẩm..." 
                value={searchQuery}
                onChange={handleSearchChange}
                ref={searchRef}
              />
              {searchQuery && (
                <button 
                  type="button" 
                  className="clear-search-btn"
                  onClick={clearSearch}
                >
                  <X size={16} />
                </button>
              )}
            </form>
            
            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="search-results-dropdown">
                {isSearching ? (
                  <div className="search-loading">
                    <div className="search-spinner"></div>
                    <span>Đang tìm kiếm...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="search-results-header">
                      <span>Kết quả tìm kiếm</span>
                    </div>
                    {searchResults.map((product) => (
                      <div 
                        key={product.id} 
                        className="search-result-item"
                        onClick={() => handleProductClick(product.id)}
                      >
                        <img 
                          src={
                            product.images && product.images.length > 0 
                              ? product.images[0].image 
                              : '/assets/images/products/placeholder-product.jpg'
                          } 
                          alt={product.name}
                          className="search-result-image"
                        />
                        <div className="search-result-info">
                          <h4>{product.name}</h4>
                          <p className="search-result-price">
                            {Number(product.price).toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                      </div>
                    ))}
                    <div 
                      className="search-view-all"
                      onClick={() => {
                        navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                        setShowSearchResults(false);
                      }}
                    >
                      Xem tất cả kết quả cho "{searchQuery}"
                    </div>
                  </>
                ) : (
                  <div className="search-no-results">
                    <span>Không tìm thấy sản phẩm nào</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="notification-section-header">
            <button className="icon-btn-header notification-btn" onClick={() => {
              setShowNotifications(!showNotifications);
            }}>
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="notification-count">{unreadCount}</span>
              )}
            </button>
            
            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-dropdown-header">
                  <h3>Thông báo</h3>
                  {unreadCount > 0 && (
                    <button 
                      className="mark-all-read-btn"
                      onClick={markAllAsRead}
                    >
                      Đánh dấu tất cả đã đọc
                    </button>
                  )}
                </div>
                
                <div className="notification-list">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        {/* Left side - Image */}
                        <div className="notification-left">
                          {notification.product_image ? (
                            <div className="notification-image">
                              <img 
                                src={notification.product_image} 
                                alt={notification.related_product_name || 'Sản phẩm'}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          ) : (
                            <div className="notification-icon">
                              🔔
                            </div>
                          )}
                          {!notification.is_read && (
                            <div className="unread-indicator"></div>
                          )}
                        </div>
                        
                        {/* Right side - Content */}
                        <div className="notification-right">
                          <div className="notification-header">
                            <h3 className="notification-title">{notification.title}</h3>
                            <span className="notification-time">
                              {new Date(notification.created_at).toLocaleString('vi-VN')}
                            </span>
                          </div>
                          
                          <p className="notification-message">{notification.message}</p>
                          
                          {/* Product Info */}
                          {notification.related_product_name && (
                            <div className="notification-product-info">
                              <span className="product-name">{notification.related_product_name}</span>
                              {notification.related_product_price && (
                                <span className="product-price">
                                  {Number(notification.related_product_price).toLocaleString('vi-VN')}đ
                                </span>
                              )}
                            </div>
                          )}
                          
                          {/* Action Button */}
                          {notification.action_button_text && notification.action_url && (
                            <button 
                              className="notification-action-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = notification.action_url;
                              }}
                            >
                              {notification.action_button_text}
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-notifications">
                      <p>Không có thông báo nào</p>
                    </div>
                  )}
                </div>
                
                <div className="notification-footer">
                  <Link to="/notifications" onClick={() => setShowNotifications(false)}>
                    Xem tất cả thông báo
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Link to="/cart" className="icon-btn-header cart-btn-header">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="cart-count-header">{cartCount}</span>
            )}
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
                    <Link to="/notifications" className="dropdown-item-header" onClick={() => setShowDropdown(false)}>
                      Tất cả thông báo
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