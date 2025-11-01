import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../../services/api';
import { useAuth } from '../../../../context/AuthContext';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './EditProduct.css';

const EditProduct = () => {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const [categories, setCategories] = useState([]);
  const [genders, setGenders] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]); // Danh sách kích cỡ từ API
  const [colors, setColors] = useState([]); // Danh sách màu sắc từ API
  const [currentImages, setCurrentImages] = useState([]); // Để hiển thị hình ảnh cũ
  const [newImages, setNewImages] = useState([]); // Để lưu trữ hình ảnh mới được chọn
  const [imagesToDelete, setImagesToDelete] = useState([]); // Để lưu trữ hình ảnh cần xóa
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    stock_quantity: '',
    category: '',
    gender: '',
    brand: '',
    sizes: [], // Lưu danh sách id kích cỡ đã chọn
    colors: [], 
    sales_count: 0,
  });
  const [error, setError] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Theo dõi trạng thái tải dữ liệu
  const { isLoggedIn, role } = useAuth();
  const navigate = useNavigate();

  // Hàm định dạng giá tiền VND
  const formatVND = (value) => {
    if (!value) return '';
    const numberValue = parseFloat(value.replace(/\D/g, '')) || 0;
    return numberValue.toLocaleString('vi-VN') + ' ₫';
  };

  // Xử lý thay đổi giá tiền
  const handlePriceChange = (e, fieldName) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Loại bỏ ký tự không phải số
    setFormData(prev => ({
      ...prev,
      [fieldName]: rawValue,
    }));
  };

  // Kiểm tra quyền admin
  useEffect(() => {
    if (!isLoggedIn || role !== 1) {
      navigate('/login');
    }
  }, [isLoggedIn, role, navigate]);

  // Fetch dữ liệu chung từ API (chỉ chạy một lần khi mount)
  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        const [categoriesRes, gendersRes, brandsRes, sizesRes, colorsRes] = await Promise.all([
          api.get('/categories/'),
          api.get('/genders/'),
          api.get('/brands/'),
          api.get('/sizes/'),
          api.get('/colors/'),
        ]);
        console.log('API Responses:', { categoriesRes, gendersRes, brandsRes, sizesRes, colorsRes });
        setCategories(categoriesRes.data?.results || []);
        setGenders(gendersRes.data?.results || []);
        setBrands(brandsRes.data?.results || []);
        setSizes(sizesRes.data?.results || []);
        setColors(colorsRes.data?.results || []);
        setIsDataLoaded(true); // Đánh dấu dữ liệu chung đã tải
      } catch (err) {
        setError('Không thể tải dữ liệu từ API. Vui lòng kiểm tra kết nối hoặc dữ liệu.');
        console.error('Fetch error details:', err.response?.data || err.message);
      }
    };
    fetchGeneralData();
  }, []);

  // Fetch dữ liệu sản phẩm dựa trên ID sau khi dữ liệu chung đã tải
  useEffect(() => {
    if (isDataLoaded && sizes.length > 0 && colors.length > 0) { // Đảm bảo cả sizes và colors đã sẵn sàng
      const fetchProductData = async () => {
        try {
          const response = await api.get(`/products/${id}/`);
          const product = response.data;
          console.log('Product data from API:', product); // Debug chi tiết dữ liệu trả về

          // Kiểm tra và lấy danh sách id kích cỡ và màu sắc từ sản phẩm
          const selectedSizes = Array.isArray(product.sizes) ? product.sizes.map(id => id.toString()) : [];
          const selectedColors = Array.isArray(product.colors) ? product.colors.map(id => id.toString()) : [];
          const selectedImages = Array.isArray(product.images) ? product.images.map(image => ({ id: image.id, image: image.image })) : [];

          console.log('Selected Sizes:', selectedSizes); // Debug danh sách kích cỡ
          console.log('Selected Colors:', selectedColors); // Debug danh sách màu sắc

          setFormData(prev => ({
            ...prev,
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            originalPrice: product.originalPrice || '',
            stock_quantity: product.stock_quantity || '',
            category: product.category || '',
            gender: product.gender || '',
            brand: product.brand || '',
            sizes: selectedSizes, // Cập nhật kích cỡ đã chọn
            colors: selectedColors, 
            sales_count: product.sales_count || 0,
          }));
          setCurrentImages(selectedImages); // Hiển thị hình ảnh cũ
        } catch (err) {
          setError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.');
          console.error('Fetch product error:', err.response?.data || err.message);
        }
      };
      fetchProductData();
    }
  }, [id, isDataLoaded, sizes, colors]); // Chạy khi id, isDataLoaded, sizes, hoặc colors thay đổi

  // Xử lý thay đổi input
  const handleInputChange = (e, fieldName = null) => {
    const { name, value, type, files, checked } = e.target;
    if (type === 'file') {
      setNewImages(Array.from(files));
    } else if (name === 'price' || name === 'originalPrice') {
      const rawValue = value.replace(/\D/g, ''); // Loại bỏ ký tự không phải số
      setFormData(prev => ({ ...prev, [name]: rawValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Xử lý thay đổi checkbox cho sizes và colors
  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: checked ? [...prev[field], value] : prev[field].filter(v => v !== value),
    }));
  };

  // Xử lý xóa ảnh
  const handleDeleteImage = (imageId) => {
    setImagesToDelete([...imagesToDelete, imageId]);
    setCurrentImages(currentImages.filter(img => img.id !== imageId));
  };

  // Xử lý submit form (cập nhật sản phẩm)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    console.log('FormData before submit:', { ...formData }); // Debug dữ liệu gửi đi

    // Thêm tất cả các trường vào FormData
    Object.keys(formData).forEach(key => {
      if (key === 'sizes' || key === 'colors') {
        formData[key].forEach(item => data.append(key, item)); // Gửi giống như AddProduct.js
      } else {
        data.append(key, formData[key] !== '' ? formData[key] : null); // Không gửi image nếu không có file
      }
    });

    // Thêm hình ảnh mới
    console.log('New images to upload:', newImages.length);
    if (newImages && newImages.length > 0) {
      newImages.forEach((image, index) => {
        console.log(`Appending new image ${index + 1}:`, image.name, image.type);
        data.append('images', image);
      });
    }

    // Thêm danh sách ảnh cần xóa
    imagesToDelete.forEach(imageId => data.append('images_to_delete', imageId));

    // Debug: log FormData entries
    console.log('FormData entries for update:');
    for (let pair of data.entries()) {
      if (pair[1] instanceof File) {
        console.log(pair[0] + ': [File] ' + pair[1].name);
      } else {
        console.log(pair[0] + ': ', pair[1]);
      }
    }

    try {
      // Không cần set Content-Type header, axios sẽ tự động set với boundary
      // Dùng PATCH thay vì PUT để DRF xử lý multipart/form-data tốt hơn
      const response = await api.patch(`/products/${id}/`, data);
      console.log('Update response:', response.data); // Debug phản hồi thành công
      navigate('/admin/products');
    } catch (err) {
      if (err.response && err.response.data) {
        const errorDetails = JSON.stringify(err.response.data); // Chuyển lỗi thành string
        setError(`Cập nhật sản phẩm thất bại: ${errorDetails}`);
        console.error('Error details from backend:', err.response.data);
      } else {
        setError('Cập nhật sản phẩm thất bại. Vui lòng kiểm tra lại.');
        console.error('Update error:', err.message);
      }
    }
  };

  // Xử lý hủy
  const handleCancel = () => {
    navigate('/admin/products');
  };

  return (
    <div className="admin-edit-prod-container">
      <h2 className="admin-edit-prod-title">Sửa sản phẩm</h2>
      {error && <p className="admin-edit-prod-error">{error}</p>}
      <form className="admin-edit-prod-form" onSubmit={handleSubmit}>
        <Tabs>
          <TabList>
            <Tab>Thông tin cơ bản</Tab>
            <Tab>Giá và Kho</Tab>
            <Tab>Hình ảnh</Tab>
            <Tab>Chi tiết</Tab>
          </TabList>

          <TabPanel>
            {/* Basic Information */}
            <div className="form-section">
              <input
                className="admin-edit-prod-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Tên sản phẩm"
                required
              />
              <textarea
                className="admin-edit-prod-input"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Mô tả sản phẩm"
                required
              />
            </div>
          </TabPanel>

          <TabPanel>
            {/* Pricing and Inventory */}
            <div className="form-section">
              <input
                className="admin-edit-prod-input"
                type="text"
                name="price"
                value={formatVND(formData.price)} // Hiển thị định dạng VND
                onChange={(e) => handlePriceChange(e, 'price')}
                placeholder="Giá bán (VND)"
                required
              />
              <input
                className="admin-edit-prod-input"
                type="text"
                name="originalPrice"
                value={formatVND(formData.originalPrice)} // Hiển thị định dạng VND
                onChange={(e) => handlePriceChange(e, 'originalPrice')}
                placeholder="Giá gốc (VND)"
              />
              <input
                className="admin-edit-prod-input"
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
            {/* Images */}
            <div className="form-section">
              {currentImages && currentImages.length > 0 && (
                <div className="current-image-preview">
                  <p>Hình ảnh hiện tại:</p>
                  <div style={{ display: 'flex', overflowX: 'auto' }}>
                    {currentImages.map((image, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={image.image}
                          alt={`Hình ảnh hiện tại ${index + 1}`}
                          style={{ maxWidth: '200px', height: 'auto', marginRight: '10px' }}
                        />
                        <button
                          type="button"
                          className="delete-image-button"
                          onClick={() => handleDeleteImage(image.id)}
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            background: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            padding: '5px',
                            cursor: 'pointer',
                          }}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <input
                className="admin-edit-prod-input"
                type="file"
                name="images"
                onChange={handleInputChange}
                accept="image/*"
                multiple
              />
            </div>
          </TabPanel>

          <TabPanel>
            {/* Details */}
            <div className="form-section">
              <select
                className="admin-edit-prod-select"
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
                className="admin-edit-prod-select"
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
                className="admin-edit-prod-select"
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
                        name="sizes"
                        value={size.id.toString()} // Sử dụng string cho value
                        checked={formData.sizes.includes(size.id.toString())} // Kiểm tra id có trong danh sách đã chọn
                        onChange={(e) => handleCheckboxChange(e, 'sizes')}
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
                        name="colors"
                        value={color.id.toString()} // Sử dụng string cho value
                        checked={formData.colors.includes(color.id.toString())} // Kiểm tra id có trong danh sách đã chọn
                        onChange={(e) => handleCheckboxChange(e, 'colors')}
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
            Cập nhật sản phẩm
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={handleCancel}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;