import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaDollarSign, FaTruck } from 'react-icons/fa';
import { getOrder, getUser, mapBeToUiStatus, mapPaymentStatus, getOrderItems } from '../../../../services/orderService';
import './OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams(); // id dạng 'FT123'
  const rawId = useMemo(() => {
    const s = String(id || '');
    return s.startsWith('FT') ? s.slice(2) : s;
  }, [id]);

  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(Number(amount || 0));
  };
  const formatDateTime = (dateString) => new Date(dateString).toLocaleString('vi-VN');

  const getStatusVi = (uiStatus) => {
    const map = {processing : 'Đang xử lý', shipping : 'Đang giao', delivered : 'Đã giao', cancelled : 'Đã hủy'};
    return map[uiStatus] || 'Đang xử lý';
  }

  const getPaymentStatusVi = (uiStatus) => {
    const map = {pending : 'Chờ thanh toán', processing : 'Đang thanh toán', paid : 'Đã thanh toán', refunded : 'Đã hoàn tiền', failed : 'Thanh toán lỗi'};
    return map[uiStatus] || 'Chờ thanh toán';
  }

  const getPaymentMethodVi = (method) => {
    const m = String(method || '').toLowerCase();
    if (['cod', 'cash_on_delivery'].includes(m)) return 'Thanh toán khi nhận hàng';
    if (['bank', 'bank_transfer', 'transfer', 'qr'].includes(m)) return 'Chuyển khoản ngân hàng';
    return method || '-';
  }


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
        console.error('Failed to load order detail', e);
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

  return (
    <div className="od-page">
      <div className="od-container">
        <div className="od-header">
          <div className="od-header-left">
            <h1>Chi tiết đơn hàng #{id}</h1>
            <p><FaCalendarAlt /> {formatDateTime(order.created_at || order.updated_at)}</p>
          </div>
          <div className="od-header-actions">
            <Link to="/admin/orders" className="od-export-btn">
              <FaArrowLeft /> Quay lại
            </Link>
          </div>
        </div>

        <div className="od-grid">
          <div className="od-card">
            <h3><FaUser /> Khách hàng</h3>
            <div className="od-row"><span>Tên:</span><strong>{user?.username || user?.name || `User #${order.user ?? ''}`}</strong></div>
            <div className="od-row"><span>Email:</span><strong>{user?.email || '-'}</strong></div>
            <div className="od-row"><span>SĐT:</span><strong>{user?.phone || '-'}</strong></div>
            <div className="od-row"><span>Địa chỉ:</span><strong>{user?.address || '-'}</strong></div>
          </div>

          <div className="od-card">
            <h3><FaTruck /> Trạng thái</h3>
            <div className="od-row"><span>Đơn hàng:</span><strong>{getStatusVi(uiStatus)}</strong></div>
            <div className="od-row"><span>Thanh toán:</span><strong>{getPaymentStatusVi(uiPayment)}</strong></div>
            <div className="od-row"><span>Phương thức:</span><strong>{getPaymentMethodVi(order.payment_method)}</strong></div>
          </div>

          <div className="od-card">
            <h3><FaDollarSign /> Tổng tiền</h3>
            <div className="od-row"><span>Tạm tính:</span><strong>{formatCurrency(order.subtotal || order.total)}</strong></div>
            <div className="od-row"><span>Phí vận chuyển:</span><strong>{formatCurrency(order.shipping_fee || 0)}</strong></div>
            <div className="od-row"><span>Giảm giá:</span><strong>{formatCurrency(order.discount || 0)}</strong></div>
            <div className="od-row"><span>Thành tiền:</span><strong>{formatCurrency(order.total)}</strong></div>
          </div>
        </div>

        <div className="od-card">
          <h3>Sản phẩm</h3>
          <div className="od-table-wrap">
            <table className="od-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Kích thước</th>
                  <th>Màu sắc</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr><td colSpan="6">Không có sản phẩm.</td></tr>
                )}
                {items.map((it, idx) => (
                  <tr key={idx}>
                    <td>{it.product_name || `#${it.productId}`}</td>
                    <td>{it.size || '-'}</td>
                    <td>{it.color || '-'}</td>
                    <td>{formatCurrency(it.price)}</td>
                    <td>{it.quantity}</td>
                    <td>{formatCurrency((it.price || 0) * (it.quantity || 1))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetail;