import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaMapMarkerAlt, 
  FaStar,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import { useNotification } from '../../../context/NotificationContext';
import api from '../../../services/api';
import './ShippingAddresses.css';

const ShippingAddresses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromCheckout = location.state?.fromCheckout;
  
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const { success, error } = useNotification();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    is_default: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await api.get('shipping-addresses/');
      setAddresses(response.data.results || response.data);
    } catch (err) {
      error('Không thể tải danh sách địa chỉ');
      console.error('Fetch addresses error:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Vui lòng nhập họ và tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Vui lòng nhập tỉnh/thành phố';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (editingAddress) {
        // Update existing address
        await api.patch(`shipping-addresses/${editingAddress.id}/`, formData);
        success('Cập nhật địa chỉ thành công!');
      } else {
        // Create new address
        await api.post('shipping-addresses/', formData);
        success('Thêm địa chỉ thành công!');
      }

      resetForm();
      fetchAddresses();
      
      // Nếu đến từ checkout và đây là địa chỉ đầu tiên, quay lại checkout
      if (fromCheckout && addresses.length === 0) {
        setTimeout(() => {
          navigate('/checkout');
        }, 1500);
      }
    } catch (err) {
      error('Có lỗi xảy ra. Vui lòng thử lại sau.');
      console.error('Submit address error:', err);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      full_name: address.full_name,
      email: address.email,
      phone: address.phone,
      address: address.address,
      city: address.city,
      district: address.district || '',
      ward: address.ward || '',
      is_default: address.is_default
    });
    setShowAddForm(true);
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      return;
    }

    try {
      await api.delete(`shipping-addresses/${addressId}/`);
      success('Xóa địa chỉ thành công!');
      fetchAddresses();
    } catch (err) {
      error('Không thể xóa địa chỉ. Vui lòng thử lại sau.');
      console.error('Delete address error:', err);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await api.post(`shipping-addresses/${addressId}/set_default/`);
      success('Đặt địa chỉ mặc định thành công!');
      fetchAddresses();
    } catch (err) {
      error('Không thể đặt địa chỉ mặc định. Vui lòng thử lại sau.');
      console.error('Set default error:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      district: '',
      ward: '',
      is_default: false
    });
    setEditingAddress(null);
    setShowAddForm(false);
    setErrors({});
  };

  const renderAddressForm = () => (
    <div className="address-form-overlay">
      <div className="address-form-modal">
        <div className="address-form-header">
          <h3>{editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</h3>
          <button className="close-btn" onClick={resetForm}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="address-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="full_name">Họ và tên *</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className={errors.full_name ? 'error' : ''}
                  placeholder="Nhập họ và tên"
                />
              </div>
              {errors.full_name && <span className="error-message">{errors.full_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Nhập email"
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại *</label>
              <div className="input-wrapper">
                <FaPhone className="input-icon" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Địa chỉ *</label>
            <div className="input-wrapper">
              <FaMapMarkerAlt className="input-icon" />
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={errors.address ? 'error' : ''}
                placeholder="Số nhà, tên đường"
              />
            </div>
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ward">Phường/Xã</label>
              <input
                type="text"
                id="ward"
                name="ward"
                value={formData.ward}
                onChange={handleInputChange}
                placeholder="Nhập phường/xã"
              />
            </div>

            <div className="form-group">
              <label htmlFor="district">Quận/Huyện</label>
              <input
                type="text"
                id="district"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                placeholder="Nhập quận/huyện"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="city">Tỉnh/Thành phố *</label>
            <div className="input-wrapper">
              <FaMapMarkerAlt className="input-icon" />
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={errors.city ? 'error' : ''}
                placeholder="VD: TP. Hồ Chí Minh"
              />
            </div>
            {errors.city && <span className="error-message">{errors.city}</span>}
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_default"
                checked={formData.is_default}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={resetForm}>
              Hủy
            </button>
            <button type="submit" className="btn-primary">
              {editingAddress ? 'Cập nhật' : 'Thêm địa chỉ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="shipping-addresses-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải danh sách địa chỉ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shipping-addresses-page">
      <div className="shipping-addresses-container">
        <div className="page-header">
          <h1>Địa chỉ giao hàng</h1>
          <p>Quản lý địa chỉ giao hàng của bạn</p>
        </div>

        <div className="addresses-content">
          <div className="addresses-header">
            <h2>Danh sách địa chỉ ({addresses.length})</h2>
            <button 
              className="btn-primary add-address-btn"
              onClick={() => setShowAddForm(true)}
            >
              <FaPlus />
              Thêm địa chỉ mới
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="empty-state">
              <FaMapMarkerAlt className="empty-icon" />
              <h3>Chưa có địa chỉ giao hàng</h3>
              <p>Thêm địa chỉ giao hàng để mua sắm dễ dàng hơn</p>
              <button 
                className="btn-primary"
                onClick={() => setShowAddForm(true)}
              >
                <FaPlus />
                Thêm địa chỉ đầu tiên
              </button>
            </div>
          ) : (
            <div className="addresses-grid">
              {addresses.map(address => (
                <div key={address.id} className={`address-card ${address.is_default ? 'default' : ''}`}>
                  {address.is_default && (
                    <div className="default-badge">
                      <FaStar />
                      Mặc định
                    </div>
                  )}
                  
                  <div className="address-info">
                    <div className="address-header">
                      <h3>{address.full_name}</h3>
                      <div className="address-actions">
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(address)}
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(address.id)}
                          title="Xóa"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    <div className="address-details">
                      <div className="detail-item">
                        <FaEnvelope />
                        <span>{address.email}</span>
                      </div>
                      <div className="detail-item">
                        <FaPhone />
                        <span>{address.phone}</span>
                      </div>
                      <div className="detail-item">
                        <FaMapMarkerAlt />
                        <span>
                          {address.address}
                          {address.ward && `, ${address.ward}`}
                          {address.district && `, ${address.district}`}
                          {`, ${address.city}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!address.is_default && (
                    <div className="address-footer">
                      <button 
                        className="btn-secondary set-default-btn"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        <FaStar />
                        Đặt làm mặc định
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddForm && renderAddressForm()}
    </div>
  );
};

export default ShippingAddresses;
