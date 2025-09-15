import React from 'react';
import Modal from 'react-modal';
import './ProductDetail.css'; // Tạo file CSS riêng nếu cần

const ProductDetail = ({ isOpen, onRequestClose, product, categories, genders, brands, sizes, colors }) => {
  // Hàm ánh xạ id sang name
  const getNameById = (id, list) => {
    const item = list?.find(item => item.id === parseInt(id));
    return item ? item.name || item.value : 'Không có';
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="admin-prod-modal"
      overlayClassName="admin-prod-modal-overlay"
    >
      <h2 className="admin-prod-modal-title">Chi tiết sản phẩm</h2>
      {product && (
        <div className="admin-prod-detail-content">
          <p><strong>ID:</strong> {product.id}</p>
          <p><strong>Tên sản phẩm:</strong> {product.name}</p>
          <p><strong>Mô tả:</strong> {product.description}</p>
          <p><strong>Giá:</strong> {parseFloat(product.price).toLocaleString('vi-VN')} ₫</p>
          <p><strong>Giá gốc:</strong> {product.originalPrice ? parseFloat(product.originalPrice).toLocaleString('vi-VN') + ' ₫' : 'Không có'}</p>
          <p><strong>Số lượng tồn kho:</strong> {product.stock_quantity}</p>
          <p><strong>Danh mục:</strong> {getNameById(product.category, categories)}</p>
          <p><strong>Giới tính:</strong> {getNameById(product.gender, genders)}</p>
          <p><strong>Thương hiệu:</strong> {getNameById(product.brand, brands)}</p>
          <p><strong>Kích cỡ:</strong> {product.sizes?.map(size => getNameById(size, sizes)).join(', ') || 'Không có'}</p>
          <p><strong>Màu sắc:</strong> {product.colors?.map(color => getNameById(color, colors)).join(', ') || 'Không có'}</p>
          <p><strong>Điểm đánh giá:</strong> {product.rating?.toFixed(1)}</p>
          <p><strong>Số lượt đánh giá:</strong> {product.reviews}</p>
          <p><strong>Số lượt bán:</strong> {product.sales_count}</p>
          <p><strong>Ngày tạo:</strong> {new Date(product.created_at).toLocaleString('vi-VN')}</p>
          <div className="images-block">
            <strong>Hình ảnh:</strong>
            {product.images && product.images.length > 0 ? (
              <div className="images-grid">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.image}
                    alt={`${product.name} - ${index + 1}`}
                  />
                ))}
              </div>
            ) : (
              <p>Không có</p>
            )}
          </div>

          <div className="admin-prod-form-actions">
            <button
              type="button"
              className="admin-prod-btn admin-prod-btn-cancel"
              onClick={onRequestClose}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ProductDetail;