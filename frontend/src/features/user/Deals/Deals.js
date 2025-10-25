import { useEffect, useMemo, useState } from 'react';
import { FaTag, FaCopy, FaCheck, FaFilter, FaFireAlt, FaClock } from 'react-icons/fa';
import api from '../../../services/api';
import './Deals.css';

export default function Deals() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [onlyActive, setOnlyActive] = useState(true);
  const [copiedCode, setCopiedCode] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchPromotions() {
      setLoading(true);
      setError(null);
      try {
        const promoRes = await api.get('promotions/');
        
        if (!mounted) return;
        
        const promos = (promoRes.data.results || promoRes.data || []).map(p => ({
          ...p,
          start_date: p.start_date ? new Date(p.start_date) : null,
          end_date: p.end_date ? new Date(p.end_date) : null
        }));
        
        setPromotions(promos);
      } catch (e) {
        console.error('Fetch promotions error:', e);
        setError('Không thể tải danh sách mã giảm giá. Vui lòng thử lại.');
        if (!mounted) return;
        setPromotions([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchPromotions();
    return () => { mounted = false; };
  }, []);

  const now = new Date();
  const filtered = useMemo(() => {
    return promotions.filter(p => {
      if (onlyActive && p.is_active === false) return false;
      if (onlyActive && p.end_date && new Date(p.end_date) < now) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        (p.code || '').toLowerCase().includes(q) ||
        String(p.discount_percentage || '').toLowerCase().includes(q)
      );
    }).sort((a, b) => {
      const aEnd = a.end_date ? new Date(a.end_date).getTime() : Infinity;
      const bEnd = b.end_date ? new Date(b.end_date).getTime() : Infinity;
      return aEnd - bEnd;
    });
  }, [promotions, query, onlyActive]);

  const formatDate = (d) => {
    if (!d) return '';
    const dt = new Date(d);
    return dt.toLocaleString('vi-VN');
  };

  const timeLeft = (end) => {
    if (!end) return '';
    const diff = new Date(end).getTime() - now.getTime();
    if (diff <= 0) return 'Hết hạn';
    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    return `${hrs}h ${mins}m`;
  };

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(''), 1500);
    } catch (e) {
      console.error('Copy failed:', e);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(''), 1500);
      } catch (err) {
        alert('Không thể copy mã. Vui lòng copy thủ công: ' + code);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="deals-page">
      <div className="deals-header">
        <div className="title-wrap">
          <FaTag />
          <h1>Săn mã giảm giá</h1>
        </div>
        <div className="actions">
          <div className="search">
            <input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Tìm mã hoặc % giảm..." 
            />
          </div>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={onlyActive} 
              onChange={(e) => setOnlyActive(e.target.checked)} 
            />
            <span><FaFilter /> Chỉ hiển thị mã còn hiệu lực</span>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="deals-loading">
          <div className="deals-spinner"></div>
          <p>Đang tải khuyến mãi...</p>
        </div>
      ) : error ? (
        <div className="deals-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Thử lại
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="deals-empty">
          <FaTag size={48} color="#ccc" />
          <h3>Chưa có mã phù hợp</h3>
          <p>
            {promotions.length === 0 
              ? 'Hiện tại chưa có mã giảm giá nào.' 
              : 'Thử thay đổi từ khóa tìm kiếm hoặc bỏ bộ lọc.'}
          </p>
        </div>
      ) : (
        <div className="deal-grid">
          {filtered.map(p => (
            <div key={p.id || p.code} className={`deal-card ${p.is_active ? 'active' : 'inactive'}`}>
              <div className="deal-head">
                <span className="badge">
                  <FaFireAlt /> {p.discount_percentage}% OFF
                </span>
                {p.end_date && (
                  <span className="time">
                    <FaClock /> {timeLeft(p.end_date)}
                  </span>
                )}
              </div>
              <div className="deal-body">
                <div className="code">{p.code}</div>
                <div className="meta">
                  <span>Bắt đầu: {formatDate(p.start_date)}</span>
                  <span>Hết hạn: {formatDate(p.end_date)}</span>
                </div>
                <div className="apply">
                  <button onClick={() => handleCopy(p.code)} className="copy-btn">
                    {copiedCode === p.code ? (
                      <><FaCheck /> Đã copy</>
                    ) : (
                      <><FaCopy /> Copy mã</>
                    )}
                  </button>
                  <a 
                    className="view-btn" 
                    href={`/products?promo=${encodeURIComponent(p.code)}`}
                  >
                    Áp dụng ngay
                  </a>
                </div>
                <div className="mini-note">
                  Áp dụng cho tất cả sản phẩm
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


