import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel } from '@tanstack/react-table';
import Modal from 'react-modal';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import './ManageProducts.css';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductDetail from './ProductDetail/ProductDetail'; // Import component mới
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 10;
  
  // Bulk Actions & Selection
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  // Advanced Filters
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterPriceMin, setFilterPriceMin] = useState('');
  const [filterPriceMax, setFilterPriceMax] = useState('');
  const [filterStockMin, setFilterStockMin] = useState('');
  const [filterStockMax, setFilterStockMax] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Quick Edit
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingField, setEditingField] = useState('');
  const [editValue, setEditValue] = useState('');
  
  const { isLoggedIn, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra quyền admin
  useEffect(() => {
    if (!isLoggedIn || role !== 1) {
      navigate('/login');
    }
  }, [isLoggedIn, role, navigate]);

  // Fetch dữ liệu từ API với pagination và filters
  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page: page,
        page_size: itemsPerPage,
      };

      // Thêm search query nếu có
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      // Thêm filters
      if (filterCategory) params.category = filterCategory;
      if (filterBrand) params.brand = filterBrand;
      if (filterGender) params.gender = filterGender;
      if (filterPriceMin) params.price__gte = filterPriceMin;
      if (filterPriceMax) params.price__lte = filterPriceMax;
      if (filterStockMin) params.stock_quantity__gte = filterStockMin;
      if (filterStockMax) params.stock_quantity__lte = filterStockMax;
      
      // Thêm sorting
      if (sortBy) {
        params.ordering = sortOrder === 'desc' ? `-${sortBy}` : sortBy;
      }

      const [productsRes, categoriesRes, gendersRes, brandsRes, sizesRes, colorsRes] = await Promise.all([
        api.get('/products/', { params }),
        api.get('/categories/', { params: { page_size: 1000 } }),
        api.get('/genders/', { params: { page_size: 1000 } }),
        api.get('/brands/', { params: { page_size: 1000 } }),
        api.get('/sizes/', { params: { page_size: 1000 } }),
        api.get('/colors/', { params: { page_size: 1000 } }),
      ]);

      // Xử lý paginated response cho products
      if (Array.isArray(productsRes.data)) {
        setProducts(productsRes.data);
        setTotalProducts(productsRes.data.length);
        setTotalPages(1);
      } else {
        setProducts(productsRes.data.results || []);
        setTotalProducts(productsRes.data.count || 0);
        setTotalPages(Math.ceil((productsRes.data.count || 0) / itemsPerPage));
      }

      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : (categoriesRes.data.results || []));
      setGenders(Array.isArray(gendersRes.data) ? gendersRes.data : (gendersRes.data.results || []));
      setBrands(Array.isArray(brandsRes.data) ? brandsRes.data : (brandsRes.data.results || []));
      setSizes(Array.isArray(sizesRes.data) ? sizesRes.data : (sizesRes.data.results || []));
      setColors(Array.isArray(colorsRes.data) ? colorsRes.data : (colorsRes.data.results || []));
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      console.error('Fetch error:', err);
      toast.error('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Ref để theo dõi lần đầu mount
  const isMountedRef = useRef(false);

  // Fetch data khi mount hoặc khi quay lại trang
  useEffect(() => {
    if (!isMountedRef.current) {
      fetchData(currentPage);
      isMountedRef.current = true;
    } else if (location.pathname === '/admin/products') {
      fetchData(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Fetch data khi page thay đổi
  useEffect(() => {
    if (isMountedRef.current) {
      fetchData(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Debounce search và fetch lại khi search query hoặc filters thay đổi
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        setCurrentPage(1); // Reset về trang 1 khi search/filter
        fetchData(1);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filterCategory, filterBrand, filterGender, filterPriceMin, filterPriceMax, filterStockMin, filterStockMax, sortBy, sortOrder]);

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
              await fetchData(currentPage);
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

  // Bulk Actions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một sản phẩm!');
      return;
    }

    confirmAlert({
      title: 'Xác nhận xóa',
      message: `Bạn có chắc chắn muốn xóa ${selectedProducts.length} sản phẩm đã chọn?`,
      buttons: [
        {
          label: 'Có',
          onClick: async () => {
            try {
              await Promise.all(
                selectedProducts.map(id => api.delete(`/products/${id}/`))
              );
              setSelectedProducts([]);
              await fetchData(currentPage);
              toast.success(`Đã xóa ${selectedProducts.length} sản phẩm thành công!`);
            } catch (err) {
              toast.error('Xóa sản phẩm thất bại.');
              console.error('Bulk delete error:', err);
            }
          }
        },
        { label: 'Không' }
      ]
    });
  };

  // Quick Edit
  const startQuickEdit = (product, field) => {
    setEditingProduct(product.id);
    setEditingField(field);
    setEditValue(product[field]);
  };

  const cancelQuickEdit = () => {
    setEditingProduct(null);
    setEditingField('');
    setEditValue('');
  };

  const saveQuickEdit = async (productId, field, value) => {
    try {
      const updateData = {};
      updateData[field] = field === 'price' || field === 'originalPrice' || field === 'stock_quantity' 
        ? parseFloat(value) || 0 
        : value;

      await api.patch(`/products/${productId}/`, updateData);
      
      // Update local state
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, [field]: updateData[field] } : p
      ));
      
      toast.success('Cập nhật thành công!');
      cancelQuickEdit();
    } catch (err) {
      toast.error('Cập nhật thất bại.');
      console.error('Quick edit error:', err);
    }
  };

  // Statistics
  const stats = useMemo(() => {
    const total = totalProducts;
    const lowStock = products.filter(p => p.stock_quantity < 10).length;
    const outOfStock = products.filter(p => p.stock_quantity === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0);

    return { total, lowStock, outOfStock, totalValue };
  }, [products, totalProducts]);

  // Clear filters
  const clearFilters = () => {
    setFilterCategory('');
    setFilterBrand('');
    setFilterGender('');
    setFilterPriceMin('');
    setFilterPriceMax('');
    setFilterStockMin('');
    setFilterStockMax('');
    setSearchQuery('');
    setSortBy('id');
    setSortOrder('desc');
  };

  // Cấu hình bảng react-table
  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: (
          <input
            type="checkbox"
            checked={selectedProducts.length > 0 && selectedProducts.length === products.length}
            onChange={handleSelectAll}
            className="admin-prod-checkbox"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedProducts.includes(row.original.id)}
            onChange={() => handleSelectProduct(row.original.id)}
            className="admin-prod-checkbox"
          />
        ),
        enableSorting: false,
      },
      { header: 'ID', accessorKey: 'id', filterFn: 'includesString' },
      { header: 'Tên', accessorKey: 'name', filterFn: 'includesString' },
      {
        header: 'Giá',
        accessorKey: 'price',
        cell: ({ row }) => {
          const product = row.original;
          if (editingProduct === product.id && editingField === 'price') {
            return (
              <div className="admin-prod-quick-edit">
                <input
                  type="number"
                  className="admin-prod-inline-input"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => saveQuickEdit(product.id, 'price', editValue)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveQuickEdit(product.id, 'price', editValue);
                    if (e.key === 'Escape') cancelQuickEdit();
                  }}
                  autoFocus
                />
              </div>
            );
          }
          return (
            <span
              onClick={() => startQuickEdit(product, 'price')}
              style={{ cursor: 'pointer', textDecoration: 'underline dotted' }}
              title="Click để sửa nhanh"
            >
              {parseFloat(product.price).toLocaleString('vi-VN')} ₫
            </span>
          );
        },
        filterFn: 'includesString',
      },
      {
        header: 'Tồn kho',
        accessorKey: 'stock_quantity',
        cell: ({ row }) => {
          const product = row.original;
          const isLowStock = product.stock_quantity < 10;
          const isOutOfStock = product.stock_quantity === 0;
          
          if (editingProduct === product.id && editingField === 'stock_quantity') {
            return (
              <div className="admin-prod-quick-edit">
                <input
                  type="number"
                  className="admin-prod-inline-input"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => saveQuickEdit(product.id, 'stock_quantity', editValue)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveQuickEdit(product.id, 'stock_quantity', editValue);
                    if (e.key === 'Escape') cancelQuickEdit();
                  }}
                  autoFocus
                />
              </div>
            );
          }
          return (
            <span
              onClick={() => startQuickEdit(product, 'stock_quantity')}
              style={{
                cursor: 'pointer',
                textDecoration: 'underline dotted',
                color: isOutOfStock ? '#ef4444' : isLowStock ? '#f59e0b' : '#10b981',
                fontWeight: isLowStock ? 'bold' : 'normal'
              }}
              title="Click để sửa nhanh"
            >
              {product.stock_quantity}
            </span>
          );
        },
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
              title="Xem chi tiết"
            >
              <FaEye />
            </button>
            <button
              className="admin-prod-btn admin-prod-btn-edit"
              onClick={() => handleEditProduct(row.original.id)}
              title="Sửa sản phẩm"
            >
              <FaEdit />
            </button>
            <button
              className="admin-prod-btn admin-prod-btn-delete"
              onClick={() => handleDelete(row.original.id)}
              title="Xóa sản phẩm"
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    [categories, brands, selectedProducts, products, editingProduct, editingField, editValue, handleSelectAll, handleSelectProduct, startQuickEdit, saveQuickEdit, cancelQuickEdit]
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

      {/* Statistics Dashboard */}
      <div className="admin-prod-stats">
        <div className="admin-prod-stat-card">
          <div className="admin-prod-stat-label">Tổng sản phẩm</div>
          <div className="admin-prod-stat-value">{stats.total}</div>
        </div>
        <div className="admin-prod-stat-card admin-prod-stat-warning">
          <div className="admin-prod-stat-label">Sắp hết hàng (&lt;10)</div>
          <div className="admin-prod-stat-value">{stats.lowStock}</div>
        </div>
        <div className="admin-prod-stat-card admin-prod-stat-danger">
          <div className="admin-prod-stat-label">Hết hàng</div>
          <div className="admin-prod-stat-value">{stats.outOfStock}</div>
        </div>
        <div className="admin-prod-stat-card admin-prod-stat-success">
          <div className="admin-prod-stat-label">Tổng giá trị</div>
          <div className="admin-prod-stat-value">{stats.totalValue.toLocaleString('vi-VN')} ₫</div>
        </div>
      </div>

      {/* Controls */}
      <div className="admin-prod-controls">
        <div className="admin-prod-left-controls">
          <button className="admin-prod-btn admin-prod-btn-add" onClick={handleAddProduct}>
            Thêm sản phẩm
          </button>
          {(filterCategory || filterBrand || filterGender || filterPriceMin || filterPriceMax || filterStockMin || filterStockMax || searchQuery) && (
            <button className="admin-prod-btn admin-prod-btn-clear" onClick={clearFilters}>
              Xóa bộ lọc
            </button>
          )}
        </div>
        <div className="admin-prod-right-controls">
          <select
            className="admin-prod-inline-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select
            className="admin-prod-inline-select"
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
          <select
            className="admin-prod-inline-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="id">Sắp xếp: ID</option>
            <option value="name">Sắp xếp: Tên</option>
            <option value="price">Sắp xếp: Giá</option>
            <option value="stock_quantity">Sắp xếp: Tồn kho</option>
            <option value="sales_count">Sắp xếp: Đã bán</option>
          </select>
          <select
            className="admin-prod-inline-select admin-prod-sort-order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">↓</option>
            <option value="asc">↑</option>
          </select>
          <input
            className="admin-prod-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm sản phẩm theo tên..."
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="admin-prod-bulk-actions">
          <span className="admin-prod-selected-count">
            Đã chọn: {selectedProducts.length} sản phẩm
          </span>
          <div className="admin-prod-bulk-buttons">
            <button
              className="admin-prod-btn admin-prod-btn-bulk-delete"
              onClick={handleBulkDelete}
            >
              Xóa đã chọn ({selectedProducts.length})
            </button>
            <button
              className="admin-prod-btn admin-prod-btn-clear"
              onClick={() => setSelectedProducts([])}
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}
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

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="admin-prod-pagination">
          <button
            className="admin-prod-pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Trước
          </button>
          <span className="admin-prod-pagination-info">
            Trang {currentPage} / {totalPages} (Tổng: {totalProducts} sản phẩm)
          </span>
          <button
            className="admin-prod-pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
        </div>
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