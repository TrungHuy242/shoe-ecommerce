import React, { useState, useEffect, useMemo, useRef } from 'react';
import Modal from 'react-modal';
import api from '../../../../services/api';
import { useAuth } from '../../../../context/AuthContext';
import './ManageCategories.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

Modal.setAppElement('#root');

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editingCategoryModal, setEditingCategoryModal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const itemsPerPage = 10;
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

  // Fetch danh mục từ API với pagination và search
  const fetchCategories = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page: page,
        page_size: itemsPerPage,
      };

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await api.get('/categories/', { params });
      
      if (Array.isArray(response.data)) {
        setCategories(response.data);
        setTotalCategories(response.data.length);
        setTotalPages(1);
      } else {
        setCategories(response.data.results || []);
        setTotalCategories(response.data.count || 0);
        setTotalPages(Math.ceil((response.data.count || 0) / itemsPerPage));
      }
    } catch (err) {
      setError('Không thể tải danh mục. Vui lòng thử lại.');
      console.error('Fetch error:', err);
      toast.error('Không thể tải danh mục. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch khi mount hoặc khi quay lại trang
  useEffect(() => {
    if (!isMountedRef.current) {
      fetchCategories(currentPage);
      isMountedRef.current = true;
    } else if (location.pathname === '/admin/categories') {
      fetchCategories(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Fetch khi page thay đổi
  useEffect(() => {
    if (isMountedRef.current) {
      fetchCategories(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        setCurrentPage(1);
        fetchCategories(1);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Mở modal thêm/sửa
  const openModal = (category = null) => {
    setEditingCategoryModal(category);
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        image: null,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        image: null,
      });
    }
    setModalIsOpen(true);
  };

  // Đóng modal
  const closeModal = () => {
    setModalIsOpen(false);
    setEditingCategoryModal(null);
    setError('');
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCategoryModal) {
        // Đang cập nhật
        if (formData.image) {
          // Có chọn ảnh mới -> gửi multipart
          const data = new FormData();
          data.append('name', formData.name);
          data.append('description', formData.description);
          data.append('image', formData.image);

          await api.patch(`/categories/${editingCategoryModal.id}/`, data);
        } else {
          // Không chọn ảnh mới -> không gửi field image để giữ ảnh cũ
          await api.patch(`/categories/${editingCategoryModal.id}/`, {
            name: formData.name,
            description: formData.description,
          });
        }
      } else {
        // Tạo mới
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        if (formData.image) {
          data.append('image', formData.image);
        }
        await api.post('/categories/', data);
      }

      await fetchCategories(currentPage);
      closeModal();
      toast.success(editingCategoryModal ? 'Cập nhật danh mục thành công!' : 'Thêm danh mục thành công!');
    } catch (err) {
      setError('Lưu danh mục thất bại. Vui lòng kiểm tra lại.');
      console.error('Save error:', err);
      toast.error('Lưu danh mục thất bại. Vui lòng kiểm tra lại.');
    }
  };
  
  // Xóa danh mục
  const handleDelete = async (categoryId) => {
    confirmAlert({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa danh mục này?',
      buttons: [
        {
          label: 'Có',
          onClick: async () => {
            try {
              await api.delete(`/categories/${categoryId}/`);
              await fetchCategories(currentPage);
              toast.success('Xóa danh mục thành công!');
            } catch (err) {
              setError('Xóa danh mục thất bại.');
              console.error('Delete error:', err);
              toast.error('Xóa danh mục thất bại.');
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
      total: totalCategories,
      withImage: categories.filter(c => c.image).length,
      withoutImage: categories.filter(c => !c.image).length,
    };
  }, [categories, totalCategories]);

  // Quick Edit functions
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingField, setEditingField] = useState('');
  const [editValue, setEditValue] = useState('');

  const startQuickEdit = (category, field) => {
    setEditingCategory(category.id);
    setEditingField(field);
    setEditValue(category[field]);
  };

  const cancelQuickEdit = () => {
    setEditingCategory(null);
    setEditingField('');
    setEditValue('');
  };

  const saveQuickEdit = async (categoryId, field, value) => {
    try {
      const updateData = {};
      updateData[field] = value;

      await api.patch(`/categories/${categoryId}/`, updateData);
      
      setCategories(prev => prev.map(c => 
        c.id === categoryId ? { ...c, [field]: value } : c
      ));
      
      toast.success('Cập nhật thành công!');
      cancelQuickEdit();
    } catch (err) {
      toast.error('Cập nhật thất bại.');
      console.error('Quick edit error:', err);
    }
  };

  // Cấu hình bảng react-table
  const columns = useMemo(
    () => [
      { header: 'ID', accessorKey: 'id' },
      {
        header: 'Tên',
        accessorKey: 'name',
        cell: ({ row }) => {
          const category = row.original;
          if (editingCategory === category.id && editingField === 'name') {
            return (
              <div className="admin-cat-quick-edit">
                <input
                  type="text"
                  className="admin-cat-inline-input"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => saveQuickEdit(category.id, 'name', editValue)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveQuickEdit(category.id, 'name', editValue);
                    if (e.key === 'Escape') cancelQuickEdit();
                  }}
                  autoFocus
                />
              </div>
            );
          }
          return (
            <span
              onClick={() => startQuickEdit(category, 'name')}
              style={{ cursor: 'pointer', textDecoration: 'underline dotted' }}
              title="Click để sửa nhanh"
            >
              {category.name}
            </span>
          );
        },
      },
      {
        header: 'Mô tả',
        accessorKey: 'description',
        cell: ({ row }) => {
          const category = row.original;
          if (editingCategory === category.id && editingField === 'description') {
            return (
              <div className="admin-cat-quick-edit">
                <input
                  type="text"
                  className="admin-cat-inline-input"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => saveQuickEdit(category.id, 'description', editValue)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveQuickEdit(category.id, 'description', editValue);
                    if (e.key === 'Escape') cancelQuickEdit();
                  }}
                  autoFocus
                />
              </div>
            );
          }
          return (
            <span
              onClick={() => startQuickEdit(category, 'description')}
              style={{ cursor: 'pointer', textDecoration: 'underline dotted' }}
              title="Click để sửa nhanh"
            >
              {category.description || 'Không có mô tả'}
            </span>
          );
        },
      },
      {
        header: 'Hình ảnh',
        accessorKey: 'image',
        cell: ({ row }) => {
          const category = row.original;
          return category.image ? (
            <img 
              src={category.image} 
              alt="Category" 
              style={{ 
                width: '60px', 
                height: '60px', 
                objectFit: 'cover',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
              onClick={() => window.open(category.image, '_blank')}
              title="Click để xem ảnh lớn"
            />
          ) : (
            <span style={{ color: '#9ca3af' }}>Không có hình</span>
          );
        },
        enableSorting: false,
      },
      {
        header: 'Hành động',
        cell: ({ row }) => (
          <div className="admin-cat-actions">
            <button 
              className="admin-cat-btn admin-cat-btn-edit" 
              onClick={() => openModal(row.original)}
              title="Sửa danh mục"
            >
              <FaEdit />
            </button>
            <button 
              className="admin-cat-btn admin-cat-btn-delete" 
              onClick={() => handleDelete(row.original.id)}
              title="Xóa danh mục"
            >
              <FaTrash />
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [editingCategory, editingField, editValue, startQuickEdit, saveQuickEdit, cancelQuickEdit]
  );

  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: searchQuery,
    },
    onGlobalFilterChange: setSearchQuery,
    globalFilterFn: 'includesString',
  });

  return (
    <div className="admin-cat-container">
      <h2 className="admin-cat-title">Quản lý danh mục</h2>
      {error && <p className="admin-cat-error">{error}</p>}

      {/* Statistics Dashboard */}
      <div className="admin-cat-stats">
        <div className="admin-cat-stat-card">
          <div className="admin-cat-stat-label">Tổng danh mục</div>
          <div className="admin-cat-stat-value">{stats.total}</div>
        </div>
        <div className="admin-cat-stat-card admin-cat-stat-success">
          <div className="admin-cat-stat-label">Có hình ảnh</div>
          <div className="admin-cat-stat-value">{stats.withImage}</div>
        </div>
        <div className="admin-cat-stat-card admin-cat-stat-warning">
          <div className="admin-cat-stat-label">Chưa có hình</div>
          <div className="admin-cat-stat-value">{stats.withoutImage}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="admin-cat-controls">
        <button className="admin-cat-btn admin-cat-btn-add" onClick={() => openModal()}>
          <FaPlus /> Thêm danh mục
        </button>
        <input
          className="admin-cat-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm danh mục theo tên..."
        />
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="admin-cat-table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  className="admin-cat-th"
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : header.column.columnDef.header}
                  {header.column.getIsSorted() ? (header.column.getIsSorted() === 'desc' ? ' 🔽' : ' 🔼') : ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td className="admin-cat-td" key={cell.id}>
                  {cell.column.columnDef.cell ? cell.column.columnDef.cell(cell) : cell.getValue()}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="admin-cat-pagination">
          <button
            className="admin-cat-pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Trước
          </button>
          <span className="admin-cat-pagination-info">
            Trang {currentPage} / {totalPages} (Tổng: {totalCategories} danh mục)
          </span>
          <button
            className="admin-cat-pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="admin-cat-modal"
        overlayClassName="admin-cat-modal-overlay"
      >
        <h2 className="admin-cat-modal-title">{editingCategoryModal ? 'Sửa danh mục' : 'Thêm danh mục'}</h2>
        <form className="admin-cat-form" onSubmit={handleSubmit}>
          <input
            className="admin-cat-input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Tên danh mục"
            required
          />
          <textarea
            className="admin-cat-input"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Mô tả"
            required
          />
          <input
            className="admin-cat-input"
            type="file"
            name="image"
            onChange={handleInputChange}
            accept="image/*"
          />
          <div className="admin-cat-form-actions">
            <button type="submit" className="admin-cat-btn admin-cat-btn-submit">
              {editingCategoryModal ? 'Cập nhật' : 'Thêm'}
            </button>
            <button
              type="button"
              className="admin-cat-btn admin-cat-btn-cancel"
              onClick={closeModal}
            >
              Hủy
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCategories;