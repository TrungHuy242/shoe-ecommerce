import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, CheckCheck, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../../services/api';
import { useNotification } from '../../../context/NotificationContext';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [readCount, setReadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const itemsPerPage = 10;
  const { success, error } = useNotification();

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filter changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        page_size: itemsPerPage,
      };

      // Filter by read status using backend filter
      if (filter === 'unread') {
        params.is_read = 'false';
      } else if (filter === 'read') {
        params.is_read = 'true';
      }
      // 'all' doesn't need filter param

      const response = await api.get('notifications/', { params });
      
      if (Array.isArray(response.data)) {
        setNotifications(response.data);
        setTotalNotifications(response.data.length);
        setTotalPages(1);
      } else {
        const notificationsList = response.data.results || [];
        const totalCount = response.data.count || 0;
        
        setNotifications(notificationsList);
        setTotalNotifications(totalCount);
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
      }
    } catch (err) {
      error('Không thể tải thông báo');
      console.error('Fetch notifications error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('notifications/unread_count/');
      setUnreadCount(response.data.unread_count || 0);
    } catch (err) {
      console.error('Fetch unread count error:', err);
    }
  };

  const fetchStats = async () => {
    // Fetch all notifications count and read count for stats
    try {
      const [allRes, readRes] = await Promise.all([
        api.get('notifications/', { params: { page_size: 1 } }),
        api.get('notifications/', { params: { is_read: 'true', page_size: 1 } })
      ]);
      
      const totalCount = allRes.data.count || (Array.isArray(allRes.data) ? allRes.data.length : 0);
      const read = readRes.data.count || (Array.isArray(readRes.data) ? readRes.data.filter(n => n.is_read).length : 0);
      
      setTotalNotifications(totalCount);
      setReadCount(read);
      
      // Update unread count if needed
      if (unreadCount === 0 && totalCount > read) {
        setUnreadCount(totalCount - read);
      }
    } catch (err) {
      // Silently fail, use unread_count endpoint only
      console.error('Fetch stats error:', err);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.post(`notifications/${notificationId}/mark_read/`);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      // If filtering by unread, remove from list
      if (filter === 'unread') {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      }
      // Don't show toast for single mark as read to reduce noise
    } catch (err) {
      error('Không thể đánh dấu đã đọc');
      console.error('Mark as read error:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('notifications/mark_all_read/');
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
      // If filtering by unread, clear the list
      if (filter === 'unread') {
        setNotifications([]);
      }
      success('Đã đánh dấu tất cả đã đọc');
      // Refresh to update pagination
      await fetchUnreadCount();
      await fetchNotifications();
      await fetchStats();
    } catch (err) {
      error('Không thể đánh dấu tất cả đã đọc');
      console.error('Mark all as read error:', err);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`notifications/${notificationId}/`);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      setTotalNotifications(prev => Math.max(0, prev - 1));
      
      // If current page becomes empty, go to previous page
      if (notifications.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        // Refresh notifications
        await fetchNotifications();
      }
      
      // Update unread count if deleted notification was unread
      const deletedNotif = notifications.find(n => n.id === notificationId);
      if (deletedNotif && !deletedNotif.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      // Don't show toast to reduce noise
    } catch (err) {
      error('Không thể xóa thông báo');
      console.error('Delete notification error:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order_confirmed':
        return '✅';
      case 'order_shipped':
        return '🚚';
      case 'order_delivered':
        return '📦';
      case 'promotion':
        return '🎉';
      case 'system':
        return 'ℹ️';
      default:
        return '🔔';
    }
  };

  const getNotificationTypeText = (type) => {
    switch (type) {
      case 'order_confirmed':
        return 'Đơn hàng được xác nhận';
      case 'order_shipped':
        return 'Đơn hàng đã giao hàng';
      case 'order_delivered':
        return 'Đơn hàng đã giao thành công';
      case 'promotion':
        return 'Khuyến mãi';
      case 'system':
        return 'Thông báo hệ thống';
      default:
        return 'Thông báo';
    }
  };

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="notifications-container">
          <div className="loading">Đang tải thông báo...</div>
        </div>
      </div>
    );
  }

  // Statistics
  const stats = {
    total: totalNotifications,
    unread: unreadCount,
    read: readCount || (totalNotifications - unreadCount)
  };

  // No need to filter - backend handles it
  const filteredNotifications = notifications;

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="notifications-header">
          <div className="header-title">
            <Bell size={24} />
            <h1>Thông báo</h1>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </div>
          
          {unreadCount > 0 && (
            <button 
              className="mark-all-read-btn"
              onClick={markAllAsRead}
            >
              <CheckCheck size={16} />
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>

        {/* Statistics Dashboard */}
        <div className="notifications-stats">
          <div 
            className={`stat-card ${filter === 'all' ? 'active' : ''}`}
            onClick={() => {
              setFilter('all');
              setCurrentPage(1);
            }}
          >
            <div className="stat-label">Tất cả</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div 
            className={`stat-card ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => {
              setFilter('unread');
              setCurrentPage(1);
            }}
          >
            <div className="stat-label">Chưa đọc</div>
            <div className="stat-value">{stats.unread}</div>
          </div>
          <div 
            className={`stat-card ${filter === 'read' ? 'active' : ''}`}
            onClick={() => {
              setFilter('read');
              setCurrentPage(1);
            }}
          >
            <div className="stat-label">Đã đọc</div>
            <div className="stat-value">{stats.read}</div>
          </div>
        </div>

        <div className="notifications-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div 
                key={notification.id}
                className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
              >
                {/* Left side - Image */}
                <div className="notification-left">
                  {notification.product_image ? (
                    <div className="notification-image">
                      <img 
                        src={notification.product_image} 
                        alt={notification.related_product_name || 'Sản phẩm'}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}
                  {!notification.is_read && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
                
                {/* Right side - Content */}
                <div className="notification-right">
                  <div className="notification-header">
                    <h3 className="notification-title">{notification.title}</h3>
                    <span className="notification-time">
                      {new Date(notification.created_at).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  
                  <p className="notification-message">{notification.message}</p>
                  
                  {/* Product Info */}
                  {notification.related_product_name && (
                    <div className="notification-product-info">
                      <span className="product-name">{notification.related_product_name}</span>
                      {notification.related_product_price && (
                        <span className="product-price">
                          {Number(notification.related_product_price).toLocaleString('vi-VN')}đ
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Action Button */}
                  {notification.action_button_text && notification.action_url && (
                    <button 
                      className="notification-action-btn"
                      onClick={() => {
                        if (notification.action_url.startsWith('/')) {
                          window.location.href = notification.action_url;
                        } else {
                          window.open(notification.action_url, '_blank');
                        }
                      }}
                    >
                      {notification.action_button_text}
                    </button>
                  )}
                  
                  {notification.related_order && !notification.action_button_text && (
                    <Link 
                      to={`/order/${notification.related_order}`}
                      className="view-order-link"
                    >
                      Xem đơn hàng
                    </Link>
                  )}
                </div>
                
                <div className="notification-actions">
                  {!notification.is_read && (
                    <button 
                      className="mark-read-btn"
                      onClick={() => markAsRead(notification.id)}
                      title="Đánh dấu đã đọc"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  
                  <button 
                    className="delete-btn"
                    onClick={() => deleteNotification(notification.id)}
                    title="Xóa thông báo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-notifications">
              <Bell size={48} />
              <h3>Không có thông báo nào</h3>
              <p>Bạn sẽ nhận được thông báo khi có cập nhật về đơn hàng hoặc khuyến mãi mới.</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="notifications-pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              title="Trang trước"
            >
              <ChevronLeft size={18} />
              Trước
            </button>
            <span className="pagination-info">
              Trang {currentPage} / {totalPages} (Tổng: {totalNotifications} thông báo)
            </span>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              title="Trang sau"
            >
              Sau
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
