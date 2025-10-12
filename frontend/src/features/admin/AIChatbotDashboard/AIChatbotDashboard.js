import React, { useState, useEffect } from 'react';
import './AIChatbotDashboard.css';
import api from '../../../services/api';

const AIChatbotDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [sentimentStats, setSentimentStats] = useState({});
  const [avgConfidence, setAvgConfidence] = useState(0);
  const [avgProcessingTime, setAvgProcessingTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/ai/logs/');
      setLogs(response.data.recent_logs || []);
      setStatistics(response.data.intent_statistics || {});
      setSentimentStats(response.data.sentiment_statistics || {});
      setAvgConfidence(response.data.average_confidence || 0);
      setAvgProcessingTime(response.data.average_processing_time || 0);
      setError(null);
    } catch (err) {
      console.error('Error fetching AI logs:', err);
      setError('Không thể tải dữ liệu chatbot');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('vi-VN');
  };

  const getIntentColor = (intent) => {
    const colors = {
      greeting: '#4CAF50',
      product_search: '#2196F3',
      recommendation: '#FF9800',
      promotion: '#9C27B0',
      order_status: '#607D8B',
      help: '#795548',
      unknown: '#9E9E9E',
      error: '#F44336'
    };
    return colors[intent] || '#9E9E9E';
  };

  const getSentimentEmoji = (sentiment) => {
    const emojis = {
      positive: '😊',
      negative: '😔',
      neutral: '😐'
    };
    return emojis[sentiment] || '😐';
  };

  if (loading) {
    return (
      <div className="ai-dashboard">
        <div className="loading">Đang tải dữ liệu chatbot...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-dashboard">
        <div className="error">{error}</div>
        <button onClick={fetchLogs} className="retry-btn">Thử lại</button>
      </div>
    );
  }

  return (
    <div className="ai-dashboard">
      <div className="dashboard-header">
        <h2>🤖 AI Chatbot Dashboard - Footy</h2>
        <button onClick={fetchLogs} className="refresh-btn">🔄 Làm mới</button>
      </div>

      {/* Statistics */}
      <div className="statistics-section">
        <h3>📊 Thống kê Intent</h3>
        <div className="stats-grid">
          {Object.entries(statistics).map(([intent, count]) => (
            <div key={intent} className="stat-card">
              <div 
                className="stat-indicator" 
                style={{ backgroundColor: getIntentColor(intent) }}
              ></div>
              <div className="stat-content">
                <div className="stat-label">{intent}</div>
                <div className="stat-value">{count}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Advanced Statistics */}
        <div className="advanced-stats">
          <div className="stat-card">
            <div className="stat-indicator" style={{ backgroundColor: '#4CAF50' }}></div>
            <div className="stat-content">
              <div className="stat-label">Avg Confidence</div>
              <div className="stat-value">{(avgConfidence * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-indicator" style={{ backgroundColor: '#2196F3' }}></div>
            <div className="stat-content">
              <div className="stat-label">Avg Processing Time</div>
              <div className="stat-value">{avgProcessingTime.toFixed(0)}ms</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-indicator" style={{ backgroundColor: '#FF9800' }}></div>
            <div className="stat-content">
              <div className="stat-label">Positive Sentiment</div>
              <div className="stat-value">{sentimentStats.positive || 0}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-indicator" style={{ backgroundColor: '#F44336' }}></div>
            <div className="stat-content">
              <div className="stat-label">Negative Sentiment</div>
              <div className="stat-value">{sentimentStats.negative || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="conversations-section">
        <h3>💬 Cuộc hội thoại gần đây</h3>
        <div className="conversations-list">
          {logs.length === 0 ? (
            <div className="no-data">Chưa có cuộc hội thoại nào</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="conversation-item">
                <div className="conversation-header">
                  <div className="conversation-meta">
                    <span className="user-id">User: {log.user_id || 'Anonymous'}</span>
                    <span className="timestamp">{formatTimestamp(log.timestamp)}</span>
                  </div>
                  <div className="conversation-badges">
                    <span 
                      className="intent-badge"
                      style={{ backgroundColor: getIntentColor(log.intent) }}
                    >
                      {log.intent}
                    </span>
                    {log.sentiment && (
                      <span className="sentiment-badge">
                        {getSentimentEmoji(log.sentiment.sentiment)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="conversation-content">
                  <div className="user-message">
                    <strong>User:</strong> {log.message}
                  </div>
                  <div className="response-type">
                    <strong>Response Type:</strong> {log.response_type}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* AI Service Status */}
      <div className="status-section">
        <h3>⚙️ Trạng thái AI Service</h3>
        <div className="status-cards">
          <div className="status-card">
            <div className="status-icon">🧠</div>
            <div className="status-content">
              <div className="status-title">Intent Recognition</div>
              <div className="status-value">Hoạt động</div>
            </div>
          </div>
          <div className="status-card">
            <div className="status-icon">💭</div>
            <div className="status-content">
              <div className="status-title">Sentiment Analysis</div>
              <div className="status-value">Hoạt động</div>
            </div>
          </div>
          <div className="status-card">
            <div className="status-icon">🧮</div>
            <div className="status-content">
              <div className="status-title">Memory Context</div>
              <div className="status-value">Hoạt động</div>
            </div>
          </div>
          <div className="status-card">
            <div className="status-icon">🔗</div>
            <div className="status-content">
              <div className="status-title">API Integration</div>
              <div className="status-value">Hoạt động</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbotDashboard;
