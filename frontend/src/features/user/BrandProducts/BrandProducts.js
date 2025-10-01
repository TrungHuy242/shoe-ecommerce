import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaHeart, FaStar, FaShoppingCart } from 'react-icons/fa';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import './BrandProducts.css';

const BrandProducts = () => {
  const { brandName } = useParams();
  const [products, setProducts] = useState([]);
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistMap, setWishlistMap] = useState({});
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchBrandProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch brand info
        const brandsRes = await api.get('brands/');
        const brands = Array.isArray(brandsRes.data) ? brandsRes.data : (brandsRes.data.results || []);
        const currentBrand = brands.find(b => b.name.toLowerCase() === brandName.toLowerCase());
        setBrand(currentBrand);

        // Fetch products by brand
        const productsRes = await api.get('products/', {
          params: { brand__name: brandName }
        });
        const prodData = Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data.results || []);
        setProducts(prodData);
      } catch (err) {
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandProducts();
  }, [brandName]);

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

  if (loading) return <div className="loading-text">Đang tải sản phẩm...</div>;
  if (error) return <div className="error-text">{error}</div>;

  return (
    <div className="brand-products-page">
      <div className="brand-header">
        <div className="brand-header-content">
          <div className="breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span></span>
            <span>Thương hiệu {brand?.name || brandName}</span>
          </div>
          <h1>Sản phẩm {brand?.name || brandName}</h1>
          <p>Khám phá bộ sưu tập {brand?.name || brandName} với {products.length} sản phẩm</p>
        </div>
      </div>

      <div className="brand-products-container">
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
            <p>Thương hiệu này hiện chưa có sản phẩm.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandProducts;