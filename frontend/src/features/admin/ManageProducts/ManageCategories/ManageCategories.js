import React, { useState, useEffect, useMemo } from 'react';
import Modal from 'react-modal';
import api from '../../../../services/api';
import { useAuth } from '../../../../context/AuthContext';
import './ManageCategories.css';
import { useNavigate } from 'react-router-dom';
import { useReactTable, getCoreRowModel, getSortedRowModel } from '@tanstack/react-table';

Modal.setAppElement('#root');

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
  });
  const [error, setError] = useState('');
  const { isLoggedIn, role } = useAuth();
  const navigate = useNavigate();

  // Kiểm tra quyền admin
  useEffect(() => {
    if (!isLoggedIn || role !== 1) {
      navigate('/login');
    }
  }, [isLoggedIn, role, navigate]);

  // Fetch danh mục từ API
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/');
      setCategories(response.data.results || []);
    } catch (err) {
      setError('Không thể tải danh mục. Vui lòng thử lại.');
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Mở modal thêm/sửa
  const openModal = (category = null) => {
    setEditingCategory(category);
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
    setEditingCategory(null);
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
      if (editingCategory) {
        // Đang cập nhật
        if (formData.image) {
          // Có chọn ảnh mới -> gửi multipart
          const data = new FormData();
          data.append('name', formData.name);
          data.append('description', formData.description);
          data.append('image', formData.image);

          await api.patch(`/categories/${editingCategory.id}/`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          // Không chọn ảnh mới -> không gửi field image để giữ ảnh cũ
          await api.patch(`/categories/${editingCategory.id}/`, {
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
        await api.post('/categories/', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      await fetchCategories();
      closeModal();
    } catch (err) {
      setError('Lưu danh mục thất bại. Vui lòng kiểm tra lại.');
      console.error('Save error:', err);
    }
  };
  // Xóa danh mục
  const handleDelete = async (categoryId) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      try {
        await api.delete(`/categories/${categoryId}/`);
        await fetchCategories();
      } catch (err) {
        setError('Xóa danh mục thất bại.');
        console.error('Delete error:', err);
      }
    }
  };

  // Cấu hình bảng react-table
  const columns = useMemo(
    () => [
      { header: 'ID', accessorKey: 'id' },
      { header: 'Tên', accessorKey: 'name' },
      { header: 'Mô tả', accessorKey: 'description' },
      {
        header: 'Hình ảnh',
        accessorKey: 'image',
        cell: ({ getValue }) => (
          getValue() ? <img src={getValue()} alt="Category" style={{ width: '50px' }} /> : 'Không có hình'
        ),
        enableSorting: false,
      },
      {
        header: 'Hành động',
        cell: ({ row }) => (
          <div className="admin-cat-actions">
            <button className="admin-cat-btn admin-cat-btn-edit" onClick={() => openModal(row.original)}>
              Sửa
            </button>
            <button className="admin-cat-btn admin-cat-btn-delete" onClick={() => handleDelete(row.original.id)}>
              Xóa
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="admin-cat-container">
      <h2 className="admin-cat-title">Quản lý danh mục</h2>
      {error && <p className="admin-cat-error">{error}</p>}
      <button className="admin-cat-btn admin-cat-btn-add" onClick={() => openModal()}>
        Thêm danh mục
      </button>
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="admin-cat-modal"
        overlayClassName="admin-cat-modal-overlay"
      >
        <h2 className="admin-cat-modal-title">{editingCategory ? 'Sửa danh mục' : 'Thêm danh mục'}</h2>
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
              {editingCategory ? 'Cập nhật' : 'Thêm'}
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