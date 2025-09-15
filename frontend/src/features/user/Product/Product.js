// frontend/src/features/user/Product/Product.js
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import './Product.css';
import { FaHeart, FaStar, FaShoppingCart } from "react-icons/fa";
import { useAuth } from '../../../context/AuthContext';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [genders, setGenders] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    gender: '',
    size: '',
    color: '',
    brand: '',
    priceRange: '',
    sort: '',
  });

  // Wishlist map productId -> wishlistId
  const [wishlistMap, setWishlistMap] = useState({});
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse, gendersResponse, sizesResponse, colorsResponse, brandsResponse] = await Promise.all([
          api.get('products/', { params: transformFilters(filters) }),
          api.get('categories/'),
          api.get('genders/'),
          api.get('sizes/'),
          api.get('colors/'),
          api.get('brands/'),
        ]);
        const prodData = Array.isArray(productsResponse.data) ? productsResponse.data : (productsResponse.data.results || []);
        const catData = Array.isArray(categoriesResponse.data) ? categoriesResponse.data : (categoriesResponse.data.results || []);
        const genData = Array.isArray(gendersResponse.data) ? gendersResponse.data : (gendersResponse.data.results || []);
        const sizeData = Array.isArray(sizesResponse.data) ? sizesResponse.data : (sizesResponse.data.results || []);
        const colorData = Array.isArray(colorsResponse.data) ? colorsResponse.data : (colorsResponse.data.results || []);
        const brandData = Array.isArray(brandsResponse.data) ? brandsResponse.data : (brandsResponse.data.results || []);
        setProducts(prodData);
        setCategories(catData);
        setGenders(genData);
        setSizes(sizeData);
        setColors(colorData);
        setBrands(brandData);
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        console.error('API Error:', err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

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
      } catch {
        // ignore if unauth
      }
    };
    if (isLoggedIn) fetchWishlist();
  }, [isLoggedIn]);

  const transformFilters = (filters) => {
    const transformed = { ...filters };
    if (transformed.priceRange) {
      const [min, max] = transformed.priceRange.split('-');
      if (min && max === '+') {
        transformed.price__gte = parseInt(min);
      } else if (min && max) {
        transformed.price__gte = parseInt(min);
        transformed.price__lte = parseInt(max);
      } else if (min) {
        transformed.price__lte = parseInt(min);
      }
      delete transformed.priceRange;
    }
    if (transformed.size) transformed.sizes__value = transformed.size;
    if (transformed.color) transformed.colors__value = transformed.color;
    if (transformed.category) transformed.category__name = transformed.category;
    if (transformed.gender) transformed.gender__name = transformed.gender;
    if (transformed.brand) transformed.brand__name = transformed.brand;
    if (transformed.sort !== undefined) {
      let ordering;
      switch (transformed.sort) {
        case '': ordering = '-sales_count'; break;
        case 'price-asc': ordering = 'price'; break;
        case 'price-desc': ordering = '-price'; break;
        case 'newest': ordering = '-created_at'; break;
        default: ordering = undefined;
      }
      if (ordering) transformed.ordering = ordering;
      delete transformed.sort;
    }
    Object.keys(transformed).forEach(key => {
      if (transformed[key] === '' || transformed[key] === undefined) delete transformed[key];
    });
    return transformed;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === prev[name] ? '' : value,
    }));
  };

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

  const handleHeartClick = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) return navigate('/login');
    const userId = getCurrentUserId();
    if (!userId) return navigate('/login');

    try {
      const existingId = wishlistMap[product.id];
      if (existingId) {
        await api.delete(`wishlists/${existingId}/`);
        setWishlistMap(prev => {
          const next = { ...prev };
          delete next[product.id];
          return next;
        });
      } else {
        const created = await api.post('wishlists/', { user: userId, product: product.id });
        const newId = created?.data?.id;
        setWishlistMap(prev => ({ ...prev, [product.id]: newId }));
      }
    } catch (err) {
      console.error('Toggle wishlist failed:', err);
      if (err?.response?.status === 401) navigate('/login');
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-page">
      <div className="page-top">
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

      <div className="product-container">
        <div className="sidebar">
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
                {gender.name}
              </label>
              ))}
            </div>
          </div>

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
                { value: "0-999999", label: "Dưới 1.000.000đ" },
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
              {brands.map((brand) => (
                <label
                  key={brand.id}
                  className={filters.brand === brand.name ? "active" : ""}
                >
                  <input
                    type="radio"
                    name="brand"
                    value={brand.name}
                    onChange={handleFilterChange}
                    checked={filters.brand === brand.name}
                  />
                  {brand.name}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="sort-control">
            <label htmlFor="sort">Sắp xếp:</label>
            <div className="custom-select">
              <select id="sort" value={filters.sort} onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}>
                <option value="">Phổ biến</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="newest">Mới nhất</option>
              </select>
              <span className="arrow">▼</span>
            </div>
          </div>

          <div className="products-grid-container">
            {products.map((product) => (
              <div key={product.id} className="product-card-container">
                <Link to={`/product/${product.id}`} className="product-link-container">
                  <div className="product-image-container">
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0].image : "https://via.placeholder.com/300x300?text=Product"}
                      alt={product.name}
                      onError={(e) => { e.target.src = "https://via.placeholder.com/300x300?text=Product"; }}
                    />
                    <button
                      className={`product-heart ${wishlistMap[product.id] ? 'liked' : ''}`}
                      onClick={(e) => handleHeartClick(e, product)}
                      aria-label="Like"
                    >
                      <FaHeart />
                    </button>
                  </div>

                  <div className="product-info-container">
                    <h3 className="product-name-container">{product.name}</h3>
                    <div className="product-rating-container">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < (product.rating || 0) ? "star filled" : "star"} />
                      ))}
                      <span className="review-count-container">({product.reviews || 0})</span>
                    </div>

                    <div className="product-price-and-meta">
                      <div className="product-price-container">
                        <span className="current-price-container">{Number(product.price).toLocaleString('vi-VN')}đ</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="original-price-container">{Number(product.originalPrice).toLocaleString('vi-VN')}đ</span>
                        )}
                      </div>
                      <div className="product-sales-info">
                        Đã bán {Number(product?.sales_count ?? 0).toLocaleString('vi-VN')}
                      </div>
                    </div>
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