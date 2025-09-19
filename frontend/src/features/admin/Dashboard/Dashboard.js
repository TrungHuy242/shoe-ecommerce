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
import api from '../../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('week');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // 1) Đơn hàng (mới nhất)
        const ordersRes = await api.get('orders/', { params: { ordering: '-created_at', page_size: 200 } });
        const orders = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data.results || []);

        // 2) Sản phẩm bán chạy
        const productsRes = await api.get('products/', { params: { ordering: '-sales_count', page_size: 50 } });
        const products = Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data.results || []);

        // 3) Tổng số khách hàng
        const usersRes = await api.get('users/', { params: { page_size: 1 } });
        const usersCount = usersRes.data?.count ?? (Array.isArray(usersRes.data) ? usersRes.data.length : 0);

        // Tính stats tổng quan
        const deliveredOrders = orders.filter(o => String(o.status).toLowerCase() === 'delivered');
        const totalRevenue = deliveredOrders.reduce((s, o) => s + Number(o.total || 0), 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

        setStats({
          totalRevenue,
          totalOrders,
          totalCustomers: usersCount,
          totalProducts: products.length,
          revenueGrowth: 0,
          orderGrowth: 0,
          customerGrowth: 0,
          productGrowth: 0,
          conversionRate: 0,
          avgOrderValue
        });

        // Chuẩn hóa đơn gần đây (hiển thị 5)
        const statusMap = { pending: 'processing', shipped: 'shipping', delivered: 'delivered', cancelled: 'cancelled' };
        const ro = orders.slice(0, 5).map(o => ({
          id: 'FT' + o.id,
          customerName:
            (o.user && typeof o.user === 'object' ? (o.user.username || o.user.name) : '') ||
            `User #${o.user ?? ''}`,
          total: Number(o.total || 0),
          status: statusMap[String(o.status).toLowerCase()] || 'processing',
          date: (o.created_at || '').slice(0, 16).replace('T', ' '),
          items: o.items?.length || 0
        }));
        setRecentOrders(ro);

        // Chuẩn hóa top products (5 sp)
        const tp = products.slice(0, 5).map(p => ({
          id: p.id,
          name: p.name,
          image: (p.images && p.images[0]?.image) || '/assets/images/products/giày.jpg',
          sold: p.sales_count || 0,
          revenue: Math.round(Number(p.price || 0) * Number(p.sales_count || 0)),
          growth: 0,
          stock: p.stock_quantity || 0
        }));
        setTopProducts(tp);
      } catch (e) {
        console.error('Dashboard load error:', e?.response?.data || e.message);
        setStats({
          totalRevenue: 0, totalOrders: 0, totalCustomers: 0, totalProducts: 0,
          revenueGrowth: 0, orderGrowth: 0, customerGrowth: 0, productGrowth: 0,
          conversionRate: 0, avgOrderValue: 0
        });
        setRecentOrders([]);
        setTopProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
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