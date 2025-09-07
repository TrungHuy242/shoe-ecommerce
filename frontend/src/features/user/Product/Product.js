import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import './Product.css';
import { FaHeart, FaStar, FaShoppingCart } from "react-icons/fa"; 

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: '',
    category: '',
    size: '',
    color: '',
    brand: '',
  });
  const [likedProducts, setLikedProducts] = useState(new Set());

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Gửi bộ lọc qua query parameters
        const response = await api.get('products/', { params: filters });
        setProducts(response.data.results || []);
      } catch (err) {
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const toggleLike = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        ⭐
      </span>
    ));
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-page">
      {/* Header Section */}
      <div className="page-top">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <span>Sản phẩm</span>
          </div>

          <div className="page-header">
            <h1>Tất cả sản phẩm</h1>
            <p>
              Khám phá bộ sưu tập giày cao cấp: sneaker, oxford, cao gót, sandal và
              nhiều lựa chọn khác.
            </p>
          </div>
        </div>
      </div>

      <div className="product-container">
        {/* Sidebar Filters */}
        <div className="sidebar">
          {/* Danh mục */}
          <div className="filter-section">
            <h3>Danh mục</h3>
            <div className="filter-options">
              {["", "Sneaker", "Oxford", "Cao gót", "Sandal", "Boots"].map((cat) => (
                <label
                  key={cat}
                  className={filters.category === cat ? "active" : ""}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    onChange={handleFilterChange}
                    checked={filters.category === cat}
                  />
                  {cat === "" ? "Tất cả" : cat}
                </label>
              ))}
            </div>
          </div>

          {/* Kích cỡ */}
          <div className="filter-section">
            <h3>Kích cỡ</h3>
            <div className="size-grid">
              {["38", "39", "40", "41", "42", "43"].map((size) => (
                <button
                  key={size}
                  className={`size-btn ${filters.size === size ? "active" : ""}`}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      size: prev.size === size ? "" : size,
                    }))
                  }
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Màu sắc */}
          <div className="filter-section">
            <h3>Màu sắc</h3>
            <div className="color-options">
              {["Đen", "Trắng", "Be", "Nâu", "Xám"].map((color) => (
                <label
                  key={color}
                  className={filters.colors?.includes(color) ? "active" : ""}
                >
                  <input
                    type="checkbox"
                    name="color"
                    value={color}
                    checked={filters.colors?.includes(color)}
                    onChange={(e) => {
                      const { checked, value } = e.target;
                      setFilters((prev) => {
                        const colors = prev.colors || [];
                        return {
                          ...prev,
                          colors: checked
                            ? [...colors, value]
                            : colors.filter((c) => c !== value),
                        };
                      });
                    }}
                  />
                  {color}
                </label>
              ))}
            </div>
          </div>

          {/* Khoảng giá */}
          <div className="filter-section">
            <h3>Khoảng giá</h3>
            <div className="price-range">
              {[
                { value: "0-1000000", label: "Dưới 1.000.000đ" },
                { value: "1000000-2000000", label: "1.000.000 - 2.000.000đ" },
                { value: "2000000+", label: "Trên 2.000.000đ" },
              ].map((price) => (
                <label
                  key={price.value}
                  className={filters.priceRange === price.value ? "active" : ""}
                >
                  <input
                    type="radio"
                    name="priceRange"
                    value={price.value}
                    onChange={handleFilterChange}
                    checked={filters.priceRange === price.value}
                  />
                  {price.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Sort Control */}
          <div className="sort-control">
            <label htmlFor="sort">Sắp xếp:</label>
            <div className="custom-select">
              <select id="sort">
                <option value="">Phổ biến</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="newest">Mới nhất</option>
              </select>
              <span className="arrow">▼</span>
            </div>
          </div>
          {/* Products Grid */}
          <div className="products-grid-container">
            {products.map((product) => (
              <div key={product.id} className="product-card-container">
                <Link to={`/product/${product.id}`} className="product-link-container">
                  <div className="product-image-container">
                    <img
                      src={product.image || "https://via.placeholder.com/300x300?text=Product"}
                      alt={product.name}
                      onError={(e) => { e.target.src = "https://via.placeholder.com/300x300?text=Product"; }}
                    />
                    <button
                      className={`product-heart ${likedProducts.has(product.id) ? 'liked' : ''}`}
                      onClick={(e) => toggleLike(product.id, e)}
                      aria-label="Like"
                    >
                      <FaHeart />
                    </button>
                  </div>
                  <div className="product-info-container">
                    <h3 className="product-name-container">{product.name}</h3>
                    <div className="product-rating-container">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < product.rating ? "star filled" : "star"} />
                      ))}
                      <span className="review-count-container">({product.reviews})</span>
                    </div>
                    <div className="product-price-container">
                      <span className="current-price-container">{product.price.toLocaleString()}đ</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="original-price-container">{product.originalPrice.toLocaleString()}đ</span>
                      )}
                    </div>
                    <button className="add-to-cart-btn-container">
                      <FaShoppingCart /> Thêm vào giỏ
                    </button>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="no-products">
              <p>Không có sản phẩm nào.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;