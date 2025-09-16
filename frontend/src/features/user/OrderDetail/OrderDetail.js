import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../../services/api';
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
  const [order, setOrder] = useState(null);
  const [details, setDetails] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const oRes = await api.get(`orders/${id}/`);
        const o = oRes.data;
        setOrder(o);

        const dRes = await api.get('order-details/', { params: { order: id } });
        const d = Array.isArray(dRes.data) ? dRes.data : (dRes.data.results || []);

        const products = await Promise.all(
          d.map(item => api.get(`products/${item.product}/`).then(r => r.data).catch(() => null))
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
          const uRes = await api.get(`users/${o.user}/`);
          setUser(uRes.data);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="order-detail-loading">Đang tải...</div>;
  if (!order) return <div className="order-detail-error">Không tìm thấy đơn hàng</div>;

  const total = Number(order.total || 0);

  return (
    <div className="order-detail-page">
      <h1 className="order-detail-title">Chi tiết đơn hàng #{`FT${order.id}`}</h1>

      <div className="order-detail-container">
        {/* Cột trái */}
        <div className="order-detail-left">
          <section className="order-detail-section">
            <h3 className="order-detail-section-title">Thông tin người mua</h3>
            <div className="order-detail-info-item">Tên: {user?.name || user?.username}</div>
            <div className="order-detail-info-item">Email: {user?.email}</div>
            <div className="order-detail-info-item">Điện thoại: {user?.phone}</div>
            <div className="order-detail-info-item">Địa chỉ: {user?.address}</div>
            <div className="order-detail-info-item">Tỉnh/Thành phố: {user?.city}</div>
            <div className="order-detail-info-item">Quận/Huyện: {user?.district}</div>
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
                </div>
              </div>
            ))}
            <div className="order-detail-total-row">
              <span>Tổng cộng</span>
              <span>{total.toLocaleString('vi-VN')}đ</span>
            </div>
          </section>
        </div>
      </div>

      <div className="order-detail-back-link">
        <Link to="/orders">← Quay lại lịch sử đơn hàng</Link>
      </div>
    </div>
  );
};

export default OrderDetail;
