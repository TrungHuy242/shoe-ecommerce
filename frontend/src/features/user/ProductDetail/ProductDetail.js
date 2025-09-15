import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../services/api';
import { 
  FaHeart, 
  FaShoppingCart, 
  FaStar, 
  FaShare,
  FaTruck,
  FaShieldAlt,
  FaExchangeAlt,
  FaMinus,
  FaPlus,
  FaChevronRight
} from 'react-icons/fa';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [sizes, setSizes] = useState([]); // Danh sách kích cỡ từ API
  const [colors, setColors] = useState([]); // Danh sách màu sắc từ API
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        // Fetch product, sizes, and colors concurrently
        const [productResponse, sizesResponse, colorsResponse] = await Promise.all([
          api.get(`products/${id}/`),
          api.get('/sizes/'),
          api.get('/colors/'),
        ]);

        const productData = productResponse.data;
        const sizesData = sizesResponse.data?.results || [];
        const colorsData = colorsResponse.data?.results || [];

        // Map product sizes and colors IDs to their full objects
        const productSizes = sizesData.filter(size => 
          (productData.sizes || []).includes(size.id)
        );
        const productColors = colorsData.filter(color => 
          (productData.colors || []).includes(color.id)
        );

        // Update product data with full sizes and colors
        setProduct({
          ...productData,
          sizes: productSizes,
          colors: productColors,
        });

        // Set default selected color
        setSelectedColor(productColors[0]?.value || '');

        // Fetch related products
        const relatedResponse = await api.get('products/', { 
          params: { category__name: productData.category?.name, exclude: id } 
        });
        setRelatedProducts(relatedResponse.data.results.slice(0, 3) || []);

        // Store sizes and colors for reference
        setSizes(sizesData);
        setColors(colorsData);

        console.log('Product data:', productData);
        console.log('Product sizes:', productSizes);
        console.log('Product colors:', productColors);
      } catch (err) {
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        console.error('API Error:', err.response ? err.response.data : err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Vui lòng chọn size!');
      return;
    }
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 
        ? product.images[0].image 
        : '/assets/images/products/placeholder-product.jpg',
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    };
    
    console.log('Added to cart:', cartItem);
    alert('Đã thêm sản phẩm vào giỏ hàng!');
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    
    return (
      <div className="prod-stars">
        {[...Array(5)].map((_, i) => (
          <FaStar 
            key={i} 
            className={i < fullStars ? 'prod-star prod-filled' : 'prod-star'} 
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="prod-product-detail-page">
        <div className="prod-loading-container">
          <div className="prod-spinner-large"></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="prod-product-detail-page">
        <div className="prod-error-container">
          <h2>Không tìm thấy sản phẩm</h2>
          <Link to="/products" className="prod-back-to-products">
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="prod-product-detail-page">
      <div className="prod-product-detail-container">
        <div className="prod-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <FaChevronRight />
          <Link to="/products">Sản phẩm</Link>
          <FaChevronRight />
          <span>{product.name}</span>
        </div>

        <div className="prod-product-detail-content">
          <div className="prod-product-images">
            <div className="prod-main-image">
              <img 
                src={product.images && product.images.length > 0 
                  ? product.images[0].image 
                  : '/assets/images/products/placeholder-product.jpg'} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = '/assets/images/products/placeholder-product.jpg';
                }}
              />
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="prod-discount-badge">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </div>
              )}
            </div>
          </div>

          <div className="prod-product-info">
            <h1>{product.name}</h1>
            
            <div className="prod-product-rating">
              {renderStars(product.rating)}
              <span className="prod-rating-text">
                {product.rating || 0} ({product.reviews || 0} đánh giá)
              </span>
            </div>

            <div className="prod-product-price">
              <span className="prod-current-price">
                {product.price.toLocaleString('vi-VN')}đ
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="prod-original-price">
                  {product.originalPrice.toLocaleString('vi-VN')}đ
                </span>
              )}
            </div>

            <p className="prod-product-description">
              {product.description}
            </p>

            <div className="prod-size-selection">
              <h4>Kích cỡ</h4>
              <div className="prod-size-options">
                {(product.sizes || []).map(size => (
                  <button
                    key={size.id}
                    className={`prod-size-btn ${selectedSize === size.value ? 'prod-selected' : ''}`}
                    onClick={() => setSelectedSize(size.value)}
                  >
                    {size.value}
                  </button>
                ))}
              </div>
            </div>

            <div className="prod-color-selection">
              <h4>Màu sắc</h4>
              <div className="prod-color-options">
                {(product.colors || []).map(color => (
                  <button
                    key={color.id}
                    className={`prod-color-btn ${selectedColor === color.value ? 'prod-selected' : ''}`}
                    onClick={() => setSelectedColor(color.value)}
                  >
                    <span className="prod-color-text">{color.value}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="prod-quantity-selection">
              <h4>Số lượng</h4>
              <div className="prod-quantity-controls">
                <button 
                  className="prod-qty-btn"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <FaMinus />
                </button>
                <span className="prod-quantity-display">{quantity}</span>
                <button 
                  className="prod-qty-btn"
                  onClick={() => quantity < product.stock_quantity && setQuantity(quantity + 1)}
                  disabled={quantity >= product.stock_quantity}
                >
                  <FaPlus />
                </button>
              </div>
              <span className="prod-stock-info">
                Còn {product.stock_quantity} sản phẩm
              </span>
            </div>

            <div className="prod-action-buttons">
              <button className="prod-add-to-cart-btn" onClick={handleAddToCart}>
                <FaShoppingCart />
              </button>
              <button className="prod-buy-now-btn" onClick={handleAddToCart}>
                Mua Ngay
              </button>
              <button 
                className={`prod-wishlist-btn ${isLiked ? 'prod-liked' : ''}`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <FaHeart />
              </button>
              <button className="prod-share-btn">
                <FaShare />
              </button>
            </div>

            <div className="prod-product-features">
              <div className="prod-feature">
                <FaTruck className="prod-feature-icon" />
                <div>
                  <h5>Miễn phí vận chuyển</h5>
                  <p>Đơn hàng từ 500.000đ</p>
                </div>
              </div>
              <div className="prod-feature">
                <FaShieldAlt className="prod-feature-icon" />
                <div>
                  <h5>Bảo hành 1 năm</h5>
                  <p>Chính hãng 100%</p>
                </div>
              </div>
              <div className="prod-feature">
                <FaExchangeAlt className="prod-feature-icon" />
                <div>
                  <h5>Đổi trả 30 ngày</h5>
                  <p>Miễn phí đổi size</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="prod-product-details-section">
          <div className="prod-details-tabs">
            <button className="prod-tab-btn prod-active">Mô tả</button>
            <button className="prod-tab-btn">Thông số</button>
            <button className="prod-tab-btn">Đánh giá</button>
          </div>
          
          <div className="prod-tab-content">
            <div className="prod-description-tab">
              <h3>Mô tả chi tiết</h3>
              <p>{product.description}</p>
              
              <h4>Đặc điểm nổi bật:</h4>
              <ul>
                {(product.features || []).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="prod-related-products">
          <h3>Sản phẩm liên quan</h3>
          <div className="prod-related-grid">
            {relatedProducts.map(relatedProduct => (
              <Link 
                key={relatedProduct.id} 
                to={`/product/${relatedProduct.id}`}
                className="prod-related-product-card"
              >
                <img 
                  src={relatedProduct.images && relatedProduct.images.length > 0 
                    ? relatedProduct.images[0].image 
                    : '/assets/images/products/placeholder-product.jpg'} 
                  alt={relatedProduct.name} 
                />
                <h4>{relatedProduct.name}</h4>
                <div className="prod-related-rating">
                  {renderStars(relatedProduct.rating)}
                </div>
                <p className="prod-related-price">
                  {relatedProduct.price.toLocaleString('vi-VN')}đ
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;