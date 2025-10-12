import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { success } = useNotification();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Vui lòng nhập địa chỉ email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Địa chỉ email không hợp lệ');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('forgot-password/', {
        email: email
      });

      if (response.status === 200) {
        setEmailSent(true);
        success('Email khôi phục mật khẩu đã được gửi!');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Không tìm thấy tài khoản với email này');
      } else if (err.response?.status === 429) {
        setError('Quá nhiều yêu cầu. Vui lòng thử lại sau 5 phút');
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại sau');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = () => {
    setEmailSent(false);
    setEmail('');
    setError('');
  };

  if (emailSent) {
    return (
      <div className="forgot-password-page">
        <div className="forgot-password-container">
          <div className="forgot-password-card">
            <div className="success-icon">
              <FaCheckCircle />
            </div>
            <h2>Email đã được gửi!</h2>
            <p className="success-message">
              Chúng tôi đã gửi link khôi phục mật khẩu đến địa chỉ email <strong>{email}</strong>
            </p>
            <div className="instructions">
              <h3>Hướng dẫn:</h3>
              <ul>
                <li>Kiểm tra hộp thư đến của bạn</li>
                <li>Nhấp vào link trong email để đặt lại mật khẩu</li>
                <li>Link sẽ hết hạn sau 1 giờ</li>
                <li>Nếu không thấy email, hãy kiểm tra thư mục spam</li>
              </ul>
            </div>
            <div className="forgot-password-actions">
              <button 
                className="btn-secondary"
                onClick={handleResendEmail}
              >
                Gửi lại email
              </button>
              <Link to="/login" className="btn-primary">
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="forgot-password-header">
            <Link to="/login" className="back-link">
              <FaArrowLeft />
              Quay lại
            </Link>
            <h2>Quên mật khẩu?</h2>
            <p>
              Nhập địa chỉ email của bạn và chúng tôi sẽ gửi link để đặt lại mật khẩu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="email">Địa chỉ email</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập địa chỉ email của bạn"
                  className={error ? 'error' : ''}
                  disabled={loading}
                />
              </div>
              {error && <span className="error-message">{error}</span>}
            </div>

            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="spinner" />
                  Đang gửi...
                </>
              ) : (
                'Gửi link khôi phục'
              )}
            </button>
          </form>

          <div className="forgot-password-footer">
            <p>
              Nhớ mật khẩu?{' '}
              <Link to="/login" className="login-link">
                Đăng nhập ngay
              </Link>
            </p>
            <p>
              Chưa có tài khoản?{' '}
              <Link to="/register" className="register-link">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
