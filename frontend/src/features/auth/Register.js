import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone } from 'react-icons/fa';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
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
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
    }
    
    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
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
      setTimeout(() => {
        navigate('/login', {
          state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' }
        });
        setLoading(false);
      }, 1500);
      
    } catch (error) {
      setLoading(false);
      setErrors({
        general: 'Đăng ký thất bại. Vui lòng thử lại sau.'
      });
    }
  };

  return (
    <div className="reg-register-page">
      <div className="reg-register-container">
        <div className="reg-register-card">
          <div className="reg-register-header">
            <h1>Đăng ký tài khoản</h1>
            <p>Tham gia cùng chúng tôi ngay hôm nay!</p>
          </div>

          {errors.general && (
            <div className="reg-error-message">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="reg-register-form">
            <div className="reg-form-row">
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
            </div>

            <div className="reg-form-row">
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
                    placeholder="Nhập email của bạn"
                    className={errors.email ? 'reg-error' : ''}
                  />
                </div>
                {errors.email && <span className="reg-field-error">{errors.email}</span>}
              </div>
            </div>

            <div className="reg-form-row">
              <div className="reg-form-group">
                <label htmlFor="phone">Số điện thoại *</label>
                <div className="reg-input-wrapper">
                  <FaPhone className="reg-input-icon" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    className={errors.phone ? 'reg-error' : ''}
                  />
                </div>
                {errors.phone && <span className="reg-field-error">{errors.phone}</span>}
              </div>
            </div>

            <div className="reg-form-row">
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
            </div>

            <div className="reg-form-row">
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
                <Link to="/terms" className="reg-terms-link"> Điều khoản sử dụng</Link> và 
                <Link to="/privacy" className="reg-terms-link"> Chính sách bảo mật</Link>
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