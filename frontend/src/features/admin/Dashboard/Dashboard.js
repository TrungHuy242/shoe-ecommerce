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
import SkeletonLoader from '../../../components/common/SkeletonLoader';
import Chart from '../../../components/common/Chart';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('week');
  const [chartData, setChartData] = useState({
    revenue: null,
    orders: null,
    products: null
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // Tính toán date range dựa trên timeFilter
        const now = new Date();
        let startDate = null;
        
        switch (timeFilter) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'quarter':
            const quarter = Math.floor(now.getMonth() / 3);
            startDate = new Date(now.getFullYear(), quarter * 3, 1);
            break;
          case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
          default:
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }

        // 1) Lấy đơn hàng với filter theo thời gian
        const ordersRes = await api.get('orders/', { 
          params: { 
            ordering: '-created_at', 
            page_size: 1000,
            created_at__gte: startDate.toISOString()
          } 
        });
        
        let allOrders = [];
        if (Array.isArray(ordersRes.data)) {
          allOrders = ordersRes.data;
        } else {
          allOrders = ordersRes.data.results || [];
          // Nếu có nhiều trang, có thể cần lấy thêm
          const totalCount = ordersRes.data.count || 0;
          if (totalCount > 1000) {
            console.warn('Có nhiều hơn 1000 đơn hàng, cần implement pagination để lấy hết');
          }
        }

        // 2) Lấy sản phẩm bán chạy
        const productsRes = await api.get('products/', { 
          params: { 
            ordering: '-sales_count', 
            page_size: 100 
          } 
        });
        const products = Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data.results || []);

        // 3) Lấy tổng số users
        const usersRes = await api.get('users/', { params: { page_size: 1 } });
        const usersCount = usersRes.data?.count ?? (Array.isArray(usersRes.data) ? usersRes.data.length : 0);

        // 4) Enrich orders với thông tin user
        const enrichedOrders = await Promise.all(
          allOrders.slice(0, 50).map(async (order) => {
            try {
              let user = null;
              if (order.user) {
                const userRes = await api.get(`users/${order.user}/`);
                user = userRes.data;
              }
              
              return {
                ...order,
                userInfo: user
              };
            } catch (e) {
              return {
                ...order,
                userInfo: null
              };
            }
          })
        );

        // Tính stats
        const deliveredOrders = allOrders.filter(o => String(o.status).toLowerCase() === 'delivered');
        const totalRevenue = deliveredOrders.reduce((s, o) => s + Number(o.total || 0), 0);
        const totalOrders = allOrders.length;
        const avgOrderValue = deliveredOrders.length ? Math.round(totalRevenue / deliveredOrders.length) : 0;

        // Tính growth (giả lập - cần logic thực tế dựa trên thời gian)
        const revenueGrowth = Math.floor(Math.random() * 20) - 10; // -10 to +10
        const orderGrowth = Math.floor(Math.random() * 15) - 5;
        const customerGrowth = Math.floor(Math.random() * 25) - 10;

        setStats({
          totalRevenue,
          totalOrders,
          totalCustomers: usersCount,
          totalProducts: products.length,
          revenueGrowth,
          orderGrowth,
          customerGrowth,
          productGrowth: Math.floor(Math.random() * 10),
          conversionRate: Math.floor(Math.random() * 5) + 2, // 2-7%
          avgOrderValue
        });

        // Recent orders (5 đơn gần nhất)
        const statusMap = { 
          pending: 'processing', 
          shipped: 'shipping', 
          delivered: 'delivered', 
          cancelled: 'cancelled' 
        };
        
        const recentOrdersData = enrichedOrders.slice(0, 5).map(o => ({
          id: 'FT' + o.id,
          rawId: o.id,
          customerName: o.userInfo?.name || o.userInfo?.username || `User #${o.user || 'N/A'}`,
          total: Number(o.total || 0),
          status: statusMap[String(o.status).toLowerCase()] || 'processing',
          date: (o.created_at || '').slice(0, 16).replace('T', ' '),
          items: 0 // Sẽ cần gọi API order-details nếu cần
        }));
        setRecentOrders(recentOrdersData);

        // Top products (5 sản phẩm bán chạy)
        const topProductsData = products.slice(0, 5).map(p => ({
          id: p.id,
          name: p.name,
          image: (p.images && p.images[0]?.image) || '/assets/images/products/placeholder-product.jpg',
          sold: p.sales_count || 0,
          revenue: Math.round(Number(p.price || 0) * Number(p.sales_count || 0)),
          growth: Math.floor(Math.random() * 30) - 10, // -10 to +20
          stock: p.stock_quantity || 0
        }));
        setTopProducts(topProductsData);

        // Generate chart data
        const generateChartData = () => {
          const days = timeFilter === 'today' ? 1 : timeFilter === 'week' ? 7 : timeFilter === 'month' ? 30 : 90;
          const labels = [];
          const revenueData = [];
          const ordersData = [];
          
          for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }));
            
            // Simulate data (in real app, this would come from API)
            revenueData.push(Math.floor(Math.random() * 1000000) + 500000);
            ordersData.push(Math.floor(Math.random() * 50) + 10);
          }
          
          return {
            revenue: {
              labels,
              datasets: [{
                label: 'Doanh thu (VNĐ)',
                data: revenueData,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true,
              }]
            },
            orders: {
              labels,
              datasets: [{
                label: 'Số đơn hàng',
                data: ordersData,
                backgroundColor: 'rgba(72, 187, 120, 0.8)',
                borderColor: '#48bb78',
                borderWidth: 1,
              }]
            },
            products: {
              labels: topProductsData.slice(0, 5).map(p => p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name),
              datasets: [{
                label: 'Số lượng bán',
                data: topProductsData.slice(0, 5).map(p => p.sold),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.8)',
                  'rgba(54, 162, 235, 0.8)',
                  'rgba(255, 205, 86, 0.8)',
                  'rgba(75, 192, 192, 0.8)',
                  'rgba(153, 102, 255, 0.8)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 205, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
              }]
            }
          };
        };
        
        setChartData(generateChartData());

      } catch (e) {
        console.error('Dashboard load error:', e?.response?.data || e.message);
        // Set default empty stats
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
      <div className="adm-dashboard-page">
        <div className="adm-dashboard-container">
          {/* Header Skeleton */}
          <div className="adm-dashboard-header">
            <div className="adm-header-content">
              <div className="skeleton-title" style={{width: '300px', height: '36px'}}></div>
              <div className="skeleton-default" style={{width: '150px', height: '40px'}}></div>
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="adm-stats-grid">
            <SkeletonLoader type="dashboard" count={4} />
          </div>

          {/* Charts Skeleton */}
          <div className="adm-charts-grid">
            <div className="adm-chart-card">
              <div className="skeleton-title" style={{width: '200px', height: '24px'}}></div>
              <div className="skeleton-default" style={{width: '100%', height: '300px'}}></div>
            </div>
            <div className="adm-chart-card">
              <div className="skeleton-title" style={{width: '200px', height: '24px'}}></div>
              <div className="skeleton-default" style={{width: '100%', height: '300px'}}></div>
            </div>
          </div>

          {/* Tables Skeleton */}
          <div className="adm-tables-grid">
            <div className="adm-table-card">
              <div className="skeleton-title" style={{width: '200px', height: '24px'}}></div>
              <SkeletonLoader type="table" count={5} />
            </div>
            <div className="adm-table-card">
              <div className="skeleton-title" style={{width: '200px', height: '24px'}}></div>
              <SkeletonLoader type="table" count={5} />
            </div>
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

        {/* Charts Section */}
        <div className="adm-charts-section">
          <div className="adm-chart-card">
            <div className="adm-chart-header">
              <h3>Biểu đồ doanh thu</h3>
              <span className="adm-chart-period">{timeFilter === 'today' ? 'Hôm nay' : timeFilter === 'week' ? '7 ngày qua' : timeFilter === 'month' ? '30 ngày qua' : '90 ngày qua'}</span>
            </div>
            {chartData.revenue && (
              <Chart 
                type="line" 
                data={chartData.revenue} 
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      ticks: {
                        callback: function(value) {
                          return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
                        }
                      }
                    }
                  }
                }}
                height={300}
              />
            )}
          </div>

          <div className="adm-chart-card">
            <div className="adm-chart-header">
              <h3>Biểu đồ đơn hàng</h3>
              <span className="adm-chart-period">{timeFilter === 'today' ? 'Hôm nay' : timeFilter === 'week' ? '7 ngày qua' : timeFilter === 'month' ? '30 ngày qua' : '90 ngày qua'}</span>
            </div>
            {chartData.orders && (
              <Chart 
                type="bar" 
                data={chartData.orders} 
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  }
                }}
                height={300}
              />
            )}
          </div>

          <div className="adm-chart-card">
            <div className="adm-chart-header">
              <h3>Top sản phẩm bán chạy</h3>
              <span className="adm-chart-period">Số lượng đã bán</span>
            </div>
            {chartData.products && (
              <Chart 
                type="doughnut" 
                data={chartData.products} 
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  }
                }}
                height={300}
              />
            )}
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
                    <img 
                      src={product.image} 
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = '/assets/images/products/placeholder-product.jpg';
                      }}
                    />
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