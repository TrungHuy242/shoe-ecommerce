import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chatbot.css';
import api from '../../../services/api';
import { useNotification } from '../../../context/NotificationContext';
import { v4 as uuidv4 } from 'uuid';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => uuidv4()); // Generate session ID for anonymous users
  const messagesEndRef = useRef(null);
  const hasShownWelcomeRef = useRef(false); // Track if welcome message has been shown
  const navigate = useNavigate();
  const { success, error } = useNotification();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message chỉ hiển thị một lần duy nhất khi mở chatbot lần đầu tiên
    // Không hiển thị lại khi đóng rồi mở lại
    if (isOpen && messages.length === 0 && !hasShownWelcomeRef.current) {
      setMessages([
        {
          sender: 'bot',
          text: 'Chào bạn! Mình là Footy 👋\n\nMình giúp bạn:\n• Tìm giày phù hợp\n• Tư vấn sản phẩm\n• Check khuyến mãi\n• Tra đơn hàng\n\nBạn cần gì nào?',
          timestamp: new Date(),
          isWelcome: true, // Flag để identify welcome message
        },
      ]);
      hasShownWelcomeRef.current = true; // Đánh dấu đã hiển thị welcome message
    }
  }, [isOpen, messages.length]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setIsOpen(false); // Đóng chatbot khi chuyển trang
  };

  // Parse markdown links và render thành clickable elements
  const renderTextWithLinks = (text) => {
    if (!text) return text;
    
    // Check if text contains markdown links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    if (!linkRegex.test(text)) {
      // No links found, return text as is (CSS will handle newlines with white-space: pre-line)
      return text;
    }
    
    // Reset regex
    linkRegex.lastIndex = 0;
    
    // Split text into parts, handling newlines
    const parts = [];
    let lastIndex = 0;
    let match;
    let keyIndex = 0;
    
    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link (including any newlines)
      if (match.index > lastIndex) {
        const textBefore = text.substring(lastIndex, match.index);
        // Replace newlines with <br /> tags
        const textParts = textBefore.split('\n');
        textParts.forEach((part, idx) => {
          if (idx > 0) {
            parts.push(<br key={`br-${keyIndex++}`} />);
          }
          if (part) {
            parts.push(part);
          }
        });
      }
      
      // Add clickable link
      const linkText = match[1];
      const linkUrl = match[2];
      
      // Extract product ID from URL (e.g., /product/14 -> 14)
      const productIdMatch = linkUrl.match(/\/product\/(\d+)/);
      if (productIdMatch) {
        const productId = productIdMatch[1];
        parts.push(
          <span
            key={`link-${keyIndex++}`}
            className="footy-product-link"
            onClick={() => handleProductClick(productId)}
            style={{
              color: '#667eea',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontWeight: 500
            }}
          >
            {linkText}
          </span>
        );
      } else {
        // Fallback: render as regular link if not a product link
        parts.push(
          <a
            key={`link-${keyIndex++}`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#667eea',
              textDecoration: 'underline'
            }}
          >
            {linkText}
          </a>
        );
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text (including any newlines)
    if (lastIndex < text.length) {
      const textAfter = text.substring(lastIndex);
      // Replace newlines with <br /> tags
      const textParts = textAfter.split('\n');
      textParts.forEach((part, idx) => {
        if (idx > 0) {
          parts.push(<br key={`br-${keyIndex++}`} />);
        }
        if (part) {
          parts.push(part);
        }
      });
    }
    
    return parts;
  };

  const handlePromoClick = async (promoCode) => {
    try {
      // Copy mã giảm giá vào clipboard
      await navigator.clipboard.writeText(promoCode);
      
      // Hiển thị toast notification
      success(`Đã copy mã giảm giá: ${promoCode}`);
      
      // Thêm message vào chat để user biết rõ hơn
      const copyMessage = {
        sender: 'bot',
        text: `✅ Đã copy mã giảm giá "${promoCode}" vào clipboard!\n\nBạn có thể dán mã này vào ô nhập mã giảm giá khi thanh toán. 💰`,
        timestamp: new Date(),
        isCopyFeedback: true, // Flag để style khác một chút
      };
      
      setMessages((prev) => [...prev, copyMessage]);
      
      // Scroll to bottom để user thấy message mới
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (err) {
      // Fallback nếu clipboard API không khả dụng
      console.error('Copy failed:', err);
      error('Không thể copy mã giảm giá. Vui lòng copy thủ công: ' + promoCode);
      
      // Vẫn hiển thị message trong chat với mã code
      const fallbackMessage = {
        sender: 'bot',
        text: `📋 Mã giảm giá của bạn: "${promoCode}"\n\nVui lòng copy mã này để sử dụng khi thanh toán.`,
        timestamp: new Date(),
        isCopyFeedback: true,
      };
      
      setMessages((prev) => [...prev, fallbackMessage]);
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  };

  const handleFeedback = async (messageIndex, feedbackType) => {
    try {
      const message = messages[messageIndex];
      
      // Send feedback to backend
      await api.post('/ai/feedback/', {
        message: message.userMessage || '',
        response: message.text,
        intent: message.intent,
        feedback_type: feedbackType,
        session_id: sessionId,
        timestamp: message.timestamp
      });
      
      // Update message với feedback status
      setMessages(prev => {
        const updated = [...prev];
        updated[messageIndex] = { ...updated[messageIndex], feedback: feedbackType };
        return updated;
      });
      
      // Show success notification
      success(feedbackType === 'positive' 
        ? 'Cảm ơn phản hồi tích cực! 😊' 
        : 'Cảm ơn phản hồi! Chúng tôi sẽ cải thiện. 🙏');
      
    } catch (err) {
      console.error('Feedback error:', err);
      error('Không thể gửi feedback. Vui lòng thử lại!');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };
    
    const userInput = input; // Store for bot message reference

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat/', { 
        message: userInput,
        session_id: sessionId
      });
      
      const botMessage = {
        sender: 'bot',
        text: response.data.content,
        type: response.data.type,
        intent: response.data.intent,
        confidence: response.data.confidence,
        products: response.data.products || [],
        promotions: response.data.promotions || [],
        sentiment: response.data.sentiment,
        processing_time: response.data.processing_time,
        timestamp: new Date(),
        userMessage: userInput, // Store user's message for feedback
        feedback: null // Track feedback status
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        sender: 'bot',
        text: 'Xin lỗi, tôi gặp sự cố kỹ thuật. Vui lòng thử lại sau! 😅',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message, index) => {
    const isBot = message.sender === 'bot';
    const isCopyFeedback = message.isCopyFeedback;
    
    return (
      <div key={index} className={`footy-message ${isBot ? 'footy-message-bot' : 'footy-message-user'} ${isCopyFeedback ? 'footy-message-copy-feedback' : ''}`}>
        <div className="footy-message-content">
          <div className={`footy-message-text ${isCopyFeedback ? 'footy-copy-feedback-text' : ''}`}>
            {renderTextWithLinks(message.text)}
          </div>
          
          {/* Render products if available */}
          {message.products && message.products.length > 0 && (
            <div className="footy-message-products">
              {message.products.map((product, idx) => (
                <div key={idx} className="footy-product-card-mini" onClick={() => handleProductClick(product.id)}>
                  <div className="footy-product-image-container">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="footy-product-img-mini"
                        onError={(e) => {
                          e.target.src = '/assets/images/placeholder-shoe.png'; // Fallback image
                        }}
                      />
                    ) : (
                      <div className="footy-product-placeholder">
                        <span>👟</span>
                      </div>
                    )}
                  </div>
                  <div className="footy-product-info-mini">
                    <h4>{product.name}</h4>
                    <p className="footy-product-brand">{product.brand}</p>
                    <p className="footy-product-price">{product.price.toLocaleString()} VND</p>
                    <button className="footy-view-btn" onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product.id);
                    }}>
                      Xem chi tiết →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Render promotions if available */}
          {message.promotions && message.promotions.length > 0 && (
            <div className="footy-message-promotions">
              {message.promotions.map((promo, idx) => (
                <div key={idx} className="footy-promo-card-mini" onClick={() => handlePromoClick(promo.code)}>
                  <div className="footy-promo-icon">🎉</div>
                  <div className="footy-promo-info">
                    <span className="footy-promo-code">{promo.code}</span>
                    <span className="footy-promo-discount">-{promo.discount_percentage}%</span>
                  </div>
                  <div className="footy-promo-copy">📋</div>
                </div>
              ))}
            </div>
          )}
          
          <div className="footy-message-time">
            {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </div>
          
          {/* Feedback buttons for bot messages (not welcome or copy feedback) */}
          {isBot && !message.isWelcome && !isCopyFeedback && (
            <div className="footy-message-feedback">
              <button 
                className={`footy-feedback-btn ${message.feedback === 'positive' ? 'active' : ''}`}
                onClick={() => handleFeedback(index, 'positive')}
                disabled={message.feedback !== null}
                title="Câu trả lời hữu ích"
              >
                👍
              </button>
              <button 
                className={`footy-feedback-btn ${message.feedback === 'negative' ? 'active' : ''}`}
                onClick={() => handleFeedback(index, 'negative')}
                disabled={message.feedback !== null}
                title="Câu trả lời chưa tốt"
              >
                👎
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`footy-chatbot-container ${isOpen ? 'footy-open' : ''}`}>
      {/* Chatbot Toggle Button */}
      <button
        className="footy-chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chatbot"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="footy-chatbot-window">
          {/* Header */}
          <div className="footy-chatbot-header">
            <div className="footy-chatbot-header-info">
              <div className="footy-chatbot-avatar">🤖</div>
              <div>
                <h3>Footy</h3>
                <p>Trợ lý mua sắm AI</p>
              </div>
            </div>
            <div className="footy-chatbot-header-actions">
              {messages.length > 0 && (
                <button 
                  onClick={() => {
                    if (window.confirm('Bạn có chắc muốn xóa toàn bộ cuộc trò chuyện?')) {
                      setMessages([]);
                      hasShownWelcomeRef.current = false; // Reset để có thể hiển thị welcome message lại
                    }
                  }}
                  className="footy-clear-btn"
                  title="Xóa cuộc trò chuyện"
                >
                  🗑️
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="footy-close-btn">✕</button>
            </div>
          </div>

          {/* Messages */}
          <div className="footy-chatbot-messages">
            {messages.map((msg, idx) => renderMessage(msg, idx))}
            {isLoading && (
              <div className="footy-message footy-message-bot">
                <div className="footy-message-content">
                  <div className="footy-typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className="footy-chatbot-input" onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              ➤
            </button>
          </form>

          {/* Quick Actions */}
          <div className="footy-quick-actions">
            <button onClick={() => setInput('Có khuyến mãi nào không?')}>🎉 Khuyến mãi</button>
            <button onClick={() => setInput('Gợi ý giày thể thao')}>👟 Gợi ý</button>
            <button onClick={() => setInput('Giúp tôi')}>🆘 Trợ giúp</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

