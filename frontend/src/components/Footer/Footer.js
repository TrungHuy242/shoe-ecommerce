import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-main">
        <div className="footer-section about">
          <h3>FootFashion</h3>
          <p>Thị trường giày dép cao cấp, mang phong cách sang trọng, tinh tế và hiện đại.</p>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedinIn /></a>
          </div>
        </div>

        <div className="footer-section links">
          <h4>Liên kết nhanh</h4>
          <Link to="/">Trang chủ</Link>
          <Link to="/products">Sản phẩm</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/contact">Liên hệ</Link>
        </div>

        <div className="footer-section policies">
          <h4>Chính sách</h4>
          <Link to="/privacy">Bảo mật</Link>
          <Link to="/terms">Điều khoản</Link>
          <Link to="/return">Đổi trả</Link>
          <Link to="/shipping">Vận chuyển</Link>
        </div>

        <div className="footer-section contact">
          <h4>Liên hệ</h4>
          <p><FaMapMarkerAlt /> 123 Lê Lợi, Q.1, TP.HCM</p>
          <p><FaPhoneAlt /> 0901 234 567</p>
          <p><FaEnvelope /> support@footfashion.vn</p>
          <p>Giờ làm việc: 9:00 - 20:00</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 FootFashion. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
