import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react';
import api from '../../../services/api';
import { useNotification } from '../../../context/NotificationContext';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { success, error } = useNotification();

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('notifications/');
      const notificationsData = response.data.results || response.data;
      setNotifications(notificationsData);
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
      success('Đã đánh dấu đã đọc');
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
      success('Đã đánh dấu tất cả đã đọc');
    } catch (err) {
      error('Không thể đánh dấu tất cả đã đọc');
      console.error('Mark all as read error:', err);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`notifications/${notificationId}/`);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      success('Đã xóa thông báo');
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

        <div className="notifications-list">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
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
      </div>
    </div>
  );
};

export default Notifications;
