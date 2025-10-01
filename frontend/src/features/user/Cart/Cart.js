// frontend/src/features/user/Cart/Cart.js
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { useCart } from '../../../context/CartContext';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag, FaArrowLeft, FaTags } from 'react-icons/fa';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState(new Set());
  const {fetchCartCount, removeFromCart, updateCartItemQuantity } = useCart();

  const fetchCartData = async () => {
    try {
      setLoading(true);
      // 1) Lấy danh sách cart-items của user (backend đã filter theo user)
      const res = await api.get('cart-items/');
      const raw = Array.isArray(res.data) ? res.data : (res.data.results || []);

      if (raw.length === 0) {
        setCartItems([]);
        return;
      }

      // 2) Lấy chi tiết product cho từng cart-item
      const productDetails = await Promise.all(
        raw.map(ci => api.get(`products/${ci.product}/`).then(r => r.data).catch(() => null))
      );

      // đọc meta size/color từ localStorage
      const metaRaw = localStorage.getItem('cart_item_meta');
      const meta = metaRaw ? JSON.parse(metaRaw) : {};

      // 3) Gộp dữ liệu để hiển thị
      const merged = raw.map((ci, idx) => {
        const p = productDetails[idx];
        const m = meta[ci.product] || {};
        return {
          id: ci.id,                      // id cart-item (dùng update/xóa)
          productId: ci.product,          // id sản phẩm
          name: p?.name || 'Sản phẩm',
          image: (p?.images && p.images[0]?.image) || p?.image || 'https://via.placeholder.com/300x300?text=Product',
          price: Number(p?.price || 0),
          originalPrice: p?.originalPrice ? Number(p.originalPrice) : 0,
          quantity: ci.quantity || 1,
          size: m.size || '',     // lấy từ meta
          color: m.color || '',   // lấy từ meta
        };
      });

      setCartItems(merged);
      // mặc định: chọn tất cả khi vào trang
      setSelectedIds(new Set(merged.map(i => i.id)));
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu giỏ hàng:', err?.response?.data || err.message);
      if (err?.response?.status === 401) navigate('/login');
      setCartItems([]);
      setSelectedIds(new Set());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItemQuantity(cartItemId, newQuantity);        // ĐỔI: dùng context
      setCartItems(items =>
        items.map(i => (i.id === cartItemId ? { ...i, quantity: newQuantity } : i))
      );
      await fetchCartCount();                                        // THÊM: cập nhật badge
    } catch (e) {
      console.error('Update quantity error:', e?.response?.data || e.message);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      // tìm productId trước khi xóa khỏi state
      const item = (cartItems || []).find(i => i.id === cartItemId);
  
      await removeFromCart(cartItemId);                              // ĐỔI: dùng context để xóa + cập nhật count
      await fetchCartCount();                                        // THÊM: đảm bảo badge cập nhật ngay
  
      setCartItems(items => items.filter(i => i.id !== cartItemId));
      setSelectedIds(prev => { const n = new Set(prev); n.delete(cartItemId); return n; });
  
      const metaRaw = localStorage.getItem('cart_item_meta');
      if (metaRaw) {
        const meta = JSON.parse(metaRaw);
        delete meta[cartItemId];            // legacy
        if (item?.productId) delete meta[item.productId];
        localStorage.setItem('cart_item_meta', JSON.stringify(meta));
      }
    } catch {}
  };

  const applyCoupon = () => {
    setLoading(true);
    setTimeout(() => {
      if (couponCode.toLowerCase() === 'welcome10') {
        setAppliedCoupon({ code: 'WELCOME10', discount: 0.1, type: 'percentage' });
      } else if (couponCode.toLowerCase() === 'save50k') {
        setAppliedCoupon({ code: 'SAVE50K', discount: 50000, type: 'fixed' });
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

  const allSelected = cartItems.length > 0 && selectedIds.size === cartItems.length;
  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(cartItems.map(i => i.id)));
  };
  const toggleSelectOne = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Tổng tiền chỉ theo sản phẩm được chọn
  const selectedItems = cartItems.filter(i => selectedIds.has(i.id));
  const subtotal = selectedItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const savings = selectedItems.reduce((sum, it) => sum + Math.max((it.originalPrice - it.price), 0) * it.quantity, 0);
  let discount = 0;
  if (appliedCoupon) {
    discount = appliedCoupon.type === 'percentage' ? subtotal * appliedCoupon.discount : appliedCoupon.discount;
  }
  const shipping = subtotal >= 1000000 ? 0 : (selectedItems.length > 0 ? 30000 : 0);
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
              <div className="cart-bulk-bar" style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.75rem' }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
                <span>Chọn tất cả ({selectedIds.size}/{cartItems.length})</span>
              </div>
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-checkbox" style={{ display:'flex', alignItems:'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelectOne(item.id)}
                    />
                  </div>

                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <div className="cart-item-attributes">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Màu: {item.color}</span>}
                    </div>
                    <div className="cart-item-price">
                      <span className="cart-current-price">
                        {item.price.toLocaleString('vi-VN')}đ
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="cart-original-price">
                          {item.originalPrice.toLocaleString('vi-VN')}đ
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
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
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
                      : `${appliedCoupon.discount.toLocaleString('vi-VN')}đ`
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
                <span>{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              {savings > 0 && (
                <div className="cart-summary-row cart-savings">
                  <span>Tiết kiệm:</span>
                  <span>-{savings.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              {discount > 0 && (
                <div className="cart-summary-row cart-discount">
                  <span>Giảm giá ({appliedCoupon.code}):</span>
                  <span>-{discount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <div className="cart-summary-row">
                <span>Phí vận chuyển:</span>
                <span>{shipping === 0 ? <span className="cart-free-shipping">Miễn phí</span> : `${shipping.toLocaleString('vi-VN')}đ`}</span>
              </div>
              <div className="cart-summary-row cart-total">
                <span>Tổng cộng:</span>
                <span>{total.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            {shipping > 0 && (
              <div className="cart-shipping-notice">
                <p>
                  Mua thêm {(1000000 - subtotal).toLocaleString('vi-VN')}đ để được
                  <strong> miễn phí vận chuyển</strong>!
                </p>
              </div>
            )}

            <div className="cart-checkout-actions">
              <Link to="/checkout" state={{ items: selectedItems}} className="cart-checkout-btn">
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