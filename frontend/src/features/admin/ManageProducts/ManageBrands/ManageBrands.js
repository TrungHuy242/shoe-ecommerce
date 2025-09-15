import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Upload, 
  Package, 
  AlertTriangle,
  Loader2,
  Image as ImageIcon,
  Tag
} from 'lucide-react';
import api from '../../../../services/api';
import './ManageBrands.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageBrands = () => {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState({ name: '', image: null });
  const [editingBrand, setEditingBrand] = useState(null);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await api.get('/brands/');
      setBrands(response.data.results || []);
      setError('');
    } catch (error) {
      setError('Failed to load brands.');
      console.error(error);
      toast.error('Failed to load brands.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBrand(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setNewBrand(prev => ({
      ...prev,
      image: file
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', newBrand.name);
      if (newBrand.image) {
        formData.append('image', newBrand.image);
      }

      if (editingBrand) {
        await api.put(`/brands/${editingBrand.id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setEditingBrand(null);
        toast.success('Brand updated successfully!');
      } else {
        await api.post('/brands/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Brand added successfully!');
      }
      
      fetchBrands();
      setNewBrand({ name: '', image: null });
      setSelectedImage(null);
      setError('');
    } catch (error) {
      setError('Failed to save brand.');
      console.error(error);
      toast.error('Failed to save brand.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await api.delete(`/brands/${id}/`);
        fetchBrands();
        toast.success('Brand deleted successfully!');
      } catch (error) {
        setError('Failed to delete brand.');
        console.error(error);
        toast.error('Failed to delete brand.');
      }
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setNewBrand({
      name: brand.name,
      image: null
    });
    setSelectedImage(null);
  };

  const handleCancelEdit = () => {
    setEditingBrand(null);
    setNewBrand({ name: '', image: null });
    setSelectedImage(null);
  };

  return (
    <div className="manage-brands-container">
      <h2>
        <Tag size={32} />
        Manage Brands
      </h2>
      
      {error && (
        <div className="error">
          <AlertTriangle size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="brand-form">
        <div className="form-group">
          <label className="form-label">Brand Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter brand name"
            value={newBrand.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Brand Image</label>
          <div className="file-input-wrapper">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
              id="brand-image-input"
            />
            <label 
              htmlFor="brand-image-input" 
              className={`file-input-label ${selectedImage ? 'has-file' : ''}`}
            >
              <Upload size={20} />
              {selectedImage ? selectedImage.name : 'Choose brand image'}
            </label>
          </div>
          
          {selectedImage && (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
              />
              <div className="image-info">
                <div className="image-name">{selectedImage.name}</div>
                <div className="image-size">{formatFileSize(selectedImage.size)}</div>
              </div>
            </div>
          )}
          
          {editingBrand && editingBrand.image && !selectedImage && (
            <div className="image-preview">
              <img src={editingBrand.image} alt={editingBrand.name} />
              <div className="image-info">
                <div className="image-name">Current image</div>
                <div className="image-size">Keep existing image or upload new one</div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            {editingBrand ? 'Update Brand' : 'Add Brand'}
          </button>
          
          {editingBrand && (
            <button 
              type="button" 
              onClick={handleCancelEdit}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="brands-section">
        <div className="brands-header">
          <Package size={24} />
          <h3>Brand Collection ({brands.length})</h3>
        </div>

        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            Loading brands...
          </div>
        ) : brands.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <ImageIcon size={48} />
            </div>
            <h3>No brands yet</h3>
            <p>Start building your brand collection by adding your first brand above.</p>
          </div>
        ) : (
          <ul className="brands-list">
            {brands.map(brand => (
              <li key={brand.id} className="brand-item">
                <img 
                  src={brand.image} 
                  alt={brand.name} 
                  className="brand-image"
                />
                <div className="brand-info">
                  <h4 className="brand-name">{brand.name}</h4>
                  <div className="brand-meta">
                    Brand ID: {brand.id}
                  </div>
                </div>
                <div className="brand-actions">
                  <button 
                    onClick={() => handleEdit(brand)}
                    className="btn btn-secondary btn-small"
                    title="Edit brand"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(brand.id)}
                    className="btn btn-danger btn-small"
                    title="Delete brand"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageBrands;