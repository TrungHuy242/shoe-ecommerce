// frontend/src/features/user/Cart/Cart.js
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { useCart } from '../../../context/CartContext';
import { useNotification } from '../../../context/NotificationContext';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag, FaArrowLeft, FaTags, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [showBuyNowNotice, setShowBuyNowNotice] = useState(false);
  const [removingItems, setRemovingItems] = useState(new Set());
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState(new Set());
  const {fetchCartCount, removeFromCart, updateCartItemQuantity } = useCart();
  const { success, error } = useNotification();

  // Thêm state để lưu danh sách promotions
  const [availablePromotions, setAvailablePromotions] = useState([]);

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
      
      // Kiểm tra xem có sản phẩm "mua ngay" không
      const buyNowData = localStorage.getItem('buy_now_product');
      if (buyNowData) {
        try {
          const { productId, timestamp } = JSON.parse(buyNowData);
          // Chỉ xử lý nếu timestamp không quá 5 phút (tránh trường hợp cũ)
          if (Date.now() - timestamp < 5 * 60 * 1000) {
            // Tìm cart item có productId tương ứng
            const buyNowItem = merged.find(item => item.productId === productId);
            if (buyNowItem) {
              // Chỉ chọn sản phẩm "mua ngay"
              setSelectedIds(new Set([buyNowItem.id]));
            } else {
              // Nếu không tìm thấy, chọn tất cả (fallback)
              setSelectedIds(new Set(merged.map(i => i.id)));
            }
          } else {
            // Nếu quá thời gian, chọn tất cả
            setSelectedIds(new Set(merged.map(i => i.id)));
          }
          // Xóa thông tin "mua ngay" sau khi xử lý
          localStorage.removeItem('buy_now_product');
        } catch (error) {
          console.error('Error parsing buy now data:', error);
          // Fallback: chọn tất cả
          setSelectedIds(new Set(merged.map(i => i.id)));
        }
      } else {
        // Không có "mua ngay": chọn tất cả như bình thường
        setSelectedIds(new Set(merged.map(i => i.id)));
      }
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu giỏ hàng:', err?.response?.data || err.message);
      if (err?.response?.status === 401) navigate('/login');
      setCartItems([]);
      setSelectedIds(new Set());
    } finally {
      setLoading(false);
    }
  };

  // Thêm useEffect để load promotions
  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const response = await api.get('promotions/');
        const promotions = response.data.results || response.data || [];
        const activePromotions = promotions.filter(p => p.is_active);
        setAvailablePromotions(activePromotions.slice(0, 3)); // Lấy 3 mã đầu tiên
      } catch (error) {
        console.error('Load promotions error:', error);
      }
    };
    
    loadPromotions();
  }, []);

  useEffect(() => {
    // Kiểm tra xem có đến từ "mua ngay" không
    const buyNowData = localStorage.getItem('buy_now_product');
    if (buyNowData) {
      setShowBuyNowNotice(true);
      // Tự động ẩn thông báo sau 5 giây
      setTimeout(() => setShowBuyNowNotice(false), 5000);
    }
    
    fetchCartData();
  }, []);

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(cartItemId));
    
    try {
      const successResult = await updateCartItemQuantity(cartItemId, newQuantity);
      if (successResult) {
        setCartItems(items =>
          items.map(i => (i.id === cartItemId ? { ...i, quantity: newQuantity } : i))
        );
        success('Cập nhật số lượng thành công!');
        console.log('Quantity updated successfully:', cartItemId, newQuantity);
      } else {
        error('Có lỗi khi cập nhật số lượng!');
      }
    } catch (e) {
      console.error('Update quantity error:', e?.response?.data || e.message);
      error('Có lỗi khi cập nhật số lượng!');
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev);
        next.delete(cartItemId);
        return next;
      });
    }
  };

  const removeItem = async (cartItemId) => {
    setRemovingItems(prev => new Set(prev).add(cartItemId));
    
    try {
      // tìm productId trước khi xóa khỏi state
      const item = (cartItems || []).find(i => i.id === cartItemId);
  
      const successResult = await removeFromCart(cartItemId);
      
      if (successResult) {
        // Animation delay before removing from UI
        setTimeout(() => {
          setCartItems(items => items.filter(i => i.id !== cartItemId));
          setSelectedIds(prev => { 
            const n = new Set(prev); 
            n.delete(cartItemId); 
            return n; 
          });
          
          const metaRaw = localStorage.getItem('cart_item_meta');
          if (metaRaw) {
            const meta = JSON.parse(metaRaw);
            delete meta[cartItemId];
            if (item?.productId) delete meta[item.productId];
            localStorage.setItem('cart_item_meta', JSON.stringify(meta));
          }
          
          setRemovingItems(prev => {
            const next = new Set(prev);
            next.delete(cartItemId);
            return next;
          });
          
          success('Đã xóa sản phẩm khỏi giỏ hàng!');
          console.log('Item removed successfully:', cartItemId);
        }, 300);
      } else {
        error('Có lỗi khi xóa sản phẩm!');
        setRemovingItems(prev => {
          const next = new Set(prev);
          next.delete(cartItemId);
          return next;
        });
      }
    } catch (e) {
      console.error('Remove item error:', e?.response?.data || e.message);
      error('Có lỗi khi xóa sản phẩm!');
      setRemovingItems(prev => {
        const next = new Set(prev);
        next.delete(cartItemId);
        return next;
      });
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      alert('Vui lòng nhập mã giảm giá!');
      return;
    }

    setCouponLoading(true);
    try {
      // Lấy danh sách tất cả promotions
      const response = await api.get('promotions/');
      const promotions = response.data.results || response.data || [];
      
      // Tìm promotion theo code
      const promotion = promotions.find(p => 
        p.code.toUpperCase() === couponCode.trim().toUpperCase() && p.is_active
      );

      if (!promotion) {
        alert('Mã giảm giá không tồn tại hoặc không còn hiệu lực!');
        return;
      }

      // Kiểm tra thời hạn
      const now = new Date();
      if (promotion.start_date && new Date(promotion.start_date) > now) {
        alert('Mã giảm giá chưa có hiệu lực!');
        return;
      }
      
      if (promotion.end_date && new Date(promotion.end_date) < now) {
        alert('Mã giảm giá đã hết hạn!');
        return;
      }

      // Tính toán discount cho các sản phẩm được chọn
      const selectedItems = cartItems.filter(item => selectedIds.has(item.id));
      const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      
      if (subtotal === 0) {
        alert('Vui lòng chọn sản phẩm để áp dụng mã giảm giá!');
        return;
      }

      const discountAmount = subtotal * (promotion.discount_percentage / 100);

      setAppliedCoupon({
        code: promotion.code,
        discount_percentage: promotion.discount_percentage,
        discount_amount: discountAmount,
        applicable_amount: subtotal,
        promotion_id: promotion.id,
        type: 'percentage'
      });
      
      alert(`Áp dụng thành công mã giảm giá ${promotion.discount_percentage}%!`);
    } catch (error) {
      console.error('Apply coupon error:', error);
      alert('Có lỗi xảy ra khi áp dụng mã giảm giá!');
    } finally {
      setCouponLoading(false);
    }
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
  
  // Sử dụng discount_amount từ API thay vì tính toán cục bộ
  let discount = 0;
  if (appliedCoupon && appliedCoupon.discount_amount) {
    discount = appliedCoupon.discount_amount;
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
        {showBuyNowNotice && (
          <div className="cart-buy-now-notice" style={{
            backgroundColor: '#e8f5e8',
            border: '1px solid #4caf50',
            borderRadius: '4px',
            padding: '12px',
            marginBottom: '16px',
            color: '#2e7d32'
          }}>
            <p>✓ Sản phẩm đã được thêm vào giỏ hàng và được chọn sẵn để thanh toán. Bạn có thể chọn thêm sản phẩm khác nếu muốn.</p>
            <button 
              onClick={() => setShowBuyNowNotice(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#2e7d32',
                cursor: 'pointer',
                float: 'right',
                fontSize: '16px'
              }}
            >
              ×
            </button>
          </div>
        )}
        
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
                <div 
                  key={item.id} 
                  className={`cart-item ${removingItems.has(item.id) ? 'cart-item-removing' : ''} ${updatingItems.has(item.id) ? 'cart-item-updating' : ''}`}
                >
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
                        disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                      >
                        <FaMinus />
                      </button>
                      <span className="cart-quantity">
                        {updatingItems.has(item.id) ? (
                          <div className="cart-loading-spinner"></div>
                        ) : (
                          item.quantity
                        )}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="cart-qty-btn"
                        disabled={updatingItems.has(item.id)}
                      >
                        <FaPlus />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="cart-remove-btn"
                      disabled={removingItems.has(item.id)}
                      title="Xóa sản phẩm"
                    >
                      {removingItems.has(item.id) ? (
                        <div className="cart-loading-spinner-small"></div>
                      ) : (
                        <FaTrash />
                      )}
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
                    -{appliedCoupon.discount_percentage}% 
                    ({discount.toLocaleString('vi-VN')}đ)
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
                    onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={!couponCode.trim() || couponLoading}
                    className="cart-apply-coupon-btn"
                  >
                    {couponLoading ? 'Đang xử lý...' : 'Áp dụng'}
                  </button>
                </div>
              )}

              {/* Hiển thị gợi ý mã giảm giá từ database */}
              {availablePromotions.length > 0 && (
                <div className="cart-coupon-suggestions">
                  <p>💡 Mã giảm giá có sẵn:</p>
                  <div className="cart-coupon-hints">
                    {availablePromotions.map(promo => (
                      <span 
                        key={promo.id}
                        onClick={() => setCouponCode(promo.code)}
                        title={`Giảm ${promo.discount_percentage}%`}
                      >
                        {promo.code} (-{promo.discount_percentage}%)
                      </span>
                    ))}
                  </div>
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
              <Link 
                to="/checkout" 
                state={{ 
                  items: selectedItems,
                  appliedCoupon: appliedCoupon // Truyền thông tin mã giảm giá sang checkout
                }} 
                className="cart-checkout-btn"
              >
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