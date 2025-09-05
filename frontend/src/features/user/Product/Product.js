import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import './Product.css';

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

  // Mock data for development (remove when API is ready)
  const mockProducts = [
    {
      id: 1,
      name: "Sneaker Da Trắng",
      price: 2490000,
      originalPrice: 3100000,
      image: "/assets/images/products/giày.jpg",
      rating: 5,
      reviews: 124,
      isOnSale: false
    },
    {
      id: 2,
      name: "Cao Gót Nude",
      price: 2890000,
      originalPrice: 3200000,
      image: "/assets/images/products/giày.jpg",
      rating: 4,
      reviews: 178,
      isOnSale: false
    },
    {
      id: 3,
      name: "Oxford Da Đen",
      price: 3990000,
      originalPrice: 4500000,
      image: "/assets/images/products/giày.jpg",
      rating: 5,
      reviews: 89,
      isOnSale: false
    },
    {
      id: 4,
      name: "Sandal Da Tối Giản",
      price: 1290000,
      originalPrice: 1650000,
      image: "/assets/images/products/giày.jpg",
      rating: 4,
      reviews: 43,
      isOnSale: false
    },
    {
      id: 5,
      name: "Sneaker Nữ Trắng",
      price: 2190000,
      originalPrice: 2500000,
      image: "/assets/images/products/giày.jpg",
      rating: 5,
      reviews: 94,
      isOnSale: false
    },
    {
      id: 6,
      name: "Boots Da Đen",
      price: 3290000,
      originalPrice: 3700000,
      image: "/assets/images/products/giày.jpg",
      rating: 4,
      reviews: 57,
      isOnSale: false
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Uncomment when API is ready
        // const response = await api.get('products/', { params: filters });
        // setProducts(response.data.results || []);
        
        // Using mock data for now
        setProducts(mockProducts);
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
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span> &gt; </span>
        <span>Sản phẩm</span>
      </div>

      {/* Page Title */}
      <div className="page-header">
        <h1>Tất cả sản phẩm</h1>
        <p>Khám phá bộ sưu tập giày cao cấp: sneaker, oxford, cao gót, sandal và nhiều lựa chọn khác.</p>
      </div>

      <div className="product-container">
        {/* Sidebar Filters */}
        <div className="sidebar">
          <div className="filter-section">
            <h3>Danh mục</h3>
            <div className="filter-options">
              <label><input type="radio" name="category" value="" onChange={handleFilterChange} checked={filters.category === ''} /> Tất cả</label>
              <label><input type="radio" name="category" value="Sneaker" onChange={handleFilterChange} /> Sneaker</label>
              <label><input type="radio" name="category" value="Oxford" onChange={handleFilterChange} /> Oxford</label>
              <label><input type="radio" name="category" value="Cao gót" onChange={handleFilterChange} /> Cao gót</label>
              <label><input type="radio" name="category" value="Sandal" onChange={handleFilterChange} /> Sandal</label>
              <label><input type="radio" name="category" value="Boots" onChange={handleFilterChange} /> Boots</label>
            </div>
          </div>

          <div className="filter-section">
            <h3>Kích cỡ</h3>
            <div className="size-grid">
              {['38', '39', '40', '41', '42', '43'].map(size => (
                <button 
                  key={size} 
                  className={`size-btn ${filters.size === size ? 'active' : ''}`}
                  onClick={() => setFilters(prev => ({ ...prev, size: prev.size === size ? '' : size }))}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Màu sắc</h3>
            <div className="color-options">
              <label><input type="checkbox" name="color" value="Đen" /> Đen</label>
              <label><input type="checkbox" name="color" value="Trắng" /> Trắng</label>
              <label><input type="checkbox" name="color" value="Be" /> Be</label>
              <label><input type="checkbox" name="color" value="Nâu" /> Nâu</label>
              <label><input type="checkbox" name="color" value="Xám" /> Xám</label>
            </div>
          </div>

          <div className="filter-section">
            <h3>Khoảng giá</h3>
            <div className="price-range">
              <label>
                <input 
                  type="radio" 
                  name="priceRange" 
                  value="0-1000000" 
                  onChange={handleFilterChange}
                />
                Dưới 1.000.000đ
              </label>
              <label>
                <input 
                  type="radio" 
                  name="priceRange" 
                  value="1000000-5000000" 
                  onChange={handleFilterChange}
                />
                1.000.000đ - 5.000.000đ
              </label>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Top Controls */}
          <div className="top-controls">
            <div className="filter-tags">
              <button className="filter-tag active">🔥 Bộ lọc</button>
              <button className="filter-tag">⚡ Nhanh về</button>
              <button className="filter-tag">🎯 Flash Sale</button>
            </div>
            <div className="sort-control">
              <label>Sắp xếp: </label>
              <select>
                <option value="">Phổ biến</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>
          </div>

          {/* Sale Banner */}
          <div className="sale-banner">
            <span>Ưu đãi tuần này</span>
            <h3>Mua 2 giảm thêm 10% • Freeship toàn quốc</h3>
            <button className="sale-btn">Mua ngay</button>
          </div>

          {/* Products Grid */}
          <div className="products-grid-container">
            {products.map((product) => (
              <div key={product.id} className="product-card-container">
                <Link to={`/product/${product.id}`} className="product-link-container">
                  <div className="product-image-container">
                    <img
                      src="/assets/images/products/giày.jpg"
                      alt={product.name}
                      onError={(e) => { e.target.src = '/assets/images/products/placeholder-product.jpg'; }}
                    />
                    <button 
                      className={`like-btn ${likedProducts.has(product.id) ? 'liked' : ''}`}
                      onClick={(e) => toggleLike(product.id, e)}
                    >
                      ♥
                    </button>
                  </div>
                  
                  <div className="product-info-container">
                    <h3 className="product-name-container">{product.name}</h3>
                    <div className="product-rating-container">
                      {renderStars(product.rating)}
                      <span className="review-count-container">({product.reviews})</span>
                    </div>
                    <div className="product-price-container">
                      <span className="current-price-container">{product.price.toLocaleString()}đ</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="original-price-container">{product.originalPrice.toLocaleString()}đ</span>
                      )}
                    </div>
                    <button className="add-to-cart-btn-container">Thêm vào giỏ</button>
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