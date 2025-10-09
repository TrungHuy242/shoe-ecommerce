// frontend/src/features/user/Wishlist/Wishlist.js
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { FaHeart, FaStar, FaTrash, FaSearch, FaShoppingCart, FaCheck } from 'react-icons/fa';
import { useNotification } from '../../../context/NotificationContext';
import SkeletonLoader from '../../../components/common/SkeletonLoader';
import './Wishlist.css';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [removingItems, setRemovingItems] = useState(new Set());
  const [addingToCart, setAddingToCart] = useState(new Set());
  const navigate = useNavigate();
  const { success, error } = useNotification();

  useEffect(() => {
    const fetchWishlistData = async () => {
      try {
        setLoading(true);

        // nếu chưa có token => yêu cầu đăng nhập
        const token = localStorage.getItem('access_token');
        if (!token) {
          navigate('/login');
          return;
        }

        // 1) Lấy danh sách wishlist (id wishlist + product id)
        const wlRes = await api.get('wishlists/');
        const rawList = Array.isArray(wlRes.data) ? wlRes.data : (wlRes.data.results || []);
        if (rawList.length === 0) {
          setWishlistItems([]);
          return;
        }

        // 2) Lấy chi tiết product cho từng wishlist item
        const productIds = rawList.map(x => x.product);
        const productDetails = await Promise.all(
          productIds.map(id => api.get(`products/${id}/`).then(r => r.data).catch(() => null))
        );

        // 3) Gộp dữ liệu wishlist + product
        const merged = rawList.map((wl, idx) => {
          const p = productDetails[idx];
          return {
            id: wl.id,                    // id của wishlist item (dùng để xóa)
            productId: wl.product,        // id sản phẩm
            name: p?.name || 'Sản phẩm',
            image: (p?.images && p.images[0]?.image) || p?.image || 'https://via.placeholder.com/300x300?text=Product',
            price: Number(p?.price || 0),
            originalPrice: p?.originalPrice ? Number(p.originalPrice) : 0,
            rating: p?.rating || 0,
            reviews: p?.reviews || 0,
            inStock: (p?.stock_quantity || 0) > 0,
            category: String(p?.category || ''),   // id (chỉ để lọc text nếu cần)
            addedDate: wl.added_at || wl.created_at || new Date().toISOString(),
          };
        });

        setWishlistItems(merged);
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu wishlist:', err?.response?.data || err.message);
        // Nếu 401 => bắt đăng nhập
        if (err?.response?.status === 401) navigate('/login');
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistData();
  }, [navigate]);

  const removeFromWishlist = async (wishlistId) => {
    setRemovingItems(prev => new Set(prev).add(wishlistId));
    
    try {
      await api.delete(`wishlists/${wishlistId}/`);
      
      // Animation delay before removing from UI
      setTimeout(() => {
        setWishlistItems(items => items.filter(item => item.id !== wishlistId));
        setSelectedItems(prev => {
          const ns = new Set(prev);
          ns.delete(wishlistId);
          return ns;
        });
        setRemovingItems(prev => {
          const next = new Set(prev);
          next.delete(wishlistId);
          return next;
        });
        success('Đã xóa sản phẩm khỏi danh sách yêu thích!');
      }, 300);
    } catch (e) {
      console.warn('Xóa wishlist lỗi:', e?.response?.data || e.message);
      error('Có lỗi khi xóa sản phẩm!');
      setRemovingItems(prev => {
        const next = new Set(prev);
        next.delete(wishlistId);
        return next;
      });
    }
  };

  // Thêm các helper dưới phần useNavigate()
  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return null;
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return decoded.user_id || decoded.userId || null;
    } catch {
      return null;
    }
  };

  const getOrCreateCartId = async () => {
    // Lấy cart hiện có
    const cartsRes = await api.get('carts/');
    const carts = Array.isArray(cartsRes.data) ? cartsRes.data : (cartsRes.data.results || []);
    if (carts.length > 0) return carts[0].id;

    // Chưa có -> tạo mới
    const userId = getCurrentUserId();
    const created = await api.post('carts/', { user: userId });
    return created.data.id;
  };

  const isProductInCart = async (productId) => {
    // Lấy các cart-item của user
    const itemsRes = await api.get('cart-items/');
    const items = Array.isArray(itemsRes.data) ? itemsRes.data : (itemsRes.data.results || []);
    return items.some(ci => ci.product === productId);
  };

  // Thay thế hàm addToCart cũ
  const addToCart = async (item) => {
    setAddingToCart(prev => new Set(prev).add(item.id));
    
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        navigate('/login');
        return;
      }

      if (await isProductInCart(item.productId)) {
        error('Sản phẩm này đã có trong giỏ hàng.');
        return;
      }

      const cartId = await getOrCreateCartId();
      await api.post('cart-items/', {
        cart: cartId,
        product: item.productId,
        quantity: 1,
      });

      success(`Đã thêm "${item.name}" vào giỏ hàng!`);
    } catch (e) {
      console.error('Add to cart error:', e?.response?.data || e.message);
      if (e?.response?.status === 401) navigate('/login');
      else error('Không thể thêm vào giỏ hàng. Vui lòng thử lại.');
    } finally {
      setAddingToCart(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  // Cập nhật addAllToCart để dùng logic trên
  const addAllToCart = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        navigate('/login');
        return;
      }

      const cartId = await getOrCreateCartId();
      const itemsRes = await api.get('cart-items/');
      const items = Array.isArray(itemsRes.data) ? itemsRes.data : (itemsRes.data.results || []);
      const inCartSet = new Set(items.map(ci => ci.product));

      const inStockItems = wishlistItems.filter(i => i.inStock);
      const toAdd = inStockItems.filter(i => !inCartSet.has(i.productId));

      if (toAdd.length === 0) {
        error('Tất cả sản phẩm còn hàng đã có trong giỏ.');
        return;
      }

      for (const it of toAdd) {
        await api.post('cart-items/', { cart: cartId, product: it.productId, quantity: 1 });
      }

      success(`Đã thêm ${toAdd.length} sản phẩm vào giỏ hàng!`);
    } catch (e) {
      console.error('Add all to cart error:', e?.response?.data || e.message);
      if (e?.response?.status === 401) navigate('/login');
      else error('Không thể thêm tất cả vào giỏ. Vui lòng thử lại.');
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => {
      const ns = new Set(prev);
      if (ns.has(id)) ns.delete(id);
      else ns.add(id);
      return ns;
    });
  };

  const selectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  const filteredItems = wishlistItems
    .filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
      // Có thể thêm điều kiện khác nếu muốn
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name': return a.name.localeCompare(b.name);
        case 'newest':
        default: return new Date(b.addedDate) - new Date(a.addedDate);
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
          {/* Header Skeleton */}
          <div className="wl-wishlist-header">
            <div className="wl-header-content">
              <div className="wl-title-section">
                <div className="skeleton-title" style={{width: '300px', height: '32px'}}></div>
                <div className="skeleton-text" style={{width: '150px', height: '20px'}}></div>
              </div>
            </div>
            <div className="wl-wishlist-controls">
              <div className="skeleton-default" style={{width: '300px', height: '40px'}}></div>
              <div className="skeleton-default" style={{width: '150px', height: '40px'}}></div>
            </div>
          </div>
          
          {/* Grid Skeleton */}
          <div className="wl-wishlist-grid">
            <SkeletonLoader type="card" count={6} />
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
            </div>
          </div>

          {filteredItems.length > 0 && (
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
                <button className="wl-remove-selected-btn" onClick={() => {
                  // xóa hàng loạt trên UI (có thể lặp delete API nếu muốn)
                  filteredItems.forEach(it => { if (selectedItems.has(it.id)) removeFromWishlist(it.id); });
                }}>
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
              <div 
                key={item.id} 
                className={`wl-wishlist-item ${removingItems.has(item.id) ? 'wl-item-removing' : ''}`}
              >
                <div className="wl-item-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                  />
                </div>

                <Link to={`/product/${item.productId}`} className="wl-item-link">
                  <div className="wl-item-image">
                    <img src={item.image} alt={item.name} />
                    {!item.inStock && (
                      <div className="wl-out-of-stock-overlay">
                        <span>Hết hàng</span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="wl-item-info">
                  <h3 className="wl-item-name">
                    <Link to={`/product/${item.productId}`}>{item.name}</Link>
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
                      {item.price.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  <div className="wl-item-actions">
                    <button
                      className="wl-add-to-cart-btn"
                      onClick={() => addToCart(item)}
                      disabled={!item.inStock || addingToCart.has(item.id)}
                      title="Thêm vào giỏ hàng"
                    >
                      {addingToCart.has(item.id) ? (
                        <div className="wl-loading-spinner-small"></div>
                      ) : (
                        <FaShoppingCart />
                      )}
                    </button>
                    
                    <button
                      className="wl-remove-btn"
                      onClick={() => removeFromWishlist(item.id)}
                      disabled={removingItems.has(item.id)}
                      title="Xóa khỏi danh sách yêu thích"
                    >
                      {removingItems.has(item.id) ? (
                        <div className="wl-loading-spinner-small"></div>
                      ) : (
                        <FaTrash />
                      )}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;