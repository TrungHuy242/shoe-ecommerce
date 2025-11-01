import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaStar, FaShoppingCart } from 'react-icons/fa';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import './Women.css';

const Women = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistMap, setWishlistMap] = useState({});
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWomenProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('products/', {
          params: { gender: 'Nữ' }
        });
        const prodData = Array.isArray(response.data) ? response.data : (response.data.results || []);
        setProducts(prodData);
      } catch (err) {
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWomenProducts();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get('wishlists/');
        const list = Array.isArray(res.data) ? res.data : (res.data.results || []);
        const map = {};
        list.forEach(item => {
          if (item?.product) map[item.product] = item.id;
        });
        setWishlistMap(map);
      } catch (e) {
        // ignore if unauth
      }
    };
    if (isLoggedIn) fetchWishlist();
  }, [isLoggedIn]);

  const getFirstProductImage = (prod) => {
    const relImg = prod?.images && prod.images.length > 0 ? prod.images[0].image : null;
    return relImg || prod?.image || "https://via.placeholder.com/300x300?text=Product";
  };

  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return null;
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return decoded.user_id || decoded.userId || null;
    } catch (e) {
      return null;
    }
  };

  const handleHeartClick = async (e, prod) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    const userId = getCurrentUserId();
    if (!userId) {
      navigate('/login');
      return;
    }

    try {
      const existingWishlistId = wishlistMap[prod.id];
      if (existingWishlistId) {
        await api.delete(`wishlists/${existingWishlistId}/`);
        setWishlistMap(prev => {
          const next = { ...prev };
          delete next[prod.id];
          return next;
        });
      } else {
        const created = await api.post('wishlists/', { user: userId, product: prod.id });
        const newId = created?.data?.id;
        setWishlistMap(prev => ({ ...prev, [prod.id]: newId }));
      }
    } catch (err) {
      console.error('Toggle wishlist failed:', err);
      if (err?.response?.status === 401) navigate('/login');
    }
  };

  if (loading) return <div className="loading-text">Đang tải sản phẩm...</div>;
  if (error) return <div className="error-text">{error}</div>;

  return (
    <div className="women-page">
      <div className="women-header">
        <div className="women-header-content">
          <div className="breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span></span>
            <span>Giày Nữ</span>
          </div>
          <h1>Giày Nữ</h1>
          <p>Khám phá bộ sưu tập giày nữ với {products.length} sản phẩm</p>
        </div>
      </div>

      <div className="women-products-container">
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((prod) => (
              <Link to={`/product/${prod.id}`} key={prod.id} className="product-card">
                <div className="product-image-wrapper">
                  <img
                    src={getFirstProductImage(prod)}
                    alt={prod.name}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/300x300?text=Product"; }}
                    className="product-image"
                  />
                  <div className="product-actions">
                    <FaHeart
                      className={`product-heart ${wishlistMap[prod.id] ? 'liked' : ''}`}
                      onClick={(e) => handleHeartClick(e, prod)}
                    />
                  </div>
                </div>
                <div className="product-info">
                  <div className="info-top">
                    <h4>{prod.name}</h4>
                    <div className="rating">
                      <div className="rating-stars">
                        {Array.from({ length: 5 }, (_, i) => (
                          <FaStar 
                            key={i} 
                            className={i < Math.round(prod.rating || 0) ? "star filled" : "star"}
                          />
                        ))}
                      </div>
                      <span className="reviews">({prod.reviews || 0})</span>
                    </div>
                  </div>
                  <div className="price-cart-row">
                    <div className="price-block">
                      {prod.originalPrice && (
                        <span className="original-price">
                          {Number(prod.originalPrice).toLocaleString('vi-VN')}đ
                        </span>
                      )}
                      <span className="product-price">
                        {Number(prod.price).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <div className="sales-info">
                      Đã bán {Number(prod?.sales_count ?? 0).toLocaleString('vi-VN')}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="no-products">
            <h3>Không có sản phẩm nào</h3>
            <p>Hiện tại chưa có sản phẩm giày nữ.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Women;