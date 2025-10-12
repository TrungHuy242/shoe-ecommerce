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
  FaUser,
  FaChevronRight,
  FaChevronLeft,
  FaSpinner,
  FaPlus,
  FaTimes
} from 'react-icons/fa';
import './Checkout.css';
import api from '../../../services/api';
import { buildVietQrImageUrl } from '../../../services/paymentService';
import { useNotification } from '../../../context/NotificationContext';

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
  const appliedCoupon = location.state?.appliedCoupon || null; // Nhận thông tin mã giảm giá

  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('qr');
  const [loading, setLoading] = useState(false);
  const [stepLoading, setStepLoading] = useState(false);
  const { success, error } = useNotification();
  
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
  
  // Shipping addresses
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [newAddressData, setNewAddressData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    is_default: false
  });
  

  // Thêm state để kiểm soát loading khi xác nhận thanh toán
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  const fetchShippingAddresses = async () => {
    try {
      const response = await api.get('shipping-addresses/');
      const addresses = response.data.results || response.data;
      setShippingAddresses(addresses);
      
      // Tự động chọn địa chỉ mặc định
      const defaultAddress = addresses.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        setUseCustomAddress(false);
        setShippingInfo({
          fullName: defaultAddress.full_name,
          email: defaultAddress.email,
          phone: defaultAddress.phone,
          address: defaultAddress.address,
          city: defaultAddress.city,
          district: defaultAddress.district || '',
          ward: defaultAddress.ward || '',
          note: ''
        });
      }
    } catch (err) {
      console.error('Fetch shipping addresses error:', err);
    }
  };


  const prefillShipping = async () => {
    try {
      // Ưu tiên lấy từ địa chỉ giao hàng mặc định
      const defaultAddress = shippingAddresses.find(addr => addr.is_default);
      if (defaultAddress) {
        setShippingInfo({
          fullName: defaultAddress.full_name,
          email: defaultAddress.email,
          phone: defaultAddress.phone,
          address: defaultAddress.address,
          city: defaultAddress.city,
          district: defaultAddress.district || '',
          ward: defaultAddress.ward || '',
          note: ''
        });
        setSelectedAddressId(defaultAddress.id);
        setUseCustomAddress(false);
      } else {
        // Fallback về thông tin tài khoản nếu không có địa chỉ
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
      }
    } catch {}
  };

  useEffect(() => {
    if (buyNowItems) {
      setLoadingCart(false);
      fetchShippingAddresses();
      return;
    }
    if (stateItems) {
      setCartItems(stateItems);
      setLoadingCart(false);
      fetchShippingAddresses();
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
    fetchShippingAddresses();
    prefillShipping();
  }, [buyNowItems, stateItems]);

  const handleNextStep = async () => {
    setStepLoading(true);
    
    try {
      if (currentStep === 1) {
        // Kiểm tra user có địa chỉ giao hàng không
        if (shippingAddresses.length === 0) {
          error('Bạn cần thêm ít nhất một địa chỉ giao hàng trước khi đặt hàng');
          // Redirect đến trang quản lý địa chỉ
          setTimeout(() => {
            navigate('/shipping-addresses', { state: { fromCheckout: true } });
          }, 2000);
          return;
        }
        
        // Validate shipping info
        if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address) {
          error('Vui lòng điền đầy đủ thông tin giao hàng');
          return;
        }
        setCurrentStep(2);
      } else if (currentStep === 2) {
        // Validate payment method
        if (!paymentMethod) {
          error('Vui lòng chọn phương thức thanh toán');
          return;
        }
        setCurrentStep(3);
      }
    } catch (err) {
      error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setStepLoading(false);
    }
  };

  // Cập nhật tính toán tổng tiền với mã giảm giá
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => {
    const originalPrice = item.originalPrice || item.price;
    return sum + Math.max((originalPrice - item.price), 0) * item.quantity;
  }, 0);
  
  // Áp dụng mã giảm giá nếu có
  let discount = 0;
  if (appliedCoupon && appliedCoupon.discount_amount) {
    discount = appliedCoupon.discount_amount;
  }
  
  const shipping = subtotal >= 1000000 ? 0 : 30000;
  const total = subtotal - discount + shipping;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressSelect = (addressId) => {
    const address = shippingAddresses.find(addr => addr.id === addressId);
    if (address) {
      setSelectedAddressId(addressId);
      setUseCustomAddress(false);
      setShippingInfo({
        fullName: address.full_name,
        email: address.email,
        phone: address.phone,
        address: address.address,
        city: address.city,
        district: address.district || '',
        ward: address.ward || '',
        note: ''
      });
    }
  };

  const handleUseCustomAddress = () => {
    setUseCustomAddress(true);
    setSelectedAddressId(null);
    // Reset form với thông tin user (fallback)
    const userLocal = localStorage.getItem('user');
    const uid = userLocal ? JSON.parse(userLocal)?.id : null;
    if (uid) {
      api.get(`users/${uid}/`).then(res => {
        const u = res.data || {};
        setShippingInfo({
          fullName: u.name || '',
          email: u.email || '',
          phone: u.phone || '',
          address: u.address || '',
          city: u.city || '',
          district: u.district || '',
          ward: '',
          note: ''
        });
      }).catch(() => {});
    }
  };

  const handleAddNewAddress = async () => {
    try {
      const response = await api.post('shipping-addresses/', newAddressData);
      const newAddress = response.data;
      
      // Cập nhật danh sách địa chỉ
      setShippingAddresses(prev => [...prev, newAddress]);
      
      // Tự động chọn địa chỉ vừa tạo
      setSelectedAddressId(newAddress.id);
      setUseCustomAddress(false);
      setShippingInfo({
        fullName: newAddress.full_name,
        email: newAddress.email,
        phone: newAddress.phone,
        address: newAddress.address,
        city: newAddress.city,
        district: newAddress.district || '',
        ward: newAddress.ward || '',
        note: ''
      });
      
      // Reset form
      setNewAddressData({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ward: '',
        is_default: false
      });
      setShowAddAddressForm(false);
      
      success('Thêm địa chỉ thành công!');
    } catch (err) {
      error('Không thể thêm địa chỉ. Vui lòng thử lại.');
      console.error('Add address error:', err);
    }
  };

  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddressData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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


  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    try {
      const orderSubtotal = cartItems.reduce((s, it) => s + Number(it.price || 0) * Number(it.quantity || 1), 0);
      const orderDiscount = appliedCoupon ? appliedCoupon.discount_amount : 0;
      const orderShipping = orderSubtotal >= 1000000 ? 0 : 30000;
      const orderTotal = orderSubtotal - orderDiscount + orderShipping;
      
      const pm = paymentMethod === 'qr' ? 'qr' : 'cod';

      // Tạo hoặc lấy ShippingAddress
      let shippingAddressId = null;
      console.log('Checkout Debug:', {
        selectedAddressId,
        useCustomAddress,
        shippingAddressesLength: shippingAddresses.length,
        shippingInfo,
        shippingAddresses: shippingAddresses.map(addr => ({ id: addr.id, name: addr.full_name, is_default: addr.is_default }))
      });
      
      if (selectedAddressId) {
        // Sử dụng địa chỉ đã chọn
        shippingAddressId = selectedAddressId;
        console.log('Using selected address:', selectedAddressId);
      } else {
        // Tạo địa chỉ mới từ thông tin nhập (khi không chọn địa chỉ nào)
        console.log('Creating new address from shippingInfo:', shippingInfo);
        const newAddressRes = await api.post('shipping-addresses/', {
          full_name: shippingInfo.fullName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          district: shippingInfo.district,
          ward: shippingInfo.ward,
          is_default: false // Không đặt làm default cho địa chỉ tạm thời
        });
        shippingAddressId = newAddressRes.data.id;
        console.log('Created new address with ID:', shippingAddressId);
      }

      // Tạo order với thông tin đầy đủ
      const orderData = { 
        payment_method: pm,
        subtotal: orderSubtotal.toFixed(2),
        discount_amount: orderDiscount.toFixed(2),
        shipping_fee: orderShipping.toFixed(2),
        promotion_code: appliedCoupon ? appliedCoupon.code : null,
        total: orderTotal.toFixed(2),
        shipping_address_id: shippingAddressId
      };
      console.log('Creating order with data:', orderData);
      const orderRes = await api.post('orders/', orderData);
      
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

      // Cập nhật lại order với status
      await api.patch(`orders/${orderId}/`, {
        status: 'pending',
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
          subtotal: orderSubtotal,
          discount: orderDiscount,
          shipping: orderShipping,
          promotionCode: appliedCoupon ? appliedCoupon.code : null,
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
                
                {/* Show Address Card if has addresses and not using custom */}
                {shippingAddresses.length > 0 && !useCustomAddress && !showAddressSelector && (
                  <div className="default-address-display">
                    <div className="address-display-header">
                      <h3>Địa chỉ giao hàng</h3>
                      <button 
                        type="button"
                        className="btn-secondary change-address-btn"
                        onClick={() => setShowAddressSelector(true)}
                      >
                        Thay đổi địa chỉ
                      </button>
                    </div>
                    
                    <div className="selected-address-card">
                      {(() => {
                        const selectedAddress = shippingAddresses.find(addr => addr.id === selectedAddressId) || 
                                               shippingAddresses.find(addr => addr.is_default);
                        return selectedAddress ? (
                          <>
                            <div className="address-card-header">
                              <h4>{selectedAddress.full_name}</h4>
                              {selectedAddress.is_default && <span className="default-badge">Mặc định</span>}
                            </div>
                            <div className="address-card-details">
                              <p><strong>Địa chỉ:</strong> {selectedAddress.address}, {selectedAddress.district}, {selectedAddress.city}</p>
                              <p><strong>Điện thoại:</strong> {selectedAddress.phone}</p>
                              <p><strong>Email:</strong> {selectedAddress.email}</p>
                            </div>
                          </>
                        ) : null;
                      })()}
                    </div>
                  </div>
                )}

                {/* Show Address Selector */}
                {showAddressSelector && (
                  <div className="address-selection">
                    <div className="address-selection-header">
                      <h3>Chọn địa chỉ giao hàng</h3>
                      <button 
                        type="button"
                        className="btn-secondary add-address-quick-btn"
                        onClick={() => setShowAddAddressForm(true)}
                      >
                        <FaPlus /> Thêm địa chỉ mới
                      </button>
                    </div>
                    
                    <div className="address-options">
                      {shippingAddresses.map(address => (
                        <div 
                          key={address.id}
                          className={`address-option ${selectedAddressId === address.id ? 'selected' : ''}`}
                          onClick={() => {
                            handleAddressSelect(address.id);
                            setShowAddressSelector(false);
                          }}
                        >
                          <div className="address-option-content">
                            <div className="address-option-header">
                              <h4>{address.full_name}</h4>
                              {address.is_default && <span className="default-badge">Mặc định</span>}
                            </div>
                            <p>{address.address}, {address.district}, {address.city}</p>
                            <p>{address.phone} • {address.email}</p>
                          </div>
                        </div>
                      ))}
                      
                      <div 
                        className={`address-option custom-address ${useCustomAddress ? 'selected' : ''}`}
                        onClick={() => {
                          handleUseCustomAddress();
                          setShowAddressSelector(false);
                        }}
                      >
                        <div className="address-option-content">
                          <h4>Nhập địa chỉ tạm thời</h4>
                          <p>Sử dụng địa chỉ khác cho lần giao hàng này (không lưu)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Add Address Form */}
                {showAddAddressForm && (
                  <div className="quick-add-address-form">
                    <div className="quick-add-header">
                      <h4>Thêm địa chỉ mới</h4>
                      <button 
                        type="button"
                        className="close-btn"
                        onClick={() => setShowAddAddressForm(false)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                    
                    <div className="quick-add-content">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Họ và tên *</label>
                          <input
                            type="text"
                            name="full_name"
                            value={newAddressData.full_name}
                            onChange={handleNewAddressChange}
                            placeholder="Nhập họ và tên"
                          />
                        </div>
                        <div className="form-group">
                          <label>Email *</label>
                          <input
                            type="email"
                            name="email"
                            value={newAddressData.email}
                            onChange={handleNewAddressChange}
                            placeholder="Nhập email"
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label>Số điện thoại *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={newAddressData.phone}
                          onChange={handleNewAddressChange}
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Địa chỉ *</label>
                        <input
                          type="text"
                          name="address"
                          value={newAddressData.address}
                          onChange={handleNewAddressChange}
                          placeholder="Số nhà, tên đường"
                        />
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label>Phường/Xã</label>
                          <input
                            type="text"
                            name="ward"
                            value={newAddressData.ward}
                            onChange={handleNewAddressChange}
                            placeholder="Nhập phường/xã"
                          />
                        </div>
                        <div className="form-group">
                          <label>Quận/Huyện</label>
                          <input
                            type="text"
                            name="district"
                            value={newAddressData.district}
                            onChange={handleNewAddressChange}
                            placeholder="Nhập quận/huyện"
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label>Tỉnh/Thành phố *</label>
                        <input
                          type="text"
                          name="city"
                          value={newAddressData.city}
                          onChange={handleNewAddressChange}
                          placeholder="VD: TP. Hồ Chí Minh"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>
                          <input
                            type="checkbox"
                            name="is_default"
                            checked={newAddressData.is_default}
                            onChange={handleNewAddressChange}
                          />
                          Đặt làm địa chỉ mặc định
                        </label>
                      </div>
                      
                      <div className="quick-add-actions">
                        <button 
                          type="button"
                          className="btn-secondary"
                          onClick={() => setShowAddAddressForm(false)}
                        >
                          Hủy
                        </button>
                        <button 
                          type="button"
                          className="btn-primary"
                          onClick={handleAddNewAddress}
                        >
                          Thêm địa chỉ
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Custom Address Form - Show when no addresses or using custom */}
                {(shippingAddresses.length === 0 || useCustomAddress) && !showAddressSelector && !showAddAddressForm && (
                  <div className="custom-address-form">
                    {shippingAddresses.length === 0 ? (
                      <div className="no-address-warning">
                        <h3>⚠️ Bạn chưa có địa chỉ giao hàng</h3>
                        <p>Vui lòng thêm địa chỉ giao hàng để tiếp tục đặt hàng.</p>
                        <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                          <button 
                            type='button' 
                            className='chk-btn-primary' 
                            onClick={() => navigate('/shipping-addresses', { state: { fromCheckout: true } })}
                          >
                            Thêm địa chỉ giao hàng
                          </button>
                          <button type='button' className='chk-btn-secondary' onClick={prefillShipping}>
                            Lấy thông tin tài khoản
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3>Thông tin địa chỉ mới</h3>
                        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem'}}>
                          <button type='button' className='chk-btn-secondary' onClick={prefillShipping}>
                            Lấy thông tin địa chỉ mặc định
                          </button>
                        </div>
                      </>
                    )}
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
                    (currentStep === 1 && (shippingAddresses.length === 0 || !validateStep1())) ||
                    (currentStep === 2 && !validateStep2())
                  }
                >
                  {currentStep === 1 && shippingAddresses.length === 0 ? 'Cần thêm địa chỉ' : 'Tiếp tục'}
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
              
              {savings > 0 && (
                <div className="chk-total-row checkout-savings">
                  <span>Tiết kiệm sản phẩm:</span>
                  <span>-{savings.toLocaleString()}đ</span>
                </div>
              )}
              
              {appliedCoupon && discount > 0 && (
                <div className="chk-total-row checkout-discount">
                  <span>Mã giảm giá ({appliedCoupon.code}):</span>
                  <span>-{discount.toLocaleString()}đ ({appliedCoupon.discount_percentage}%)</span>
                </div>
              )}
              
              <div className="chk-total-row">
                <span>Phí vận chuyển:</span>
                <span>{shipping === 0 ? 'Miễn phí' : `${shipping.toLocaleString()}đ`}</span>
              </div>
              
              <div className="chk-total-row chk-final-total">
                <span>Tổng cộng:</span>
                <span>{total.toLocaleString()}đ</span>
              </div>
            </div>

            {/* Hiển thị thông tin mã giảm giá đã áp dụng */}
            {appliedCoupon && (
              <div className="checkout-applied-coupon">
                <div className="coupon-info">
                  <FaCheck className="coupon-check-icon" />
                  <span>Đã áp dụng mã <strong>{appliedCoupon.code}</strong></span>
                </div>
                <div className="coupon-savings">
                  Tiết kiệm: {discount.toLocaleString()}đ
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="checkout-progress">
        <div className="progress-steps">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Thông tin giao hàng</div>
          </div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Thanh toán</div>
          </div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Xác nhận</div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="checkout-navigation">
        {currentStep > 1 && (
          <button 
            className="checkout-nav-btn checkout-prev-btn"
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={stepLoading}
          >
            <FaChevronLeft />
            Quay lại
          </button>
        )}
        
        {currentStep < 3 && (
          <button 
            className="checkout-nav-btn checkout-next-btn"
            onClick={handleNextStep}
            disabled={stepLoading}
          >
            {stepLoading ? (
              <>
                <FaSpinner className="spinning" />
                Đang xử lý...
              </>
            ) : (
              <>
                Tiếp tục
                <FaChevronRight />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Checkout;