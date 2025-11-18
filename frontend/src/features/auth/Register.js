import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserTag } from 'react-icons/fa';
import api from '../../services/api';
import { jwtDecode } from 'jwt-decode';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
    }

    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Email không hợp lệ. Vui lòng nhập đúng định dạng (ví dụ: user@example.com)';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ thường';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ hoa';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ số';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Vui lòng đồng ý với điều khoản sử dụng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await api.post('register/', {
        username: formData.username,
        name: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      if (response.status === 201 || response.data.message === 'Đăng ký thành công') {
        navigate('/login', {
          state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' }
        });
      }

      if (response.data.access && response.data.refresh) {
        const { access, refresh, role } = response.data;
        localStorage.setItem('token', access);
        localStorage.setItem('refreshToken', refresh);
        const decoded = jwtDecode(access);
        localStorage.setItem('user', JSON.stringify({
          id: decoded.user_id || decoded.sub,
          username: formData.username,
          role: role || 0
        }));
        navigate(role === 1 ? '/admin/dashboard' : '/');
      }
    } catch (error) {
      let errorMsg = 'Đăng ký thất bại. Vui lòng thử lại sau.';
      if (error.response?.data?.detail) {
        errorMsg = error.response.data.detail;
      } else if (error.response?.data?.non_field_errors) {
        errorMsg = error.response.data.non_field_errors[0];
      } else if (error.response?.data?.username) {
        errorMsg = error.response.data.username[0];
      } else if (error.response?.data?.email) {
        errorMsg = error.response.data.email[0];
      }

      setErrors({
        general: errorMsg
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-register-page">
      <div className="reg-register-container">
        <div className="reg-register-card">
          <div className="reg-register-header">
            <h1>Đăng ký tài khoản</h1>
            <p>Tham gia cùng chúng tôi để mua sắm dễ dàng hơn!</p>
          </div>

          {errors.general && (
            <div className="reg-error-message">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="reg-register-form">
            <div className="reg-form-group">
              <label htmlFor="username">Tên đăng nhập *</label>
              <div className="reg-input-wrapper">
                <FaUserTag className="reg-input-icon" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Nhập tên đăng nhập"
                  className={errors.username ? 'reg-error' : ''}
                />
              </div>
              {errors.username && <span className="reg-field-error">{errors.username}</span>}
            </div>

            <div className="reg-form-group">
              <label htmlFor="fullName">Họ và tên *</label>
              <div className="reg-input-wrapper">
                <FaUser className="reg-input-icon" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                  className={errors.fullName ? 'reg-error' : ''}
                />
              </div>
              {errors.fullName && <span className="reg-field-error">{errors.fullName}</span>}
            </div>

            <div className="reg-form-group">
              <label htmlFor="email">Email *</label>
              <div className="reg-input-wrapper">
                <FaEnvelope className="reg-input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email"
                  className={errors.email ? 'reg-error' : ''}
                />
              </div>
              {errors.email && <span className="reg-field-error">{errors.email}</span>}
            </div>

            <div className="reg-form-group">
              <label htmlFor="password">Mật khẩu *</label>
              <div className="reg-input-wrapper">
                <FaLock className="reg-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  className={errors.password ? 'reg-error' : ''}
                />
                <button
                  type="button"
                  className="reg-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <span className="reg-field-error">{errors.password}</span>}
            </div>

            <div className="reg-form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu *</label>
              <div className="reg-input-wrapper">
                <FaLock className="reg-input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  className={errors.confirmPassword ? 'reg-error' : ''}
                />
                <button
                  type="button"
                  className="reg-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && <span className="reg-field-error">{errors.confirmPassword}</span>}
            </div>

            <div className="reg-form-group">
              <label className="reg-checkbox-wrapper">
                <input 
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                <span className="reg-checkmark"></span>
                Tôi đồng ý với 
                <a 
                  href="#" 
                  className="reg-terms-link"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    alert('Điều khoản sử dụng: Khi đăng ký tài khoản, bạn đồng ý tuân thủ các quy định của FootFashion. Vui lòng liên hệ support@footfashion.vn để biết thêm chi tiết.'); 
                  }}
                > Điều khoản sử dụng</a> và 
                <a 
                  href="#" 
                  className="reg-terms-link"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    alert('Chính sách bảo mật: Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Vui lòng liên hệ support@footfashion.vn để biết thêm chi tiết.'); 
                  }}
                > Chính sách bảo mật</a>
              </label>
              {errors.terms && <span className="reg-field-error">{errors.terms}</span>}
            </div>

            <button
              type="submit"
              className={`reg-register-btn ${loading ? 'reg-loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <div className="reg-spinner"></div>
              ) : (
                'Đăng ký tài khoản'
              )}
            </button>
          </form>

          <div className="reg-register-footer">
            <p>
              Đã có tài khoản? 
              <Link to="/login" className="reg-login-link"> Đăng nhập ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;