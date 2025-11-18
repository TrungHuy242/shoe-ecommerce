import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../../services/api';
import { useNotification } from '../../../context/NotificationContext';
import './OrderDetail.css';

const statusVi = (s) => ({
  pending: 'Đang xử lý',
  processing: 'Đang xử lý',
  shipped: 'Đang giao',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy'
}[s] || 'Đang xử lý');

const paymentMethodVi = (m) => ({
  qr: 'Quét mã QR ngân hàng',
  cod: 'Thanh toán khi nhận hàng',
  card: 'Thẻ tín dụng/ghi nợ',
  paypal: 'PayPal'
}[m] || 'Không xác định');

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const [order, setOrder] = useState(null);
  const [details, setDetails] = useState([]);
  const [user, setUser] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(null);
  const [errorType, setErrorType] = useState(null); // 'not_found', 'network', 'permission', 'unknown'

  useEffect(() => {
    const load = async () => {
      // Reset error state khi load lại
      setErrorState(null);
      setErrorType(null);
      
      try {
        setLoading(true);
        setOrder(null); // Reset order để tránh hiển thị data cũ
        
        // Fetch order
        const oRes = await api.get(`orders/${id}/`);
        const o = oRes.data;
        
        if (!o) {
          throw new Error('Order data is null');
        }
        
        setOrder(o);

        // Fetch order details
        const dRes = await api.get('order-details/', { params: { order: id } });
        const d = Array.isArray(dRes.data) ? dRes.data : (dRes.data.results || []);

        // Fetch product details for each order detail (with error handling per product)
        const products = await Promise.all(
          d.map(item => 
            api.get(`products/${item.product}/`)
              .then(r => r.data)
              .catch((productErr) => {
                console.warn(`Failed to load product ${item.product}:`, productErr);
                return null; // Continue without product details
              })
          )
        );

        const enriched = d.map((item, idx) => {
          const p = products[idx];
          return {
            ...item,
            productName: p?.name || `Sản phẩm #${item.product}`,
            productImage: (p?.images && p.images[0]?.image) || p?.image || '/assets/images/products/placeholder-product.jpg'
          };
        });
        setDetails(enriched);

        // Load user info (optional - continue if fails)
        if (o?.user) {
          const userId = typeof o.user === 'object' ? o.user.id : o.user;
          if (userId) {
            try {
              const uRes = await api.get(`users/${userId}/`);
              setUser(uRes.data);
            } catch (userErr) {
              console.warn('Load user error (non-critical):', userErr);
              // Continue without user info - không phải lỗi nghiêm trọng
            }
          }
        }

        // Load shipping address if exists
        if (o?.shipping_address) {
          setShippingAddress(o.shipping_address);
        }
      } catch (err) {
        console.error('Load order error:', err);
        
        // Phân loại lỗi để hiển thị message phù hợp
        let errorMsg = 'Không thể tải đơn hàng. Vui lòng thử lại.';
        let errType = 'unknown';
        
        if (!err.response) {
          // Network error (no response)
          errorMsg = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại.';
          errType = 'network';
        } else {
          const status = err.response.status;
          
          if (status === 404) {
            errorMsg = `Không tìm thấy đơn hàng với mã #FT${id}. Vui lòng kiểm tra lại mã đơn hàng.`;
            errType = 'not_found';
          } else if (status === 403) {
            errorMsg = 'Bạn không có quyền truy cập đơn hàng này.';
            errType = 'permission';
          } else if (status === 401) {
            errorMsg = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
            errType = 'unauthorized';
          } else if (status >= 500) {
            errorMsg = 'Lỗi máy chủ. Vui lòng thử lại sau vài phút hoặc liên hệ hỗ trợ.';
            errType = 'server_error';
          } else {
            // Try to get error message from response
            const detailMsg = err?.response?.data?.detail || err?.response?.data?.message;
            if (detailMsg) {
              errorMsg = detailMsg;
            }
          }
        }
        
        setErrorState(errorMsg);
        setErrorType(errType);
        error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, [id, error]);

  // Loading state với skeleton loader
  if (loading) {
    return (
      <div className="order-detail-page">
        <div className="order-detail-loading-container">
          <div className="order-detail-spinner">
            <div className="spinner"></div>
          </div>
          <p className="order-detail-loading-text">Đang tải thông tin đơn hàng...</p>
        </div>
        
        <div className="order-detail-container">
          {/* Left column skeleton */}
          <div className="order-detail-left">
            <div className="order-detail-section">
              <div className="skeleton-section-title"></div>
              <div className="skeleton-info-item"></div>
              <div className="skeleton-info-item"></div>
              <div className="skeleton-info-item"></div>
              <div className="skeleton-info-item"></div>
              <div className="skeleton-info-item" style={{width: '70%'}}></div>
            </div>
            <div className="order-detail-section">
              <div className="skeleton-section-title"></div>
              <div className="skeleton-info-item"></div>
              <div className="skeleton-info-item"></div>
              <div className="skeleton-info-item" style={{width: '80%'}}></div>
            </div>
          </div>
          
          {/* Right column skeleton */}
          <div className="order-detail-right">
            <div className="order-detail-section">
              <div className="skeleton-section-title"></div>
              {/* Product cards skeleton */}
              <div className="skeleton-product-card">
                <div className="skeleton-product-header">
                  <div className="skeleton-product-image"></div>
                  <div className="skeleton-product-info">
                    <div className="skeleton-product-name"></div>
                    <div className="skeleton-product-sub"></div>
                  </div>
                </div>
                <div className="skeleton-product-details">
                  <div className="skeleton-info-item"></div>
                  <div className="skeleton-info-item"></div>
                  <div className="skeleton-info-item" style={{width: '60%'}}></div>
                </div>
              </div>
              <div className="skeleton-product-card">
                <div className="skeleton-product-header">
                  <div className="skeleton-product-image"></div>
                  <div className="skeleton-product-info">
                    <div className="skeleton-product-name"></div>
                    <div className="skeleton-product-sub"></div>
                  </div>
                </div>
                <div className="skeleton-product-details">
                  <div className="skeleton-info-item"></div>
                  <div className="skeleton-info-item"></div>
                  <div className="skeleton-info-item" style={{width: '60%'}}></div>
                </div>
              </div>
              
              {/* Summary skeleton */}
              <div className="skeleton-summary">
                <div className="skeleton-summary-row"></div>
                <div className="skeleton-summary-row" style={{width: '70%'}}></div>
                <div className="skeleton-summary-total"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state với button quay lại
  if (errorState || (!loading && !order)) {
    // Determine error icon and title based on error type
    const getErrorIcon = () => {
      switch (errorType) {
        case 'not_found':
          return '🔍';
        case 'network':
          return '📡';
        case 'permission':
          return '🚫';
        case 'unauthorized':
          return '🔐';
        case 'server_error':
          return '⚠️';
        default:
          return '⚠️';
      }
    };

    const getErrorTitle = () => {
      switch (errorType) {
        case 'not_found':
          return 'Không tìm thấy đơn hàng';
        case 'network':
          return 'Lỗi kết nối';
        case 'permission':
          return 'Không có quyền truy cập';
        case 'unauthorized':
          return 'Phiên đăng nhập hết hạn';
        case 'server_error':
          return 'Lỗi máy chủ';
        default:
          return 'Không thể tải đơn hàng';
      }
    };

    // Don't show retry for not_found errors
    const showRetry = errorType !== 'not_found' && errorType !== 'permission';

    return (
      <div className="order-detail-page">
        <div className="order-detail-error-container">
          <div className="order-detail-error-icon">{getErrorIcon()}</div>
          <h2 className="order-detail-error-title">{getErrorTitle()}</h2>
          <p className="order-detail-error-message">
            {errorState || 'Không tìm thấy đơn hàng. Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ.'}
          </p>
          <div className="order-detail-error-actions">
            <button 
              className="order-detail-back-btn"
              onClick={() => navigate('/orders')}
            >
              ← Quay lại lịch sử đơn hàng
            </button>
            {showRetry && (
              <button 
                className="order-detail-retry-btn"
                onClick={async () => {
                  setErrorState(null);
                  setErrorType(null);
                  setLoading(true);
                  
                  // Retry load order data (không reload page)
                  try {
                    const oRes = await api.get(`orders/${id}/`);
                    const o = oRes.data;
                    
                    if (!o) {
                      throw new Error('Order data is null');
                    }
                    
                    setOrder(o);

                    const dRes = await api.get('order-details/', { params: { order: id } });
                    const d = Array.isArray(dRes.data) ? dRes.data : (dRes.data.results || []);

                    const products = await Promise.all(
                      d.map(item => 
                        api.get(`products/${item.product}/`)
                          .then(r => r.data)
                          .catch(() => null)
                      )
                    );

                    const enriched = d.map((item, idx) => {
                      const p = products[idx];
                      return {
                        ...item,
                        productName: p?.name || `Sản phẩm #${item.product}`,
                        productImage: (p?.images && p.images[0]?.image) || p?.image || '/assets/images/products/placeholder-product.jpg'
                      };
                    });
                    setDetails(enriched);

                    if (o?.user) {
                      const userId = typeof o.user === 'object' ? o.user.id : o.user;
                      if (userId) {
                        try {
                          const uRes = await api.get(`users/${userId}/`);
                          setUser(uRes.data);
                        } catch (userErr) {
                          console.warn('Load user error (non-critical):', userErr);
                        }
                      }
                    }

                    if (o?.shipping_address) {
                      setShippingAddress(o.shipping_address);
                    }
                  } catch (retryErr) {
                    console.error('Retry load order error:', retryErr);
                    let errorMsg = 'Không thể tải đơn hàng. Vui lòng thử lại.';
                    let errType = 'unknown';
                    
                    if (!retryErr.response) {
                      errorMsg = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại.';
                      errType = 'network';
                    } else {
                      const status = retryErr.response.status;
                      if (status === 404) {
                        errorMsg = `Không tìm thấy đơn hàng với mã #FT${id}.`;
                        errType = 'not_found';
                      } else if (status === 403) {
                        errorMsg = 'Bạn không có quyền truy cập đơn hàng này.';
                        errType = 'permission';
                      } else {
                        const detailMsg = retryErr?.response?.data?.detail || retryErr?.response?.data?.message;
                        if (detailMsg) errorMsg = detailMsg;
                      }
                    }
                    
                    setErrorState(errorMsg);
                    setErrorType(errType);
                    error(errorMsg);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                🔄 Thử lại
              </button>
            )}
            {errorType === 'unauthorized' && (
              <button 
                className="order-detail-login-btn"
                onClick={() => navigate('/login')}
              >
                🔐 Đăng nhập lại
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Tính toán chi tiết giá
  const calculatedSubtotal = details.reduce((sum, item) => sum + (Number(item.unit_price || 0) * Number(item.quantity || 0)), 0);
  
  // Ưu tiên dữ liệu từ database, fallback về tính toán
  const subtotal = Number(order.subtotal || 0) > 0 ? Number(order.subtotal) : calculatedSubtotal;
  const discount = Number(order.discount_amount || 0);
  const shipping = Number(order.shipping_fee || 0);
  const total = Number(order.total || 0) > 0 ? Number(order.total) : (subtotal - discount + shipping);
  
  const handleConfirmDelivery = async () => {
    try {
      setLoading(true);
      await api.post(`orders/${id}/confirm_delivery/`);
      success('Đã xác nhận nhận hàng thành công!');
      
      // Reload order data
      const oRes = await api.get(`orders/${id}/`);
      const updatedOrder = oRes.data;
      
      if (updatedOrder) {
        setOrder(updatedOrder);
      } else {
        throw new Error('Failed to reload order data');
      }
    } catch (err) {
      console.error('Confirm delivery error:', err);
      const errorMsg = err?.response?.data?.detail || err?.response?.data?.message || 'Có lỗi xảy ra khi xác nhận nhận hàng. Vui lòng thử lại.';
      error(errorMsg);
      
      // Reload order data nếu có thể
      try {
        const oRes = await api.get(`orders/${id}/`);
        if (oRes.data) {
          setOrder(oRes.data);
        }
      } catch (reloadErr) {
        console.error('Failed to reload order after confirm:', reloadErr);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-detail-page">
      <h1 className="order-detail-title">Chi tiết đơn hàng #{`FT${order.id}`}</h1>

      <div className="order-detail-container">
        {/* Cột trái */}
        <div className="order-detail-left">
          <section className="order-detail-section">
            <h3 className="order-detail-section-title">
              Thông tin giao hàng
              {shippingAddress ? (
                <span className="address-source-badge">(Từ địa chỉ đã lưu)</span>
              ) : (
                <span className="address-source-badge">(Nhập mới khi đặt hàng)</span>
              )}
            </h3>
            {shippingAddress ? (
              <>
                <div className="order-detail-info-item">Tên: {shippingAddress.full_name}</div>
                <div className="order-detail-info-item">Email: {shippingAddress.email}</div>
                <div className="order-detail-info-item">Điện thoại: {shippingAddress.phone}</div>
                <div className="order-detail-info-item">Địa chỉ: {shippingAddress.address}</div>
                <div className="order-detail-info-item">Tỉnh/Thành phố: {shippingAddress.city}</div>
                <div className="order-detail-info-item">Quận/Huyện: {shippingAddress.district}</div>
                {shippingAddress.ward && (
                  <div className="order-detail-info-item">Phường/Xã: {shippingAddress.ward}</div>
                )}
              </>
            ) : (
              <>
                <div className="order-detail-info-item">Tên: {user?.name || user?.username}</div>
                <div className="order-detail-info-item">Email: {user?.email}</div>
                <div className="order-detail-info-item">Điện thoại: {user?.phone}</div>
                <div className="order-detail-info-item">Địa chỉ: {user?.address}</div>
                <div className="order-detail-info-item">Tỉnh/Thành phố: {user?.city}</div>
                <div className="order-detail-info-item">Quận/Huyện: {user?.district}</div>
              </>
            )}
          </section>

          <section className="order-detail-section">
            <h3 className="order-detail-section-title">Trạng thái & Thanh toán</h3>
            <div className="order-detail-info-item">
              Trạng thái:{" "}
              <span className={`order-detail-status-${order.status?.toLowerCase()}`}>
                {statusVi(order.status)}
              </span>
            </div>
            <div className="order-detail-info-item">Phương thức: {paymentMethodVi(order.payment_method)}</div>
            <div className="order-detail-info-item">Ngày tạo: {String(order.created_at || '').slice(0, 10)}</div>
            {order.promotion_code && (
              <div className="order-detail-info-item">
                Mã giảm giá: <span className="order-detail-promotion-code">{order.promotion_code}</span>
              </div>
            )}
          </section>
        </div>

        {/* Cột phải */}
        <div className="order-detail-right">
          <section className="order-detail-section order-detail-product-list">
            <h3 className="order-detail-section-title">Sản phẩm</h3>
            {details.map((it) => (
              <div key={it.id} className="order-detail-product-card">
                <div className="order-detail-product-header">
                  <img
                    src={it.productImage}
                    alt={it.productName}
                    className="order-detail-product-img"
                    onError={(e) => { e.currentTarget.src = '/assets/images/products/placeholder-product.jpg'; }}
                  />
                  <div>
                    <div className="order-detail-product-name">{it.productName}</div>
                    <div className="order-detail-product-sub">Mã SP: #{it.product}</div>
                  </div>
                </div>
                <div className="order-detail-product-info">
                  <div><strong>Size:</strong> {it.size || '-'}</div>
                  <div><strong>Màu:</strong> {it.color || '-'}</div>
                  <div><strong>Số lượng:</strong> {it.quantity}</div>
                  <div><strong>Đơn giá:</strong> {Number(it.unit_price || 0).toLocaleString('vi-VN')}đ</div>
                  <div><strong>Thành tiền:</strong> {(Number(it.unit_price || 0) * Number(it.quantity || 0)).toLocaleString('vi-VN')}đ</div>
                </div>
              </div>
            ))}
            
            {/* Chi tiết tính toán */}
            <div className="order-detail-total-section">
              <div className="order-detail-summary-row">
                <span>Tạm tính:</span>
                <span>{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              
              {discount > 0 && (
                <div className="order-detail-summary-row order-detail-discount">
                  <span>Mã giảm giá {order.promotion_code ? `(${order.promotion_code})` : ''}:</span>
                  <span>-{discount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              
              {shipping > 0 && (
                <div className="order-detail-summary-row">
                  <span>Phí vận chuyển:</span>
                  <span>{shipping.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              
              <div className="order-detail-total-row">
                <span>Tổng cộng</span>
                <span>{total.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Confirm Delivery Button */}
      {order && order.status === 'shipped' && (
        <div className="order-detail-actions">
          <button 
            className="confirm-delivery-btn"
            onClick={handleConfirmDelivery}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận đã nhận hàng'}
          </button>
        </div>
      )}

      <div className="order-detail-back-link">
        <Link to="/orders">← Quay lại lịch sử đơn hàng</Link>
      </div>
    </div>
  );
};

export default OrderDetail;
