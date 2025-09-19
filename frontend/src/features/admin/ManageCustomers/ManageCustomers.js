import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaSearch, FaSort, FaSync, FaTrash, FaUserShield, FaUserAltSlash, FaDownload, FaUserEdit } from 'react-icons/fa';
import api from '../../../services/api';
import './ManageCustomers.css';

const ManageCustomers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // all | customer | admin
  const [statusFilter, setStatusFilter] = useState('all'); // all | active | inactive
  const [sortBy, setSortBy] = useState('created'); // name | email | created | orders
  const [sortOrder, setSortOrder] = useState('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(15);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // lấy nhiều nhất có thể, nếu có paginate thì dựa vào count
      const res = await api.get('users/', { params: { ordering: '-date_joined', page_size: 1000 } });
      const list = Array.isArray(res.data) ? res.data : (res.data.results || []);
      // chuẩn hóa (phòng trường hợp BE không trả đủ)
      const enriched = list.map(u => ({
        id: u.id,
        username: u.username || u.name || `User#${u.id}`,
        name: u.name || u.username || '',
        email: u.email || '',
        phone: u.phone || '',
        address: u.address || '',
        role: typeof u.role === 'number' ? u.role : 0, // 0 customer, 1 admin
        is_active: typeof u.is_active === 'boolean' ? u.is_active : true,
        date_joined: u.date_joined || u.created_at || '',
        orders_count: u.orders_count || 0,
      }));
      setUsers(enriched);
    } catch (e) {
      console.error('Load users failed', e?.response?.data || e.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filtered = useMemo(() => {
    const bySearch = (u) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        String(u.username).toLowerCase().includes(q) ||
        String(u.name).toLowerCase().includes(q) ||
        String(u.email).toLowerCase().includes(q) ||
        String(u.phone).toLowerCase().includes(q)
      );
    };
    const byRole = (u) => roleFilter === 'all' ||
      (roleFilter === 'customer' && u.role === 0) ||
      (roleFilter === 'admin' && u.role === 1);
    const byStatus = (u) => statusFilter === 'all' ||
      (statusFilter === 'active' && u.is_active) ||
      (statusFilter === 'inactive' && !u.is_active);

    let arr = users.filter(u => bySearch(u) && byRole(u) && byStatus(u));
    arr.sort((a, b) => {
      let av, bv;
      switch (sortBy) {
        case 'name': av = (a.name || a.username || '').toLowerCase(); bv = (b.name || b.username || '').toLowerCase(); break;
        case 'email': av = (a.email || '').toLowerCase(); bv = (b.email || '').toLowerCase(); break;
        case 'orders': av = a.orders_count || 0; bv = b.orders_count || 0; break;
        case 'created':
        default: av = new Date(a.date_joined || 0).getTime(); bv = new Date(b.date_joined || 0).getTime(); break;
      }
      if (sortOrder === 'asc') return av > bv ? 1 : -1;
      return av < bv ? 1 : -1;
    });
    return arr;
  }, [users, search, roleFilter, statusFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const start = (currentPage - 1) * perPage;
  const pageData = filtered.slice(start, start + perPage);

  const updateUser = async (id, data) => {
    await api.patch(`users/${id}/`, data);
  };

  const handleToggleActive = async (u) => {
    if (!window.confirm(`${u.is_active ? 'Vô hiệu hoá' : 'Kích hoạt'} tài khoản này?`)) return;
    try {
      await updateUser(u.id, { is_active: !u.is_active });
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, is_active: !x.is_active } : x));
    } catch (e) {
      console.error('Toggle active failed', e?.response?.data || e.message);
      alert('Thao tác thất bại');
    }
  };

  const handleChangeRole = async (u, newRole) => {
    try {
      await updateUser(u.id, { role: Number(newRole) });
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: Number(newRole) } : x));
    } catch (e) {
      console.error('Change role failed', e?.response?.data || e.message);
      alert('Cập nhật vai trò thất bại');
    }
  };

  const handleDelete = async (u) => {
    if (!window.confirm('Bạn chắc chắn muốn xoá người dùng này?')) return;
    try {
      await api.delete(`users/${u.id}/`);
      setUsers(prev => prev.filter(x => x.id !== u.id));
    } catch (e) {
      console.error('Delete user failed', e?.response?.data || e.message);
      alert('Xoá người dùng thất bại');
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Tên', 'Email', 'SĐT', 'Vai trò', 'Trạng thái', 'Ngày tạo', 'Số đơn'];
    const rows = filtered.map(u => [
      u.id,
      `"${(u.name || u.username || '').replace(/"/g, '""')}"`,
      u.email,
      u.phone,
      u.role === 1 ? 'Admin' : 'Khách hàng',
      u.is_active ? 'Đang hoạt động' : 'Đã vô hiệu',
      u.date_joined,
      u.orders_count
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'users.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mc-page">
      <div className="mc-container">
        <div className="mc-header">
          <div className="mc-title">
            <h1><FaUsers /> Quản lý người dùng</h1>
            <p>{filtered.length} người dùng</p>
          </div>
          <div className="mc-actions">
            <button className="mc-btn" onClick={loadUsers}><FaSync /> Tải lại</button>
            <button className="mc-btn mc-export" onClick={exportCSV}><FaDownload /> Xuất CSV</button>
          </div>
        </div>

        <div className="mc-filters">
          <div className="mc-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Tìm theo tên, email, SĐT..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="mc-selects">
            <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}>
              <option value="all">Tất cả vai trò</option>
              <option value="customer">Khách hàng</option>
              <option value="admin">Admin</option>
            </select>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Đã vô hiệu</option>
            </select>
            <div className="mc-sort">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="created">Ngày tạo</option>
                <option value="name">Tên</option>
                <option value="email">Email</option>
                <option value="orders">Số đơn hàng</option>
              </select>
              <button className="mc-icon-btn" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                <FaSort />
              </button>
            </div>
          </div>
        </div>

        <div className="mc-table-wrap">
          <table className="mc-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Email</th>
                <th>SĐT</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Số đơn</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 && (
                <tr><td colSpan="9" className="mc-empty">Không có người dùng</td></tr>
              )}
              {pageData.map(u => (
                <tr key={u.id}>
                  <td>#{u.id}</td>
                  <td>
                    <div className="mc-user">
                      <div className="mc-user-name">{u.name || u.username}</div>
                      <div className="mc-user-username">@{u.username}</div>
                    </div>
                  </td>
                  <td>{u.email || '-'}</td>
                  <td>{u.phone || '-'}</td>
                  <td>
                    <select
                      className="mc-role"
                      value={u.role}
                      onChange={(e) => handleChangeRole(u, e.target.value)}
                    >
                      <option value={0}>Khách hàng</option>
                      <option value={1}>Admin</option>
                    </select>
                  </td>
                  <td>
                    <span className={`mc-badge ${u.is_active ? 'mc-active' : 'mc-inactive'}`}>
                      {u.is_active ? 'Đang hoạt động' : 'Đã vô hiệu'}
                    </span>
                  </td>
                  <td>{(u.date_joined || '').slice(0, 16).replace('T', ' ')}</td>
                  <td>{u.orders_count}</td>
                  <td>
                    <div className="mc-actions-cell">
                      <Link to={`/admin/users/${u.id}`} className="mc-icon-btn" title="Xem chi tiết">
                        <FaUserEdit />
                      </Link>
                      <button
                        className="mc-icon-btn"
                        title={u.is_active ? 'Vô hiệu hoá' : 'Kích hoạt'}
                        onClick={() => handleToggleActive(u)}
                      >
                        {u.is_active ? <FaUserAltSlash /> : <FaUserShield />}
                      </button>
                      <button
                        className="mc-icon-btn mc-danger"
                        title="Xoá người dùng"
                        onClick={() => handleDelete(u)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mc-pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Trước</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={p === currentPage ? 'mc-active' : ''} onClick={() => setCurrentPage(p)}>{p}</button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Sau</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCustomers;