// src/features/auth/Login.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebookF,
} from "react-icons/fa";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = "Vui lòng nhập username";
    }
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 1. Gọi API login
      const response = await api.post("token/", {
        username: formData.username,
        password: formData.password,
      });
      const { access, refresh } = response.data;

      if (!access || !refresh) {
        throw new Error("Token không hợp lệ từ server");
      }

      // 2. Lưu token vào localStorage
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // 3. Giải mã token để lấy user_id
      const decodedToken = jwtDecode(access);
      const userId = decodedToken.user_id;

      // 4. Gọi API lấy thông tin user (để lấy role)
      const userRes = await api.get(`users/${userId}/`);
      const userData = userRes.data;

      // 5. Lưu thông tin user và role
      login(userData); // Cập nhật AuthContext
      localStorage.setItem("user_role", userData.role);

      // 6. Điều hướng dựa theo role
      if (userData.role === 1) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setErrors({
        general: "Tên đăng nhập hoặc mật khẩu không đúng!",
      });
      console.error("Lỗi đăng nhập:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Đăng nhập với ${provider} chưa được triển khai`);
  };

  return (
    <div className="auth-login-page">
      <div className="auth-login-container">
        <div className="auth-login-card">
          <div className="auth-login-header">
            <h1>Đăng nhập</h1>
            <p>Chào mừng bạn trở lại!</p>
            {errors.general && (
              <span className="auth-error-message">{errors.general}</span>
            )}
          </div>
          <form onSubmit={handleSubmit} className="auth-login-form">
            <div className="auth-form-group">
              <div className="auth-input-wrapper">
                <FaUser className="auth-input-icon" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Tên đăng nhập"
                  disabled={loading}
                />
              </div>
              {errors.username && (
                <span className="auth-field-error">{errors.username}</span>
              )}
            </div>

            <div className="auth-form-group">
              <div className="auth-input-wrapper">
                <FaLock className="auth-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mật khẩu"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <span className="auth-field-error">{errors.password}</span>
              )}
            </div>

            <div className="auth-form-options">
              <label className="auth-checkbox-wrapper">
                <input type="checkbox" disabled={loading} />
                <span className="auth-checkmark"></span>
                Ghi nhớ đăng nhập
              </label>
              <Link to="/forgot-password" className="auth-forgot-password">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              className={`auth-login-btn ${loading ? "auth-loading" : ""}`}
              disabled={loading}
            >
              {loading ? <div className="auth-spinner"></div> : "Đăng nhập"}
            </button>
          </form>

          <div className="auth-divider">
            <span>Hoặc đăng nhập với</span>
          </div>

          <div className="auth-social-login">
            <button
              type="button"
              className="auth-social-btn auth-google"
              onClick={() => handleSocialLogin("google")}
              disabled={loading}
            >
              <FaGoogle />
              Google
            </button>
            <button
              type="button"
              className="auth-social-btn auth-facebook"
              onClick={() => handleSocialLogin("facebook")}
              disabled={loading}
            >
              <FaFacebookF />
              Facebook
            </button>
          </div>

          <div className="auth-login-footer">
            <p>
              Chưa có tài khoản?{" "}
              <Link to="/register" className="auth-register-link">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
