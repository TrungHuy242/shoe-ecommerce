import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const mockOrders = [
    {
      id: 'FT1706432100001',
      date: '2025-01-28',
      status: 'delivered',
      total: 8970000,
      items: [
        {
          id: 1,
          name: 'Sneaker Da Trắng Premium',
          price: 2490000,
          quantity: 2,
          image: '/assets/images/products/giày.jpg',
          size: '42',
          color: 'Trắng'
        },
        {
          id: 2,
          name: 'Oxford Da Đen',
          price: 3990000,
          quantity: 1,
          image: '/assets/images/products/giày.jpg',
          size: '41',
          color: 'Đen'
        }
      ],
      shipping: {
        address: '123 Lê Lợi, Quận 1, TP.HCM',
        method: 'Standard',
        fee: 0
      },
      payment: {
        method: 'card',
        status: 'paid'
      },
      tracking: 'VN123456789',
      estimatedDelivery: '2025-01-30',
      canReview: true,
      canReorder: true
    },
    {
      id: 'FT1706345200002',
      date: '2025-01-25',
      status: 'shipping',
      total: 4200000,
      items: [
        {
          id: 3,
          name: 'Boots Da Cao Cổ',
          price: 4200000,
          quantity: 1,
          image: '/assets/images/products/giày.jpg',
          size: '43',
          color: 'Nâu'
        }
      ],
      shipping: {
        address: '456 Nguyễn Huệ, Quận 1, TP.HCM',
        method: 'Express',
        fee: 30000
      },
      payment: {
        method: 'cod',
        status: 'pending'
      },
      tracking: 'VN987654321',
      estimatedDelivery: '2025-01-29',
      canReview: false,
      canReorder: true
    },
    {
      id: 'FT1706258300003',
      date: '2025-01-22',
      status: 'processing',
      total: 2580000,
      items: [
        {
          id: 4,
          name: 'Sandal Da Tối Giản',
          price: 1290000,
          quantity: 2,
          image: '/assets/images/products/giày.jpg',
          size: '40',
          color: 'Be'
        }
      ],
      shipping: {
        address: '789 Hai Bà Trưng, Quận 3, TP.HCM',
        method: 'Standard',
        fee: 0
      },
      payment: {
        method: 'paypal',
        status: 'paid'
      },
      tracking: null,
      estimatedDelivery: '2025-01-31',
      canReview: false,
      canReorder: true
    },
    {
      id: 'FT1706171400004',
      date: '2025-01-20',
      status: 'cancelled',
      total: 3990000,
      items: [
        {
          id: 5,
          name: 'Giày Thể Thao Nike',
          price: 3990000,
          quantity: 1,
          image: '/assets/images/products/giày.jpg',
          size: '42',
          color: 'Đỏ'
        }
      ],
      shipping: {
        address: '321 Lý Tự Trọng, Quận 1, TP.HCM',
        method: 'Express',
        fee: 30000
      },
      payment: {
        method: 'card',
        status: 'refunded'
      },
      tracking: null,
      estimatedDelivery: null,
      canReview: false,
      canReorder: true,
      cancelReason: 'Hết hàng'
    }
  ];

  const statusConfig = {
    processing: { label: 'Đang xử lý', color: '#f7931e', icon: FaClipboardList },
    shipping: { label: 'Đang giao', color: '#667eea', icon: FaTruck },
    delivered: { label: 'Đã giao', color: '#38a169', icon: FaCheck },
    cancelled: { label: 'Đã hủy', color: '#e53e3e', icon: FaTimes }
  };

  useEffect(() => {
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const handleReorder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      console.log('Reordering:', order.items);
      alert(`Đã thêm ${order.items.length} sản phẩm vào giỏ hàng!`);
    }
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled', cancelReason: 'Hủy bởi khách hàng' }
          : order
      ));
    }
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
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
                  {orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}đ
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
              const StatusIcon = statusConfig[order.status].icon;
              
              return (
                <div key={order.id} className="oh-order-card">
                  <div className="oh-order-header">
                    <div className="oh-order-info">
                      <h3>Đơn hàng #{order.id}</h3>
                      <div className="oh-order-meta">
                        <span className="oh-order-date">
                          <FaCalendarAlt /> {formatDate(order.date)}
                        </span>
                        <span className={`oh-order-status ${order.status}`}>
                          <StatusIcon />
                          {statusConfig[order.status].label}
                        </span>
                      </div>
                    </div>
                    
                    <div className="oh-order-total">
                      {order.total.toLocaleString()}đ
                    </div>
                  </div>

                  <div className="oh-order-items">
                    {order.items.map(item => (
                      <div key={item.id} className="oh-order-item">
                        <img src={item.image} alt={item.name} />
                        <div className="oh-item-details">
                          <h4>{item.name}</h4>
                          <div className="oh-item-specs">
                            Size: {item.size} | Màu: {item.color} | SL: {item.quantity}
                          </div>
                          <div className="oh-item-price">
                            {item.price.toLocaleString()}đ
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.status === 'shipping' && order.tracking && (
                    <div className="oh-tracking-info">
                      <div className="oh-tracking-number">
                        <strong>Mã vận đơn:</strong> {order.tracking}
                      </div>
                      <div className="oh-estimated-delivery">
                        <strong>Dự kiến giao:</strong> {formatDate(order.estimatedDelivery)}
                      </div>
                    </div>
                  )}

                  {order.status === 'cancelled' && order.cancelReason && (
                    <div className="oh-cancel-info">
                      <strong>Lý do hủy:</strong> {order.cancelReason}
                    </div>
                  )}

                  <div className="oh-order-actions">
                    <Link to={`/order/${order.id}`} className="oh-view-detail-btn">
                      <FaEye /> Chi tiết
                    </Link>

                    {order.canReorder && (
                      <button 
                        className="oh-reorder-btn"
                        onClick={() => handleReorder(order.id)}
                      >
                        <FaShoppingCart /> Mua lại
                      </button>
                    )}

                    {order.canReview && order.status === 'delivered' && (
                      <Link to={`/review/${order.id}`} className="oh-review-btn">
                        <FaStar /> Đánh giá
                      </Link>
                    )}

                    {order.status === 'processing' && (
                      <button 
                        className="oh-cancel-btn"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        <FaTimes /> Hủy đơn
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;