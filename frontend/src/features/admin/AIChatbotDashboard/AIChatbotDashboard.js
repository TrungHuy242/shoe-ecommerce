import React, { useState, useEffect, useMemo } from 'react';
import './AIChatbotDashboard.css';
import api from '../../../services/api';

const AIChatbotDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // Tabs: dashboard, conversations, intents, config, context, test, alerts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [daysMetrics, setDaysMetrics] = useState(7);
  const [daysAnalytics, setDaysAnalytics] = useState(30);

  // Logs (recent conversations)
  const [logs, setLogs] = useState([]);
  const [intentStatsFromLogs, setIntentStatsFromLogs] = useState({});
  const [sentimentStatsFromLogs, setSentimentStatsFromLogs] = useState({});
  const [avgConfidenceFromLogs, setAvgConfidenceFromLogs] = useState(0);
  const [avgProcessingTimeFromLogs, setAvgProcessingTimeFromLogs] = useState(0);

  // Metrics (/metrics)
  const [metricsSummary, setMetricsSummary] = useState(null);
  const [dailyMetrics, setDailyMetrics] = useState([]);
  const [metricsDateRange, setMetricsDateRange] = useState(null);

  // Analytics (/analytics)
  const [intentStats, setIntentStats] = useState([]);
  const [sentimentStats, setSentimentStats] = useState({ positive: 0, negative: 0, neutral: 0 });
  const [feedbackStats, setFeedbackStats] = useState({ positive: 0, negative: 0 });
  const [analyticsDateRange, setAnalyticsDateRange] = useState(null);

  // Log explorer filters & pagination
  const [logIntentFilter, setLogIntentFilter] = useState('all');
  const [logSentimentFilter, setLogSentimentFilter] = useState('all');
  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [logPage, setLogPage] = useState(1);
  const LOGS_PAGE_SIZE = 10;

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daysMetrics, daysAnalytics]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);

      // Run endpoints in parallel
      const [logsRes, metricsRes, analyticsRes] = await Promise.all([
        api.get('/ai/logs/'),
        api.get(`/ai/metrics/?days=${encodeURIComponent(daysMetrics)}`),
        api.get(`/ai/analytics/?days=${encodeURIComponent(daysAnalytics)}`)
      ]);

      // Logs
      const logsData = logsRes.data || {};
      setLogs(logsData.recent_logs || []);
      setIntentStatsFromLogs(logsData.intent_statistics || {});
      setSentimentStatsFromLogs(logsData.sentiment_statistics || {});
      setAvgConfidenceFromLogs(logsData.average_confidence || 0);
      setAvgProcessingTimeFromLogs(logsData.average_processing_time || 0);

      // Metrics
      const metricsData = metricsRes.data || {};
      setMetricsSummary(metricsData.summary || null);
      setDailyMetrics(metricsData.daily_metrics || []);
      setMetricsDateRange(metricsData.date_range || null);

      // Analytics
      const analyticsData = analyticsRes.data || {};
      setIntentStats(analyticsData.intent_statistics || []);
      setSentimentStats(analyticsData.sentiment_statistics || { positive: 0, negative: 0, neutral: 0 });
      setFeedbackStats(analyticsData.feedback_statistics || { positive: 0, negative: 0 });
      setAnalyticsDateRange(analyticsData.date_range || null);
    } catch (err) {
      console.error('Error fetching AI dashboard data:', err);
      setError('Không thể tải dữ liệu chatbot');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLogPage(1);
  }, [logIntentFilter, logSentimentFilter, logSearchTerm, logs.length]);

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

  const downloadCsv = (rows, filename) => {
    if (!rows || rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(','),
      ...rows.map(row => headers.map(h => {
        const val = row[h] ?? '';
        const escaped = String(val).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportLogsCsv = () => {
    const rows = (logs || []).map(l => ({
      id: l.id,
      user_id: l.user_id || '',
      session_id: l.session_id || '',
      intent: l.intent || '',
      response_type: l.response_type || '',
      confidence: l.confidence ?? '',
      sentiment: l.sentiment ? l.sentiment.sentiment : '',
      timestamp: l.timestamp || '',
      message: l.message || ''
    }));
    downloadCsv(rows, `chatbot_logs_${new Date().toISOString().slice(0,10)}.csv`);
  };

  const exportDailyMetricsCsv = () => {
    const rows = (dailyMetrics || []).map(d => ({
      date: d.date,
      total_interactions: d.total_interactions,
      unique_users: d.unique_users,
      unique_sessions: d.unique_sessions,
      product_searches: d.product_searches,
      product_clicks: d.product_clicks,
      product_purchases: d.product_purchases,
      promotion_views: d.promotion_views,
      order_queries: d.order_queries,
      positive_feedback: d.positive_feedback,
      negative_feedback: d.negative_feedback,
      avg_confidence_score: d.avg_confidence_score,
      avg_processing_time: d.avg_processing_time,
      conversion_rate: d.conversion_rate
    }));
    downloadCsv(rows, `chatbot_daily_metrics_${new Date().toISOString().slice(0,10)}.csv`);
  };

  const intentStatsPairs = useMemo(() => {
    return Object.entries(intentStatsFromLogs || {});
  }, [intentStatsFromLogs]);

  const filteredLogs = useMemo(() => {
    return (logs || []).filter((log) => {
      if (logIntentFilter !== 'all' && (log.intent || 'unknown') !== logIntentFilter) {
        return false;
      }
      if (logSentimentFilter !== 'all') {
        const sentimentValue = log.sentiment?.sentiment || 'neutral';
        if (sentimentValue !== logSentimentFilter) {
          return false;
        }
      }
      if (logSearchTerm) {
        const term = logSearchTerm.toLowerCase();
        const combined = `${log.message || ''} ${log.intent || ''} ${log.user_id || ''}`.toLowerCase();
        if (!combined.includes(term)) {
          return false;
        }
      }
      return true;
    });
  }, [logs, logIntentFilter, logSentimentFilter, logSearchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / LOGS_PAGE_SIZE));

  const paginatedLogs = useMemo(() => {
    const start = (logPage - 1) * LOGS_PAGE_SIZE;
    return filteredLogs.slice(start, start + LOGS_PAGE_SIZE);
  }, [filteredLogs, logPage]);

  const feedbackRates = useMemo(() => {
    if (!metricsSummary) {
      return { positive: 0, negative: 0 };
    }
    const totalFeedback =
      (metricsSummary.positive_feedback || 0) + (metricsSummary.negative_feedback || 0);
    if (!totalFeedback) {
      return { positive: 0, negative: 0 };
    }
    return {
      positive: ((metricsSummary.positive_feedback || 0) / totalFeedback) * 100,
      negative: ((metricsSummary.negative_feedback || 0) / totalFeedback) * 100
    };
  }, [metricsSummary]);

  const topIntentFromAnalytics = useMemo(() => {
    if (!intentStats || intentStats.length === 0) {
      return null;
    }
    return intentStats.reduce(
      (best, current) => (current.count > (best?.count || 0) ? current : best),
      null
    );
  }, [intentStats]);

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
        <button onClick={fetchAll} className="retry-btn">Thử lại</button>
      </div>
    );
  }

  return (
    <div className="ai-dashboard">
      <div className="dashboard-header">
        <h2>🤖 AI Chatbot Dashboard - Footy</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="filter-group">
            <label>Metrics days:</label>
            <input type="number" min="1" max="90" value={daysMetrics} onChange={(e) => setDaysMetrics(Number(e.target.value) || 7)} />
          </div>
          <div className="filter-group">
            <label>Analytics days:</label>
            <input type="number" min="1" max="180" value={daysAnalytics} onChange={(e) => setDaysAnalytics(Number(e.target.value) || 30)} />
          </div>
          <button onClick={fetchAll} className="refresh-btn">🔄 Làm mới</button>
          <button onClick={exportLogsCsv} className="refresh-btn">⬇️ Export Logs CSV</button>
          <button onClick={exportDailyMetricsCsv} className="refresh-btn">⬇️ Export Daily Metrics CSV</button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-container">
        <button 
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`tab-button ${activeTab === 'conversations' ? 'active' : ''}`}
          onClick={() => setActiveTab('conversations')}
        >
          💬 Conversations
        </button>
        <button 
          className={`tab-button ${activeTab === 'intents' ? 'active' : ''}`}
          onClick={() => setActiveTab('intents')}
        >
          🧠 Intent Training
        </button>
        <button 
          className={`tab-button ${activeTab === 'config' ? 'active' : ''}`}
          onClick={() => setActiveTab('config')}
        >
          ⚙️ Response & Rules
        </button>
        <button 
          className={`tab-button ${activeTab === 'context' ? 'active' : ''}`}
          onClick={() => setActiveTab('context')}
        >
          🧮 Context & Memory
        </button>
        <button 
          className={`tab-button ${activeTab === 'test' ? 'active' : ''}`}
          onClick={() => setActiveTab('test')}
        >
          🧪 Test & Simulation
        </button>
        <button 
          className={`tab-button ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          🚨 Alerts
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <>
      {/* Overview (from /metrics summary) */}
      <div className="statistics-section">
        <h3>📈 Tổng quan (Metrics)</h3>
        {metricsSummary ? (
          <div className="advanced-stats">
            <div className="stat-card">
              <div className="stat-indicator" style={{ backgroundColor: '#3b82f6' }}></div>
              <div className="stat-content">
                <div className="stat-label">Total Interactions</div>
                <div className="stat-value">{metricsSummary.total_interactions}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-indicator" style={{ backgroundColor: '#10b981' }}></div>
              <div className="stat-content">
                <div className="stat-label">Unique Users</div>
                <div className="stat-value">{metricsSummary.unique_users}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-indicator" style={{ backgroundColor: '#f59e0b' }}></div>
              <div className="stat-content">
                <div className="stat-label">Unique Sessions</div>
                <div className="stat-value">{metricsSummary.unique_sessions}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-indicator" style={{ backgroundColor: '#8b5cf6' }}></div>
              <div className="stat-content">
                <div className="stat-label">Product Searches</div>
                <div className="stat-value">{metricsSummary.product_searches}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-indicator" style={{ backgroundColor: '#ef4444' }}></div>
              <div className="stat-content">
                <div className="stat-label">Product Clicks</div>
                <div className="stat-value">{metricsSummary.product_clicks}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-indicator" style={{ backgroundColor: '#14b8a6' }}></div>
              <div className="stat-content">
                <div className="stat-label">Promotion Views</div>
                <div className="stat-value">{metricsSummary.promotion_views}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-indicator" style={{ backgroundColor: '#64748b' }}></div>
              <div className="stat-content">
                <div className="stat-label">Order Queries</div>
                <div className="stat-value">{metricsSummary.order_queries}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-indicator" style={{ backgroundColor: '#22c55e' }}></div>
              <div className="stat-content">
                <div className="stat-label">Avg Confidence</div>
                <div className="stat-value">{metricsSummary.avg_confidence_score?.toFixed(3)}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-indicator" style={{ backgroundColor: '#0ea5e9' }}></div>
              <div className="stat-content">
                <div className="stat-label">Avg Processing Time</div>
                <div className="stat-value">{metricsSummary.avg_processing_time?.toFixed(2)} ms</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-indicator" style={{ backgroundColor: '#e11d48' }}></div>
              <div className="stat-content">
                <div className="stat-label">Conversion Rate</div>
                <div className="stat-value">{metricsSummary.conversion_rate?.toFixed(2)}%</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-indicator" style={{ backgroundColor: '#f97316' }}></div>
              <div className="stat-content">
                <div className="stat-label">👍 Feedback Rate</div>
                <div className="stat-value">
                  {feedbackRates.positive ? `${feedbackRates.positive.toFixed(1)}%` : '0%'}
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-indicator" style={{ backgroundColor: '#475569' }}></div>
              <div className="stat-content">
                <div className="stat-label">👎 Feedback Rate</div>
                <div className="stat-value">
                  {feedbackRates.negative ? `${feedbackRates.negative.toFixed(1)}%` : '0%'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-data">Không có dữ liệu tổng quan</div>
        )}
        <div style={{ marginTop: 8, color: '#6b7280' }}>
          Phạm vi thời gian: {metricsDateRange ? `${metricsDateRange.start_date} → ${metricsDateRange.end_date} (${metricsDateRange.days} ngày)` : 'N/A'}
        </div>
      </div>

      {/* Intent & Sentiment & Feedback (from /analytics) */}
      <div className="statistics-section">
        <h3>🧠 Phân tích (Analytics)</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-indicator" style={{ backgroundColor: '#4CAF50' }}></div>
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
          <div className="stat-card">
            <div className="stat-indicator" style={{ backgroundColor: '#9E9E9E' }}></div>
            <div className="stat-content">
              <div className="stat-label">Neutral Sentiment</div>
              <div className="stat-value">{sentimentStats.neutral || 0}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-indicator" style={{ backgroundColor: '#22c55e' }}></div>
            <div className="stat-content">
              <div className="stat-label">👍 Feedback</div>
              <div className="stat-value">{feedbackStats.positive || 0}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-indicator" style={{ backgroundColor: '#ef4444' }}></div>
            <div className="stat-content">
              <div className="stat-label">👎 Feedback</div>
              <div className="stat-value">{feedbackStats.negative || 0}</div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 8, color: '#6b7280' }}>
          Phạm vi thời gian: {analyticsDateRange ? `${analyticsDateRange.start_date} → ${analyticsDateRange.end_date} (${analyticsDateRange.days} ngày)` : 'N/A'}
        </div>

        <div className="advanced-stats" style={{ marginTop: 16 }}>
          <div className="stat-card">
            <div className="stat-indicator" style={{ backgroundColor: '#2dd4bf' }}></div>
            <div className="stat-content">
              <div className="stat-label">Top Intent</div>
              <div className="stat-value">
                {topIntentFromAnalytics
                  ? `${topIntentFromAnalytics.intent || topIntentFromAnalytics.intent_name}: ${topIntentFromAnalytics.count}`
                  : 'N/A'}
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-indicator" style={{ backgroundColor: '#a855f7' }}></div>
            <div className="stat-content">
              <div className="stat-label">Avg Confidence (Logs)</div>
              <div className="stat-value">{(avgConfidenceFromLogs * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-indicator" style={{ backgroundColor: '#1d4ed8' }}></div>
            <div className="stat-content">
              <div className="stat-label">Avg Time (Logs)</div>
              <div className="stat-value">{avgProcessingTimeFromLogs.toFixed(0)} ms</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-indicator" style={{ backgroundColor: '#22c55e' }}></div>
            <div className="stat-content">
              <div className="stat-label">Total Conversations</div>
              <div className="stat-value">{metricsSummary?.total_interactions || 0}</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <h4 style={{ marginBottom: 8 }}>Top Intents</h4>
          {intentStats && intentStats.length > 0 ? (
            <div className="stats-grid">
              {intentStats.map((item, idx) => (
                <div key={idx} className="stat-card">
                  <div 
                    className="stat-indicator" 
                    style={{ backgroundColor: getIntentColor(item.intent || item.intent_name || 'unknown') }}
                  ></div>
                  <div className="stat-content">
                    <div className="stat-label">{item.intent || item.intent_name || 'unknown'}</div>
                    <div className="stat-value">{item.count}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">Không có dữ liệu intent</div>
          )}
        </div>
      </div>

      {/* Daily Metrics Table */}
      <div className="statistics-section">
        <h3>🗓️ Daily Metrics</h3>
        {dailyMetrics && dailyMetrics.length > 0 ? (
          <div className="table-wrapper">
            <table className="ai-table">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Interactions</th>
                  <th>Users</th>
                  <th>Sessions</th>
                  <th>Searches</th>
                  <th>Clicks</th>
                  <th>Purchases</th>
                  <th>Promo Views</th>
                  <th>Order Queries</th>
                  <th>👍</th>
                  <th>👎</th>
                  <th>Avg Conf</th>
                  <th>Avg Time (ms)</th>
                  <th>Conv Rate (%)</th>
                </tr>
              </thead>
              <tbody>
                {dailyMetrics.map((d, idx) => (
                  <tr key={idx}>
                    <td>{d.date}</td>
                    <td>{d.total_interactions}</td>
                    <td>{d.unique_users}</td>
                    <td>{d.unique_sessions}</td>
                    <td>{d.product_searches}</td>
                    <td>{d.product_clicks}</td>
                    <td>{d.product_purchases}</td>
                    <td>{d.promotion_views}</td>
                    <td>{d.order_queries}</td>
                    <td>{d.positive_feedback}</td>
                    <td>{d.negative_feedback}</td>
                    <td>{Number(d.avg_confidence_score).toFixed(3)}</td>
                    <td>{Number(d.avg_processing_time).toFixed(2)}</td>
                    <td>{Number(d.conversion_rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">Không có dữ liệu theo ngày</div>
        )}
      </div>

      {/* Logs from DB */}
      <div className="conversations-section">
        <h3>💬 Cuộc hội thoại gần đây (DB)</h3>
        <div className="filter-bar">
          <div className="filter-group">
            <label>Lọc Intent:</label>
            <select value={logIntentFilter} onChange={(e) => setLogIntentFilter(e.target.value)}>
              <option value="all">Tất cả</option>
              {Array.from(new Set(logs.map((l) => l.intent || 'unknown'))).map((intent) => (
                <option key={intent} value={intent}>
                  {intent}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Lọc Sentiment:</label>
            <select
              value={logSentimentFilter}
              onChange={(e) => setLogSentimentFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Tìm kiếm:</label>
            <input
              type="text"
              placeholder="Từ khóa user, intent..."
              value={logSearchTerm}
              onChange={(e) => setLogSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div style={{ marginBottom: 8, color: '#6b7280' }}>
          Tổng hiển thị: {filteredLogs.length} / {logs?.length || 0} | Avg Confidence:{' '}
          {(avgConfidenceFromLogs * 100).toFixed(1)}% | Avg Time: {avgProcessingTimeFromLogs.toFixed(0)}ms
        </div>
        <div className="conversations-list">
          {paginatedLogs.length === 0 ? (
            <div className="no-data">Chưa có cuộc hội thoại nào</div>
          ) : (
            paginatedLogs.map((log, index) => (
              <div key={`${log.id || 'log'}-${index}`} className="conversation-item">
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

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={logPage === 1} onClick={() => setLogPage((p) => Math.max(1, p - 1))}>
              ‹
            </button>
            <span>
              Trang {logPage}/{totalPages}
            </span>
            <button
              disabled={logPage === totalPages}
              onClick={() => setLogPage((p) => Math.min(totalPages, p + 1))}
            >
              ›
            </button>
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <h4 style={{ marginBottom: 8 }}>Intent từ Logs</h4>
          <div className="stats-grid">
            {intentStatsPairs.map(([intent, count]) => (
              <div key={intent} className="stat-card">
                <div className="stat-indicator" style={{ backgroundColor: getIntentColor(intent) }}></div>
                <div className="stat-content">
                  <div className="stat-label">{intent}</div>
                  <div className="stat-value">{count}</div>
                </div>
              </div>
            ))}
          </div>
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
        </>
      )}

      {activeTab === 'conversations' && (
        <div className="tab-content">
          <h3>💬 Conversation Management</h3>
          <p>Conversation management features will be implemented here with search, tags, and notes.</p>
        </div>
      )}

      {activeTab === 'intents' && (
        <div className="tab-content">
          <h3>🧠 Intent Training</h3>
          <p>Intent training features will be implemented here with CRUD operations.</p>
        </div>
      )}

      {activeTab === 'config' && (
        <div className="tab-content">
          <h3>⚙️ Response & Rules Configuration</h3>
          <p>Bot configuration features will be implemented here.</p>
        </div>
      )}

      {activeTab === 'context' && (
        <div className="tab-content">
          <h3>🧮 Context & Memory</h3>
          <p>Context and memory management features will be implemented here.</p>
        </div>
      )}

      {activeTab === 'test' && (
        <div className="tab-content">
          <h3>🧪 Test & Simulation</h3>
          <p>Test and simulation features will be implemented here.</p>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="tab-content">
          <h3>🚨 Alerts & Monitoring</h3>
          <p>Alert and monitoring features will be implemented here.</p>
        </div>
      )}
    </div>
  );
};

export default AIChatbotDashboard;

