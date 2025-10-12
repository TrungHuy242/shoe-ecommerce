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
  FaReceipt,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight
} from 'react-icons/fa';
import './OrderHistory.css';
import api from '../../../services/api';

const getStatusMeta = (status) => {
  switch (status) {
    case 'processing': return { label: 'Đang xử lý', className: 'processing', Icon: FaClipboardList };
    case 'confirmed':  return { label: 'Đã xác nhận', className: 'confirmed',  Icon: FaCheck };
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const ordersPerPage = 5;

  // ĐÁNH GIÁ - Đánh giá trực tiếp trong OrderHistory
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewItem, setReviewItem] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [productReviews, setProductReviews] = useState({});

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
  
  // Load reviews cho các sản phẩm đã mua
  const loadProductReviews = async (productIds) => {
    if (productIds.length === 0) return;
    
    try {
      const currentUserId = getCurrentUserId();
      if (!currentUserId) return;
      
      console.log('🔍 Loading reviews for products:', productIds, 'User:', currentUserId);
      
      const reviewsRes = await api.get('reviews/', {
        params: { 
          product__in: productIds.join(','),
          user: currentUserId  // Chỉ lấy reviews của user hiện tại
        }
      });
      const reviews = reviewsRes.data.results || reviewsRes.data;
      
      console.log('📥 Reviews API Response:', reviews);
      
      const reviewMap = {};
      reviews.forEach(review => {
        reviewMap[review.product] = review;
      });
      
      console.log('🗂️ Review Map:', reviewMap);
      setProductReviews(reviewMap);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  // Load orders with pagination
  const loadOrders = async (page = 1, search = '', statusF = 'all', dateF = 'all') => {
    
    try {
      setLoading(true);
      const uid = getCurrentUserId();
      
      if (!uid) {
        setOrders([]);
        setTotalOrders(0);
        setTotalPages(0);
        setLoading(false);
        return;
      }

      // Build API params - BỎ user param vì backend tự filter
      const params = {
        ordering: '-created_at',
        page: page,
        page_size: ordersPerPage
      };

      // Chỉ thêm status filter nếu không phải 'all'
      if (statusF !== 'all') {
        const statusMap = {
          'processing': 'pending',
          'confirmed': 'confirmed',
          'shipping': 'shipped', 
          'delivered': 'delivered',
          'cancelled': 'cancelled'
        };
        params.status = statusMap[statusF] || statusF;
      }

      // Gọi API orders
      const ordersRes = await api.get('orders/', { params });
      
      let rawOrders = [];
      let total = 0;
      
      if (Array.isArray(ordersRes.data)) {
        rawOrders = ordersRes.data;
        total = ordersRes.data.length;
      } else {
        rawOrders = ordersRes.data.results || [];
        total = ordersRes.data.count || 0;
      }


      // 2) Enrich mỗi đơn với order-details và thông tin product
      const enriched = await Promise.all(rawOrders.map(async (o) => {
        const detailsRes = await api.get('order-details/', { 
          params: { 
            order: o.id,
            page_size: 100  // Lấy tất cả order-details cho đơn hàng này
          } 
        });
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
        
        // Lấy thông tin mã giảm giá từ order
        const subtotal = Number(o.subtotal || 0) > 0 ? Number(o.subtotal) : computedTotal;
        const discount = Number(o.discount_amount || 0);
        const shipping = Number(o.shipping_fee || 0);
        const promotionCode = o.promotion_code || null;

        const statusMap = { 
          pending: 'processing', 
          confirmed: 'confirmed', 
          shipped: 'shipping', 
          delivered: 'delivered', 
          cancelled: 'cancelled' 
        };
        const uiStatus = statusMap[o.status] || 'processing';

        // Load reviews cho đơn hàng này - chỉ lấy reviews của user hiện tại cho các sản phẩm trong đơn hàng này
        let orderReviews = [];
        try {
          const currentUserId = getCurrentUserId();
          if (currentUserId) {
            const productIds = items.map(item => item.productId).join(',');
            const reviewsRes = await api.get('reviews/', {
              params: { 
                product__in: productIds,
                user: currentUserId,
                order: o.id
              }
            });
            orderReviews = reviewsRes.data.results || reviewsRes.data;
          }
        } catch (error) {
          console.error('Error loading reviews for order:', o.id, error);
        }

        return {
          id: 'FT' + o.id,
          rawId: o.id,
          date: (o.created_at || '').slice(0, 10),
          status: uiStatus,
          total,
          subtotal,
          discount,
          shipping,
          promotionCode,
          items,
          reviews: orderReviews, // Thêm reviews vào order
          payment: { method: o.payment_method || '', status: o.status === 'delivered' ? 'paid' : 'pending' },
          tracking: null,
          estimatedDelivery: null,
          canReview: uiStatus === 'delivered' || uiStatus === 'confirmed' || uiStatus === 'shipped',
          canReorder: true
        };
      }));

      // 3) Chỉ áp dụng client-side filter cho search và date (không phải status)
      let filteredOrders = enriched;
      
      // Search filter - áp dụng trên frontend vì backend không hỗ trợ search theo tên sản phẩm
      if (search) {
        filteredOrders = filteredOrders.filter(order => 
          String(order.id).toLowerCase().includes(search.toLowerCase()) ||
          order.items.some(item => item.name.toLowerCase().includes(search.toLowerCase()))
        );
      }

      // Date filter - áp dụng trên frontend vì backend không có filter date range
      if (dateF !== 'all') {
        filteredOrders = filteredOrders.filter(order => {
          const orderDate = new Date(order.date);
          const today = new Date();
          const diffTime = Math.abs(today - orderDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          switch (dateF) {
            case 'week': return diffDays <= 7;
            case 'month': return diffDays <= 30;
            case '3months': return diffDays <= 90;
            default: return true;
          }
        });
      }

      // 4) Nếu có search hoặc date filter, cần tính lại total và pages
      let finalTotal = total;
      let finalPages = Math.ceil(total / ordersPerPage);
      
      if (search || dateF !== 'all') {
        // Khi có filter frontend, cần load tất cả để filter chính xác
        // Đây là trường hợp đặc biệt, thường thì backend sẽ xử lý
        finalTotal = filteredOrders.length;
        finalPages = Math.ceil(finalTotal / ordersPerPage);
        
        // Pagination trên frontend filtered results
        const startIndex = (page - 1) * ordersPerPage;
        const endIndex = startIndex + ordersPerPage;
        filteredOrders = filteredOrders.slice(startIndex, endIndex);
      }

      setOrders(filteredOrders);
      setTotalOrders(finalTotal);
      setTotalPages(finalPages);
      
       // Reviews đã được load trong từng order, không cần load riêng
      
      
    } catch (e) {
      console.error('Load orders error:', e?.response?.data || e.message);
      setOrders([]);
      setTotalOrders(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(currentPage, searchTerm, statusFilter, dateFilter);
  }, [currentPage, searchTerm, statusFilter, dateFilter]);

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  // Filter handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

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
      // Reload current page
      loadOrders(currentPage, searchTerm, statusFilter, dateFilter);
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
      await api.patch(`orders/${id}/`, { status: 'delivered', payment_status: 'paid' });
      // Reload current page
      loadOrders(currentPage, searchTerm, statusFilter, dateFilter);
      alert('Xác nhận nhận hàng thành công.');
    } catch (e) {
      console.error('Confirm received error:', e?.response?.data || e.message);
      alert(e?.response?.data?.detail || 'Xác nhận thất bại.');
    }
  };

  const openReview = (item, order) => {
    setReviewItem({...item, orderId: order.rawId});
    setReviewRating(5);
    setReviewTitle(`Đánh giá ${item.name}`);
    setReviewComment('');
    setReviewOpen(true);
  };

  const submitReview = async () => {
    if (!reviewItem?.productId) return;
    
    // Validation ở frontend
    if (!reviewRating || reviewRating < 1 || reviewRating > 5) {
      alert('Vui lòng chọn đánh giá từ 1 đến 5 sao');
      return;
    }
    
    if (!reviewTitle.trim() || reviewTitle.trim().length < 3) {
      alert('Tiêu đề đánh giá phải có ít nhất 3 ký tự');
      return;
    }
    
    if (!reviewComment.trim() || reviewComment.trim().length < 10) {
      alert('Nội dung đánh giá phải có ít nhất 10 ký tự');
      return;
    }
    
    setSubmittingReview(true);
    try {
      const reviewData = {
        product: reviewItem.productId,
        order: reviewItem.orderId,
        rating: reviewRating,
        title: reviewTitle.trim(),
        comment: reviewComment.trim()
      };
      
      const response = await api.post('reviews/', reviewData);
  
       // Reload orders để cập nhật reviews
       loadOrders(currentPage, searchTerm, statusFilter, dateFilter);
  
      setReviewOpen(false);
      setReviewItem(null);
      alert('Đánh giá thành công. Cảm ơn bạn!');
    } catch (e) {
      console.error('Submit review error:', e?.response?.data || e.message);
      
      // Hiển thị lỗi chi tiết từ backend
      let errorMessage = 'Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.';
      
      if (e?.response?.data) {
        const errorData = e.response.data;
        console.log('Error data:', errorData);
        
        if (typeof errorData === 'object') {
          // Lấy lỗi đầu tiên từ validation
          const firstError = Object.values(errorData)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else if (typeof firstError === 'string') {
            errorMessage = firstError;
          }
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      }
      
      alert(errorMessage);
    } finally {
      setSubmittingReview(false);
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
              <p>{totalOrders} đơn hàng • Trang {currentPage}/{totalPages}</p>
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
                <span className="oh-stat-label">Tổng trang này</span>
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
              onChange={handleSearchChange}
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
                <select value={statusFilter} onChange={handleStatusFilterChange}>
                  <option value="all">Tất cả</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="shipping">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <div className="oh-filter-group">
                <label>Thời gian:</label>
                <select value={dateFilter} onChange={handleDateFilterChange}>
                  <option value="all">Tất cả</option>
                  <option value="week">7 ngày qua</option>
                  <option value="month">30 ngày qua</option>
                  <option value="3months">3 tháng qua</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {orders.length === 0 ? (
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
          <>
            <div className="oh-orders-list">
              {orders.map(order => {
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
                          {order.promotionCode && (
                            <span className="oh-order-promotion">
                              🏷️ {order.promotionCode}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="oh-order-total">
                        {order.discount > 0 ? (
                          <div className="oh-order-pricing">
                            <div className="oh-original-total">{order.subtotal.toLocaleString('vi-VN')}đ</div>
                            <div className="oh-discount">-{order.discount.toLocaleString('vi-VN')}đ</div>
                            <div className="oh-final-total">{order.total.toLocaleString('vi-VN')}đ</div>
                          </div>
                        ) : (
                          <div className="oh-final-total">{order.total.toLocaleString('vi-VN')}đ</div>
                        )}
                      </div>
                    </div>

                    <div className="oh-order-items">
                      {order.items.map(item => {
                        // Tìm review trong order.reviews có productId trùng với sản phẩm hiện tại VÀ orderId trùng với đơn hàng hiện tại
                        const existingReview = order.reviews?.find(review => 
                          review.product === item.productId && 
                          review.order === order.rawId && 
                          review.rating !== null
                        );
                        
                        
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

                              {order.status === 'delivered' && !existingReview && (
                                <button
                                  className="oh-review-btn"
                                  onClick={() => openReview(item, order)}
                                >
                                  Đánh giá sản phẩm
                                </button>
                              )}

                              {order.status === 'delivered' && existingReview && (
                                <div style={{ marginTop: 8, color: '#f59e0b', fontWeight: 600 }}>
                                  Đã đánh giá: {'★'.repeat(existingReview.rating)}
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="oh-pagination">
                <div className="oh-pagination-info">
                  Hiển thị {((currentPage - 1) * ordersPerPage) + 1}-{Math.min(currentPage * ordersPerPage, totalOrders)} trong {totalOrders} đơn hàng
                </div>
                
                <div className="oh-pagination-controls">
                  <button 
                    onClick={handleFirstPage} 
                    disabled={currentPage === 1}
                    className="oh-pagination-btn oh-pagination-first"
                    title="Trang đầu"
                  >
                    <FaAngleDoubleLeft />
                  </button>
                  
                  <button 
                    onClick={handlePrevPage} 
                    disabled={currentPage === 1}
                    className="oh-pagination-btn oh-pagination-prev"
                    title="Trang trước"
                  >
                    <FaChevronLeft />
                  </button>

                  <div className="oh-pagination-numbers">
                    {getPageNumbers().map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`oh-pagination-btn oh-pagination-number ${currentPage === page ? 'oh-active' : ''}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={handleNextPage} 
                    disabled={currentPage === totalPages}
                    className="oh-pagination-btn oh-pagination-next"
                    title="Trang sau"
                  >
                    <FaChevronRight />
                  </button>
                  
                  <button 
                    onClick={handleLastPage} 
                    disabled={currentPage === totalPages}
                    className="oh-pagination-btn oh-pagination-last"
                    title="Trang cuối"
                  >
                    <FaAngleDoubleRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal đánh giá - Đánh giá trực tiếp */}
      {reviewOpen && reviewItem && (
        <div className="oh-modal-overlay" style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div className="oh-modal" style={{ background:'#fff', borderRadius:16, width:'90%', maxWidth:500, padding:0, overflow:'hidden' }}>
            <div style={{ padding:'1.5rem', borderBottom:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h3 style={{ margin:0, fontSize:'1.25rem', fontWeight:600, color:'#2d3748' }}>Đánh giá sản phẩm</h3>
              <button onClick={()=>{ setReviewOpen(false); setReviewItem(null); }} style={{ background:'none', border:'none', fontSize:'1.2rem', color:'#718096', cursor:'pointer', padding:'0.5rem', borderRadius:'50%' }}>
                ✕
              </button>
            </div>

            <div style={{ padding:'1.5rem', background:'#f7fafc', borderBottom:'1px solid #e2e8f0', display:'flex', alignItems:'center', gap:'1rem' }}>
              <img src={reviewItem.image} alt={reviewItem.name} style={{ width:60, height:60, objectFit:'cover', borderRadius:8 }} />
              <div>
                <h4 style={{ margin:'0 0 0.25rem 0', fontSize:'1rem', fontWeight:600, color:'#2d3748' }}>{reviewItem.name}</h4>
                <p style={{ margin:0, fontSize:'0.85rem', color:'#718096' }}>Sản phẩm đã mua</p>
              </div>
            </div>

            <form onSubmit={(e)=>{ e.preventDefault(); submitReview(); }} style={{ padding:'1.5rem' }}>
              <div style={{ marginBottom:'1.5rem' }}>
                <label style={{ display:'block', marginBottom:'0.75rem', fontWeight:600, color:'#4a5568' }}>Đánh giá của bạn:</label>
                <div style={{ display:'flex', gap:'0.25rem', marginBottom:'0.5rem' }}>
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      style={{
                        cursor:'pointer',
                        fontSize:'1.5rem',
                        color: star <= reviewRating ? '#fbbf24' : '#e2e8f0',
                        background:'transparent',
                        border:'none',
                        transition:'color 0.2s ease'
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {reviewRating > 0 && <span style={{ color:'#667eea', fontWeight:600, fontSize:'0.9rem' }}>{reviewRating} sao</span>}
              </div>

              <div style={{ marginBottom:'1.5rem' }}>
                <label style={{ display:'block', marginBottom:'0.5rem', fontWeight:600, color:'#4a5568' }}>Tiêu đề đánh giá:</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Nhập tiêu đề đánh giá..."
                  required
                  style={{ width:'100%', padding:'0.75rem', border:'1px solid #e2e8f0', borderRadius:8, fontSize:'0.9rem' }}
                />
              </div>

              <div style={{ marginBottom:'1.5rem' }}>
                <label style={{ display:'block', marginBottom:'0.5rem', fontWeight:600, color:'#4a5568' }}>Nhận xét chi tiết:</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                  rows={4}
                  required
                  style={{ width:'100%', padding:'0.75rem', border:'1px solid #e2e8f0', borderRadius:8, fontSize:'0.9rem', resize:'vertical' }}
                />
              </div>

              <div style={{ display:'flex', justifyContent:'flex-end', gap:'1rem', marginTop:'2rem' }}>
                <button type="button" onClick={()=>{ setReviewOpen(false); setReviewItem(null); }} style={{ background:'#f7fafc', color:'#4a5568', border:'1px solid #e2e8f0', padding:'0.75rem 1.5rem', borderRadius:8, fontWeight:600, cursor:'pointer' }}>
                  Hủy
                </button>
                <button type="submit" disabled={submittingReview} style={{ background:submittingReview ? '#a0aec0' : '#667eea', color:'white', border:'none', padding:'0.75rem 1.5rem', borderRadius:8, fontWeight:600, cursor:submittingReview ? 'not-allowed' : 'pointer' }}>
                  {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;