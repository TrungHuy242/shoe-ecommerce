import { useEffect, useMemo, useState } from 'react';
import { FaTag, FaCopy, FaCheck, FaFilter, FaFireAlt, FaClock } from 'react-icons/fa';
import api from '../../../services/api';
import './Deals.css';

export default function Deals() {
  const [promotions, setPromotions] = useState([]);
  const [productPromos, setProductPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [onlyActive, setOnlyActive] = useState(true);
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      setLoading(true);
      try {
        const [promoRes, ppRes] = await Promise.all([
          api.get('/promotions/'),
          api.get('/product-promotions/')
        ]);
        if (!mounted) return;
        const promos = (promoRes.data.results || promoRes.data || []).map(p => ({
          ...p,
          start_date: p.start_date ? new Date(p.start_date) : null,
          end_date: p.end_date ? new Date(p.end_date) : null
        }));
        setPromotions(promos);
        setProductPromos(ppRes.data.results || ppRes.data || []);
      } catch (e) {
        console.error('Fetch promotions error', e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchAll();
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

  const codeToProducts = useMemo(() => {
    const map = {};
    for (const pp of productPromos) {
      const key = pp.promotion;
      if (!map[key]) map[key] = [];
      map[key].push(pp.product);
    }
    return map;
  }, [productPromos]);

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
    } catch {}
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
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm mã hoặc % giảm..." />
          </div>
          <label className="toggle">
            <input type="checkbox" checked={onlyActive} onChange={(e) => setOnlyActive(e.target.checked)} />
            <span><FaFilter /> Chỉ hiển thị mã còn hiệu lực</span>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="deals-loading">Đang tải khuyến mãi...</div>
      ) : filtered.length === 0 ? (
        <div className="deals-empty">Chưa có mã phù hợp.</div>
      ) : (
        <div className="deal-grid">
          {filtered.map(p => (
            <div key={p.id || p.code} className={`deal-card ${p.is_active ? 'active' : 'inactive'}`}>
              <div className="deal-head">
                <span className="badge"><FaFireAlt /> {p.discount_percentage}% OFF</span>
                {p.end_date && <span className="time"><FaClock /> {timeLeft(p.end_date)}</span>}
              </div>
              <div className="deal-body">
                <div className="code">{p.code}</div>
                <div className="meta">
                  <span>Bắt đầu: {formatDate(p.start_date)}</span>
                  <span>Hết hạn: {formatDate(p.end_date)}</span>
                </div>
                <div className="apply">
                  <button onClick={() => handleCopy(p.code)} className="copy-btn">
                    {copiedCode === p.code ? (<><FaCheck /> Đã copy</>) : (<><FaCopy /> Copy mã</>)}
                  </button>
                  <a className="view-btn" href={`/products?promo=${encodeURIComponent(p.code)}`}>Xem sản phẩm áp dụng</a>
                </div>
                {codeToProducts[p.id]?.length > 0 && (
                  <div className="mini-note">Áp dụng cho {codeToProducts[p.id].length} sản phẩm</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


