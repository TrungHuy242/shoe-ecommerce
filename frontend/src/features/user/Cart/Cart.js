import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api'; // Đường dẫn tới file api.js
import { FaTrash, FaMinus, FaPlus, FaShoppingBag, FaArrowLeft, FaTags } from 'react-icons/fa';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        const response = await api.get('cart/'); // Gọi API để lấy danh sách giỏ hàng
        setCartItems(response.data); // Giả định response.data là mảng các item
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu giỏ hàng:', err.response ? err.response.data : err.message);
        setCartItems([]); // Đặt mảng rỗng nếu có lỗi
      } finally {
        setLoading(false);
      }
    };
    fetchCartData();
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyCoupon = () => {
    setLoading(true);
    
    setTimeout(() => {
      if (couponCode.toLowerCase() === 'welcome10') {
        setAppliedCoupon({
          code: 'WELCOME10',
          discount: 0.1,
          type: 'percentage'
        });
      } else if (couponCode.toLowerCase() === 'save50k') {
        setAppliedCoupon({
          code: 'SAVE50K',
          discount: 50000,
          type: 'fixed'
        });
      } else {
        alert('Mã giảm giá không hợp lệ!');
      }
      setLoading(false);
    }, 1000);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => 
    sum + ((item.originalPrice - item.price) * item.quantity), 0
  );
  
  let discount = 0;
  if (appliedCoupon) {
    discount = appliedCoupon.type === 'percentage' 
      ? subtotal * appliedCoupon.discount
      : appliedCoupon.discount;
  }
  
  const shipping = subtotal >= 1000000 ? 0 : 30000;
  const total = subtotal - discount + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-empty-cart">
            <FaShoppingBag className="cart-empty-cart-icon" />
            <h2>Giỏ hàng của bạn đang trống</h2>
            <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
            <Link to="/products" className="cart-continue-shopping-btn">
              <FaArrowLeft /> Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Giỏ hàng của bạn</h1>
          <p>{cartItems.length} sản phẩm</p>
        </div>

        <div className="cart-content">
          <div className="cart-items-section">
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <div className="cart-item-attributes">
                      <span>Size: {item.size}</span>
                      <span>Màu: {item.color}</span>
                    </div>
                    <div className="cart-item-price">
                      <span className="cart-current-price">
                        {item.price.toLocaleString()}đ
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="cart-original-price">
                          {item.originalPrice.toLocaleString()}đ
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <div className="cart-quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="cart-qty-btn"
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span className="cart-quantity">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="cart-qty-btn"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="cart-remove-btn"
                      title="Xóa sản phẩm"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="cart-item-total">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-coupon-section">
              <div className="cart-coupon-header">
                <FaTags className="cart-coupon-icon" />
                <h3>Mã giảm giá</h3>
              </div>
              
              {appliedCoupon ? (
                <div className="cart-applied-coupon">
                  <span className="cart-coupon-code">{appliedCoupon.code}</span>
                  <span className="cart-coupon-discount">
                    -{appliedCoupon.type === 'percentage' 
                      ? `${(appliedCoupon.discount * 100)}%` 
                      : `${appliedCoupon.discount.toLocaleString()}đ`
                    }
                  </span>
                  <button onClick={removeCoupon} className="cart-remove-coupon-btn">
                    Hủy
                  </button>
                </div>
              ) : (
                <div className="cart-coupon-input">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Nhập mã giảm giá"
                  />
                  <button 
                    onClick={applyCoupon}
                    disabled={!couponCode.trim() || loading}
                    className="cart-apply-coupon-btn"
                  >
                    {loading ? 'Đang xử lý...' : 'Áp dụng'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="cart-order-summary">
            <h3>Tóm tắt đơn hàng</h3>
            
            <div className="cart-summary-details">
              <div className="cart-summary-row">
                <span>Tạm tính:</span>
                <span>{subtotal.toLocaleString()}đ</span>
              </div>
              
              {savings > 0 && (
                <div className="cart-summary-row cart-savings">
                  <span>Tiết kiệm:</span>
                  <span>-{savings.toLocaleString()}đ</span>
                </div>
              )}
              
              {discount > 0 && (
                <div className="cart-summary-row cart-discount">
                  <span>Giảm giá ({appliedCoupon.code}):</span>
                  <span>-{discount.toLocaleString()}đ</span>
                </div>
              )}
              
              <div className="cart-summary-row">
                <span>Phí vận chuyển:</span>
                <span>
                  {shipping === 0 ? (
                    <span className="cart-free-shipping">Miễn phí</span>
                  ) : (
                    `${shipping.toLocaleString()}đ`
                  )}
                </span>
              </div>
              
              <div className="cart-summary-row cart-total">
                <span>Tổng cộng:</span>
                <span>{total.toLocaleString()}đ</span>
              </div>
            </div>

            {shipping > 0 && (
              <div className="cart-shipping-notice">
                <p>
                  Mua thêm {(1000000 - subtotal).toLocaleString()}đ để được 
                  <strong> miễn phí vận chuyển</strong>!
                </p>
              </div>
            )}

            <div className="cart-checkout-actions">
              <Link to="/checkout" className="cart-checkout-btn">
                Thanh toán
              </Link>
              <Link to="/products" className="cart-continue-shopping">
                <FaArrowLeft /> Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;