import React, { useState, useEffect, useMemo, useRef } from 'react';
import api from '../../../../services/api';
import { useAuth } from '../../../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import './ManageColors.css';

const ManageColors = () => {
  const [colors, setColors] = useState([]);
  const [newColor, setNewColor] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalColors, setTotalColors] = useState(0);
  const itemsPerPage = 5;
  
  // Quick Edit
  const [editingColorId, setEditingColorId] = useState(null);
  const [editedColorValue, setEditedColorValue] = useState('');
  
  const { isLoggedIn, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMountedRef = useRef(false);

  // Kiểm tra quyền admin
  useEffect(() => {
    if (!isLoggedIn || role !== 1) {
      navigate('/login');
    }
  }, [isLoggedIn, role, navigate]);

  // Fetch colors với pagination và search
  const fetchColors = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page: page,
        page_size: itemsPerPage,
      };

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await api.get('/colors/', { params });
      
      if (Array.isArray(response.data)) {
        setColors(response.data);
        setTotalColors(response.data.length);
        setTotalPages(1);
      } else {
        setColors(response.data.results || []);
        setTotalColors(response.data.count || 0);
        setTotalPages(Math.ceil((response.data.count || 0) / itemsPerPage));
      }
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách màu sắc.');
      console.error(err);
      toast.error('Không thể tải danh sách màu sắc.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch khi mount hoặc khi quay lại trang
  useEffect(() => {
    if (!isMountedRef.current) {
      fetchColors(currentPage);
      isMountedRef.current = true;
    } else if (location.pathname === '/admin/colors') {
      fetchColors(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Fetch khi page thay đổi
  useEffect(() => {
    if (isMountedRef.current) {
      fetchColors(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        setCurrentPage(1);
        fetchColors(1);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleAddColor = async () => {
    if (!newColor.trim()) {
      toast.warn('Vui lòng nhập tên màu.');
      return;
    }
    try {
      await api.post('/colors/', { value: newColor.trim() });
      setNewColor('');
      await fetchColors(currentPage);
      toast.success('Thêm màu sắc thành công!');
    } catch (err) {
      console.error(err);
      toast.error('Không thể thêm màu sắc.');
      setError('Không thể thêm màu sắc.');
    }
  };

  const handleEditColor = (color) => {
    setEditingColorId(color.id);
    setEditedColorValue(color.value);
  };

  const handleUpdateColor = async () => {
    if (!editedColorValue.trim()) {
      toast.warn('Vui lòng nhập tên màu.');
      return;
    }
    try {
      await api.patch(`/colors/${editingColorId}/`, { value: editedColorValue.trim() });
      setEditingColorId(null);
      setEditedColorValue('');
      await fetchColors(currentPage);
      toast.success('Cập nhật màu sắc thành công!');
    } catch (err) {
      console.error(err);
      toast.error('Không thể cập nhật màu sắc.');
      setError('Không thể cập nhật màu sắc.');
    }
  };

  const handleCancelEdit = () => {
    setEditingColorId(null);
    setEditedColorValue('');
  };

  const handleDeleteColor = async (id) => {
    confirmAlert({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa màu sắc này?',
      buttons: [
        {
          label: 'Có',
          onClick: async () => {
            try {
              await api.delete(`/colors/${id}/`);
              await fetchColors(currentPage);
              toast.success('Xóa màu sắc thành công!');
            } catch (err) {
              console.error(err);
              toast.error('Không thể xóa màu sắc.');
              setError('Không thể xóa màu sắc.');
            }
          }
        },
        {
          label: 'Không',
        }
      ]
    });
  };

  // Statistics
  const stats = useMemo(() => {
    return {
      total: totalColors,
    };
  }, [totalColors]);

  return (
    <div className="admin-colors-container">
      <h2 className="admin-colors-title">Quản lý màu sắc</h2>
      {error && <p className="admin-colors-error">{error}</p>}

      {/* Statistics Dashboard */}
      <div className="admin-colors-stats">
        <div className="admin-colors-stat-card">
          <div className="admin-colors-stat-label">Tổng màu sắc</div>
          <div className="admin-colors-stat-value">{stats.total}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="admin-colors-controls">
        <div className="admin-colors-add-section">
          <input
            type="text"
            className="admin-colors-input"
            placeholder="Nhập màu sắc mới (ví dụ: Đỏ, Xanh, Đen...)"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddColor();
              }
            }}
          />
          <button className="admin-colors-btn admin-colors-btn-add" onClick={handleAddColor}>
            <FaPlus /> Thêm
          </button>
        </div>
        <input
          className="admin-colors-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm màu sắc..."
        />
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="admin-colors-table">
          <thead>
            <tr>
              <th className="admin-colors-th">ID</th>
              <th className="admin-colors-th">Tên màu sắc</th>
              <th className="admin-colors-th">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {colors.map(color => (
              <tr key={color.id}>
                <td className="admin-colors-td">{color.id}</td>
                <td className="admin-colors-td">
                  {editingColorId === color.id ? (
                    <div className="admin-colors-quick-edit">
                      <input
                        type="text"
                        className="admin-colors-inline-input"
                        value={editedColorValue}
                        onChange={(e) => setEditedColorValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdateColor();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <span 
                      onClick={() => handleEditColor(color)}
                      style={{ cursor: 'pointer', textDecoration: 'underline dotted' }}
                      title="Click để sửa nhanh"
                    >
                      {color.value}
                    </span>
                  )}
                </td>
                <td className="admin-colors-td">
                  <div className="admin-colors-actions">
                    {editingColorId === color.id ? (
                      <>
                        <button 
                          className="admin-colors-btn admin-colors-btn-save" 
                          onClick={handleUpdateColor}
                          title="Lưu"
                        >
                          <FaCheck />
                        </button>
                        <button 
                          className="admin-colors-btn admin-colors-btn-cancel-edit" 
                          onClick={handleCancelEdit}
                          title="Hủy"
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="admin-colors-btn admin-colors-btn-edit" 
                          onClick={() => handleEditColor(color)}
                          title="Sửa màu sắc"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="admin-colors-btn admin-colors-btn-delete" 
                          onClick={() => handleDeleteColor(color.id)}
                          title="Xóa màu sắc"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="admin-colors-pagination">
          <button
            className="admin-colors-pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Trước
          </button>
          <span className="admin-colors-pagination-info">
            Trang {currentPage} / {totalPages} (Tổng: {totalColors} màu sắc)
          </span>
          <button
            className="admin-colors-pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageColors;
