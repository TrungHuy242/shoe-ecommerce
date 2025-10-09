import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaDollarSign, FaTruck, FaTags } from 'react-icons/fa';
import { getOrder, getUser, mapBeToUiStatus, mapPaymentStatus, getOrderItems } from '../../../../services/orderService';
import './OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const rawId = useMemo(() => {
    const s = String(id || '');
    return s.startsWith('FT') ? s.slice(2) : s;
  }, [id]);

  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND', 
      minimumFractionDigits: 0 
    }).format(Number(amount || 0));
  };
  
  const formatDateTime = (dateString) => new Date(dateString).toLocaleString('vi-VN');

  const getStatusVi = (uiStatus) => {
    const map = {
      processing: 'Đang xử lý', 
      shipping: 'Đang giao', 
      delivered: 'Đã giao', 
      cancelled: 'Đã hủy'
    };
    return map[uiStatus] || 'Đang xử lý';
  };

  const getPaymentStatusVi = (uiStatus) => {
    const map = {
      pending: 'Chờ thanh toán', 
      processing: 'Đang thanh toán', 
      paid: 'Đã thanh toán', 
      refunded: 'Đã hoàn tiền', 
      failed: 'Thanh toán lỗi'
    };
    return map[uiStatus] || 'Chờ thanh toán';
  };

  const getPaymentMethodVi = (method) => {
    const m = String(method || '').toLowerCase();
    if (['cod', 'cash_on_delivery'].includes(m)) return 'Thanh toán khi nhận hàng';
    if (['bank', 'bank_transfer', 'transfer', 'qr'].includes(m)) return 'Chuyển khoản ngân hàng';
    return method || '-';
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const o = await getOrder(rawId);
        const u = await getUser(o.user);
        const its = await getOrderItems(rawId);
        
        if (!mounted) return;
        setOrder(o);
        setUser(u);
        setItems(its);
      } catch (e) {
        console.error('Failed to load order detail:', e);
        if (mounted) {
          setOrder(null);
          setUser(null);
          setItems([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    if (rawId) load();
    return () => { mounted = false; };
  }, [rawId]);

  if (loading) {
    return (
      <div className="od-page">
        <div className="od-container">
          <div className="od-loading">
            <div className="od-spinner"></div>
            <p>Đang tải chi tiết đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="od-page">
        <div className="od-container">
          <Link to="/admin/orders" className="od-back-btn">
            <FaArrowLeft /> Quay lại danh sách
          </Link>
          <p>Không tìm thấy đơn hàng.</p>
        </div>
      </div>
    );
  }

  const uiStatus = mapBeToUiStatus(order.status);
  const uiPayment = mapPaymentStatus(order.payment_status);

  // Tính toán đơn giản
  const subtotal = Number(order.subtotal || 0);
  const discount = Number(order.discount_amount || 0);
  const shipping = Number(order.shipping_fee || 0);
  const total = Number(order.total || 0);

  return (
    <div className="od-page">
      <div className="od-container">
        <div className="od-header">
          <div className="od-header-left">
            <h1>Chi tiết đơn hàng #{id}</h1>
            <p><FaCalendarAlt /> {formatDateTime(order.created_at)}</p>
          </div>
          <div className="od-header-actions">
            <Link to="/admin/orders" className="od-export-btn">
              <FaArrowLeft /> Quay lại
            </Link>
          </div>
        </div>

        <div className="od-grid">
          {/* Thông tin khách hàng */}
          <div className="od-card">
            <h3><FaUser /> Khách hàng</h3>
            <div className="od-row">
              <span>Tên:</span>
              <strong>{user?.name || user?.username || `User #${order.user}`}</strong>
            </div>
            <div className="od-row">
              <span>Email:</span>
              <strong>{user?.email || '-'}</strong>
            </div>
            <div className="od-row">
              <span>SĐT:</span>
              <strong>{user?.phone || '-'}</strong>
            </div>
            <div className="od-row">
              <span>Địa chỉ:</span>
              <strong>{user?.address || '-'}</strong>
            </div>
          </div>

          {/* Trạng thái đơn hàng */}
          <div className="od-card">
            <h3><FaTruck /> Trạng thái</h3>
            <div className="od-row">
              <span>Đơn hàng:</span>
              <strong className={`od-status-${uiStatus}`}>{getStatusVi(uiStatus)}</strong>
            </div>
            <div className="od-row">
              <span>Thanh toán:</span>
              <strong className={`od-payment-${uiPayment}`}>{getPaymentStatusVi(uiPayment)}</strong>
            </div>
            <div className="od-row">
              <span>Phương thức:</span>
              <strong>{getPaymentMethodVi(order.payment_method)}</strong>
            </div>
            {order.promotion_code && (
              <div className="od-row">
                <span><FaTags /> Mã giảm giá:</span>
                <strong className="od-promotion-code">{order.promotion_code}</strong>
              </div>
            )}
          </div>

          {/* Chi tiết thanh toán */}
          <div className="od-card">
            <h3><FaDollarSign /> Chi tiết thanh toán</h3>
            <div className="od-row">
              <span>Tạm tính:</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            
            {discount > 0 && (
              <div className="od-row od-discount">
                <span>Mã giảm giá ({order.promotion_code}):</span>
                <strong>-{formatCurrency(discount)}</strong>
              </div>
            )}
            
            <div className="od-row">
              <span>Phí vận chuyển:</span>
              <strong>{formatCurrency(shipping)}</strong>
            </div>
            
            <div className="od-row od-total">
              <span>Tổng cộng:</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="od-card">
          <h3>Sản phẩm ({items.length})</h3>
          <div className="od-table-wrap">
            <table className="od-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Size</th>
                  <th>Màu</th>
                  <th>Đơn giá</th>
                  <th>SL</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                      Không có sản phẩm
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>{item.product_name || `Sản phẩm #${item.productId}`}</strong>
                      </td>
                      <td>{item.size || '-'}</td>
                      <td>{item.color || '-'}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{item.quantity}</td>
                      <td><strong>{formatCurrency(item.price * item.quantity)}</strong></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;