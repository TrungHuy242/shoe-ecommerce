import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaStar, FaTrash, FaShare, FaSearch } from 'react-icons/fa';
import './Wishlist.css';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedItems, setSelectedItems] = useState(new Set());

  const mockWishlistItems = [
    {
      id: 1,
      name: "Sneaker Da Trắng Premium Limited Edition",
      price: 2490000,
      originalPrice: 3100000,
      discount: 20,
      image: "/assets/images/products/giày.jpg",
      rating: 4.8,
      reviews: 124,
      inStock: true,
      addedDate: '2025-01-15',
      category: 'Sneaker'
    },
    {
      id: 2,
      name: "Oxford Da Đen Classic",
      price: 3990000,
      originalPrice: 4500000,
      discount: 11,
      image: "/assets/images/products/giày.jpg",
      rating: 4.9,
      reviews: 89,
      inStock: true,
      addedDate: '2025-01-10',
      category: 'Oxford'
    },
    {
      id: 3,
      name: "Boots Da Cao Cổ",
      price: 4200000,
      originalPrice: 5000000,
      discount: 16,
      image: "/assets/images/products/giày.jpg",
      rating: 4.7,
      reviews: 156,
      inStock: false,
      addedDate: '2025-01-05',
      category: 'Boots'
    },
    {
      id: 4,
      name: "Sandal Da Tối Giản",
      price: 1290000,
      originalPrice: 1650000,
      discount: 22,
      image: "/assets/images/products/giày.jpg",
      rating: 4.5,
      reviews: 43,
      inStock: true,
      addedDate: '2025-01-01',
      category: 'Sandal'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setWishlistItems(mockWishlistItems);
      setLoading(false);
    }, 1000);
  }, []);

  const removeFromWishlist = (id) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const addToCart = (item) => {
    console.log('Added to cart:', item);
    alert(`Đã thêm "${item.name}" vào giỏ hàng!`);
  };

  const addAllToCart = () => {
    const inStockItems = wishlistItems.filter(item => item.inStock);
    if (inStockItems.length === 0) {
      alert('Không có sản phẩm nào còn hàng để thêm vào giỏ!');
      return;
    }
    
    console.log('Added all to cart:', inStockItems);
    alert(`Đã thêm ${inStockItems.length} sản phẩm vào giỏ hàng!`);
  };

  const removeSelected = () => {
    if (selectedItems.size === 0) {
      alert('Vui lòng chọn sản phẩm để xóa!');
      return;
    }
    
    setWishlistItems(items => items.filter(item => !selectedItems.has(item.id)));
    setSelectedItems(new Set());
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  const shareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Danh sách yêu thích của tôi',
        text: 'Xem những sản phẩm tôi yêu thích tại FootFashion',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép link vào clipboard!');
    }
  };

  const filteredItems = wishlistItems
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return new Date(b.addedDate) - new Date(a.addedDate);
      }
    });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={index < Math.floor(rating) ? 'wl-star wl-filled' : 'wl-star'}
      />
    ));
  };

  if (loading) {
    return (
      <div className="wl-wishlist-page">
        <div className="wl-wishlist-container">
          <div className="wl-loading-state">
            <div className="wl-spinner-large"></div>
            <p>Đang tải danh sách yêu thích...</p>
          </div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="wl-wishlist-page">
        <div className="wl-wishlist-container">
          <div className="wl-empty-wishlist">
            <FaHeart className="wl-empty-icon" />
            <h2>Danh sách yêu thích trống</h2>
            <p>Bạn chưa có sản phẩm nào trong danh sách yêu thích.</p>
            <p>Hãy khám phá và thêm những sản phẩm ưa thích của bạn!</p>
            <Link to="/products" className="wl-browse-products-btn">
              <FaSearch /> Khám phá sản phẩm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wl-wishlist-page">
      <div className="wl-wishlist-container">
        <div className="wl-wishlist-header">
          <div className="wl-header-content">
            <div className="wl-title-section">
              <h1>
                <FaHeart className="wl-title-icon" />
                Danh sách yêu thích
              </h1>
              <p>{wishlistItems.length} sản phẩm</p>
            </div>
            <button className="wl-share-btn" onClick={shareWishlist}>
              <FaShare /> Chia sẻ
            </button>
          </div>

          <div className="wl-wishlist-controls">
            <div className="wl-search-box">
              <FaSearch className="wl-search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="wl-control-group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="wl-sort-select"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="name">Tên A-Z</option>
              </select>

              <button className="wl-bulk-action-btn" onClick={addAllToCart}>
                <FaShoppingCart /> Thêm tất cả vào giỏ
              </button>
            </div>
          </div>

          {wishlistItems.length > 0 && (
            <div className="wl-bulk-actions">
              <label className="wl-select-all">
                <input
                  type="checkbox"
                  checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                  onChange={selectAll}
                />
                <span>Chọn tất cả ({selectedItems.size})</span>
              </label>

              {selectedItems.size > 0 && (
                <button className="wl-remove-selected-btn" onClick={removeSelected}>
                  <FaTrash /> Xóa đã chọn
                </button>
              )}
            </div>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="wl-no-results">
            <p>Không tìm thấy sản phẩm nào phù hợp với "{searchTerm}"</p>
          </div>
        ) : (
          <div className="wl-wishlist-grid">
            {filteredItems.map(item => (
              <div key={item.id} className="wl-wishlist-item">
                <div className="wl-item-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                  />
                </div>

                <Link to={`/product/${item.id}`} className="wl-item-link">
                  <div className="wl-item-image">
                    <img src={item.image} alt={item.name} />
                    {item.discount > 0 && (
                      <div className="wl-discount-badge">-{item.discount}%</div>
                    )}
                    {!item.inStock && (
                      <div className="wl-out-of-stock-overlay">
                        <span>Hết hàng</span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="wl-item-info">
                  <div className="wl-item-category">{item.category}</div>
                  <h3 className="wl-item-name">
                    <Link to={`/product/${item.id}`}>{item.name}</Link>
                  </h3>
                  
                  <div className="wl-item-rating">
                    <div className="wl-stars">
                      {renderStars(item.rating)}
                    </div>
                    <span className="wl-rating-text">
                      {item.rating} ({item.reviews} đánh giá)
                    </span>
                  </div>

                  <div className="wl-item-price">
                    <span className="wl-current-price">
                      {item.price.toLocaleString()}đ
                    </span>
                    {item.originalPrice > item.price && (
                      <span className="wl-original-price">
                        {item.originalPrice.toLocaleString()}đ
                      </span>
                    )}
                  </div>

                  <div className="wl-item-actions">
                    <button
                      className={`wl-add-to-cart-btn ${!item.inStock ? 'wl-disabled' : ''}`}
                      onClick={() => item.inStock && addToCart(item)}
                      disabled={!item.inStock}
                    >
                      <FaShoppingCart />
                      {item.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                    </button>
                    <button
                      className="wl-remove-btn"
                      onClick={() => removeFromWishlist(item.id)}
                      title="Xóa khỏi danh sách yêu thích"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredItems.length > 0 && (
          <div className="wl-wishlist-summary">
            <div className="wl-summary-stats">
              <div className="wl-stat">
                <span className="wl-stat-number">{filteredItems.length}</span>
                <span className="wl-stat-label">Sản phẩm</span>
              </div>
              <div className="wl-stat">
                <span className="wl-stat-number">
                  {filteredItems.filter(item => item.inStock).length}
                </span>
                <span className="wl-stat-label">Còn hàng</span>
              </div>
              <div className="wl-stat">
                <span className="wl-stat-number">
                  {filteredItems.reduce((sum, item) => sum + (item.originalPrice - item.price), 0).toLocaleString()}đ
                </span>
                <span className="wl-stat-label">Tiết kiệm</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;