import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import './Product.css';
import { FaHeart, FaStar, FaShoppingCart } from "react-icons/fa"; 

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [genders, setGenders] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    gender: '',
    size: '',
    color: '',
    brand: '',
    priceRange: '',
    isOnSale: '',
  });
  const [likedProducts, setLikedProducts] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse, gendersResponse, sizesResponse, colorsResponse] = await Promise.all([
          api.get('products/', { params: transformFilters(filters) }),
          api.get('categories/'),
          api.get('genders/'),
          api.get('sizes/'),
          api.get('colors/'),
        ]);
        setProducts(productsResponse.data.results || []);
        setCategories(categoriesResponse.data.results || []);
        setGenders(gendersResponse.data.results || []);
        setSizes(sizesResponse.data.results || []);
        setColors(colorsResponse.data.results || []);
        console.log('Products:', productsResponse.data.results); // Debug
        console.log('Filters applied:', transformFilters(filters)); // Debug
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        console.error('API Error:', err.response ? err.response.data : err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  // Chuyển đổi filters để khớp với backend
  const transformFilters = (filters) => {
    const transformed = { ...filters };
    if (transformed.priceRange) {
      const [min, max] = transformed.priceRange.split('-');
      if (min && max === '+') {
        transformed.price__gte = parseInt(min) * 1000; // Chuyển sang VND
      } else if (min && max) {
        transformed.price__gte = parseInt(min) * 1000;
        transformed.price__lte = parseInt(max) * 1000;
      } else if (min) {
        transformed.price__lte = parseInt(min) * 1000;
      }
      delete transformed.priceRange;
    }
    if (transformed.size) transformed.sizes__value = transformed.size;
    if (transformed.color) transformed.colors__value = transformed.color;
    // Đảm bảo category, gender, brand được truyền đúng
    transformed.category__name = transformed.category || undefined;
    transformed.gender__name = transformed.gender || undefined;
    transformed.brand__name = transformed.brand || undefined;
    return transformed;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === prev[name] ? '' : value, // Reset nếu chọn lại giá trị cũ
    }));
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
            <p>Khám phá bộ sưu tập giày cao cấp: sneaker, oxford, cao gót, sandal và nhiều lựa chọn khác.</p>
          </div>
        </div>
      </div>

      <div className="product-container">
        {/* Sidebar Filters */}
        <div className="sidebar">
          {/* Loại sản phẩm (Category) */}
          <div className="filter-section">
            <h3>Loại sản phẩm</h3>
            <div className="filter-options">
              <label className={filters.category === '' ? "active" : ""}>
                <input
                  type="radio"
                  name="category"
                  value=""
                  onChange={handleFilterChange}
                  checked={filters.category === ''}
                />
                Tất cả
              </label>
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className={filters.category === cat.name ? "active" : ""}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.name}
                    onChange={handleFilterChange}
                    checked={filters.category === cat.name}
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>

          {/* Giới tính */}
          <div className="filter-section">
            <h3>Giới tính</h3>
            <div className="filter-options">
              <label className={filters.gender === '' ? "active" : ""}>
                <input
                  type="radio"
                  name="gender"
                  value=""
                  onChange={handleFilterChange}
                  checked={filters.gender === ''}
                />
                Tất cả
              </label>
              {genders.map((gender) => (
                <label
                  key={gender.id}
                  className={filters.gender === gender.name ? "active" : ""}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={gender.name}
                    onChange={handleFilterChange}
                    checked={filters.gender === gender.name}
                  />
                  {gender.name === 'nam' ? 'Nam' : 'Nữ'}
                </label>
              ))}
            </div>
          </div>

          {/* Kích cỡ */}
          <div className="filter-section">
            <h3>Kích cỡ</h3>
            <div className="size-grid">
              {sizes.map((size) => (
                <button
                  key={size.id}
                  className={`size-btn ${filters.size === size.value ? "active" : ""}`}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      size: prev.size === size.value ? "" : size.value,
                    }))
                  }
                >
                  {size.value}
                </button>
              ))}
            </div>
          </div>

          {/* Màu sắc */}
          <div className="filter-section">
            <h3>Màu sắc</h3>
            <div className="color-options">
              <label className={filters.color === '' ? "active" : ""}>
                <input
                  type="radio"
                  name="color"
                  value=""
                  onChange={handleFilterChange}
                  checked={filters.color === ''}
                />
                Tất cả
              </label>
              {colors.map((color) => (
                <label
                  key={color.id}
                  className={filters.color === color.value ? "active" : ""}
                >
                  <input
                    type="radio"
                    name="color"
                    value={color.value}
                    onChange={handleFilterChange}
                    checked={filters.color === color.value}
                  />
                  {color.value}
                </label>
              ))}
            </div>
          </div>

          {/* Khoảng giá */}
          <div className="filter-section">
            <h3>Khoảng giá</h3>
            <div className="price-range">
              <label className={filters.priceRange === '' ? "active" : ""}>
                <input
                  type="radio"
                  name="priceRange"
                  value=""
                  onChange={handleFilterChange}
                  checked={filters.priceRange === ''}
                />
                Tất cả
              </label>
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

          {/* Thương hiệu */}
          <div className="filter-section">
            <h3>Thương hiệu</h3>
            <div className="filter-options">
              <label className={filters.brand === '' ? "active" : ""}>
                <input
                  type="radio"
                  name="brand"
                  value=""
                  onChange={handleFilterChange}
                  checked={filters.brand === ''}
                />
                Tất cả
              </label>
              {["Nike", "Adidas", "Crocs", "Puma", "Converse", "Vans"].map((brand) => (
                <label
                  key={brand}
                  className={filters.brand === brand ? "active" : ""}
                >
                  <input
                    type="radio"
                    name="brand"
                    value={brand}
                    onChange={handleFilterChange}
                    checked={filters.brand === brand}
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>

          {/* Khuyến mãi */}
          <div className="filter-section">
            <h3>Khuyến mãi</h3>
            <div className="filter-options">
              <label className={filters.isOnSale === '' ? "active" : ""}>
                <input
                  type="radio"
                  name="isOnSale"
                  value=""
                  onChange={handleFilterChange}
                  checked={filters.isOnSale === ''}
                />
                Tất cả
              </label>
              {["true", "false"].map((sale) => (
                <label
                  key={sale}
                  className={filters.isOnSale === sale ? "active" : ""}
                >
                  <input
                    type="radio"
                    name="isOnSale"
                    value={sale}
                    onChange={handleFilterChange}
                    checked={filters.isOnSale === sale}
                  />
                  {sale === "true" ? "Có khuyến mãi" : "Không khuyến mãi"}
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
              <select id="sort" onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}>
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