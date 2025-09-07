import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const mockProduct = {
    id: 1,
    name: "Sneaker Da Trắng Premium Limited Edition",
    description: "Giày sneaker cao cấp với chất liệu da thật 100%, thiết kế hiện đại và thoải mái. Phù hợp cho mọi hoạt động hàng ngày và thể thao nhẹ.",
    price: 2490000,
    originalPrice: 3100000,
    discount: 20,
    rating: 4.8,
    reviews: 124,
    images: [
      "/assets/images/products/giày.jpg",
      "/assets/images/products/giày.jpg",
      "/assets/images/products/giày.jpg",
      "/assets/images/products/giày.jpg"
    ],
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    colors: [
      { name: "Trắng", code: "#FFFFFF", available: true },
      { name: "Đen", code: "#000000", available: true },
      { name: "Xám", code: "#808080", available: false },
      { name: "Navy", code: "#000080", available: true }
    ],
    features: [
      "Chất liệu da cao cấp",
      "Đế cao su chống trượt",
      "Lót giày êm ái",
      "Thiết kế thời trang"
    ],
    specifications: {
      material: "Da thật + Canvas",
      sole: "Cao su tự nhiên",
      weight: "450g",
      origin: "Việt Nam"
    },
    inStock: 50,
    category: "Sneaker"
  };

  const relatedProducts = [
    {
      id: 2,
      name: "Oxford Da Đen",
      price: 3990000,
      image: "/assets/images/products/giày.jpg",
      rating: 4.9
    },
    {
      id: 3,
      name: "Sandal Da Nâu",
      price: 1290000,
      image: "/assets/images/products/giày.jpg",
      rating: 4.5
    },
    {
      id: 4,
      name: "Boots Da Cao",
      price: 4200000,
      image: "/assets/images/products/giày.jpg",
      rating: 4.7
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setProduct(mockProduct);
      setSelectedColor(mockProduct.colors[0].name);
      setLoading(false);
    }, 1000);
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
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    };
    
    console.log('Added to cart:', cartItem);
    alert('Đã thêm sản phẩm vào giỏ hàng!');
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
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

  if (!product) {
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
                src={product.images[activeImage]} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = '/assets/images/products/placeholder-product.jpg';
                }}
              />
              {product.discount > 0 && (
                <div className="prod-discount-badge">-{product.discount}%</div>
              )}
            </div>
            <div className="prod-image-thumbnails">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`prod-thumbnail ${index === activeImage ? 'prod-active' : ''}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="prod-product-info">
            <h1>{product.name}</h1>
            
            <div className="prod-product-rating">
              {renderStars(product.rating)}
              <span className="prod-rating-text">
                {product.rating} ({product.reviews} đánh giá)
              </span>
            </div>

            <div className="prod-product-price">
              <span className="prod-current-price">
                {product.price.toLocaleString()}đ
              </span>
              {product.originalPrice > product.price && (
                <span className="prod-original-price">
                  {product.originalPrice.toLocaleString()}đ
                </span>
              )}
            </div>

            <p className="prod-product-description">
              {product.description}
            </p>

            <div className="prod-size-selection">
              <h4>Kích cỡ</h4>
              <div className="prod-size-options">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`prod-size-btn ${selectedSize === size ? 'prod-selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="prod-color-selection">
              <h4>Màu sắc: {selectedColor}</h4>
              <div className="prod-color-options">
                {product.colors.map(color => (
                  <button
                    key={color.name}
                    className={`prod-color-btn ${selectedColor === color.name ? 'prod-selected' : ''} ${!color.available ? 'prod-disabled' : ''}`}
                    onClick={() => color.available && setSelectedColor(color.name)}
                    disabled={!color.available}
                    style={{ backgroundColor: color.code }}
                    title={color.name}
                  >
                    {selectedColor === color.name && (
                      <span className="prod-checkmark">✓</span>
                    )}
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
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <FaPlus />
                </button>
              </div>
              <span className="prod-stock-info">
                Còn {product.inStock} sản phẩm
              </span>
            </div>

            <div className="prod-action-buttons">
              <button className="prod-add-to-cart-btn" onClick={handleAddToCart}>
                <FaShoppingCart />
                Thêm vào giỏ hàng
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
                {product.features.map((feature, index) => (
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
                <img src={relatedProduct.image} alt={relatedProduct.name} />
                <h4>{relatedProduct.name}</h4>
                <div className="prod-related-rating">
                  {renderStars(relatedProduct.rating)}
                </div>
                <p className="prod-related-price">
                  {relatedProduct.price.toLocaleString()}đ
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