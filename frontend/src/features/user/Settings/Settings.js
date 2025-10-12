import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaBell, 
  FaPalette,
  FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import api from '../../../services/api';
import './Settings.css';

const Settings = () => {
  const { user, logout } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('password');
  const [loading, setLoading] = useState(false);
  
  // Password change states
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // Notification settings states
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotions: true,
    newsletters: false
  });

  // Theme settings states
  const [themeSettings, setThemeSettings] = useState({
    theme: 'light',
    language: 'vi'
  });

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setLoading(true);
    try {
      const response = await api.post('change-password/', {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword
      });
      
      if (response.status === 200) {
        success('Đổi mật khẩu thành công!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      if (err.response?.status === 400) {
        error('Mật khẩu hiện tại không đúng');
      } else {
        error('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleThemeChange = (setting, value) => {
    setThemeSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderPasswordTab = () => (
    <div className="settings-tab-content">
      <div className="settings-section">
        <h3 className="settings-section-title">
          <FaLock className="settings-icon" />
          Thay đổi mật khẩu
        </h3>
        <p className="settings-section-desc">
          Để bảo mật tài khoản, hãy sử dụng mật khẩu mạnh và thay đổi thường xuyên.
        </p>
        
        <form onSubmit={handleChangePassword} className="password-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className={passwordErrors.currentPassword ? 'error' : ''}
                placeholder="Nhập mật khẩu hiện tại"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
              >
                {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {passwordErrors.currentPassword && (
              <span className="error-message">{passwordErrors.currentPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Mật khẩu mới</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className={passwordErrors.newPassword ? 'error' : ''}
                placeholder="Nhập mật khẩu mới"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
              >
                {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {passwordErrors.newPassword && (
              <span className="error-message">{passwordErrors.newPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={passwordErrors.confirmPassword ? 'error' : ''}
                placeholder="Nhập lại mật khẩu mới"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
              >
                {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {passwordErrors.confirmPassword && (
              <span className="error-message">{passwordErrors.confirmPassword}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Thay đổi mật khẩu'}
          </button>
        </form>
      </div>

    </div>
  );

  const renderNotificationsTab = () => (
    <div className="settings-tab-content">
      <div className="settings-section">
        <h3 className="settings-section-title">
          <FaBell className="settings-icon" />
          Cài đặt thông báo
        </h3>
        <p className="settings-section-desc">
          Chọn loại thông báo bạn muốn nhận.
        </p>
        
        <div className="notification-settings">
          <div className="notification-item">
            <div className="notification-info">
              <h4>Thông báo qua email</h4>
              <p>Nhận thông báo quan trọng qua email</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notificationSettings.emailNotifications}
                onChange={() => handleNotificationChange('emailNotifications')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="notification-info">
              <h4>Thông báo qua SMS</h4>
              <p>Nhận thông báo qua tin nhắn SMS</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notificationSettings.smsNotifications}
                onChange={() => handleNotificationChange('smsNotifications')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="notification-info">
              <h4>Cập nhật đơn hàng</h4>
              <p>Thông báo về trạng thái đơn hàng</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notificationSettings.orderUpdates}
                onChange={() => handleNotificationChange('orderUpdates')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="notification-info">
              <h4>Khuyến mãi</h4>
              <p>Thông báo về các chương trình khuyến mãi</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notificationSettings.promotions}
                onChange={() => handleNotificationChange('promotions')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="notification-info">
              <h4>Bản tin</h4>
              <p>Nhận bản tin và cập nhật từ cửa hàng</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notificationSettings.newsletters}
                onChange={() => handleNotificationChange('newsletters')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderThemeTab = () => (
    <div className="settings-tab-content">
      <div className="settings-section">
        <h3 className="settings-section-title">
          <FaPalette className="settings-icon" />
          Giao diện và ngôn ngữ
        </h3>
        <p className="settings-section-desc">
          Tùy chỉnh giao diện và ngôn ngữ hiển thị.
        </p>
        
        <div className="theme-settings">
          <div className="theme-item">
            <h4>Chủ đề</h4>
            <div className="theme-options">
              <label className="theme-option">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={themeSettings.theme === 'light'}
                  onChange={(e) => handleThemeChange('theme', e.target.value)}
                />
                <span>Sáng</span>
              </label>
              <label className="theme-option">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={themeSettings.theme === 'dark'}
                  onChange={(e) => handleThemeChange('theme', e.target.value)}
                />
                <span>Tối</span>
              </label>
            </div>
          </div>

          <div className="theme-item">
            <h4>Ngôn ngữ</h4>
            <select 
              value={themeSettings.language}
              onChange={(e) => handleThemeChange('language', e.target.value)}
              className="language-select"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1>Cài đặt tài khoản</h1>
          <p>Quản lý cài đặt và tùy chọn tài khoản của bạn</p>
        </div>

        <div className="settings-content">
          <div className="settings-sidebar">
            <div className="user-info">
              <div className="user-avatar">
                <FaUser />
              </div>
              <div className="user-details">
                <h3>{user?.name || user?.username}</h3>
                <p>{user?.email}</p>
              </div>
            </div>

            <nav className="settings-nav">
              <button
                className={`settings-nav-item ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
              >
                <FaLock />
                Mật khẩu & Bảo mật
              </button>
              <button
                className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <FaBell />
                Thông báo
              </button>
              <button
                className={`settings-nav-item ${activeTab === 'theme' ? 'active' : ''}`}
                onClick={() => setActiveTab('theme')}
              >
                <FaPalette />
                Giao diện
              </button>
            </nav>

            <div className="settings-actions">
              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt />
                Đăng xuất
              </button>
            </div>
          </div>

          <div className="settings-main">
            {activeTab === 'password' && renderPasswordTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'theme' && renderThemeTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
