import React, { useState, useEffect } from 'react';
import { FaStar, FaUser, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import './Review.css';

const Review = ({ productId, onReviewAdded }) => {
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const { isLoggedIn, user } = useAuth();
  const { success, error } = useNotification();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`reviews/?product=${productId}`);
      setReviews(response.data.results || response.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      error('Vui lòng đăng nhập để đánh giá sản phẩm');
      return;
    }

    if (rating === 0) {
      error('Vui lòng chọn số sao đánh giá');
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        product: productId,
        rating,
        title,
        comment
      };

      if (editingReview) {
        await api.patch(`reviews/${editingReview.id}/`, reviewData);
        success('Cập nhật đánh giá thành công!');
      } else {
        await api.post('reviews/', reviewData);
        success('Gửi đánh giá thành công!');
      }

      setShowReviewForm(false);
      setEditingReview(null);
      setRating(0);
      setTitle('');
      setComment('');
      fetchReviews();
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      console.error('Error submitting review:', err);
      if (err.response?.status === 400) {
        error('Bạn đã đánh giá sản phẩm này rồi!');
      } else {
        error('Có lỗi xảy ra khi gửi đánh giá');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setTitle(review.title);
    setComment(review.comment);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Bạn có chắc muốn xóa đánh giá này?')) return;

    try {
      await api.delete(`reviews/${reviewId}/`);
      success('Xóa đánh giá thành công!');
      fetchReviews();
    } catch (err) {
      console.error('Error deleting review:', err);
      error('Có lỗi xảy ra khi xóa đánh giá');
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`review-star ${index < rating ? 'review-star-filled' : ''} ${interactive ? 'review-star-interactive' : ''}`}
        onClick={interactive && onStarClick ? () => onStarClick(index + 1) : undefined}
      />
    ));
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0
  }));

  if (loading) {
    return (
      <div className="review-section">
        <div className="review-loading">
          <div className="review-skeleton-header"></div>
          <div className="review-skeleton-form"></div>
          <div className="review-skeleton-list">
            {[1, 2, 3].map(i => (
              <div key={i} className="review-skeleton-item"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="review-section">
      <div className="review-header">
        <h3>Đánh giá sản phẩm</h3>
        <div className="review-summary">
          <div className="review-average">
            <div className="review-average-rating">{averageRating.toFixed(1)}</div>
            <div className="review-average-stars">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="review-average-text">
              Dựa trên {reviews.length} đánh giá
            </div>
          </div>
          <div className="review-distribution">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="review-distribution-item">
                <span className="review-distribution-star">{star}⭐</span>
                <div className="review-distribution-bar">
                  <div 
                    className="review-distribution-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="review-distribution-count">({count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isLoggedIn && (
        <div className="review-form-section">
          {!showReviewForm ? (
            <button 
              className="review-write-btn"
              onClick={() => setShowReviewForm(true)}
            >
              Viết đánh giá
            </button>
          ) : (
            <form className="review-form" onSubmit={handleSubmitReview}>
              <div className="review-form-header">
                <h4>{editingReview ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá'}</h4>
                <button 
                  type="button"
                  className="review-form-cancel"
                  onClick={() => {
                    setShowReviewForm(false);
                    setEditingReview(null);
                    setRating(0);
                    setTitle('');
                    setComment('');
                  }}
                >
                  Hủy
                </button>
              </div>
              
              <div className="review-form-rating">
                <label>Đánh giá:</label>
                <div className="review-form-stars">
                  {renderStars(5, true, setRating)}
                </div>
                {rating > 0 && <span className="review-form-rating-text">{rating} sao</span>}
              </div>

              <div className="review-form-field">
                <label>Tiêu đề:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề đánh giá..."
                  required
                />
              </div>

              <div className="review-form-field">
                <label>Nội dung:</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                  rows={4}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="review-form-submit"
                disabled={submitting}
              >
                {submitting ? 'Đang gửi...' : (editingReview ? 'Cập nhật' : 'Gửi đánh giá')}
              </button>
            </form>
          )}
        </div>
      )}

      <div className="review-list">
        {reviews.length === 0 ? (
          <div className="review-empty">
            <p>Chưa có đánh giá nào cho sản phẩm này.</p>
            {!isLoggedIn && <p>Hãy đăng nhập để viết đánh giá đầu tiên!</p>}
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-item">
              <div className="review-item-header">
                <div className="review-item-user">
                  <FaUser className="review-user-icon" />
                  <div className="review-user-info">
                    <div className="review-user-name">{review.user_name || review.user_username}</div>
                    <div className="review-item-date">
                      {new Date(review.created_at).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
                <div className="review-item-actions">
                  {isLoggedIn && user && (user.id === review.user || user.role === 1) && (
                    <>
                      <button 
                        className="review-edit-btn"
                        onClick={() => handleEditReview(review)}
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="review-delete-btn"
                        onClick={() => handleDeleteReview(review.id)}
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="review-item-rating">
                {renderStars(review.rating)}
              </div>
              
              <div className="review-item-content">
                <h5 className="review-item-title">{review.title}</h5>
                <p className="review-item-comment">{review.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Review;
