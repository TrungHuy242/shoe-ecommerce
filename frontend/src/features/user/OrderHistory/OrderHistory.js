import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaClipboardList,
  FaSearch,
  FaEye,
  FaStar,
  FaShoppingCart,
  FaTruck,
  FaCheck,
  FaTimes,
  FaFilter,
  FaCalendarAlt,
  FaReceipt
} from 'react-icons/fa';
import './OrderHistory.css';
import api from '../../../services/api';

const getStatusMeta = (status) => {
  switch (status) {
    case 'processing': return { label: 'Đang xử lý', className: 'processing', Icon: FaClipboardList };
    case 'shipping':   return { label: 'Đang giao',   className: 'shipping',   Icon: FaTruck };
    case 'delivered':  return { label: 'Đã giao',     className: 'delivered',  Icon: FaCheck };
    case 'cancelled':  return { label: 'Đã hủy',      className: 'cancelled',  Icon: FaTimes };
    default:           return { label: 'Đang xử lý',  className: 'processing', Icon: FaClipboardList };
  }
};

const OrderHistory = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // ĐÁNH GIÁ (FE only)
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewItem, setReviewItem] = useState(null); 
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [localReviews, setLocalReviews] = useState(() => {
    try { return JSON.parse(localStorage.getItem('local_reviews') || '{}'); } catch { return {}; }
  });
  
  const isReviewed = (orderId, productId) => !!localReviews?.[makeReviewKey(orderId, productId)];
  const getReview = (orderId, productId) => localReviews?.[makeReviewKey(orderId, productId)];

  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return null;
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return decoded.user_id || decoded.userId || null;
    } catch {
      return null;
    }
  };
  
  const makeReviewKey = (orderId, productId) => `${orderId}:${productId}`;

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const uid = getCurrentUserId();
        if (!uid) {
          setOrders([]);
          setLoading(false);
          return;
        }

        // 1) Lấy danh sách đơn của user
        const ordersRes = await api.get('orders/', { params: { user: uid, ordering: '-created_at' } });
        const rawOrders = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data.results || []);

        // 2) Enrich mỗi đơn với order-details và thông tin product
        const enriched = await Promise.all(rawOrders.map(async (o) => {
          const detailsRes = await api.get('order-details/', { params: { order: o.id } });
          const details = Array.isArray(detailsRes.data) ? detailsRes.data : (detailsRes.data.results || []);

          const products = await Promise.all(
            details.map(d => api.get(`products/${d.product}/`).then(r => r.data).catch(() => null))
          );

          const items = details.map((d, idx) => {
            const p = products[idx];
            return {
              id: d.id,
              productId: d.product,
              name: p?.name || `Sản phẩm #${d.product}`,
              price: Number(d.unit_price || 0),
              quantity: d.quantity || 1,
              image: (p?.images && p.images[0]?.image) || p?.image || '/assets/images/products/giày.jpg',
              size: d.size || '',
              color: d.color || ''
            };
          });

          const computedTotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
          const total = Number(o.total || 0) > 0 ? Number(o.total) : computedTotal;

          const statusMap = { pending: 'processing', shipped: 'shipping', delivered: 'delivered', cancelled: 'cancelled' };
          const uiStatus = statusMap[o.status] || 'processing';

          return {
            id: 'FT' + o.id,
            rawId: o.id,
            date: (o.created_at || '').slice(0, 10),
            status: uiStatus,
            total,
            items,
            shipping: { address: '', method: '', fee: 0 },
            payment: { method: o.payment_method || '', status: o.status === 'delivered' ? 'paid' : 'pending' },
            tracking: null,
            estimatedDelivery: null,
            canReview: uiStatus === 'delivered',
            canReorder: true
          };
        }));

        setOrders(enriched);
      } catch (e) {
        console.error('Load orders error:', e?.response?.data || e.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch =
        String(order.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      const matchesDate = (() => {
        if (dateFilter === 'all') return true;
        const orderDate = new Date(order.date);
        const today = new Date();
        const diffTime = Math.abs(today - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (dateFilter) {
          case 'week': return diffDays <= 7;
          case 'month': return diffDays <= 30;
          case '3months': return diffDays <= 90;
          default: return true;
        }
      })();

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleViewDetail = (orderIdWithPrefix, rawId) => {
    const id = rawId || String(orderIdWithPrefix).replace(/^FT/, '');
    navigate(`/order/${id}`);
  };

  const getOrCreateCartId = async () => {
    const res = await api.get('carts/');
    const carts = Array.isArray(res.data) ? res.data : (res.data.results || []);
    if (carts.length) return carts[0].id;
    const uid = getCurrentUserId();
    const created = await api.post('carts/', { user: uid });
    return created.data.id;
  };

  const handleReorder = async (orderIdWithPrefix, rawId) => {
    try {
      const id = rawId || String(orderIdWithPrefix).replace(/^FT/, '');
      const detailsRes = await api.get('order-details/', { params: { order: id } });
      const details = Array.isArray(detailsRes.data) ? detailsRes.data : (detailsRes.data.results || []);
      if (!details.length) return;

      const cartId = await getOrCreateCartId();
      await Promise.all(details.map(d =>
        api.post('cart-items/', { cart: cartId, product: d.product, quantity: d.quantity }).catch(() => {})
      ));
      navigate('/cart');
    } catch (e) {
      console.error('Reorder error:', e?.response?.data || e.message);
      alert('Không thể mua lại. Vui lòng thử lại.');
    }
  };

  const handleCancelOrder = async (orderIdWithPrefix, rawId) => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    try {
      const id = rawId || String(orderIdWithPrefix).replace(/^FT/, '');
      await api.post(`orders/${id}/cancel/`);
      setOrders(prev => prev.map(o => (o.rawId === Number(id) ? { ...o, status: 'cancelled' } : o)));
      alert('Đã hủy đơn và hoàn kho thành công.');
    } catch (e) {
      console.error('Cancel order error:', e?.response?.data || e.message);
      alert(e?.response?.data?.detail || 'Hủy đơn thất bại.');
    }
  };

  const handleConfirmReceived = async (orderIdWithPrefix, rawId) => {
    if (!window.confirm('Xác nhận đã nhận được hàng?')) return;
    try {
      const id = rawId || String(orderIdWithPrefix).replace(/^FT/, '');
      // Cập nhật cả trạng thái đơn và trạng thái thanh toán trên BE
      await api.patch(`orders/${id}/`, { status: 'delivered', payment_status: 'paid' });

      // Cập nhật ngay trên UI để: 1) ẩn nút xác nhận, 2) bật review, 3) set payment = paid
      setOrders(prev => prev.map(o =>
        o.rawId === Number(id)
          ? { ...o, status: 'delivered', canReview: true, payment: { ...(o.payment || {}), status: 'paid' } }
          : o
      ));

      alert('Xác nhận nhận hàng thành công.');
    } catch (e) {
      console.error('Confirm received error:', e?.response?.data || e.message);
      alert(e?.response?.data?.detail || 'Xác nhận thất bại.');
    }
  };

  const openReview = (orderId, item) => {
    setReviewItem({...item, orderId: orderId});
    setReviewStars(5);
    setReviewComment('');
    setReviewOpen(true);
  };

  const submitReview = async () => {
    if (!reviewItem?.productId) return;
    try {
      const token = localStorage.getItem('access_token');
      await api.post(
        `products/${reviewItem.productId}/rate/`,
        { rating: Number(reviewStars) || 5, comment: String(reviewComment || '') },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
  
      const key = makeReviewKey(reviewItem.orderId, reviewItem.productId);
      const next = {
        ...localReviews,
        [key]: {
          stars: Number(reviewStars) || 5,
          comment: String(reviewComment || ''),
          at: new Date().toISOString(),
          name: reviewItem.name || '',
          image: reviewItem.image || ''
        }
      };
      setLocalReviews(next);
      localStorage.setItem('local_reviews', JSON.stringify(next));
  
      setReviewOpen(false);
      setReviewItem(null);
      alert('Đánh giá thành công. Cảm ơn bạn!');
    } catch (e) {
      console.error('Submit review error:', e?.response?.data || e.message);
      alert(e?.response?.data?.detail || 'Gửi đánh giá thất bại.');
    }
  };

  if (loading) {
    return (
      <div className="oh-order-history-page">
        <div className="oh-order-history-container">
          <div className="oh-loading-state">
            <div className="oh-spinner-large"></div>
            <p>Đang tải lịch sử đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="oh-order-history-page">
      <div className="oh-order-history-container">
        <div className="oh-page-header">
          <div className="oh-header-content">
            <div className="oh-title-section">
              <h1>
                <FaReceipt className="oh-title-icon" />
                Lịch sử đơn hàng
              </h1>
              <p>{orders.length} đơn hàng</p>
            </div>

            <div className="oh-header-stats">
              <div className="oh-stat">
                <span className="oh-stat-number">{orders.filter(o => o.status === 'delivered').length}</span>
                <span className="oh-stat-label">Hoàn thành</span>
              </div>
              <div className="oh-stat">
                <span className="oh-stat-number">{orders.filter(o => o.status === 'shipping').length}</span>
                <span className="oh-stat-label">Đang giao</span>
              </div>
              <div className="oh-stat">
                <span className="oh-stat-number">
                  {orders.reduce((sum, order) => sum + order.total, 0).toLocaleString('vi-VN')}đ
                </span>
                <span className="oh-stat-label">Tổng chi tiêu</span>
              </div>
            </div>
          </div>
        </div>

        <div className="oh-filters-section">
          <div className="oh-search-box">
            <FaSearch className="oh-search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className={`oh-filter-toggle ${showFilters ? 'oh-active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Bộ lọc
          </button>

          {showFilters && (
            <div className="oh-filter-options">
              <div className="oh-filter-group">
                <label>Trạng thái:</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">Tất cả</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipping">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <div className="oh-filter-group">
                <label>Thời gian:</label>
                <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                  <option value="all">Tất cả</option>
                  <option value="week">7 ngày qua</option>
                  <option value="month">30 ngày qua</option>
                  <option value="3months">3 tháng qua</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="oh-no-orders">
            <FaClipboardList className="oh-no-orders-icon" />
            <h3>Không tìm thấy đơn hàng nào</h3>
            <p>
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!'}
            </p>
            {!searchTerm && statusFilter === 'all' && dateFilter === 'all' && (
              <Link to="/products" className="oh-shop-now-btn">
                <FaShoppingCart /> Mua sắm ngay
              </Link>
            )}
          </div>
        ) : (
          <div className="oh-orders-list">
            {filteredOrders.map(order => {
              const { label, className, Icon: StatusIcon } = getStatusMeta(order.status);

              return (
                <div key={order.id} className="oh-order-card">
                  <div className="oh-order-header">
                    <div className="oh-order-info">
                      <h3>Đơn hàng #{order.id}</h3>
                      <div className="oh-order-meta">
                        <span className="oh-order-date">
                          <FaCalendarAlt /> {formatDate(order.date)}
                        </span>
                        <span className={`oh-order-status ${className}`}>
                          <StatusIcon />
                          {label}
                        </span>
                      </div>
                    </div>

                    <div className="oh-order-total">
                      {order.total.toLocaleString('vi-VN')}đ
                    </div>
                  </div>

                  <div className="oh-order-items">
                    {order.items.map(item => {
                      const saved = getReview(order.rawId, item.productId);
                      return (
                        <div key={item.id} className="oh-order-item">
                          <img src={item.image} alt={item.name} />
                          <div className="oh-item-details">
                            <h4>{item.name}</h4>
                            <div className="oh-item-specs">
                              Size: {item.size || '-'} | Màu: {item.color || '-'} | SL: {item.quantity}
                            </div>
                            <div className="oh-item-price">
                              {item.price.toLocaleString('vi-VN')}đ
                            </div>

                            {order.status === 'delivered' && !isReviewed(order.rawId, item.productId) && (
                              <button
                                className="oh-review-btn"
                                onClick={() => openReview(order.rawId, item)}
                              >
                                Đánh giá sản phẩm
                              </button>
                            )}

                            {order.status === 'delivered' && isReviewed(order.rawId, item.productId) && (
                              <div style={{ marginTop: 8, color: '#f59e0b', fontWeight: 600 }}>
                                Đã đánh giá: {'★'.repeat(saved?.stars || 5)}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="oh-order-actions">
                    <Link
                      to="#"
                      className="oh-view-detail-btn"
                      onClick={(e)=>{ e.preventDefault(); handleViewDetail(order.id, order.rawId); }}
                    >
                      <FaEye /> Chi tiết
                    </Link>

                    {order.canReorder && (
                      <button
                        className="oh-reorder-btn"
                        onClick={() => handleReorder(order.id, order.rawId)}
                      >
                        <FaShoppingCart /> Mua lại
                      </button>
                    )}

                    {order.status === 'processing' && (
                      <button
                        className="oh-cancel-btn"
                        onClick={() => handleCancelOrder(order.id, order.rawId)}
                      >
                        <FaTimes /> Hủy đơn
                      </button>
                    )}

                    {order.status === 'shipping' && (
                      <button
                        className='oh-confirm-btn'
                        onClick={() => handleConfirmReceived(order.id, order.rawId)}
                      >
                        <FaCheck /> Xác nhận nhận hàng
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal đánh giá */}
      {reviewOpen && (
        <div className="oh-modal-overlay" style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div className="oh-modal" style={{ background:'#fff', borderRadius:12, width:'90%', maxWidth:520, padding:20 }}>
            <h3 style={{ marginTop:0, marginBottom:12 }}>Đánh giá sản phẩm</h3>
            <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:12 }}>
              {reviewItem?.image && <img src={reviewItem.image} alt={reviewItem?.name} style={{ width:60, height:60, objectFit:'cover', borderRadius:8 }} />}
              <div style={{ fontWeight:600 }}>{reviewItem?.name}</div>
            </div>

            <div style={{ marginBottom:12 }}>
              <div style={{ marginBottom:6, fontWeight:600 }}>Số sao</div>
              <div>
                {[1,2,3,4,5].map(s => (
                  <button
                    key={s}
                    onClick={() => setReviewStars(s)}
                    style={{
                      cursor:'pointer',
                      fontSize:20,
                      marginRight:6,
                      color: s <= reviewStars ? '#f59e0b' : '#d1d5db',
                      background:'transparent',
                      border:'none'
                    }}
                    aria-label={`${s} sao`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom:16 }}>
              <div style={{ marginBottom:6, fontWeight:600 }}>Nhận xét (tuỳ chọn)</div>
              <textarea
                rows={4}
                value={reviewComment}
                onChange={(e)=>setReviewComment(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn..."
                style={{ width:'100%', border:'1px solid #e5e7eb', borderRadius:8, padding:10, outline:'none' }}
              />
            </div>

            <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
              <button onClick={()=>{ setReviewOpen(false); setReviewItem(null); }} style={{ padding:'8px 14px', border:'1px solid #e5e7eb', borderRadius:8, background:'#fff', cursor:'pointer' }}>
                Huỷ
              </button>
              <button onClick={submitReview} style={{ padding:'8px 14px', border:'none', borderRadius:8, background:'#667eea', color:'#fff', cursor:'pointer' }}>
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;