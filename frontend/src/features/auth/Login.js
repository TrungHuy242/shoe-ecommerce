import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
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
      setTimeout(() => {
        localStorage.setItem('user', JSON.stringify({
          id: 1,
          email: formData.email,
          name: 'Người dùng'
        }));
        navigate('/');
        setLoading(false);
      }, 1500);
      
    } catch (error) {
      setLoading(false);
      setErrors({
        general: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
      });
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
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
              <label htmlFor="email">Email</label>
              <div className="auth-input-wrapper">
                <FaUser className="auth-input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email của bạn"
                  className={errors.email ? 'auth-error' : ''}
                />
              </div>
              {errors.email && <span className="auth-field-error">{errors.email}</span>}
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