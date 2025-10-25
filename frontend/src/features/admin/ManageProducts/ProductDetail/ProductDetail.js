import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaTimes, FaTag, FaBox, FaStar, FaEye, FaShoppingCart, FaHeart, FaShare, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './ProductDetail.css';

const ProductDetail = ({ isOpen, onRequestClose, product, categories, genders, brands, sizes, colors }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Hàm ánh xạ id sang name
  const getNameById = (id, list) => {
    const item = list?.find(item => item.id === parseInt(id));
    return item ? item.name || item.value : 'Không có';
  };

  // Format giá tiền
  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('vi-VN') + ' ₫';
  };

  // Tính phần trăm giảm giá
  const getDiscountPercent = () => {
    if (product.originalPrice && product.price) {
      const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  // Chuyển đổi hình ảnh
  const nextImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Reset image index khi product thay đổi
  React.useEffect(() => {
    setCurrentImageIndex(0);
  }, [product]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="product-detail-modal"
      overlayClassName="product-detail-overlay"
      closeTimeoutMS={200}
    >
      <div className="product-detail-container">
        {/* Header */}
        <div className="product-detail-header">
          <h2 className="product-detail-title">
            <FaEye className="product-detail-icon" />
            Chi tiết sản phẩm
          </h2>
          <button 
            className="product-detail-close"
            onClick={onRequestClose}
            title="Đóng"
          >
            <FaTimes />
          </button>
        </div>

        {product && (
          <div className="product-detail-content">
            {/* Product Images */}
            <div className="product-detail-images">
              <div className="product-detail-main-image">
                {product.images && product.images.length > 0 ? (
                  <>
                    <img
                      src={product.images[currentImageIndex].image}
                      alt={product.name}
                      className="main-image"
                    />
                    {product.images.length > 1 && (
                      <>
                        <button 
                          className="image-nav-btn image-nav-prev"
                          onClick={prevImage}
                          title="Ảnh trước"
                        >
                          <FaChevronLeft />
                        </button>
                        <button 
                          className="image-nav-btn image-nav-next"
                          onClick={nextImage}
                          title="Ảnh sau"
                        >
                          <FaChevronRight />
                        </button>
                        <div className="image-counter">
                          {currentImageIndex + 1} / {product.images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="no-image">
                    <FaBox />
                    <span>Không có hình ảnh</span>
                  </div>
                )}
                {getDiscountPercent() > 0 && (
                  <div className="discount-badge">
                    -{getDiscountPercent()}%
                  </div>
                )}
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="product-detail-thumbnails">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.image}
                      alt={`${product.name} - ${index + 1}`}
                      className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => selectImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="product-detail-info">
              {/* Basic Info */}
              <div className="product-detail-section">
                <div className="section-header">
                  <FaTag className="section-icon" />
                  <h3>Thông tin cơ bản</h3>
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">ID sản phẩm</span>
                    <span className="info-value product-id">#{product.id}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Tên sản phẩm</span>
                    <span className="info-value product-name">{product.name}</span>
                  </div>
                  <div className="info-item full-width">
                    <span className="info-label">Mô tả</span>
                    <span className="info-value product-description">{product.description || 'Không có mô tả'}</span>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="product-detail-section">
                <div className="section-header">
                  <FaShoppingCart className="section-icon" />
                  <h3>Giá cả</h3>
                </div>
                <div className="pricing-info">
                  <div className="current-price">
                    {formatPrice(product.price)}
                  </div>
                  {product.originalPrice && (
                    <div className="original-price">
                      {formatPrice(product.originalPrice)}
                    </div>
                  )}
                  {getDiscountPercent() > 0 && (
                    <div className="discount-info">
                      Tiết kiệm {formatPrice(product.originalPrice - product.price)}
                    </div>
                  )}
                </div>
              </div>

              {/* Category & Brand */}
              <div className="product-detail-section">
                <div className="section-header">
                  <FaBox className="section-icon" />
                  <h3>Phân loại</h3>
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Danh mục</span>
                    <span className="info-value category-badge">
                      {getNameById(product.category, categories)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Giới tính</span>
                    <span className="info-value gender-badge">
                      {getNameById(product.gender, genders)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Thương hiệu</span>
                    <span className="info-value brand-badge">
                      {getNameById(product.brand, brands)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sizes & Colors */}
              <div className="product-detail-section">
                <div className="section-header">
                  <FaHeart className="section-icon" />
                  <h3>Thuộc tính</h3>
                </div>
                <div className="attributes">
                  <div className="attribute-group">
                    <span className="attribute-label">Kích cỡ:</span>
                    <div className="attribute-values">
                      {product.sizes?.map(size => getNameById(size, sizes)).join(', ') || 'Không có'}
                    </div>
                  </div>
                  <div className="attribute-group">
                    <span className="attribute-label">Màu sắc:</span>
                    <div className="attribute-values">
                      {product.colors?.map(color => getNameById(color, colors)).join(', ') || 'Không có'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="product-detail-section">
                <div className="section-header">
                  <FaStar className="section-icon" />
                  <h3>Thống kê</h3>
                </div>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-value">{product.stock_quantity || 0}</div>
                    <div className="stat-label">Tồn kho</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{product.rating?.toFixed(1) || '0.0'}</div>
                    <div className="stat-label">Đánh giá</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{product.reviews || 0}</div>
                    <div className="stat-label">Lượt đánh giá</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{product.sales_count || 0}</div>
                    <div className="stat-label">Đã bán</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="product-detail-footer">
          <button
            className="product-detail-btn product-detail-btn-secondary"
            onClick={onRequestClose}
          >
            <FaTimes />
            Đóng
          </button>
          <button
            className="product-detail-btn product-detail-btn-primary"
            onClick={onRequestClose}
          >
            <FaShare />
            Chia sẻ
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetail;