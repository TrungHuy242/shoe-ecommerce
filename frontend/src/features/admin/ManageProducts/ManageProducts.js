import React, { useState, useEffect, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel } from '@tanstack/react-table';
import Modal from 'react-modal';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import './ManageProducts.css';
import { useNavigate } from 'react-router-dom';
import ProductDetail from './ProductDetail/ProductDetail'; // Import component mới
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

Modal.setAppElement('#root');

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [genders, setGenders] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [detailModalIsOpen, setDetailModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, role } = useAuth();
  const navigate = useNavigate();

  // Kiểm tra quyền admin
  useEffect(() => {
    if (!isLoggedIn || role !== 1) {
      navigate('/login');
    }
  }, [isLoggedIn, role, navigate]);

  // Fetch dữ liệu từ API
  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, gendersRes, brandsRes, sizesRes, colorsRes] = await Promise.all([
        api.get('/products/', { params: { page_size: 1000 } }),
        api.get('/categories/', { params: { page_size: 1000 } }),
        api.get('/genders/', { params: { page_size: 1000 } }),
        api.get('/brands/', { params: { page_size: 1000 } }),
        api.get('/sizes/', { params: { page_size: 1000 } }),
        api.get('/colors/', { params: { page_size: 1000 } }),
      ]);
      setProducts((Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data.results || [])));
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : (categoriesRes.data.results || []));
      setGenders(Array.isArray(gendersRes.data) ? gendersRes.data : (gendersRes.data.results || []));
      setBrands(Array.isArray(brandsRes.data) ? brandsRes.data : (brandsRes.data.results || []));
      setSizes(Array.isArray(sizesRes.data) ? sizesRes.data : (sizesRes.data.results || []));
      setColors(Array.isArray(colorsRes.data) ? colorsRes.data : (colorsRes.data.results || []));
      console.log('Products data:', productsRes.data.results); // Debug
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      console.error('Fetch error:', err);
      toast.error('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Hàm ánh xạ id sang name
  const getNameById = (id, list) => {
    const item = list.find(item => item.id === parseInt(id));
    return item ? item.name || item.value : 'Không có'; // Sử dụng 'name' cho category, gender, brand; 'value' cho sizes, colors
  };

  // Mở modal xem chi tiết
  const openDetailModal = (product) => {
    setSelectedProduct(product);
    setDetailModalIsOpen(true);
  };

  // Đóng modal
  const closeDetailModal = () => {
    setDetailModalIsOpen(false);
    setSelectedProduct(null);
  };

  // Xóa sản phẩm
  const handleDelete = async (productId) => {
    confirmAlert({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
      buttons: [
        {
          label: 'Có',
          onClick: async () => {
            try {
              await api.delete(`/products/${productId}/`);
              await fetchData();
              toast.success('Xóa sản phẩm thành công!');
            } catch (err) {
              setError('Xóa sản phẩm thất bại.');
              console.error('Delete error:', err);
              toast.error('Xóa sản phẩm thất bại.');
            }
          }
        },
        {
          label: 'Không',
        }
      ]
    });
  };

  // Chuyển hướng đến trang thêm sản phẩm
  const handleAddProduct = () => {
    navigate('/admin/products/add-product');
  };

  // Chuyển hướng đến trang sửa sản phẩm
  const handleEditProduct = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  // Cấu hình bảng react-table
  const columns = useMemo(
    () => [
      { header: 'ID', accessorKey: 'id', filterFn: 'includesString' },
      { header: 'Tên', accessorKey: 'name', filterFn: 'includesString' },
      {
        header: 'Giá',
        accessorKey: 'price',
        cell: ({ getValue }) => `${parseFloat(getValue()).toLocaleString('vi-VN')} ₫`,
        filterFn: 'includesString',
      },
      {
        header: 'Danh mục',
        accessorKey: 'category',
        cell: ({ row }) => getNameById(row.original.category, categories),
        filterFn: 'includesString',
      },
      {
        header: 'Thương hiệu',
        accessorKey: 'brand',
        cell: ({ row }) => getNameById(row.original.brand, brands),
        filterFn: 'includesString',
      },
      {
        header: 'Hình ảnh',
        accessorKey: 'images',
        cell: ({ row }) => (
          row.original.images && row.original.images.length > 0 ? (
            <div style={{ display: 'flex', overflowX: 'auto' }}>
              {row.original.images.map((image, index) => (
                <img
                  key={index}
                  src={image.image}
                  alt={`${row.original.name} - Image ${index + 1}`}
                  style={{
                    maxWidth: '100px',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    marginRight: '5px',
                  }}
                />
              ))}
            </div>
          ) : 'Không có'
        ),
        filterFn: 'includesString',
      },
      {
        header: 'Hành động',
        cell: ({ row }) => (
          <div className="admin-prod-actions">
            <button
              className="admin-prod-btn admin-prod-btn-detail"
              onClick={() => openDetailModal(row.original)}
            >
              Chi tiết
            </button>
            <button
              className="admin-prod-btn admin-prod-btn-edit"
              onClick={() => handleEditProduct(row.original.id)}
            >
              Sửa
            </button>
            <button
              className="admin-prod-btn admin-prod-btn-delete"
              onClick={() => handleDelete(row.original.id)}
            >
              Xóa
            </button>
          </div>
        ),
      },
    ],
    [categories, brands]
  );

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: searchQuery,
    },
    onGlobalFilterChange: setSearchQuery,
    globalFilterFn: 'includesString',
  });

  return (
    <div className="admin-prod-container">
      <h2 className="admin-prod-title">Quản lý sản phẩm</h2>
      {error && <p className="admin-prod-error">{error}</p>}
      <div className="admin-prod-controls">
        <button className="admin-prod-btn admin-prod-btn-add" onClick={handleAddProduct}>
          Thêm sản phẩm
        </button>
        <input
          className="admin-prod-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm sản phẩm theo tên..."
        />
      </div>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="admin-prod-table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th className="admin-prod-th" key={header.id}>
                    {header.isPlaceholder ? null : header.column.columnDef.header}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td className="admin-prod-td" key={cell.id}>
                    {cell.column.columnDef.cell ? cell.column.columnDef.cell(cell) : cell.getValue()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal xem chi tiết sản phẩm */}
      <ProductDetail
        isOpen={detailModalIsOpen}
        onRequestClose={closeDetailModal}
        product={selectedProduct}
        categories={categories}
        genders={genders}
        brands={brands}
        sizes={sizes}
        colors={colors}
      />
    </div>
  );
};

export default ManageProducts;