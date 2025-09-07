import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCreditCard, 
  FaPaypal, 
  FaMoneyBillWave, 
  FaShieldAlt, 
  FaCheck,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUser
} from 'react-icons/fa';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const cartItems = [
    {
      id: 1,
      name: "Sneaker Da Trắng Premium",
      price: 2490000,
      quantity: 2,
      size: "42",
      color: "Trắng",
      image: "/assets/images/products/giày.jpg"
    },
    {
      id: 2,
      name: "Oxford Da Đen",
      price: 3990000,
      quantity: 1,
      size: "41", 
      color: "Đen",
      image: "/assets/images/products/giày.jpg"
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 30000;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + shipping + tax;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep1 = () => {
    const required = ['fullName', 'email', 'phone', 'address', 'city'];
    return required.every(field => shippingInfo[field].trim() !== '');
  };

  const validateStep2 = () => {
    if (paymentMethod === 'card') {
      const required = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
      return required.every(field => paymentInfo[field].trim() !== '');
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    setTimeout(() => {
      navigate('/order-success', {
        state: {
          orderNumber: 'FT' + Date.now(),
          total: total,
          items: cartItems
        }
      });
    }, 2000);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div className="chk-checkout-page">
      <div className="chk-checkout-container">
        <div className="chk-checkout-progress">
          <div className={`chk-step ${currentStep >= 1 ? 'chk-active' : ''}`}>
            <div className="chk-step-number">
              {currentStep > 1 ? <FaCheck /> : '1'}
            </div>
            <span>Thông tin giao hàng</span>
          </div>
          <div className={`chk-step ${currentStep >= 2 ? 'chk-active' : ''}`}>
            <div className="chk-step-number">
              {currentStep > 2 ? <FaCheck /> : '2'}
            </div>
            <span>Thanh toán</span>
          </div>
          <div className={`chk-step ${currentStep >= 3 ? 'chk-active' : ''}`}>
            <div className="chk-step-number">3</div>
            <span>Xác nhận</span>
          </div>
        </div>

        <div className="chk-checkout-content">
          <div className="chk-checkout-main">
            {currentStep === 1 && (
              <div className="chk-shipping-form">
                <h2>Thông tin giao hàng</h2>
                
                <form>
                  <div className="chk-form-row">
                    <div className="chk-form-group">
                      <label htmlFor="fullName">Họ và tên *</label>
                      <div className="chk-input-wrapper">
                        <FaUser className="chk-input-icon" />
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={shippingInfo.fullName}
                          onChange={handleShippingChange}
                          placeholder="Nhập họ và tên"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="chk-form-row">
                    <div className="chk-form-group">
                      <label htmlFor="email">Email *</label>
                      <div className="chk-input-wrapper">
                        <FaEnvelope className="chk-input-icon" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={shippingInfo.email}
                          onChange={handleShippingChange}
                          placeholder="Nhập email"
                          required
                        />
                      </div>
                    </div>
                    <div className="chk-form-group">
                      <label htmlFor="phone">Số điện thoại *</label>
                      <div className="chk-input-wrapper">
                        <FaPhone className="chk-input-icon" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={shippingInfo.phone}
                          onChange={handleShippingChange}
                          placeholder="Nhập số điện thoại"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="chk-form-group">
                    <label htmlFor="address">Địa chỉ *</label>
                    <div className="chk-input-wrapper">
                      <FaMapMarkerAlt className="chk-input-icon" />
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        placeholder="Số nhà, tên đường"
                        required
                      />
                    </div>
                  </div>

                  <div className="chk-form-row">
                    <div className="chk-form-group">
                      <label htmlFor="city">Tỉnh/Thành phố *</label>
                      <select
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        required
                      >
                        <option value="">Chọn tỉnh/thành phố</option>
                        <option value="Ho Chi Minh">TP. Hồ Chí Minh</option>
                        <option value="Ha Noi">Hà Nội</option>
                        <option value="Da Nang">Đà Nẵng</option>
                      </select>
                    </div>
                    <div className="chk-form-group">
                      <label htmlFor="district">Quận/Huyện</label>
                      <select
                        id="district"
                        name="district"
                        value={shippingInfo.district}
                        onChange={handleShippingChange}
                      >
                        <option value="">Chọn quận/huyện</option>
                        <option value="District 1">Quận 1</option>
                        <option value="District 3">Quận 3</option>
                      </select>
                    </div>
                  </div>

                  <div className="chk-form-group">
                    <label htmlFor="note">Ghi chú đơn hàng (tùy chọn)</label>
                    <textarea
                      id="note"
                      name="note"
                      value={shippingInfo.note}
                      onChange={handleShippingChange}
                      placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                      rows="3"
                    />
                  </div>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div className="chk-payment-form">
                <h2>Phương thức thanh toán</h2>
                
                <div className="chk-payment-methods">
                  <div
                    className={`chk-payment-option ${paymentMethod === 'card' ? 'chk-selected' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <FaCreditCard className="chk-payment-icon" />
                    <span>Thẻ tín dụng/ghi nợ</span>
                  </div>
                  <div
                    className={`chk-payment-option ${paymentMethod === 'paypal' ? 'chk-selected' : ''}`}
                    onClick={() => setPaymentMethod('paypal')}
                  >
                    <FaPaypal className="chk-payment-icon" />
                    <span>PayPal</span>
                  </div>
                  <div
                    className={`chk-payment-option ${paymentMethod === 'cod' ? 'chk-selected' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <FaMoneyBillWave className="chk-payment-icon" />
                    <span>Thanh toán khi nhận hàng</span>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <form className="chk-card-form">
                    <div className="chk-form-group">
                      <label htmlFor="cardNumber">Số thẻ *</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          handlePaymentChange({ target: { name: 'cardNumber', value: formatted } });
                        }}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        required
                      />
                    </div>
                    <div className="chk-form-row">
                      <div className="chk-form-group">
                        <label htmlFor="expiryDate">Ngày hết hạn *</label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={paymentInfo.expiryDate}
                          onChange={handlePaymentChange}
                          placeholder="MM/YY"
                          maxLength="5"
                          required
                        />
                      </div>
                      <div className="chk-form-group">
                        <label htmlFor="cvv">CVV *</label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={paymentInfo.cvv}
                          onChange={handlePaymentChange}
                          placeholder="123"
                          maxLength="4"
                          required
                        />
                      </div>
                    </div>
                    <div className="chk-form-group">
                      <label htmlFor="cardName">Tên trên thẻ *</label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={paymentInfo.cardName}
                        onChange={handlePaymentChange}
                        placeholder="NGUYEN VAN A"
                        required
                      />
                    </div>
                  </form>
                )}

                <div className="chk-security-notice">
                  <FaShieldAlt className="chk-security-icon" />
                  <span>Thông tin thanh toán của bạn được bảo mật an toàn</span>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="chk-order-review">
                <h2>Xác nhận đơn hàng</h2>
                
                <div className="chk-review-section">
                  <h3>Thông tin giao hàng</h3>
                  <div className="chk-review-info">
                    <p><strong>{shippingInfo.fullName}</strong></p>
                    <p>{shippingInfo.email}</p>
                    <p>{shippingInfo.phone}</p>
                    <p>
                      {shippingInfo.address}, {shippingInfo.district}, {shippingInfo.city}
                    </p>
                  </div>
                </div>

                <div className="chk-review-section">
                  <h3>Phương thức thanh toán</h3>
                  <div className="chk-review-payment">
                    {paymentMethod === 'card' && (
                      <p>Thẻ tín dụng kết thúc bằng **** {paymentInfo.cardNumber.slice(-4)}</p>
                    )}
                    {paymentMethod === 'paypal' && <p>PayPal</p>}
                    {paymentMethod === 'cod' && <p>Thanh toán khi nhận hàng</p>}
                  </div>
                </div>
              </div>
            )}

            <div className="chk-checkout-actions">
              {currentStep > 1 && (
                <button 
                  className="chk-btn-secondary"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Quay lại
                </button>
              )}
              {currentStep < 3 ? (
                <button 
                  className="chk-btn-primary"
                  onClick={handleNextStep}
                  disabled={
                    (currentStep === 1 && !validateStep1()) ||
                    (currentStep === 2 && !validateStep2())
                  }
                >
                  Tiếp tục
                </button>
              ) : (
                <button 
                  className={`chk-btn-primary ${loading ? 'chk-loading' : ''}`}
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="chk-spinner"></div>
                  ) : (
                    'Đặt hàng'
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="chk-order-summary">
            <h3>Tóm tắt đơn hàng</h3>
            
            <div className="chk-order-items">
              {cartItems.map(item => (
                <div key={item.id} className="chk-order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="chk-item-details">
                    <h4>{item.name}</h4>
                    <p>Size: {item.size} | Màu: {item.color}</p>
                    <p>Số lượng: {item.quantity}</p>
                  </div>
                  <div className="chk-item-price">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </div>
                </div>
              ))}
            </div>

            <div className="chk-order-totals">
              <div className="chk-total-row">
                <span>Tạm tính:</span>
                <span>{subtotal.toLocaleString()}đ</span>
              </div>
              <div className="chk-total-row">
                <span>Phí vận chuyển:</span>
                <span>{shipping.toLocaleString()}đ</span>
              </div>
              <div className="chk-total-row">
                <span>Thuế (10%):</span>
                <span>{tax.toLocaleString()}đ</span>
              </div>
              <div className="chk-total-row chk-final-total">
                <span>Tổng cộng:</span>
                <span>{total.toLocaleString()}đ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;