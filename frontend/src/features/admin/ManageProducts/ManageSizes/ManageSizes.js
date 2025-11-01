import React, { useState, useEffect, useMemo, useRef } from 'react';
import api from '../../../../services/api';
import { useAuth } from '../../../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import './ManageSizes.css';

const ManageSizes = () => {
  const [sizes, setSizes] = useState([]);
  const [newSize, setNewSize] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSizes, setTotalSizes] = useState(0);
  const itemsPerPage = 5;
  
  // Quick Edit
  const [editingSizeId, setEditingSizeId] = useState(null);
  const [editedSizeValue, setEditedSizeValue] = useState('');
  
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

  // Fetch sizes với pagination và search
  const fetchSizes = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page: page,
        page_size: itemsPerPage,
      };

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await api.get('/sizes/', { params });
      
      if (Array.isArray(response.data)) {
        setSizes(response.data);
        setTotalSizes(response.data.length);
        setTotalPages(1);
      } else {
        setSizes(response.data.results || []);
        setTotalSizes(response.data.count || 0);
        setTotalPages(Math.ceil((response.data.count || 0) / itemsPerPage));
      }
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách kích cỡ.');
      console.error(err);
      toast.error('Không thể tải danh sách kích cỡ.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch khi mount hoặc khi quay lại trang
  useEffect(() => {
    if (!isMountedRef.current) {
      fetchSizes(currentPage);
      isMountedRef.current = true;
    } else if (location.pathname === '/admin/sizes') {
      fetchSizes(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Fetch khi page thay đổi
  useEffect(() => {
    if (isMountedRef.current) {
      fetchSizes(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        setCurrentPage(1);
        fetchSizes(1);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleAddSize = async () => {
    if (!newSize.trim()) {
      toast.warn('Vui lòng nhập kích cỡ.');
      return;
    }
    try {
      await api.post('/sizes/', { value: newSize.trim() });
      setNewSize('');
      await fetchSizes(currentPage);
      toast.success('Thêm kích cỡ thành công!');
    } catch (err) {
      console.error(err);
      toast.error('Không thể thêm kích cỡ.');
      setError('Không thể thêm kích cỡ.');
    }
  };

  const handleEditSize = (size) => {
    setEditingSizeId(size.id);
    setEditedSizeValue(size.value);
  };

  const handleUpdateSize = async () => {
    if (!editedSizeValue.trim()) {
      toast.warn('Vui lòng nhập kích cỡ.');
      return;
    }
    try {
      await api.patch(`/sizes/${editingSizeId}/`, { value: editedSizeValue.trim() });
      setEditingSizeId(null);
      setEditedSizeValue('');
      await fetchSizes(currentPage);
      toast.success('Cập nhật kích cỡ thành công!');
    } catch (err) {
      console.error(err);
      toast.error('Không thể cập nhật kích cỡ.');
      setError('Không thể cập nhật kích cỡ.');
    }
  };

  const handleCancelEdit = () => {
    setEditingSizeId(null);
    setEditedSizeValue('');
  };

  const handleDeleteSize = async (id) => {
    confirmAlert({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa kích cỡ này?',
      buttons: [
        {
          label: 'Có',
          onClick: async () => {
            try {
              await api.delete(`/sizes/${id}/`);
              await fetchSizes(currentPage);
              toast.success('Xóa kích cỡ thành công!');
            } catch (err) {
              console.error(err);
              toast.error('Không thể xóa kích cỡ.');
              setError('Không thể xóa kích cỡ.');
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
      total: totalSizes,
    };
  }, [totalSizes]);

  return (
    <div className="admin-sizes-container">
      <h2 className="admin-sizes-title">Quản lý kích cỡ</h2>
      {error && <p className="admin-sizes-error">{error}</p>}

      {/* Statistics Dashboard */}
      <div className="admin-sizes-stats">
        <div className="admin-sizes-stat-card">
          <div className="admin-sizes-stat-label">Tổng kích cỡ</div>
          <div className="admin-sizes-stat-value">{stats.total}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="admin-sizes-controls">
        <div className="admin-sizes-add-section">
          <input
            type="text"
            className="admin-sizes-input"
            placeholder="Nhập kích cỡ mới (ví dụ: 38, 39, 40...)"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddSize();
              }
            }}
          />
          <button className="admin-sizes-btn admin-sizes-btn-add" onClick={handleAddSize}>
            <FaPlus /> Thêm
          </button>
        </div>
        <input
          className="admin-sizes-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm kích cỡ..."
        />
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="admin-sizes-table">
          <thead>
            <tr>
              <th className="admin-sizes-th">ID</th>
              <th className="admin-sizes-th">Tên kích cỡ</th>
              <th className="admin-sizes-th">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map(size => (
              <tr key={size.id}>
                <td className="admin-sizes-td">{size.id}</td>
                <td className="admin-sizes-td">
                  {editingSizeId === size.id ? (
                    <div className="admin-sizes-quick-edit">
                      <input
                        type="text"
                        className="admin-sizes-inline-input"
                        value={editedSizeValue}
                        onChange={(e) => setEditedSizeValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdateSize();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <span 
                      onClick={() => handleEditSize(size)}
                      style={{ cursor: 'pointer', textDecoration: 'underline dotted' }}
                      title="Click để sửa nhanh"
                    >
                      {size.value}
                    </span>
                  )}
                </td>
                <td className="admin-sizes-td">
                  <div className="admin-sizes-actions">
                    {editingSizeId === size.id ? (
                      <>
                        <button 
                          className="admin-sizes-btn admin-sizes-btn-save" 
                          onClick={handleUpdateSize}
                          title="Lưu"
                        >
                          <FaCheck />
                        </button>
                        <button 
                          className="admin-sizes-btn admin-sizes-btn-cancel-edit" 
                          onClick={handleCancelEdit}
                          title="Hủy"
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="admin-sizes-btn admin-sizes-btn-edit" 
                          onClick={() => handleEditSize(size)}
                          title="Sửa kích cỡ"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="admin-sizes-btn admin-sizes-btn-delete" 
                          onClick={() => handleDeleteSize(size.id)}
                          title="Xóa kích cỡ"
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
        <div className="admin-sizes-pagination">
          <button
            className="admin-sizes-pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Trước
          </button>
          <span className="admin-sizes-pagination-info">
            Trang {currentPage} / {totalPages} (Tổng: {totalSizes} kích cỡ)
          </span>
          <button
            className="admin-sizes-pagination-btn"
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

export default ManageSizes;
