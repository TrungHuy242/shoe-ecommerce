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
  FaClipboardList
} from 'react-icons/fa';
import './ManageOrders.css';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  // Mock orders data
  const mockOrders = [
    {
      id: 'FT1706432100001',
      customerName: 'Nguyễn Văn A',
      customerEmail: 'nguyenvana@email.com',
      customerPhone: '0901234567',
      total: 8970000,
      status: 'processing',
      paymentStatus: 'paid',
      paymentMethod: 'card',
      date: '2025-01-28 14:30',
      shippingAddress: '123 Lê Lợi, Quận 1, TP.HCM',
      items: [
        { name: 'Sneaker Da Trắng Premium', quantity: 2, price: 2490000 },
        { name: 'Oxford Da Đen', quantity: 1, price: 3990000 }
      ],
      tracking: null,
      notes: 'Giao hàng buổi chiều'
    },
    {
      id: 'FT1706431900002',
      customerName: 'Trần Thị B',
      customerEmail: 'tranthib@email.com',
      customerPhone: '0901234568',
      total: 3990000,
      status: 'shipping',
      paymentStatus: 'paid',
      paymentMethod: 'paypal',
      date: '2025-01-27 13:45',
      shippingAddress: '456 Nguyễn Huệ, Quận 1, TP.HCM',
      items: [
        { name: 'Oxford Da Đen Classic', quantity: 1, price: 3990000 }
      ],
      tracking: 'VN123456789',
      notes: null
    },
    {
      id: 'FT1706431800003',
      customerName: 'Lê Văn C',
      customerEmail: 'levanc@email.com',
      customerPhone: '0901234569',
      total: 1290000,
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'cod',
      date: '2025-01-26 12:15',
      shippingAddress: '789 Hai Bà Trưng, Quận 3, TP.HCM',
      items: [
        { name: 'Sandal Da Tối Giản', quantity: 1, price: 1290000 }
      ],
      tracking: 'VN987654321',
      notes: null
    },
    {
      id: 'FT1706431700004',
      customerName: 'Phạm Thị D',
      customerEmail: 'phamthid@email.com',
      customerPhone: '0901234570',
      total: 4200000,
      status: 'cancelled',
      paymentStatus: 'refunded',
      paymentMethod: 'card',
      date: '2025-01-25 11:30',
      shippingAddress: '321 Lý Tự Trọng, Quận 1, TP.HCM',
      items: [
        { name: 'Boots Da Cao Cổ', quantity: 1, price: 4200000 }
      ],
      tracking: null,
      notes: 'Khách hàng hủy do thay đổi ý định'
    },
    {
      id: 'FT1706431600005',
      customerName: 'Hoàng Văn E',
      customerEmail: 'hoangvane@email.com',
      customerPhone: '0901234571',
      total: 2800000,
      status: 'processing',
      paymentStatus: 'pending',
      paymentMethod: 'cod',
      date: '2025-01-25 10:20',
      shippingAddress: '654 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
      items: [
        { name: 'Sneaker Nike Air Max', quantity: 1, price: 2800000 }
      ],
      tracking: null,
      notes: 'Khách yêu cầu gọi trước khi giao'
    }
  ];

  const statusOptions = [
    { value: 'processing', label: 'Đang xử lý', color: '#f7931e', icon: FaClipboardList },
    { value: 'shipping', label: 'Đang giao', color: '#667eea', icon: FaTruck },
    { value: 'delivered', label: 'Đã giao', color: '#38a169', icon: FaCheck },
    { value: 'cancelled', label: 'Đã hủy', color: '#e53e3e', icon: FaTimes }
  ];

  const paymentStatusOptions = [
    { value: 'pending', label: 'Chờ thanh toán', color: '#f7931e' },
    { value: 'paid', label: 'Đã thanh toán', color: '#38a169' },
    { value: 'refunded', label: 'Đã hoàn tiền', color: '#667eea' },
    { value: 'failed', label: 'Thanh toán lỗi', color: '#e53e3e' }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
      
      const matchesDate = (() => {
        if (dateFilter === 'all') return true;
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
      })();
      
      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'customer':
          aValue = a.customerName.toLowerCase();
          bValue = b.customerName.toLowerCase();
          break;
        case 'total':
          aValue = a.total;
          bValue = b.total;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedOrders.size === paginatedOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(paginatedOrders.map(o => o.id)));
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
  };

  const handleBulkStatusChange = (newStatus) => {
    if (selectedOrders.size === 0) return;
    
    setOrders(prev => prev.map(order => 
      selectedOrders.has(order.id)
        ? { ...order, status: newStatus }
        : order
    ));
    setSelectedOrders(new Set());
  };

  const handleExport = () => {
    console.log('Exporting orders:', filteredOrders);
    alert('Đang xuất dữ liệu...');
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
            <p>{filteredOrders.length} đơn hàng</p>
          </div>
          
          <div className="ord-header-actions">
            <button className="ord-export-btn" onClick={handleExport}>
              <FaDownload /> Xuất Excel
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
            >
              <FaFilter /> Bộ lọc
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

        {/* Bulk Actions */}
        {selectedOrders.size > 0 && (
          <div className="ord-bulk-actions">
            <span>Đã chọn {selectedOrders.size} đơn hàng</span>
            <div className="ord-bulk-action-buttons">
              <button onClick={() => handleBulkStatusChange('processing')}>
                Chuyển sang Đang xử lý
              </button>
              <button onClick={() => handleBulkStatusChange('shipping')}>
                Chuyển sang Đang giao
              </button>
              <button onClick={() => handleBulkStatusChange('delivered')}>
                Chuyển sang Đã giao
              </button>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="ord-orders-table-container">
          <table className="ord-orders-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedOrders.size === paginatedOrders.length && paginatedOrders.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
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
              {paginatedOrders.map(order => {
                const statusConfig = getStatusConfig(order.status);
                const paymentConfig = getPaymentStatusConfig(order.paymentStatus);
                
                return (
                  <tr key={order.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedOrders.has(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                      />
                    </td>
                    <td>
                      <Link to={`/admin/orders/${order.id}`} className="ord-order-link">
                        #{order.id}
                      </Link>
                    </td>
                    <td>
                      <div className="ord-customer-info">
                        <div className="ord-customer-name">{order.customerName}</div>
                        <div className="ord-customer-email">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="ord-total-amount">{formatCurrency(order.total)}</td>
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
                          to={`/admin/orders/${order.id}`}
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
            <button 
              className="ord-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Trước
            </button>
            
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
              <button
                key={page}
                className={`ord-page-btn ${currentPage === page ? 'ord-active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            
            <button 
              className="ord-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;