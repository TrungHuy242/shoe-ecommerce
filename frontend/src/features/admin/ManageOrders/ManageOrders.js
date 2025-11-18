import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaShoppingCart,
  FaSearch,
  FaEye,
  FaEdit,
  FaFilter,
  FaSort,
  FaCalendarAlt,
  FaUser,
  FaDollarSign,
  FaTruck,
  FaCheck,
  FaTimes,
  FaPrint,
  FaDownload,
  FaClipboardList,
  FaTrash,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import './ManageOrders.css';
import api from '../../../services/api';
import { useNotification } from '../../../context/NotificationContext';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const { success, error } = useNotification();

  // Debug: Kiểm tra token
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    
    console.log('🔐 Admin Auth Debug:', {
      hasAccessToken: !!token,
      hasRefreshToken: !!refreshToken,
      tokenLength: token?.length,
      tokenPreview: token?.substring(0, 20) + '...'
    });

    if (!token) {
      console.error('❌ No access token found! Admin needs to login.');
      // Có thể redirect về login
      // window.location.href = '/login';
    }
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load orders with pagination
  const loadOrders = async (page = 1) => {
    try {
      setLoading(true);
      
      // Debug: Log request details
      const params = {
        ordering: sortOrder === 'desc' ? '-created_at' : 'created_at',
        page: page,
        page_size: itemsPerPage
      };

      // Add status filter if not 'all'
      if (statusFilter !== 'all') {
        const statusMap = {
          'processing': 'pending',
          'shipping': 'shipped', 
          'delivered': 'delivered',
          'cancelled': 'cancelled'
        };
        params.status = statusMap[statusFilter] || statusFilter;
      }

      console.log('📤 Loading orders with params:', params);
      console.log('🔗 Full URL:', `orders/?${new URLSearchParams(params).toString()}`);

      // Call API
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

      console.log('📥 Orders API Response:', {
        status: ordersRes.status,
        dataType: Array.isArray(ordersRes.data) ? 'array' : 'object',
        count: Array.isArray(ordersRes.data) ? ordersRes.data.length : ordersRes.data?.count,
        hasResults: !!ordersRes.data?.results
      });

      console.log('API Response:', { orders: rawOrders.length, total, page });

      // Enrich orders with user info
      const enrichedOrders = await Promise.all(
        rawOrders.map(async (o) => {
          try {
            let user = null;
            if (o.user) {
              // Handle both user ID and user object
              const userId = typeof o.user === 'object' ? o.user.id : o.user;
              if (userId) {
                const userRes = await api.get(`users/${userId}/`);
                user = userRes.data;
              }
            }

            // Map backend status to UI status
            const statusMap = { 
              pending: 'processing', 
              shipped: 'shipping', 
              delivered: 'delivered', 
              cancelled: 'cancelled' 
            };

            return {
              id: 'FT' + o.id,
              rawId: o.id,
              customerName: user?.name || user?.username || `User #${typeof o.user === 'object' ? o.user.id : o.user || 'N/A'}`,
              customerEmail: user?.email || '',
              customerPhone: user?.phone || '',
              total: Number(o.total || 0),
              subtotal: Number(o.subtotal || 0),
              discount: Number(o.discount_amount || 0),
              promotionCode: o.promotion_code || null,
              status: statusMap[String(o.status).toLowerCase()] || 'processing',
              paymentStatus: (o.payment_status || 'pending').toLowerCase(), 
              paymentMethod: o.payment_method || '',
              date: o.created_at || o.updated_at || new Date().toISOString(),
              shippingAddress: user?.address || '',
              items: [],
              tracking: null,
              notes: null
            };
          } catch (e) {
            console.error('Error enriching order:', o.id, e);
            return {
              id: 'FT' + o.id,
              rawId: o.id,
              customerName: `User #${typeof o.user === 'object' ? o.user.id : o.user || 'N/A'}`,
              customerEmail: '',
              customerPhone: '',
              total: Number(o.total || 0),
              subtotal: Number(o.subtotal || 0),
              discount: Number(o.discount_amount || 0),
              promotionCode: o.promotion_code || null,
              status: 'processing',
              paymentStatus: 'pending',
              paymentMethod: o.payment_method || '',
              date: o.created_at || new Date().toISOString(),
              shippingAddress: '',
              items: [],
              tracking: null,
              notes: null
            };
          }
        })
      );

      // Apply frontend filters (search, date) since backend doesn't support them
      let filteredOrders = enrichedOrders;
      
      // Search filter
      if (debouncedSearchTerm) {
        filteredOrders = filteredOrders.filter(order => 
          order.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          order.customerEmail.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
      }

      // Date filter
      if (dateFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => {
          const orderDate = new Date(order.date);
          const today = new Date();
          const diffTime = Math.abs(today - orderDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          switch (dateFilter) {
            case 'today': return diffDays <= 1;
            case 'week': return diffDays <= 7;
            case 'month': return diffDays <= 30;
            default: return true;
          }
        });
      }

      // Payment filter
      if (paymentFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => 
          order.paymentStatus === paymentFilter
        );
      }

      // Update state
      setOrders(filteredOrders);
      setTotalOrders(total);
      setTotalPages(Math.ceil(total / itemsPerPage));

    } catch (e) {
      console.error('❌ Failed to load orders:', {
        status: e.response?.status,
        statusText: e.response?.statusText,
        data: e.response?.data,
        message: e.message,
        url: e.config?.url,
        method: e.config?.method,
        headers: e.config?.headers
      });
      
      // Specific handling for 401
      if (e.response?.status === 401) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        // Có thể redirect về login
        // window.location.href = '/login';
      } else {
        alert('Không thể tải danh sách đơn hàng: ' + (e.response?.data?.detail || e.message));
      }
      
      setOrders([]);
      setTotalOrders(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Load orders when page or filters change
  useEffect(() => {
    loadOrders(currentPage);
  }, [currentPage, statusFilter]);

  // Reload when search/date/payment filters change (reset to page 1)
  useEffect(() => {
    if (currentPage === 1) {
      loadOrders(1);
    } else {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, dateFilter, paymentFilter, sortBy, sortOrder]);

  const statusOptions = [
    { value: 'processing', label: 'Đang xử lý', color: '#f7931e', icon: FaClipboardList },
    { value: 'shipping', label: 'Đang giao', color: '#667eea', icon: FaTruck },
    { value: 'delivered', label: 'Đã giao', color: '#38a169', icon: FaCheck },
    { value: 'cancelled', label: 'Đã hủy', color: '#e53e3e', icon: FaTimes }
  ];

  const paymentStatusOptions = [
    { value: 'pending', label: 'Chờ thanh toán', color: '#f7931e' },
    { value: 'processing', label: 'Đang thanh toán', color: '#3182ce' },
    { value: 'paid', label: 'Đã thanh toán', color: '#38a169' },
    { value: 'refunded', label: 'Đã hoàn tiền', color: '#667eea' },
    { value: 'failed', label: 'Thanh toán lỗi', color: '#e53e3e' }
  ];

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleStatusChange = async (displayId, newStatus) => {
    try {
      const order = orders.find(x => x.id === displayId);
      if (!order) return;

      // Map UI status to backend status
      const statusMap = {
        'processing': 'pending',
        'shipping': 'shipped',
        'delivered': 'delivered', 
        'cancelled': 'cancelled'
      };
      const backendStatus = statusMap[newStatus] || newStatus;

      await api.patch(`orders/${order.rawId}/`, { status: backendStatus });
      
      // Update local state
      setOrders(prev => prev.map(o =>
        o.id === displayId ? { ...o, status: newStatus } : o
      ));

      // Show success notification
      const statusLabels = {
        'processing': 'Đang xử lý',
        'shipping': 'Đang giao',
        'delivered': 'Đã giao',
        'cancelled': 'Đã hủy'
      };
      success(`Đã cập nhật trạng thái đơn hàng #${displayId} thành "${statusLabels[newStatus] || newStatus}"`);
      
      console.log(`Updated order ${displayId} status to ${newStatus}`);
    } catch (e) {
      console.error('Update status failed:', e?.response?.data || e.message);
      error('Cập nhật trạng thái thất bại: ' + (e?.response?.data?.detail || e.message));
    }
  };

  const handleDeleteOrder = async (displayId) => {
    const order = orders.find(x => x.id === displayId);
    if (!order) return;
    
    if (!window.confirm(`Bạn có chắc muốn xóa đơn hàng ${displayId}?\n\nĐiều này sẽ xóa vĩnh viễn đơn hàng này và không thể hoàn tác.`)) return;
    
    try {
      await api.delete(`orders/${order.rawId}/`);
      
      // Remove from local state
      setOrders(prev => prev.filter(o => o.id !== displayId));
      
      // Update total count
      setTotalOrders(prev => prev - 1);
      setTotalPages(Math.ceil((totalOrders - 1) / itemsPerPage));
      
      success('Xóa đơn hàng thành công');
      
      // Reload để đảm bảo dữ liệu đồng bộ
      if (orders.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        loadOrders(currentPage);
      }
    } catch (e) {
      console.error('Delete order failed:', e?.response?.data || e.message);
      error('Xóa đơn hàng thất bại: ' + (e?.response?.data?.detail || e.message));
    }
  };

  const handleExport = () => {
    console.log('Exporting orders:', orders);
    alert('Chức năng xuất Excel đang được phát triển...');
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusConfig = (status) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
  };

  const getPaymentStatusConfig = (status) => {
    return paymentStatusOptions.find(s => s.value === status) || paymentStatusOptions[0];
  };

  if (loading) {
    return (
      <div className="ord-manage-orders-page">
        <div className="ord-manage-orders-container">
          <div className="ord-loading-state">
            <div className="ord-spinner-large"></div>
            <p>Đang tải danh sách đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ord-manage-orders-page">
      <div className="ord-manage-orders-container">
        {/* Header */}
        <div className="ord-page-header">
          <div className="ord-header-left">
            <h1>
              <FaShoppingCart className="ord-title-icon" />
              Quản lý đơn hàng
            </h1>
            <p>{totalOrders} đơn hàng • Trang {currentPage}/{totalPages}</p>
          </div>
          
          <div className="ord-header-actions">
            <button className="ord-export-btn" onClick={handleExport} title="Xuất Excel">
              <FaDownload />
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="ord-stats-summary">
          {statusOptions.map(status => {
            const count = orders.filter(o => o.status === status.value).length;
            const StatusIcon = status.icon;
            
            return (
              <div key={status.value} className="ord-stat-item">
                <div className="ord-stat-icon" style={{ backgroundColor: status.color }}>
                  <StatusIcon />
                </div>
                <div className="ord-stat-info">
                  <span className="ord-stat-number">{count}</span>
                  <span className="ord-stat-label">{status.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div className="ord-filters-section">
          <div className="ord-search-and-sort">
            <div className="ord-search-box">
              <FaSearch className="ord-search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button 
              className={`ord-filter-toggle ${showFilters ? 'ord-active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
              title="Bộ lọc"
            >
              <FaFilter />
            </button>

            <div className="ord-sort-controls">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">Ngày tạo</option>
                <option value="customer">Khách hàng</option>
                <option value="total">Tổng tiền</option>
                <option value="status">Trạng thái</option>
              </select>
              <button 
                className="ord-sort-order-btn"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                title={sortOrder === 'asc' ? 'Sắp xếp giảm dần' : 'Sắp xếp tăng dần'}
              >
                <FaSort />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="ord-filter-options">
              <div className="ord-filter-group">
                <label>Trạng thái:</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">Tất cả</option>
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div className="ord-filter-group">
                <label>Thanh toán:</label>
                <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
                  <option value="all">Tất cả</option>
                  {paymentStatusOptions.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div className="ord-filter-group">
                <label>Thời gian:</label>
                <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                  <option value="all">Tất cả</option>
                  <option value="today">Hôm nay</option>
                  <option value="week">Tuần này</option>
                  <option value="month">Tháng này</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div className="ord-orders-table-container">
          <table className="ord-orders-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')} className="ord-sortable">
                  Mã đơn <FaSort />
                </th>
                <th onClick={() => handleSort('customer')} className="ord-sortable">
                  Khách hàng <FaSort />
                </th>
                <th onClick={() => handleSort('total')} className="ord-sortable">
                  Tổng tiền <FaSort />
                </th>
                <th onClick={() => handleSort('status')} className="ord-sortable">
                  Trạng thái <FaSort />
                </th>
                <th>Thanh toán</th>
                <th onClick={() => handleSort('date')} className="ord-sortable">
                  Ngày tạo <FaSort />
                </th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const statusConfig = getStatusConfig(order.status);
                const paymentConfig = getPaymentStatusConfig(order.paymentStatus);
                
                return (
                  <tr key={order.id}>
                    <td>
                      <Link to={`/admin/orders/${order.rawId}`} className="ord-order-link">
                        #{order.id}
                      </Link>
                      {order.promotionCode && (
                        <div className="ord-promotion-code">🏷️ {order.promotionCode}</div>
                      )}
                    </td>
                    <td>
                      <div className="ord-customer-info">
                        <div className="ord-customer-name">{order.customerName}</div>
                        <div className="ord-customer-email">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="ord-total-amount">
                      {order.discount > 0 ? (
                        <div className="ord-pricing-breakdown">
                          <div className="ord-subtotal">{formatCurrency(order.subtotal)}</div>
                          <div className="ord-discount">-{formatCurrency(order.discount)}</div>
                          <div className="ord-final-total">{formatCurrency(order.total)}</div>
                        </div>
                      ) : (
                        formatCurrency(order.total)
                      )}
                    </td>
                    <td>
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="ord-status-select"
                        style={{ borderColor: statusConfig.color }}
                      >
                        {statusOptions.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span 
                        className="ord-payment-badge"
                        style={{ backgroundColor: paymentConfig.color }}
                      >
                        {paymentConfig.label}
                      </span>
                    </td>
                    <td className="ord-order-date">
                      <FaCalendarAlt />
                      {formatDateTime(order.date)}
                    </td>
                    <td>
                      <div className="ord-action-buttons">
                        <Link 
                          to={`/admin/orders/${order.rawId}`}
                          className="ord-action-btn ord-view-btn"
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </Link>
                        <button 
                          className="ord-action-btn ord-print-btn"
                          title="In đơn hàng"
                          onClick={() => window.print()}
                        >
                          <FaPrint />
                        </button>
                        <button
                          className="ord-action-btn ord-delete-btn"
                          title="Xóa đơn hàng"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="ord-pagination">
            <div className="ord-pagination-info">
              Hiển thị {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalOrders)} trong {totalOrders} đơn hàng
            </div>
            
            <div className="ord-pagination-controls">
              <button 
                className="ord-page-btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                title="Trang trước"
              >
                <FaChevronLeft />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                const page = Math.max(1, currentPage - 2) + index;
                if (page > totalPages) return null;
                
                return (
                  <button
                    key={page}
                    className={`ord-page-btn ${currentPage === page ? 'ord-active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button 
                className="ord-page-btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                title="Trang sau"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;