import React, { useState, useEffect } from 'react';
import api from '../../../../services/api';
import './ManageSizes.css'; // Create this CSS file
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageSizes = () => {
  const [sizes, setSizes] = useState([]);
  const [newSize, setNewSize] = useState('');
  const [editingSizeId, setEditingSizeId] = useState(null);
  const [editedSizeValue, setEditedSizeValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSizes();
  }, []);

  const fetchSizes = async () => {
    try {
      const response = await api.get('/sizes/');
      const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
      setSizes(data);
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách kích cỡ.');
      console.error(err);
      toast.error('Không thể tải danh sách kích cỡ.');
    }
  };

  const handleAddSize = async () => {
    if (!newSize.trim()) {
      toast.warn('Vui lòng nhập kích cỡ.');
      return;
    }
    try {
      await api.post('/sizes/', { value: newSize.trim() });
      setNewSize('');
      await fetchSizes();
      toast.success('Thêm kích cỡ thành công!');
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        toast.error('Bạn cần quyền admin để thêm kích cỡ.');
      } else if (status === 405) {
        toast.error('API chưa cho phép thêm kích cỡ (405).');
      } else {
        toast.error('Không thể thêm kích cỡ.');
      }
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
      await api.put(`/sizes/${editingSizeId}/`, { value: editedSizeValue.trim() });
      setEditingSizeId(null);
      await fetchSizes();
      toast.success('Cập nhật kích cỡ thành công!');
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        toast.error('Bạn cần quyền admin để cập nhật kích cỡ.');
      } else if (status === 405) {
        toast.error('API chưa cho phép cập nhật kích cỡ (405).');
      } else {
        toast.error('Không thể cập nhật kích cỡ.');
      }
      setError('Không thể cập nhật kích cỡ.');
    }
  };

  const handleDeleteSize = async (id) => {
    try {
      await api.delete(`/sizes/${id}/`);
      await fetchSizes();
      toast.success('Xóa kích cỡ thành công!');
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        toast.error('Bạn cần quyền admin để xóa kích cỡ.');
      } else if (status === 405) {
        toast.error('API chưa cho phép xóa kích cỡ (405).');
      } else {
        toast.error('Không thể xóa kích cỡ.');
      }
      setError('Không thể xóa kích cỡ.');
    }
  };

  return (
    <div className="admin-sizes-container">
      <h2 className="admin-sizes-title">Quản lý kích cỡ</h2>
      {error && <p className="admin-sizes-error">{error}</p>}

      <div className="admin-sizes-add">
        <input
          type="text"
          placeholder="Thêm kích cỡ mới"
          value={newSize}
          onChange={(e) => setNewSize(e.target.value)}
        />
        <button onClick={handleAddSize}>Thêm</button>
      </div>

      <table className="admin-sizes-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên kích cỡ</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map(size => (
            <tr key={size.id}>
              <td>{size.id}</td>
              <td>
                {editingSizeId === size.id ? (
                  <input
                    type="text"
                    value={editedSizeValue}
                    onChange={(e) => setEditedSizeValue(e.target.value)}
                  />
                ) : (
                  size.value
                )}
              </td>
              <td>
                {editingSizeId === size.id ? (
                  <>
                    <button onClick={handleUpdateSize}>Cập nhật</button>
                    <button onClick={() => setEditingSizeId(null)}>Hủy</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditSize(size)}>Sửa</button>
                    <button onClick={() => handleDeleteSize(size.id)}>Xóa</button>
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

export default ManageSizes;