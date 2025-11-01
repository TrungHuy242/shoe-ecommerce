import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; // Import default styles
import api from '../../../../services/api';
import { useAuth } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AddProduct.css';

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [genders, setGenders] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    stock_quantity: '',
    category: '',
    gender: '',
    brand: '',
    sizes: [],
    colors: [],
    images: [], // Use images instead of image
  });
  const [error, setError] = useState('');
  const { isLoggedIn, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || role !== 1) {
      navigate('/login');
    }
  }, [isLoggedIn, role, navigate]);

  const fetchData = async () => {
    try {
      const [categoriesRes, gendersRes, brandsRes, sizesRes, colorsRes] = await Promise.all([
        api.get('/categories/'),
        api.get('/genders/'),
        api.get('/brands/'),
        api.get('/sizes/'),
        api.get('/colors/'),
      ]);
      setCategories(categoriesRes.data?.results || []);
      setGenders(gendersRes.data?.results || []);
      setBrands(brandsRes.data?.results || []);
      setSizes(sizesRes.data?.results || []);
      setColors(colorsRes.data?.results || []);
    } catch (err) {
      setError('Không thể tải dữ liệu từ API. Vui lòng kiểm tra kết nối hoặc dữ liệu.');
      console.error('Fetch error details:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Hàm định dạng số thành VND
  const formatVND = (value) => {
    if (!value) return '';
    const number = parseFloat(value.replace(/[^0-9]/g, '')); // Loại bỏ ký tự không phải số
    if (isNaN(number)) return '';
    return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  // Hàm xử lý giá trị nhập vào và bỏ định dạng khi lưu vào formData
  const parseVND = (value) => {
    return value.replace(/[^0-9]/g, ''); // Loại bỏ tất cả ký tự không phải số
  };

  const handleInputChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === 'file') {
      //setFormData({ ...formData, image: files[0] });
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    } else if (name === 'price' || name === 'originalPrice') {
      // Chỉ lưu giá trị số thô vào formData
      setFormData({ ...formData, [name]: parseVND(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: checked ? [...prev[field], value] : prev[field].filter(v => v !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'sizes' || key === 'colors') {
        formData[key].forEach(item => data.append(key, item));
      } else if (key === 'images' && formData[key].length > 0) {
        //data.append(key, formData[key]);
        formData[key].forEach(image => data.append('images', image));
      }
       else {
        data.append(key, formData[key]);
      }
    });

    try {
      // Không cần set Content-Type header, axios sẽ tự động set với boundary
      await api.post('/products/', data);
      navigate('/admin/products');
    } catch (err) {
      setError('Thêm sản phẩm thất bại. Vui lòng kiểm tra lại.');
      console.error('Save error:', err.response?.data || err.message);
    }
  };

  return (
    <form className="admin-add-prod-form" onSubmit={handleSubmit}>
      <h2 className="admin-add-prod-title">Thêm sản phẩm</h2>
      {error && <p className="admin-add-prod-error">{error}</p>}

      <Tabs>
        <TabList>
          <Tab>Thông tin cơ bản</Tab>
          <Tab>Giá sản phẩm</Tab>
          <Tab>Số lượng</Tab>
          <Tab>Hình ảnh</Tab>
          <Tab>Thông tin chi tiết</Tab>
        </TabList>

        <TabPanel>
          <div className="form-section">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Tên sản phẩm"
              required
            />
            <textarea
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Mô tả sản phẩm"
              required
            />
          </div>
        </TabPanel>

        <TabPanel>
          <div className="form-section">
            <input
              type="text" // Đổi từ type="number" sang type="text" để bỏ nút spinner
              name="price"
              value={formatVND(formData.price)} // Hiển thị giá trị đã định dạng
              onChange={handleInputChange}
              placeholder="Giá bán (VND)"
              required
            />
            <input
              type="text" // Đổi từ type="number" sang type="text" để bỏ nút spinner
              name="originalPrice"
              value={formData.originalPrice ? formatVND(formData.originalPrice) : ''} // Hiển thị giá trị đã định dạng nếu có
              onChange={handleInputChange}
              placeholder="Giá gốc (VND)"
            />
          </div>
        </TabPanel>

        <TabPanel>
          <div className="form-section">
            <input
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleInputChange}
              placeholder="Số lượng tồn kho"
              required
            />
          </div>
        </TabPanel>

        <TabPanel>
          <div className="form-section">
            <input
              type="file"
              name="images"
              onChange={handleInputChange}
              accept="image/*"
              multiple
            />
          </div>
        </TabPanel>

        <TabPanel>
          <div className="form-section">
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Chọn giới tính</option>
              {genders.map(gen => (
                <option key={gen.id} value={gen.id}>
                  {gen.name}
                </option>
              ))}
            </select>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              required
            >
              <option value="">Chọn thương hiệu</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <div className="checkbox-group">
              <label>Kích cỡ:</label>
              <div className="checkbox-options">
                {sizes.map(size => (
                  <label key={size.id}>
                    <input
                      type="checkbox"
                      value={size.id}
                      checked={formData.sizes.includes(String(size.id))}
                      onChange={e => handleCheckboxChange(e, 'sizes')}
                    />
                    {size.value}
                  </label>
                ))}
              </div>
            </div>
            <div className="checkbox-group">
              <label>Màu sắc:</label>
              <div className="checkbox-options">
                {colors.map(color => (
                  <label key={color.id}>
                    <input
                      type="checkbox"
                      value={color.id}
                      checked={formData.colors.includes(String(color.id))}
                      onChange={e => handleCheckboxChange(e, 'colors')}
                    />
                    {color.value}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </TabPanel>
      </Tabs>

      {/* Nút hành động */}
      <div className="form-actions">
        <button type="submit" className="btn-submit">
          Thêm sản phẩm
        </button>
        <button
          type="button"
          className="btn-cancel"
          onClick={() => navigate('/admin/products')}
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

export default AddProduct;