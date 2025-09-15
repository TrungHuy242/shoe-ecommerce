import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHeart, 
  FaShoppingCart, 
  FaStar, 
  FaFire, 
  FaThumbsUp,
  FaEye,
  FaSync,
  FaFilter
} from 'react-icons/fa';
import './ProductRecommendation.css';

const ProductRecommendation = ({ 
  userId = null, 
  currentProductId = null, 
  type = 'similar', // 'similar', 'popular', 'personalized', 'trending'
  title = 'Sản phẩm gợi ý',
  maxItems = 8 
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedProducts, setLikedProducts] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(4);

  // Mock recommendation data with different types
  const mockRecommendations = {
    similar: [
      {
        id: 1,
        name: 'Sneaker Da Trắng Premium Plus',
        price: 2790000,
        originalPrice: 3200000,
        image: '/assets/images/products/giày.jpg',
        rating: 4.8,
        reviews: 156,
        discount: 13,
        similarity: 95,
        reason: 'Cùng phong cách và chất liệu'
      },
      {
        id: 2,
        name: 'Sneaker Canvas Trắng Classic',
        price: 1990000,
        originalPrice: 2400000,
        image: '/assets/images/products/giày.jpg',
        rating: 4.6,
        reviews: 89,
        discount: 17,
        similarity: 88,
        reason: 'Thiết kế tương tự'
      }
    ],
    popular: [
      {
        id: 3,
        name: 'Oxford Da Đen Business Pro',
        price: 4200000,
        originalPrice: 4800000,
        image: '/assets/images/products/giày.jpg',
        rating: 4.9,
        reviews: 234,
        discount: 12,
        salesCount: 450,
        reason: 'Bán chạy nhất tuần'
      },
      {
        id: 4,
        name: 'Boots Da Nâu Winter',
        price: 3800000,
        originalPrice: 4200000,
        image: '/assets/images/products/giày.jpg',
        rating: 4.7,
        reviews: 167,
        discount: 10,
        salesCount: 320,
        reason: 'Được yêu thích nhất'
      }
    ],
    personalized: [
      {
        id: 5,
        name: 'Sandal Da Minimalist',
        price: 1490000,
        originalPrice: 1800000,
        image: '/assets/images/products/giày.jpg',
        rating: 4.5,
        reviews: 78,
        discount: 17,
        matchScore: 92,
        reason: 'Phù hợp với sở thích của bạn'
      },
      {
        id: 6,
        name: 'Giày Thể Thao Adidas',
        price: 2890000,
        originalPrice: 3200000,
        image: '/assets/images/products/giày.jpg',
        rating: 4.6,
        reviews: 145,
        discount: 10,
        matchScore: 88,
        reason: 'Dựa trên lịch sử mua hàng'
      }
    ],
    trending: [
      {
        id: 7,
        name: 'Nike Air Max 2025 Limited',
        price: 4500000,
        originalPrice: 5000000,
        image: '/assets/images/products/giày.jpg',
        rating: 4.8,
        reviews: 89,
        discount: 10,
        trendScore: 98,
        reason: 'Hot trend 2025',
        isNew: true
      },
      {
        id: 8,
        name: 'Vans Old Skool Vintage',
        price: 2200000,
        originalPrice: 2500000,
        image: '/assets/images/products/giày.jpg',
        rating: 4.7,
        reviews: 234,
        discount: 12,
        trendScore: 95,
        reason: 'Đang được quan tâm',
        isNew: false
      }
    ]
  };

  const typeConfig = {
    similar: { 
      title: 'Sản phẩm tương tự', 
      icon: FaThumbsUp, 
      color: '#667eea' 
    },
    popular: { 
      title: 'Sản phẩm phổ biến', 
      icon: FaFire, 
      color: '#f7931e' 
    },
    personalized: { 
      title: 'Dành riêng cho bạn', 
      icon: FaHeart, 
      color: '#e53e3e' 
    },
    trending: { 
      title: 'Xu hướng mới', 
      icon: FaEye, 
      color: '#38a169' 
    }
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      
      // Simulate API call with different logic based on type
      setTimeout(() => {
        let data = mockRecommendations[type] || mockRecommendations.similar;
        
        // Filter out current product if provided
        if (currentProductId) {
          data = data.filter(item => item.id !== currentProductId);
        }
        
        // Limit items
        data = data.slice(0, maxItems);
        
        setRecommendations(data);
        setLoading(false);
      }, 800);
    };

    fetchRecommendations();
  }, [type, currentProductId, maxItems, userId]);

  const handleLike = (productId, e) => {
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

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add to cart logic
    console.log('Added to cart:', product);
    
    // Show success message
    const message = `Đã thêm "${product.name}" vào giỏ hàng!`;
    alert(message);
  };

  const handleRefresh = () => {
    setCurrentPage(0);
    setLoading(true);
    
    // Simulate refresh with new recommendations
    setTimeout(() => {
      const shuffled = [...mockRecommendations[type]]
        .sort(() => 0.5 - Math.random())
        .slice(0, maxItems);
      setRecommendations(shuffled);
      setLoading(false);
    }, 600);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={index < Math.floor(rating) ? 'star filled' : 'star'}
      />
    ));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const currentTypeConfig = typeConfig[type];
  const TypeIcon = currentTypeConfig.icon;

  // Pagination
  const totalPages = Math.ceil(recommendations.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const displayedProducts = recommendations.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="product-recommendation">
        <div className="recommendation-header">
          <div className="header-content">
            <TypeIcon style={{ color: currentTypeConfig.color }} />
            <h3>{title || currentTypeConfig.title}</h3>
          </div>
        </div>
        <div className="loading-recommendations">
          <div className="loading-skeleton">
            {[...Array(itemsPerPage)].map((_, index) => (
              <div key={index} className="skeleton-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-rating"></div>
                  <div className="skeleton-price"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="product-recommendation">
        <div className="recommendation-header">
          <div className="header-content">
            <TypeIcon style={{ color: currentTypeConfig.color }} />
            <h3>{title || currentTypeConfig.title}</h3>
          </div>
        </div>
        <div className="no-recommendations">
          <p>Không có sản phẩm gợi ý nào.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-recommendation">
      <div className="recommendation-header">
        <div className="header-content">
          <TypeIcon style={{ color: currentTypeConfig.color }} />
          <h3>{title || currentTypeConfig.title}</h3>
          <span className="item-count">({recommendations.length} sản phẩm)</span>
        </div>
        
        <div className="header-actions">
          <button className="refresh-btn" onClick={handleRefresh} disabled={loading}>
            <FaSync className={loading ? 'spinning' : ''} />
          </button>
          
          {totalPages > 1 && (
            <div className="pagination-mini">
              <button 
                className="page-nav-btn" 
                onClick={prevPage} 
                disabled={currentPage === 0}
              >
                ‹
              </button>
              <span>{currentPage + 1}/{totalPages}</span>
              <button 
                className="page-nav-btn" 
                onClick={nextPage} 
                disabled={currentPage === totalPages - 1}
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="recommendations-grid">
        {displayedProducts.map(product => (
          <div key={product.id} className="recommendation-card">
            <Link to={`/product/${product.id}`} className="card-link">
              <div className="card-image">
                <img 
                  src={product.image} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = '/assets/images/products/placeholder-product.jpg';
                  }}
                />
                
                {product.discount > 0 && (
                  <div className="discount-badge">-{product.discount}%</div>
                )}
                
                {product.isNew && (
                  <div className="new-badge">New</div>
                )}
                
                <button 
                  className={`like-btn ${likedProducts.has(product.id) ? 'liked' : ''}`}
                  onClick={(e) => handleLike(product.id, e)}
                  title="Thêm vào yêu thích"
                >
                  <FaHeart />
                </button>
              </div>

              <div className="card-content">
                <div className="recommendation-reason">
                  {product.reason}
                </div>
                
                <h4 className="product-title">{product.name}</h4>
                
                <div className="product-rating">
                  <div className="stars">
                    {renderStars(product.rating)}
                  </div>
                  <span className="rating-text">
                    {product.rating} ({product.reviews} đánh giá)
                  </span>
                </div>

                <div className="price-section">
                  <div className="price-info">
                    <span className="current-price">
                      {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="original-price">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Additional metrics based on type */}
                {type === 'similar' && product.similarity && (
                  <div className="similarity-score">
                    Độ tương đồng: {product.similarity}%
                  </div>
                )}
                
                {type === 'popular' && product.salesCount && (
                  <div className="popularity-score">
                    Đã bán: {product.salesCount} sản phẩm
                  </div>
                )}
                
                {type === 'personalized' && product.matchScore && (
                  <div className="match-score">
                    Phù hợp: {product.matchScore}%
                  </div>
                )}
                
                {type === 'trending' && product.trendScore && (
                  <div className="trend-score">
                    Trending: {product.trendScore}%
                  </div>
                )}
              </div>
            </Link>

            <div className="card-actions">
              <button 
                className="add-to-cart-btn"
                onClick={(e) => handleAddToCart(product, e)}
              >
                <FaShoppingCart />
                Thêm vào giỏ
              </button>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length > itemsPerPage && (
        <div className="recommendation-footer">
          <Link 
            to={`/products?type=${type}`} 
            className="view-all-link"
          >
            Xem tất cả {recommendations.length} sản phẩm
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductRecommendation;