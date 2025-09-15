import React, { useState, useEffect } from 'react';
import api from '../../../../services/api';
import './ManageColors.css'; // Create this CSS file
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageColors = () => {
  const [colors, setColors] = useState([]);
  const [newColor, setNewColor] = useState('');
  const [editingColorId, setEditingColorId] = useState(null);
  const [editedColorValue, setEditedColorValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      const response = await api.get('/colors/');
      // Hỗ trợ cả dạng phân trang (results) và dạng danh sách thẳng
      const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
      setColors(data);
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách màu sắc.');
      console.error(err);
      toast.error('Không thể tải danh sách màu sắc.');
    }
  };

  const handleAddColor = async () => {
    if (!newColor.trim()) {
      toast.warn('Vui lòng nhập tên màu.');
      return;
    }
    try {
      await api.post('/colors/', { value: newColor.trim() });
      setNewColor('');
      await fetchColors();
      toast.success('Thêm màu sắc thành công!');
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        toast.error('Bạn cần quyền admin để thêm màu.');
      } else if (status === 405) {
        toast.error('API chưa cho phép thêm màu (405).');
      } else {
        toast.error('Không thể thêm màu sắc.');
      }
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
      await api.put(`/colors/${editingColorId}/`, { value: editedColorValue.trim() });
      setEditingColorId(null);
      await fetchColors();
      toast.success('Cập nhật màu sắc thành công!');
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        toast.error('Bạn cần quyền admin để cập nhật màu.');
      } else if (status === 405) {
        toast.error('API chưa cho phép cập nhật màu (405).');
      } else {
        toast.error('Không thể cập nhật màu sắc.');
      }
      setError('Không thể cập nhật màu sắc.');
    }
  };

  const handleDeleteColor = async (id) => {
    try {
      await api.delete(`/colors/${id}/`);
      await fetchColors();
      toast.success('Xóa màu sắc thành công!');
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        toast.error('Bạn cần quyền admin để xóa màu.');
      } else if (status === 405) {
        toast.error('API chưa cho phép xóa màu (405).');
      } else {
        toast.error('Không thể xóa màu sắc.');
      }
      setError('Không thể xóa màu sắc.');
    }
  };

  return (
    <div className="admin-colors-container">
      <h2 className="admin-colors-title">Quản lý màu sắc</h2>
      {error && <p className="admin-colors-error">{error}</p>}

      <div className="admin-colors-add">
        <input
          type="text"
          placeholder="Thêm màu sắc mới"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
        />
        <button onClick={handleAddColor}>Thêm</button>
      </div>

      <table className="admin-colors-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên màu sắc</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {colors.map(color => (
            <tr key={color.id}>
              <td>{color.id}</td>
              <td>
                {editingColorId === color.id ? (
                  <input
                    type="text"
                    value={editedColorValue}
                    onChange={(e) => setEditedColorValue(e.target.value)}
                  />
                ) : (
                  color.value
                )}
              </td>
              <td>
                {editingColorId === color.id ? (
                  <>
                    <button onClick={handleUpdateColor}>Cập nhật</button>
                    <button onClick={() => setEditingColorId(null)}>Hủy</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditColor(color)}>Sửa</button>
                    <button onClick={() => handleDeleteColor(color.id)}>Xóa</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageColors;