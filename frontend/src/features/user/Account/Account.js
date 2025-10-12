import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Edit2, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import './Account.css';

const Account = () => {
  const { isLoggedIn, user, updateUserInfo } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    username: '',
    city: '',
    district: ''
  });

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        username: user.username || '',
        city: user.city || '',
        district: user.district || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // chỉ gửi những trường có giá trị (tránh gửi null/undefined gây lỗi validate)
      const payload = {};
      ['name','email','phone','address','username','city','district'].forEach(k => {
        if (formData[k] !== undefined && formData[k] !== null) payload[k] = formData[k];
      });

      const response = await api.patch(`users/${user.id}/`, payload); // dùng PATCH thay vì PUT
      updateUserInfo(response.data);
      setMessage('Cập nhật thông tin thành công!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error?.response?.data || error.message);
      const detail = error?.response?.data
        ? JSON.stringify(error.response.data)
        : 'Có lỗi xảy ra khi cập nhật. Vui lòng thử lại.';
      setMessage(detail);
      setTimeout(() => setMessage(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        username: user.username || '',
        city: user.city || '',
        district: user.district || ''
      });
    }
    setIsEditing(false);
  };

  const renderProfileContent = () => (
    <div>
      {message && (
        <div className="message" style={{
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          background: message.includes('thành công') ? '#d1fae5' : '#fee2e2',
          color: message.includes('thành công') ? '#065f46' : '#991b1b'
        }}>
          {message}
        </div>
      )}

      <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label className="form-label">
            <User size={18} />
            Tên đầy đủ
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="form-input"
            placeholder="Nhập tên đầy đủ"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <User size={18} />
            Tên đăng nhập
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="form-input"
            placeholder="Tên đăng nhập"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <Mail size={18} />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="form-input"
            placeholder="email@example.com"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <Phone size={18} />
            Số điện thoại
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="form-input"
            placeholder="0123456789"
          />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">
            <MapPin size={18} />
            Địa chỉ
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="form-input form-textarea"
            placeholder="Nhập số nhà, tên đường"
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            <MapPin size={18} />
            Tỉnh/Thành phố
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="form-input"
            placeholder="VD: TP. Hồ Chí Minh"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <MapPin size={18} />
            Quận/Huyện
          </label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="form-input"
            placeholder="VD: Quận 1"
          />
        </div>

        <div className="form-actions">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn btn-secondary"
                disabled={loading}
              >
                <X size={18} />
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="btn btn-primary"
                disabled={loading}
              >
                <Save size={18} />
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
            >
              <Edit2 size={18} />
              Chỉnh sửa thông tin
            </button>
          )}
        </div>
      </form>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="account-page">
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          background: 'white',
          borderRadius: '1rem',
          maxWidth: '500px',
          margin: '2rem auto'
        }}>
          <User size={64} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
          <h2>Vui lòng đăng nhập</h2>
          <p style={{ color: '#6b7280' }}>
            Bạn cần đăng nhập để xem thông tin tài khoản
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="account-container">
        {/* Sidebar */}
        <div className="account-sidebar">
          <div className="sidebar-header">
            
            <div className="user-name">{user.name || user.username}</div>
            <div className="user-email">{user.email}</div>
          </div>
          <nav className="sidebar-nav">
            <button
              className="nav-item active"
            >
              <User size={20} />
              Thông tin cá nhân
            </button>
            <Link
              to="/shipping-addresses"
              className="nav-item"
            >
              <MapPin size={20} />
              Địa chỉ giao hàng
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="account-main">
          <div className="content-header">
            <h1 className="content-title">Thông tin cá nhân</h1>
            <p className="content-subtitle">Quản lý thông tin cá nhân và địa chỉ của bạn</p>
          </div>
          <div className="content-body">
            {renderProfileContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;