import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaEnvelope, FaStar } from 'react-icons/fa';
import api from '../../../services/api';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.get('products/'),
          api.get('categories/'),
        ]);
        setProducts(productsResponse.data.results || []);
        setCategories(categoriesResponse.data.results || []);
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="loading-text">Đang tải...</p>;
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
            <div key={prod.id} className="product-card">
              <div className="product-image-wrapper">
                <img
                  src={prod.image || "https://via.placeholder.com/300x300?text=Product"}
                  alt={prod.name}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/300x300?text=Product"; }}
                  className="product-image"
                />
                <div className="product-actions">
                  <FaHeart
                    className="product-heart"
                    onClick={(e) => e.currentTarget.classList.toggle('liked')}
                  />
                </div>
              </div>
              <div className="product-info">
                <div className="info-top">
                  <h4>{prod.name}</h4>
                  <div className="rating">
                    <div className="rating-stars">
                      {Array.from({ length: 4 }, (_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <span className="reviews">(120)</span>
                  </div>
                </div>
                <div className="price-cart-row">
                  <div className="price-block">
                    {prod.originalPrice && (
                      <span className="original-price">
                        {prod.originalPrice.toLocaleString()}đ
                      </span>
                    )}
                    <span className="product-price">
                      {prod.price.toLocaleString()}đ
                    </span>
                  </div>
                  <button className="add-to-cart">
                    <FaShoppingCart className="cart-icon" /> Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          )) : <p>Không có sản phẩm nào.</p>}
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