import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaQrcode,
  FaMoneyBillWave, 
  FaShieldAlt, 
  FaCheck,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUser
} from 'react-icons/fa';
import './Checkout.css';
import api from '../../../services/api';
import { buildVietQrImageUrl } from '../../../services/paymentService';

export async function createOrUpdateQrPayment(orderId, transactionId) {
  console.log('createOrUpdateQrPayment', orderId, transactionId);
  const res = await api.get('payments/', { params: { order: orderId } });
  const list = Array.isArray(res.data) ? res.data : (res.data.results || []);
  if (list.length) {
    const latest = list.sort((a,b)=>new Date(b.payment_date)-new Date(a.payment_date))[0];
    await api.patch(`payments/${latest.id}/`, { status: 'paid', transaction_id: transactionId });
    return;
  }
  await api.post('payments/', {
    order: orderId,
    transaction_id: transactionId,
    status: 'paid',
    gateway_response: 'VietQR webhook (simulated): user confirmed'
  });
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const buyNowItems = location.state?.buyNow ? (location.state?.items || []) : null;
  const stateItems = !location.state?.buyNow ? (location.state?.items || null) : null;

  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('qr');
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

  const [cartItems, setCartItems] = useState(buyNowItems || []);
  const [loadingCart, setLoadingCart] = useState(!buyNowItems);
  const [qrOrderId, setQrOrderId] = useState(null);
  const [transferContent, setTransferContent] = useState('');

  // Thêm state để kiểm soát loading khi xác nhận thanh toán
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  const prefillShipping = async () => {
    try {
      const userLocal = localStorage.getItem('user');
      const uid = userLocal ? JSON.parse(userLocal)?.id : null;
      if (!uid) return;
      const res = await api.get(`users/${uid}/`);
      const u = res.data || {};
      setShippingInfo(prev => ({
        ...prev,
        fullName: u.name || prev.fullName,
        email: u.email || prev.email,
        phone: u.phone || prev.phone,
        address: u.address || prev.address,
        city: u.city || prev.city,
        district: u.district || prev.district
      }));
    } catch {}
  };

  useEffect(() => {
    if (buyNowItems) {
      setLoadingCart(false);
      return;
    }
    if (stateItems) {
      setCartItems(stateItems);
      setLoadingCart(false);
      return;
    }
    const loadCart = async () => {
      try {
        setLoadingCart(true);
        const itemsRes = await api.get('cart-items/');
        const raw = Array.isArray(itemsRes.data) ? itemsRes.data : (itemsRes.data.results || []);
        const productDetails = await Promise.all(
          raw.map(ci => api.get(`products/${ci.product}/`).then(r => r.data).catch(() => null))
        );
        const metaRaw = localStorage.getItem('cart_item_meta');
        const meta = metaRaw ? JSON.parse(metaRaw) : {};
        const merged = raw.map((ci, idx) => {
          const p = productDetails[idx];
          const item = {
            id: ci.id,
            productId: ci.product,
            name: p?.name || 'Sản phẩm',
            price: Number(p?.price || 0),
            quantity: ci.quantity || 1,
            // meta in ProductDetail uses productId as key, not cart-item id
            size: meta[ci.product]?.size || '',
            color: meta[ci.product]?.color || '',
            image: (p?.images && p.images[0]?.image) || p?.image || '/assets/images/products/giày.jpg'
          };
          return item;
        });
        setCartItems(merged);
      } catch (e) {
        console.error('Load cart error:', e?.response?.data || e.message);
        setCartItems([]);
      } finally {
        setLoadingCart(false);
      }
    };
    loadCart();
    prefillShipping();
  }, [buyNowItems, stateItems]);

  const subtotal = cartItems.reduce((s, it) => s + it.price * it.quantity, 0);
  const shipping = cartItems.length > 0 ? 30000 : 0;
  const total = subtotal + shipping;

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
    if (cartItems.length === 0) return;
    setLoading(true);
    try {
      const orderTotal = cartItems.reduce((s, it) => s + Number(it.price || 0) * Number(it.quantity || 1), 0);
      const pm = paymentMethod === 'qr' ? 'qr' : 'cod';

      const orderRes = await api.post('orders/', { payment_method: pm });
      const orderId = orderRes?.data?.id;
      if (!orderId) throw new Error('Không tạo được đơn hàng');

      await Promise.all(
        cartItems.map(it =>
          api.post('order-details/', {
            order: orderId,
            product: it.productId,
            quantity: it.quantity,
            unit_price: Number(it.price || 0).toFixed(2),
            size: it.size || '',
            color: it.color || ''
          })
        )
      );

      await api.patch(`orders/${orderId}/`, {
        total: Number(orderTotal).toFixed(2),
        status: 'pending',
        payment_method: pm,
        payment_status: pm === 'qr' ? 'paid' : 'pending'
      });

      // Webhook giả lập cho QR: ghi nhận thanh toán ngay
      if (pm === 'qr') {
        await createOrUpdateQrPayment(orderId, `QR_${orderId}`);
      }

      await Promise.all(
        cartItems
          .filter(it => Number.isInteger(it.id))
          .map(it => api.delete(`cart-items/${it.id}/`).catch(() => {}))
      );

      navigate('/order-success', {
        state: {
          orderNumber: 'FT' + orderId,
          total: orderTotal,
          items: cartItems
        }
      });
    } catch (e) {
      console.error('Place order error:', e?.response?.data || e.message);
      alert((e?.response?.data?.detail) || 'Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
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

  // For student project, we skip QR polling and simulate via order success after placeOrder

  const vietQrUrl = buildVietQrImageUrl({ amount: total, addInfo: transferContent });
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
                <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem'}}>
                  <button type='button' className='chk-btn-secondary' onClick={prefillShipping}>
                    Lấy thông tin tài khoản
                  </button>
                </div>
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
                      <div className="chk-input-wrapper">
                        <FaMapMarkerAlt className="chk-input-icon" />
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleShippingChange}
                          placeholder="VD: TP. Hồ Chí Minh"
                          required
                        />
                      </div>
                    </div>
                    <div className="chk-form-group">
                      <label htmlFor="district">Quận/Huyện</label>
                      <div className="chk-input-wrapper">
                        <FaMapMarkerAlt className="chk-input-icon" />
                        <input
                          type="text"
                          id="district"
                          name="district"
                          value={shippingInfo.district}
                          onChange={handleShippingChange}
                          placeholder="VD: Quận 1"
                        />
                      </div>
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
                    className={`chk-payment-option ${paymentMethod === 'qr' ? 'chk-selected' : ''}`}
                    onClick={() => setPaymentMethod('qr')}
                  >
                    <FaQrcode className="chk-payment-icon" />
                    <span>Thanh toán bằng mã QR ngân hàng</span>
                  </div>

                  <div
                    className={`chk-payment-option ${paymentMethod === 'cod' ? 'chk-selected' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <FaMoneyBillWave className="chk-payment-icon" />
                    <span>Thanh toán khi nhận hàng</span>
                  </div>
                </div>

                {paymentMethod === 'qr' && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <p style={{ marginBottom: '0.75rem', color: '#4a5568' }}>
                      Quét mã QR dưới đây bằng ứng dụng ngân hàng để thanh toán.
                    </p>
                    <div style={{ display:'flex', gap:'1.5rem', alignItems:'center', flexWrap:'wrap' }}>
                      {/* Ảnh QR minh họa - thay bằng ảnh thật nếu có */}
                      {(() => {
                        const contentToShow = transferContent || `FT${Date.now()}`;
                        return (
                          <>
                            <img
                              src={buildVietQrImageUrl({ amount: total, addInfo: contentToShow })}
                              alt="QR thanh toán VietQR"
                              style={{ width: 180, height: 180, background:'#f7fafc', borderRadius: 8 }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <div style={{ color: '#4a5568' }}>
                              <div><strong>Tổng thanh toán:</strong> {total.toLocaleString('vi-VN')}đ</div>
                              <div><strong>Nội dung:</strong> {contentToShow}</div>
                              <div style={{ fontSize: 13, marginTop: 8 }}>Sau khi thanh toán thành công, bấm “Đặt hàng” để hoàn tất.</div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                    {/* Nút xác nhận thủ công đã được lược bỏ để flow gọn hơn */}
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div style={{ marginTop: '1.5rem', color:'#4a5568' }}>
                    <p>Bạn sẽ thanh toán tiền mặt khi nhận hàng.</p>
                  </div>
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
                    {paymentMethod === 'qr' && (
                      <p>Thanh toán bằng mã QR ngân hàng</p>
                    )}
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
            
            {loadingCart ? (
              <div className="chk-order-items"><p>Đang tải giỏ hàng...</p></div>
            ) : (
              <div className="chk-order-items">
                {cartItems.map(item => (
                  <div key={item.id} className="chk-order-item">
                    <img src={item.image} alt={item.name} />
                    <div className="chk-item-details">
                      <h4>{item.name}</h4>
                      <p>Size: {item.size || '-' } | Màu: {item.color || '-'}</p>
                      <p>Số lượng: {item.quantity}</p>
                    </div>
                    <div className="chk-item-price">
                      {(item.price * item.quantity).toLocaleString()}đ
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="chk-order-totals">
              <div className="chk-total-row">
                <span>Tạm tính:</span>
                <span>{subtotal.toLocaleString()}đ</span>
              </div>
              <div className="chk-total-row">
                <span>Phí vận chuyển:</span>
                <span>{shipping.toLocaleString()}đ</span>
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