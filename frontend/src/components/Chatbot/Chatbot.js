import { useState, useRef, useEffect } from "react";
import { FaCommentDots, FaPaperPlane, FaImage, FaTimes } from "react-icons/fa";
import './Chatbot.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [replies, setReplies] = useState([]);
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (!message.trim()) return;
    setReplies(prev => [...prev, { text: message, from: "user" }]);
    setMessage("");
    setTimeout(() => {
      setReplies(prev => [...prev, { text: "Bot đang trả lời...", from: "bot" }]);
    }, 500);
  };

  const handleFileSend = () => {
    alert("Chức năng gửi file hình ảnh demo");
  };

  // Tự scroll xuống dưới khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [replies, isOpen]);

  return (
    <>
      {!isOpen && (
        <div className="chatbot-icon" onClick={() => setIsOpen(true)}>
          <FaCommentDots size={28} />
        </div>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>Trợ lý ảo FootFashion</span>
            <FaTimes className="chatbot-close" onClick={() => setIsOpen(false)} />
          </div>

          <div className="chatbot-messages">
            {replies.length === 0 && (
              <p className="bot-message">Xin chào! Tôi có thể giúp gì cho bạn hôm nay?</p>
            )}
            {replies.map((reply, idx) => (
              <p key={idx} className={reply.from === "user" ? "user-message" : "bot-message"}>
                {reply.text}
              </p>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <div className="chatbot-icons">
              <FaImage className="icon-send" onClick={handleFileSend} title="Gửi hình" />
              <FaPaperPlane className="icon-send" onClick={handleSend} title="Gửi tin nhắn" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
