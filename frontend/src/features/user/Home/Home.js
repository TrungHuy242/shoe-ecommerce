import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaEnvelope, FaStar } from 'react-icons/fa';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import SkeletonLoader from '../../../components/common/SkeletonLoader';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Thêm state + load wishlists khi đã đăng nhập
  const [wishlistMap, setWishlistMap] = useState({}); // productId -> wishlistId

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse, brandsResponse] = await Promise.all([
          api.get('products/'),
          api.get('categories/'),
          api.get('brands/'),
        ]);
        const prodData = Array.isArray(productsResponse.data) ? productsResponse.data : (productsResponse.data.results || []);
        const catData = Array.isArray(categoriesResponse.data) ? categoriesResponse.data : (categoriesResponse.data.results || []);
        const brandData = Array.isArray(brandsResponse.data) ? brandsResponse.data : (brandsResponse.data.results || []);
        setProducts(prodData);
        setCategories(catData);
        setBrands(brandData);
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get('wishlists/');
        // res.data có thể là mảng hoặc { results: [...] }
        const list = Array.isArray(res.data) ? res.data : (res.data.results || []);
        const map = {};
        list.forEach(item => {
          if (item?.product) map[item.product] = item.id;
        });
        setWishlistMap(map);
      } catch (e) {
        // bỏ qua nếu chưa đăng nhập hoặc lỗi quyền
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

  // Cập nhật handleHeartClick để toggle theo wishlistMap
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
        // Đã thích -> xóa
        await api.delete(`wishlists/${existingWishlistId}/`);
        setWishlistMap(prev => {
          const next = { ...prev };
          delete next[prod.id];
          return next;
        });
      } else {
        // Chưa thích -> tạo mới
        const created = await api.post('wishlists/', { user: userId, product: prod.id });
        const newId = created?.data?.id;
        setWishlistMap(prev => ({ ...prev, [prod.id]: newId }));
      }
    } catch (err) {
      console.error('Toggle wishlist failed:', err);
      if (err?.response?.status === 401) navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="home-page">
        {/* Banner Skeleton */}
        <section className="banner-section">
          <div className="skeleton-banner">
            <div className="skeleton-banner-content">
              <div className="skeleton-banner-title"></div>
              <div className="skeleton-banner-subtitle"></div>
              <div className="skeleton-banner-button"></div>
            </div>
          </div>
        </section>

        {/* Categories Skeleton */}
        <section className="categories-section">
          <div className="categories-header">
            <div className="skeleton-title" style={{width: '300px', height: '32px'}}></div>
          </div>
          <div className="categories-grid">
            <SkeletonLoader type="card" count={3} />
          </div>
        </section>

        {/* Featured Products Skeleton */}
        <section className="featured-products-section">
          <div className="featured-header">
            <div className="skeleton-title" style={{width: '250px', height: '28px'}}></div>
          </div>
          <div className="products-grid">
            <SkeletonLoader type="card" count={8} />
          </div>
        </section>

        {/* Brands Skeleton */}
        <section className="brands-section">
          <div className="brands-header">
            <div className="skeleton-title" style={{width: '200px', height: '28px'}}></div>
          </div>
          <div className="brands-grid">
            <SkeletonLoader type="card" count={5} />
          </div>
        </section>
      </div>
    );
  }
  if (error) return <p className="error-text">{error}</p>;

  return (
    <>
      {/* Banner */}
      <section className="banner-section">
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <h1 className="banner-title">Giày dép thời trang 2025</h1>
          <p className="banner-subtitle">
            Bộ sưu tập mới phong cách sang trọng, chất liệu cao cấp trải nghiệm hoàn hảo.
          </p>
          <Link to="/products" className="banner-button">
            <FaShoppingCart className="button-icon" /> Shop Now
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="categories-header">
          <h2>Khám Phá Danh Mục</h2>
        </div>
        <div className="categories-grid">
          {categories.length > 0 ? categories.slice(0, 3).map((cat) => (
            <Link to={`/categories/${cat.id}`} key={cat.id} className="category-card">
              <div className="category-image">
                <img
                  src={cat.image || "https://via.placeholder.com/300x300?text=Category"}
                  alt={cat.name}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/300x300?text=Category"; }}
                />
                <div className="category-gradient"></div>
                <h3>{cat.name}</h3>
              </div>
            </Link>
          )) : <p>Không có danh mục nào.</p>}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products-section">
        <div className="section-header">
          <h2>Sản phẩm nổi bật</h2>
          <Link to="/products" className="view-all">
            Xem tất cả <span className="arrow">→</span>
          </Link>
        </div>
        <div className="products-grid">
          {products.length > 0 ? products.slice(0, 4).map((prod) => (
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
          )) : <p>Không có sản phẩm nào.</p>}
        </div>
      </section>

      {/* Brands */}
      <section className="home-brands-section">
        <div className="home-brands-header">
          <h2>Thương hiệu nổi bật</h2>
          <p>Khám phá các thương hiệu được yêu thích</p>
        </div>
        <div className="home-brands-grid">
          {brands.length > 0 ? brands.map((b) => (
            <Link 
              to={`/brands/${b.name}`} 
              key={b.id} 
              className="home-brand-card"
            >
              <div className="home-brand-image-wrap">
                <img
                  src={b.image || "https://via.placeholder.com/180x80?text=Brand"}
                  alt={b.name}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/180x80?text=Brand"; }}
                />
              </div>
              <div className="home-brand-name">{b.name}</div>
            </Link>
          )) : <p>Chưa có thương hiệu.</p>}
        </div>
      </section>

      {/* Promo Section */}
      <section className="promo-section">
        <div className="promo-overlay"></div>
        <div className="promo-card">
          <h2>Giảm giá 30% cho đơn hàng đầu tiên</h2>
          <p>Nhập email để nhận mã ưu đãi và cập nhật sản phẩm mới nhất.</p>
          <div className="promo-input-group">
            <FaEnvelope className="promo-icon" />
            <input type="email" placeholder="Nhập email của bạn" />
            <button>Đăng ký</button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>Khách hàng nói gì về chúng tôi</h2>
        <div className="testimonials-grid">
          {[
            { name: "Ngọc Anh", avatar: "/assets/images/users/user1.jpg", rating: 5, comment: "Thời trang tinh tế, giá rẻ, dịch vụ tốt." },
            { name: "Minh Khang", avatar: "/assets/images/users/user2.jpg", rating: 4, comment: "Sản phẩm chất lượng, giao hàng nhanh." },
            { name: "Thu Hà", avatar: "/assets/images/users/user3.jpg", rating: 5, comment: "Dịch vụ chăm sóc tuyệt vời." }
          ].map((t, idx) => (
            <div key={idx} className="testimonial-card">
              <div className="testimonial-header">
                <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
                <div className="testimonial-info">
                  <h4>{t.name}</h4>
                  <div className="testimonial-rating">
                    {Array.from({ length: t.rating }, (_, i) => (
                      <FaStar key={i} />
                    ))}
                    <span>({t.rating})</span>
                  </div>
                </div>
              </div>
              <p className="testimonial-comment">"{t.comment}"</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;