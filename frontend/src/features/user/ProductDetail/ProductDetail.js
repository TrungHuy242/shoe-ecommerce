import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { useCart } from '../../../context/CartContext';
import { useNotification } from '../../../context/NotificationContext';
import { 
  FaHeart, 
  FaShoppingCart, 
  FaStar, 
  FaTruck,
  FaShieldAlt,
  FaExchangeAlt,
  FaMinus,
  FaPlus,
  FaChevronRight
} from 'react-icons/fa';
import Review from '../../../components/Review/Review';
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
  const [wishlistId, setWishlistId] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ addingToCart, setAddingToCart ] = useState(false);

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { success, error: showError } = useNotification();
  const vnd = new Intl.NumberFormat('vi-VN'); // format VND

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

        // Không tự chọn màu mặc định - để người dùng tự chọn
        setCurrentImageIndex(0);

        // Fetch related products
        // Fetch related products by category id and exclude current id
        const relatedResponse = await api.get('products/', { 
          params: { category: productData.category, exclude: id, page_size: 6 } 
        });
        const relatedList = Array.isArray(relatedResponse.data) ? relatedResponse.data : (relatedResponse.data.results || []);
        setRelatedProducts(relatedList.slice(0, 3));

        // Store sizes and colors for reference
        setSizes(sizesData);
        setColors(colorsData);

        await loadWishlistStatus(productData.id);

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

  useEffect(() => {
    fetchProductData();
  }, [id]);

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
  
  const loadWishlistStatus = async (productId) => {
    try {
      const userId = getCurrentUserId();
      if (!userId){
        setIsLiked(false);
        setWishlistId(null);
        return;
      }
      const res = await api.get('wishlists/');
      const list = Array.isArray(res.data) ? res.data : (res.data.results || []);
      const found = list.find(w => w.product === productId);
      setIsLiked(!!found);
      setWishlistId(found ? found.id : null);
    } catch (e) {
      console.error('Load wishlist status error:', e?.response?.data || e.message);
      setIsLiked(false);
      setWishlistId(null);
    }
  };

  const toggleWishlist = async () => {
    const userId = getCurrentUserId();
    if (!userId) {navigate('/login'); return;}
    try{
      if (!isLiked){
        const res = await api.post('wishlists/', { user: userId, product: product.id });
        setIsLiked(true);
        setWishlistId(res?.data?.id || null);
      } else if (wishlistId){
        await api.delete(`wishlists/${wishlistId}/`);
        setIsLiked(false);
        setWishlistId(null)
      } else {
      const res = await api.delete('wishlists/');
      const list = Array.isArray(res.data) ? res.data : (res.data.results || []);
      const found = list.find(w => w.product === product.id);
      if (found){
        await api.delete(`wishlists/${found.id}/`);
      }
      setIsLiked(false);
      setWishlistId(null);
      }
    } catch (e) {
      console.error('Toggle wishlist error:', e?.response?.data || e.message);
    }
  };

  const getOrCreateCartId = async () => {
    const cartsRes = await api.get('carts/');
    const carts = Array.isArray(cartsRes.data) ? cartsRes.data : (cartsRes.data.results || []);
    if (carts.length > 0) return carts[0].id;
    const userId = getCurrentUserId();
    const created = await api.post('carts/', { user: userId });
    return created.data.id;
  };

  const isProductInCart = async (productId) => {
    const itemsRes = await api.get('cart-items/');
    const items = Array.isArray(itemsRes.data) ? itemsRes.data : (itemsRes.data.results || []);
    return items.some(ci => ci.product === productId);
  };

  const handleAddToCart = async () => {
    // Chỉ validate size nếu sản phẩm có sizes
    if (product.sizes && product.sizes.length > 0 && !selectedSize) { 
      showError('Vui lòng chọn kích cỡ!'); 
      return; 
    }
    // Chỉ validate color nếu sản phẩm có colors
    if (product.colors && product.colors.length > 0 && !selectedColor) { 
      showError('Vui lòng chọn màu sắc!'); 
      return; 
    }
    
    // Kiểm tra hết hàng
    if (product.stock_quantity === 0) {
      showError('Sản phẩm đã hết hàng!');
      return;
    }

    const userId = getCurrentUserId();
    if (!userId) { navigate('/login'); return; }
    
    setAddingToCart(true);
    try {
      // Sử dụng addToCart từ CartContext thay vì gọi API trực tiếp
      const successResult = await addToCart(product.id, quantity);
      
      if (successResult) {
        // Lưu meta size/color vào localStorage theo cartItemId
        const metaRaw = localStorage.getItem('cart_item_meta');
        const meta = metaRaw ? JSON.parse(metaRaw) : {};
        meta[product.id] = { size: selectedSize, color: selectedColor };
        localStorage.setItem('cart_item_meta', JSON.stringify(meta));
        
        success('Đã thêm sản phẩm vào giỏ hàng!');
        console.log('Product added to cart successfully:', product.id, quantity);
      } else {
        showError('Không thể thêm sản phẩm. Vui lòng thử lại.');
      }
    } catch (e) {
      console.error('Add to cart error:', e?.response?.data || e.message);
      if (e?.response?.status === 401) navigate('/login');
      else showError('Không thể thêm sản phẩm. Vui lòng thử lại.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    // Chỉ validate size nếu sản phẩm có sizes
    if (product.sizes && product.sizes.length > 0 && !selectedSize) { 
      showError('Vui lòng chọn kích cỡ!'); 
      return; 
    }
    // Chỉ validate color nếu sản phẩm có colors
    if (product.colors && product.colors.length > 0 && !selectedColor) { 
      showError('Vui lòng chọn màu sắc!'); 
      return; 
    }
    
    // Kiểm tra hết hàng
    if (product.stock_quantity === 0) {
      showError('Sản phẩm đã hết hàng!');
      return;
    }

    const userId = getCurrentUserId();
    if (!userId) { navigate('/login'); return; }

    try {
      // Thêm sản phẩm vào giỏ hàng trước
      const successResult = await addToCart(product.id, quantity);
      
      if (successResult) {
        // Lưu meta size/color vào localStorage
        const metaRaw = localStorage.getItem('cart_item_meta');
        const meta = metaRaw ? JSON.parse(metaRaw) : {};
        meta[product.id] = { size: selectedSize, color: selectedColor };
        localStorage.setItem('cart_item_meta', JSON.stringify(meta));
        
        // Lưu thông tin sản phẩm "mua ngay" để trang Cart biết cần chọn sản phẩm nào
        localStorage.setItem('buy_now_product', JSON.stringify({
          productId: product.id,
          timestamp: Date.now()
        }));
        
        success('Đã thêm sản phẩm vào giỏ hàng!');
        // Chuyển đến trang giỏ hàng
        navigate('/cart');
      } else {
        showError('Không thể thêm sản phẩm. Vui lòng thử lại.');
      }
    } catch (e) {
      console.error('Buy now error:', e?.response?.data || e.message);
      if (e?.response?.status === 401) navigate('/login');
      else showError('Không thể thực hiện mua ngay. Vui lòng thử lại.');
    }
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
              src={
                product.images && product.images.length > 0 
                  ? (product.images[currentImageIndex]?.image || product.images[0].image)
                  : '/assets/images/products/placeholder-product.jpg'
              } 
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

          {/* Thumbnails ảnh nhỏ mờ */}
          <div className="prod-thumbnails">
            {(product.images || []).map((img, idx) => (
              <button
                key={idx}
                className={`prod-thumb ${idx === currentImageIndex ? 'prod-thumb-active' : ''}`}
                onClick={() => setCurrentImageIndex(idx)}
                aria-label={`Ảnh ${idx + 1}`}
              >
                <img src={img.image} alt={`thumb-${idx}`} />
              </button>
            ))}
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
                {vnd.format(product.price)}đ
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="prod-original-price">
                  {vnd.format(product.originalPrice)}đ
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
              {product.stock_quantity === 0 ? (
                <button className="prod-add-to-cart-btn prod-out-of-stock" disabled>
                  <FaShoppingCart />
                  Hết hàng
                </button>
              ) : (
                <>
                  <button className="prod-add-to-cart-btn" onClick={handleAddToCart} disabled={addingToCart}>
                    <FaShoppingCart />
                    {addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                  </button>
                  <button className="prod-buy-now-btn" onClick={handleBuyNow} disabled={addingToCart}>
                    Mua Ngay
                  </button>
                </>
              )}
              <button 
                className={`prod-wishlist-btn ${isLiked ? 'prod-liked' : ''}`}
                onClick={toggleWishlist}
                aria-pressed={isLiked}
                title={isLiked ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
              >
                <FaHeart />
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
                  {vnd.format(relatedProduct.price)}đ
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Review Section */}
      <Review productId={id} onReviewAdded={() => {
        // Refresh product data to update rating
        fetchProductData();
      }} />
    </div>
  );
};

export default ProductDetail;