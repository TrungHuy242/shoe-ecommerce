import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chatbot.css';
import api from '../../../services/api';
import { v4 as uuidv4 } from 'uuid';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => uuidv4()); // Generate session ID for anonymous users
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message khi mở chatbot
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          sender: 'bot',
          text: 'Xin chào! Tôi là Footy, trợ lý mua sắm của FootFashion! 👋\n\nTôi có thể giúp bạn:\n🔍 Tìm kiếm giày dép\n💡 Gợi ý sản phẩm\n🎉 Xem khuyến mãi\n📦 Kiểm tra đơn hàng\n\nBạn cần gì nhé?',
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setIsOpen(false); // Đóng chatbot khi chuyển trang
  };

  const handlePromoClick = (promoCode) => {
    // Copy mã giảm giá vào clipboard
    navigator.clipboard.writeText(promoCode).then(() => {
      // Có thể thêm toast notification ở đây
      console.log('Mã giảm giá đã được copy:', promoCode);
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat/', { 
        message: input,
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
    
    return (
      <div key={index} className={`footy-message ${isBot ? 'footy-message-bot' : 'footy-message-user'}`}>
        <div className="footy-message-content">
          <div className="footy-message-text">{message.text}</div>
          
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
            <button onClick={() => setIsOpen(false)} className="footy-close-btn">✕</button>
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

