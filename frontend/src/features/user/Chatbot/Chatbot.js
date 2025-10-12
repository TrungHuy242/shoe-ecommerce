import React, { useState, useEffect, useRef } from 'react';
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
      <div key={index} className={`message ${isBot ? 'bot' : 'user'}`}>
        <div className="message-content">
          <div className="message-text">{message.text}</div>
          
          {/* Render products if available */}
          {message.products && message.products.length > 0 && (
            <div className="message-products">
              {message.products.map((product, idx) => (
                <div key={idx} className="product-card-mini">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="product-img-mini" />
                  )}
                  <div className="product-info-mini">
                    <h4>{product.name}</h4>
                    <p className="brand">{product.brand}</p>
                    <p className="price">{product.price.toLocaleString()} VND</p>
                    <a href={product.link || `/product/${product.id}`} className="view-btn">Xem chi tiết</a>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Render promotions if available */}
          {message.promotions && message.promotions.length > 0 && (
            <div className="message-promotions">
              {message.promotions.map((promo, idx) => (
                <div key={idx} className="promo-card-mini">
                  <span className="promo-code">{promo.code}</span>
                  <span className="promo-discount">-{promo.discount_percentage}%</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="message-time">
            {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {/* Chatbot Toggle Button */}
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chatbot"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">🤖</div>
              <div>
                <h3>Footy</h3>
                <p>Trợ lý mua sắm AI</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="close-btn">✕</button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, idx) => renderMessage(msg, idx))}
            {isLoading && (
              <div className="message bot">
                <div className="message-content">
                  <div className="typing-indicator">
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
          <form className="chatbot-input" onSubmit={sendMessage}>
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
          <div className="quick-actions">
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

