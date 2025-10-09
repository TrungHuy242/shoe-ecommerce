// frontend/src/features/user/OrderSuccess/OrderSuccess.js
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, ShoppingBag, Mail, Copy, ArrowRight } from 'lucide-react';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || 'FT' + Date.now();
  const total = location.state?.total || 0;
  const subtotal = location.state?.subtotal || 0;
  const discount = location.state?.discount || 0;
  const shipping = location.state?.shipping || 0;
  const promotionCode = location.state?.promotionCode || null;
  const items = location.state?.items || [];

  return (
    <div className="order-success-wrapper">
      <div className="order-success-container">
        {/* Success Icon */}
        <div className="order-success-icon">
          <CheckCircle size={32} strokeWidth={2.5} />
        </div>

        {/* Header */}
        <div className="order-success-header">
          <h1 className="order-success-title">Đặt hàng thành công!</h1>
          <p className="order-success-subtitle">
            Cảm ơn bạn đã mua sắm tại cửa hàng
          </p>
        </div>

        {/* Order Info */}
        <div className="order-success-summary">
          <div className="order-success-info-row">
            <span className="order-success-label">Mã đơn hàng</span>
            <span className="order-success-order-number">{orderNumber}</span>
          </div>
          
          <div className="order-success-info-row">
            <span className="order-success-label">Tạm tính</span>
            <span className="order-success-subtotal">{Number(subtotal).toLocaleString('vi-VN')}đ</span>
          </div>
          
          {discount > 0 && (
            <div className="order-success-info-row">
              <span className="order-success-label">Mã giảm giá ({promotionCode})</span>
              <span className="order-success-discount">-{Number(discount).toLocaleString('vi-VN')}đ</span>
            </div>
          )}
          
          {shipping > 0 && (
            <div className="order-success-info-row">
              <span className="order-success-label">Phí vận chuyển</span>
              <span className="order-success-shipping">{Number(shipping).toLocaleString('vi-VN')}đ</span>
            </div>
          )}
          
          <div className="order-success-info-row order-success-total-row">
            <span className="order-success-label">Tổng tiền</span>
            <span className="order-success-total">{Number(total).toLocaleString('vi-VN')}đ</span>
          </div>
        </div>

        {/* Items */}
        {items.length > 0 && (
          <div className="order-success-items">
            <div className="order-success-items-list">
              {items.slice(0, 2).map((item, index) => (
                <div key={index} className="order-success-item">
                  <img src={item.image} alt={item.name} className="order-success-item-image" />
                  <div className="order-success-item-info">
                    <div className="order-success-item-name">{item.name}</div>
                    <div className="order-success-item-detail">
                      x{item.quantity} • {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                </div>
              ))}
              {items.length > 2 && (
                <div className="order-success-more-items">
                  +{items.length - 2} sản phẩm khác
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="order-success-actions">
          <Link to="/orders" className="order-success-btn order-success-btn-primary">
            <Package size={16} />
            Xem đơn hàng
          </Link>
          <Link to="/products" className="order-success-btn order-success-btn-secondary">
            <ShoppingBag size={16} />
            Tiếp tục mua
          </Link>
        </div>

        {/* Footer */}
        <div className="order-success-footer">
          <Mail size={14} />
          <span>Thông tin đã được gửi đến email</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;