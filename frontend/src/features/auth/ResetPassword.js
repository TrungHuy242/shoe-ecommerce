import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import './ResetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [tokenValid, setTokenValid] = useState(null);
  const [passwordReset, setPasswordReset] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      navigate('/forgot-password');
      return;
    }

    // Validate token
    validateToken();
  }, [token, email, navigate]);

  const validateToken = async () => {
    try {
      const response = await api.post('validate-reset-token/', {
        token: token,
        email: email
      });
      
      if (response.status === 200) {
        setTokenValid(true);
      }
    } catch (err) {
      setTokenValid(false);
      if (err.response?.status === 400) {
        error('Link khôi phục mật khẩu không hợp lệ hoặc đã hết hạn');
      } else {
        error('Có lỗi xảy ra. Vui lòng thử lại');
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu mới';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    setLoading(true);
    try {
      const response = await api.post('reset-password/', {
        token: token,
        email: email,
        password: formData.password
      });

      if (response.status === 200) {
        setPasswordReset(true);
        success('Đặt lại mật khẩu thành công!');
      }
    } catch (err) {
      if (err.response?.status === 400) {
        error('Link khôi phục mật khẩu không hợp lệ hoặc đã hết hạn');
      } else if (err.response?.status === 404) {
        error('Không tìm thấy tài khoản');
      } else {
        error('Có lỗi xảy ra. Vui lòng thử lại sau');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (tokenValid === null) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="reset-password-card">
            <div className="loading-state">
              <FaSpinner className="spinner" />
              <p>Đang xác thực link khôi phục...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="reset-password-card">
            <div className="error-state">
              <h2>Link không hợp lệ</h2>
              <p>Link khôi phục mật khẩu không hợp lệ hoặc đã hết hạn.</p>
              <div className="reset-password-actions">
                <Link to="/forgot-password" className="btn-primary">
                  Yêu cầu link mới
                </Link>
                <Link to="/login" className="btn-secondary">
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (passwordReset) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="reset-password-card">
            <div className="success-state">
              <FaCheckCircle className="success-icon" />
              <h2>Đặt lại mật khẩu thành công!</h2>
              <p>Mật khẩu của bạn đã được thay đổi thành công. Bây giờ bạn có thể đăng nhập với mật khẩu mới.</p>
              <Link to="/login" className="btn-primary">
                Đăng nhập ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="reset-password-header">
            <Link to="/login" className="back-link">
              <FaArrowLeft />
              Quay lại
            </Link>
            <h2>Đặt lại mật khẩu</h2>
            <p>
              Nhập mật khẩu mới cho tài khoản <strong>{email}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="reset-password-form">
            <div className="form-group">
              <label htmlFor="password">Mật khẩu mới</label>
              <div className="password-input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPasswords.password ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu mới"
                  className={errors.password ? 'error' : ''}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('password')}
                >
                  {showPasswords.password ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
              <div className="password-input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPasswords.confirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Nhập lại mật khẩu mới"
                  className={errors.confirmPassword ? 'error' : ''}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                >
                  {showPasswords.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            <div className="password-requirements">
              <h4>Yêu cầu mật khẩu:</h4>
              <ul>
                <li className={formData.password.length >= 6 ? 'valid' : ''}>
                  Ít nhất 6 ký tự
                </li>
                <li className={/(?=.*[a-z])/.test(formData.password) ? 'valid' : ''}>
                  Có chữ thường
                </li>
                <li className={/(?=.*[A-Z])/.test(formData.password) ? 'valid' : ''}>
                  Có chữ hoa
                </li>
                <li className={/(?=.*\d)/.test(formData.password) ? 'valid' : ''}>
                  Có số
                </li>
              </ul>
            </div>

            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="spinner" />
                  Đang xử lý...
                </>
              ) : (
                'Đặt lại mật khẩu'
              )}
            </button>
          </form>

          <div className="reset-password-footer">
            <p>
              Nhớ mật khẩu?{' '}
              <Link to="/login" className="login-link">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
