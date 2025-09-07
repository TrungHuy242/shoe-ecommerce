import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from 'react-icons/fa';
import api from '../../services/api';
import { jwtDecode } from 'jwt-decode';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', // Thay email bằng username
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

    if (!formData.username) {
      newErrors.username = 'Vui lòng nhập username'; // Thay email bằng username
    } /* else if (!/\S+@\S+\.\S+/.test(formData.username)) { // Loại bỏ validation email
      newErrors.username = 'Username không hợp lệ';
    } */

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post('token/', {
        username: formData.username, // Sử dụng username thay vì email
        password: formData.password
      });

      const { access, refresh, role } = response.data; // Giả định API trả về { access, refresh, role }
      if (!access || !refresh) {
        throw new Error('Token không hợp lệ từ server');
      }

      // Lưu token và thông tin user
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      const decoded = jwtDecode(access);
      localStorage.setItem('user', JSON.stringify({
        id: decoded.user_id || decoded.sub, // Điều chỉnh key dựa trên cấu trúc JWT
        username: formData.username, // Lưu username thay vì email
        role: role || 0 // Mặc định role = 0 nếu không có
      }));

      // Điều hướng dựa trên role
      navigate(role === 1 ? '/admin/dashboard' : '/');
    } catch (error) {
      let errorMsg = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.';
      if (error.response?.data?.detail === 'No active account found with the given credentials') {
        errorMsg = 'Sai tài khoản hoặc mật khẩu.'; // Ánh xạ lỗi cụ thể
      } else if (error.response?.data?.non_field_errors) {
        errorMsg = error.response.data.non_field_errors[0] || errorMsg;
      } else if (error.response?.data?.detail) {
        errorMsg = error.response.data.detail;
      }
      setErrors({
        general: errorMsg
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // TODO: Tích hợp API social login (Google, Facebook) khi backend sẵn sàng
  };

  return (
    <div className="auth-login-page">
      <div className="auth-login-container">
        <div className="auth-login-card">
          <div className="auth-login-header">
            <h1>Đăng nhập</h1>
            <p>Chào mừng bạn trở lại!</p>
          </div>

          {errors.general && (
            <div className="auth-error-message">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-login-form">
            <div className="auth-form-group">
              <label htmlFor="username">Username</label> {/* Thay email bằng username */}
              <div className="auth-input-wrapper">
                <FaUser className="auth-input-icon" />
                <input
                  type="text" // Thay type="email" bằng type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Nhập username của bạn" // Thay đổi placeholder
                  className={errors.username ? 'auth-error' : ''} // Thay email bằng username
                />
              </div>
              {errors.username && <span className="auth-field-error">{errors.username}</span>} {/* Thay email bằng username */}
            </div>

            <div className="auth-form-group">
              <label htmlFor="password">Mật khẩu</label>
              <div className="auth-input-wrapper">
                <FaLock className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  className={errors.password ? 'auth-error' : ''}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <span className="auth-field-error">{errors.password}</span>}
            </div>

            <div className="auth-form-options">
              <label className="auth-checkbox-wrapper">
                <input type="checkbox" />
                <span className="auth-checkmark"></span>
                Ghi nhớ đăng nhập
              </label>
              <Link to="/forgot-password" className="auth-forgot-password">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              className={`auth-login-btn ${loading ? 'auth-loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <div className="auth-spinner"></div>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>Hoặc đăng nhập với</span>
          </div>

          <div className="auth-social-login">
            <button
              type="button"
              className="auth-social-btn auth-google"
              onClick={() => handleSocialLogin('google')}
            >
              <FaGoogle />
              Google
            </button>
            <button
              type="button"
              className="auth-social-btn auth-facebook"
              onClick={() => handleSocialLogin('facebook')}
            >
              <FaFacebookF />
              Facebook
            </button>
          </div>

          <div className="auth-login-footer">
            <p>
              Chưa có tài khoản? 
              <Link to="/register" className="auth-register-link"> Đăng ký ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;