import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaShoppingCart,
  FaDollarSign,
  FaBox,
  FaEye,
  FaCalendarAlt,
  FaChartLine,
  FaShoppingBag
} from 'react-icons/fa';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('week');

  // Mock data
  const mockStats = {
    totalRevenue: 1250000000,
    totalOrders: 1847,
    totalCustomers: 892,
    totalProducts: 156,
    revenueGrowth: 12.5,
    orderGrowth: 8.3,
    customerGrowth: 15.2,
    productGrowth: 3.4,
    conversionRate: 2.8,
    avgOrderValue: 675000
  };

  const mockRecentOrders = [
    {
      id: 'FT1706432100001',
      customerName: 'Nguyễn Văn A',
      total: 2490000,
      status: 'processing',
      date: '2025-01-28 14:30',
      items: 2
    },
    {
      id: 'FT1706431900002',
      customerName: 'Trần Thị B',
      total: 3990000,
      status: 'shipping',
      date: '2025-01-28 13:45',
      items: 1
    },
    {
      id: 'FT1706431800003',
      customerName: 'Lê Văn C',
      total: 1290000,
      status: 'delivered',
      date: '2025-01-28 12:15',
      items: 1
    },
    {
      id: 'FT1706431700004',
      customerName: 'Phạm Thị D',
      total: 4200000,
      status: 'processing',
      date: '2025-01-28 11:30',
      items: 3
    },
    {
      id: 'FT1706431600005',
      customerName: 'Hoàng Văn E',
      total: 2800000,
      status: 'cancelled',
      date: '2025-01-28 10:20',
      items: 2
    }
  ];

  const mockTopProducts = [
    {
      id: 1,
      name: 'Sneaker Da Trắng Premium',
      image: '/assets/images/products/giày.jpg',
      sold: 245,
      revenue: 610000000,
      growth: 18.5,
      stock: 12
    },
    {
      id: 2,
      name: 'Oxford Da Đen Classic',
      image: '/assets/images/products/giày.jpg',
      sold: 189,
      revenue: 754000000,
      growth: 12.3,
      stock: 8
    },
    {
      id: 3,
      name: 'Boots Da Cao Cổ',
      image: '/assets/images/products/giày.jpg',
      sold: 156,
      revenue: 655000000,
      growth: -5.2,
      stock: 23
    },
    {
      id: 4,
      name: 'Sandal Da Tối Giản',
      image: '/assets/images/products/giày.jpg',
      sold: 298,
      revenue: 384000000,
      growth: 25.8,
      stock: 45
    },
    {
      id: 5,
      name: 'Giày Thể Thao Nike',
      image: '/assets/images/products/giày.jpg',
      sold: 134,
      revenue: 535000000,
      growth: 8.9,
      stock: 3
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats(mockStats);
      setRecentOrders(mockRecentOrders);
      setTopProducts(mockTopProducts);
      setLoading(false);
    }, 1000);
  }, [timeFilter]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return '#f7931e';
      case 'shipping': return '#667eea';
      case 'delivered': return '#38a169';
      case 'cancelled': return '#e53e3e';
      default: return '#718096';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'processing': return 'Đang xử lý';
      case 'shipping': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Đang tải dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-dashboard-page">
      <div className="adm-dashboard-container">
        {/* Header */}
        <div className="adm-dashboard-header">
          <div className="adm-header-content">
            <h1>Dashboard Quản Trị</h1>
            <div className="adm-time-filter">
              <select 
                value={timeFilter} 
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="today">Hôm nay</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
                <option value="quarter">Quý này</option>
                <option value="year">Năm này</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="adm-stats-grid">
          <div className="adm-stat-card adm-revenue">
            <div className="adm-stat-icon">
              <FaDollarSign />
            </div>
            <div className="adm-stat-content">
              <h3>Doanh thu</h3>
              <p className="adm-stat-value">{formatCurrency(stats.totalRevenue)}</p>
              <div className={`adm-stat-growth ${stats.revenueGrowth >= 0 ? 'adm-positive' : 'adm-negative'}`}>
                {stats.revenueGrowth >= 0 ? <MdTrendingUp /> : <MdTrendingDown />}
                {Math.abs(stats.revenueGrowth)}%
              </div>
            </div>
          </div>

          <div className="adm-stat-card adm-orders">
            <div className="adm-stat-icon">
              <FaShoppingCart />
            </div>
            <div className="adm-stat-content">
              <h3>Đơn hàng</h3>
              <p className="adm-stat-value">{formatNumber(stats.totalOrders)}</p>
              <div className={`adm-stat-growth ${stats.orderGrowth >= 0 ? 'adm-positive' : 'adm-negative'}`}>
                {stats.orderGrowth >= 0 ? <MdTrendingUp /> : <MdTrendingDown />}
                {Math.abs(stats.orderGrowth)}%
              </div>
            </div>
          </div>

          <div className="adm-stat-card adm-customers">
            <div className="adm-stat-icon">
              <FaUsers />
            </div>
            <div className="adm-stat-content">
              <h3>Khách hàng</h3>
              <p className="adm-stat-value">{formatNumber(stats.totalCustomers)}</p>
              <div className={`adm-stat-growth ${stats.customerGrowth >= 0 ? 'adm-positive' : 'adm-negative'}`}>
                {stats.customerGrowth >= 0 ? <MdTrendingUp /> : <MdTrendingDown />}
                {Math.abs(stats.customerGrowth)}%
              </div>
            </div>
          </div>

          <div className="adm-stat-card adm-products">
            <div className="adm-stat-icon">
              <FaBox />
            </div>
            <div className="adm-stat-content">
              <h3>Sản phẩm</h3>
              <p className="adm-stat-value">{formatNumber(stats.totalProducts)}</p>
              <div className={`adm-stat-growth ${stats.productGrowth >= 0 ? 'adm-positive' : 'adm-negative'}`}>
                {stats.productGrowth >= 0 ? <MdTrendingUp /> : <MdTrendingDown />}
                {Math.abs(stats.productGrowth)}%
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="adm-metrics-grid">
          <div className="adm-metric-card">
            <div className="adm-metric-header">
              <h4>Tỷ lệ chuyển đổi</h4>
              <FaChartLine className="adm-metric-icon" />
            </div>
            <div className="adm-metric-value">{stats.conversionRate}%</div>
            <div className="adm-metric-description">Khách truy cập thành khách mua hàng</div>
          </div>

          <div className="adm-metric-card">
            <div className="adm-metric-header">
              <h4>Giá trị đơn hàng TB</h4>
              <FaShoppingBag className="adm-metric-icon" />
            </div>
            <div className="adm-metric-value">{formatCurrency(stats.avgOrderValue)}</div>
            <div className="adm-metric-description">Trung bình mỗi đơn hàng</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="adm-dashboard-content">
          {/* Recent Orders */}
          <div className="adm-dashboard-section">
            <div className="adm-section-header">
              <h3>Đơn hàng gần đây</h3>
              <Link to="/admin/orders" className="adm-view-all-link">
                Xem tất cả <FaEye />
              </Link>
            </div>

            <div className="adm-orders-table">
              <div className="adm-table-header">
                <div>Mã đơn</div>
                <div>Khách hàng</div>
                <div>Tổng tiền</div>
                <div>Trạng thái</div>
                <div>Thời gian</div>
              </div>

              {recentOrders.map(order => (
                <div key={order.id} className="adm-table-row">
                  <div className="adm-order-id">
                    <Link to={`/admin/orders/${order.id}`}>
                      #{order.id}
                    </Link>
                  </div>
                  <div className="adm-customer-name">{order.customerName}</div>
                  <div className="adm-order-total">{formatCurrency(order.total)}</div>
                  <div className="adm-order-status">
                    <span 
                      className="adm-status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="adm-order-date">
                    <FaCalendarAlt />
                    {order.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="adm-dashboard-section">
            <div className="adm-section-header">
              <h3>Sản phẩm bán chạy</h3>
              <Link to="/admin/products" className="adm-view-all-link">
                Xem tất cả <FaEye />
              </Link>
            </div>

            <div className="adm-products-grid">
              {topProducts.map(product => (
                <div key={product.id} className="adm-product-card">
                  <div className="adm-product-image">
                    <img src={product.image} alt={product.name} />
                    <div className={`adm-stock-indicator ${product.stock <= 10 ? 'adm-low' : ''}`}>
                      Còn {product.stock}
                    </div>
                  </div>
                  
                  <div className="adm-product-info">
                    <h4>{product.name}</h4>
                    <div className="adm-product-stats">
                      <div className="adm-stat">
                        <span>Đã bán:</span>
                        <strong>{formatNumber(product.sold)}</strong>
                      </div>
                      <div className="adm-stat">
                        <span>Doanh thu:</span>
                        <strong>{formatCurrency(product.revenue)}</strong>
                      </div>
                      <div className={`adm-growth ${product.growth >= 0 ? 'adm-positive' : 'adm-negative'}`}>
                        {product.growth >= 0 ? <MdTrendingUp /> : <MdTrendingDown />}
                        {Math.abs(product.growth)}%
                      </div>
                    </div>
                    
                    <div className="adm-product-actions">
                      <Link to={`/admin/products/${product.id}`} className="adm-edit-btn">
                        Chỉnh sửa
                      </Link>
                      <Link to={`/product/${product.id}`} className="adm-view-btn">
                        Xem
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;