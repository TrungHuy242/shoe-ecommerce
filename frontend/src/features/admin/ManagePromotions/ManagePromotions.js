import { useEffect, useMemo, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSave, FaTimes } from 'react-icons/fa';
import api from '../../../services/api';
import './ManagePromotions.css';

export default function ManagePromotions() {
  const [promotions, setPromotions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ code: '', discount_percentage: 0, start_date: '', end_date: '', is_active: true });
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      try {
        setLoading(true);
        const pRes = await api.get('/promotions/');
        if (!mounted) return;
        setPromotions(pRes.data.results || pRes.data || []);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchAll();
    return () => { mounted = false; };
  }, []);

  const filteredPromos = useMemo(() => {
    const q = query.toLowerCase();
    return promotions.filter(p => (p.code || '').toLowerCase().includes(q));
  }, [promotions, query]);

  const resetForm = () => {
    setEditing(null);
    setForm({ code: '', discount_percentage: 0, start_date: '', end_date: '', is_active: true });
  };

  const startCreate = () => { resetForm(); setEditing('new'); };
  const startEdit = (promo) => {
    setEditing(promo.id);
    setForm({
      code: promo.code || '',
      discount_percentage: promo.discount_percentage || 0,
      start_date: promo.start_date ? promo.start_date.substring(0,16) : '',
      end_date: promo.end_date ? promo.end_date.substring(0,16) : '',
      is_active: promo.is_active !== false
    });
    
  };

  const savePromo = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    try {
      if (editing === 'new') {
        await api.post('/promotions/', payload);
      } else {
        await api.put(`/promotions/${editing}/`, payload);
      }
      resetForm();
      const { data } = await api.get('/promotions/');
      setPromotions(data.results || data || []);
    } catch (err) {
      alert('Lưu khuyến mãi thất bại');
      console.error(err);
    }
  };

  const deletePromo = async (id) => {
    if (!window.confirm('Xóa khuyến mãi này?')) return;
    try {
      await api.delete(`/promotions/${id}/`);
      setPromotions(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Xóa thất bại');
    }
  };

  

  return (
    <div className="manage-promos">
      <div className="header">
        <h1>Quản lý mã giảm giá</h1>
        <div className="actions">
          <div className="search">
            <FaSearch />
            <input placeholder="Tìm mã..." value={query} onChange={(e)=>setQuery(e.target.value)} />
          </div>
          <button className="primary" onClick={startCreate}><FaPlus /> Tạo mới</button>
        </div>
      </div>

      {loading ? (<div className="loading">Đang tải...</div>) : (
        <div className="grid">
          <div className="list">
            {filteredPromos.map(p => (
              <div key={p.id} className={`promo-item ${editing===p.id?'active':''}`}>
                <div className="meta">
                  <div className="code">{p.code}</div>
                  <div className="percent">-{p.discount_percentage}%</div>
                </div>
                <div className="dates">
                  <span>Bắt đầu: {p.start_date}</span>
                  <span>Kết thúc: {p.end_date}</span>
                </div>
                <div className="row-actions">
                  <button onClick={()=>startEdit(p)}><FaEdit /> Sửa</button>
                  <button className="danger" onClick={()=>deletePromo(p.id)}><FaTrash /> Xóa</button>
                </div>
              </div>
            ))}
            {filteredPromos.length===0 && <div className="empty">Chưa có mã</div>}
          </div>

          <div className="editor">
            {editing && (
              <form onSubmit={savePromo} className="form">
                <div className="form-row">
                  <label>Mã</label>
                  <input value={form.code} onChange={(e)=>setForm({...form, code:e.target.value})} required maxLength={20}/>
                </div>
                <div className="form-row">
                  <label>Giảm (%)</label>
                  <input type="number" min="0" max="100" value={form.discount_percentage} onChange={(e)=>setForm({...form, discount_percentage:Number(e.target.value)})} required/>
                </div>
                <div className="form-row two">
                  <div>
                    <label>Bắt đầu</label>
                    <input type="datetime-local" value={form.start_date} onChange={(e)=>setForm({...form, start_date:e.target.value})}/>
                  </div>
                  <div>
                    <label>Kết thúc</label>
                    <input type="datetime-local" value={form.end_date} onChange={(e)=>setForm({...form, end_date:e.target.value})}/>
                  </div>
                </div>
                <div className="form-row">
                  <label><input type="checkbox" checked={form.is_active} onChange={(e)=>setForm({...form, is_active:e.target.checked})}/> Kích hoạt</label>
                </div>
                <div className="form-actions">
                  <button type="submit" className="primary"><FaSave /> Lưu</button>
                  <button type="button" onClick={resetForm}><FaTimes /> Hủy</button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}


