# Chatbot Test Cases - Footy AI Assistant

## Tổng quan
File này chứa các test cases để kiểm tra các tính năng của Chatbot AI Footy.

## 1. Test Cases - Intent Detection

### Test Case 1.1: Greeting Intent
**Mục đích:** Kiểm tra chatbot có nhận diện được lời chào không

**Input:**
```
"Xin chào"
"Hello"
"Hi"
"Chào bạn"
```

**Expected Output:**
- Intent: `greeting`
- Confidence: > 0.5
- Response: Chứa lời chào và giới thiệu về các tính năng

**Cách test:**
```bash
POST /api/ai/chat/
{
  "message": "Xin chào",
  "session_id": "test_session_1"
}
```

---

### Test Case 1.2: Product Search Intent
**Mục đích:** Kiểm tra chatbot có nhận diện được yêu cầu tìm kiếm sản phẩm không

**Input:**
```
"Tôi muốn mua giày Nike"
"Tìm giày Adidas nam"
"Có giày nữ không?"
```

**Expected Output:**
- Intent: `product_search`
- Confidence: > 0.5
- Response: Chứa thông tin về sản phẩm hoặc hỏi thêm thông tin

**Cách test:**
```bash
POST /api/ai/chat/
{
  "message": "Tôi muốn mua giày Nike",
  "session_id": "test_session_2"
}
```

---

### Test Case 1.3: Recommendation Intent
**Mục đích:** Kiểm tra chatbot có nhận diện được yêu cầu gợi ý sản phẩm không

**Input:**
```
"Gợi ý cho tôi giày đẹp"
"Giày nào bán chạy nhất?"
"Recommend giày thể thao"
```

**Expected Output:**
- Intent: `recommendation`
- Confidence: > 0.5
- Response: Chứa danh sách sản phẩm được gợi ý

---

### Test Case 1.4: Promotion Intent
**Mục đích:** Kiểm tra chatbot có nhận diện được yêu cầu về khuyến mãi không

**Input:**
```
"Có khuyến mãi nào không?"
"Xem mã giảm giá"
"Sale hôm nay"
```

**Expected Output:**
- Intent: `promotion`
- Confidence: > 0.5
- Response: Chứa thông tin về khuyến mãi hiện tại

---

## 2. Test Cases - Sentiment Analysis

### Test Case 2.1: Positive Sentiment
**Mục đích:** Kiểm tra chatbot có nhận diện được cảm xúc tích cực không

**Input:**
```
"Tôi rất thích giày này, đẹp quá!"
"Cảm ơn bạn rất nhiều"
"Tuyệt vời!"
```

**Expected Output:**
- Sentiment: `positive`
- Confidence: > 0.5

---

### Test Case 2.2: Negative Sentiment
**Mục đích:** Kiểm tra chatbot có nhận diện được cảm xúc tiêu cực không

**Input:**
```
"Giày này tệ quá"
"Không hài lòng"
"Thất vọng"
```

**Expected Output:**
- Sentiment: `negative`
- Confidence: > 0.5

---

### Test Case 2.3: Neutral Sentiment
**Mục đích:** Kiểm tra chatbot có nhận diện được cảm xúc trung tính không

**Input:**
```
"Giày này giá bao nhiêu?"
"Xem sản phẩm"
"Tìm giày"
```

**Expected Output:**
- Sentiment: `neutral`

---

## 3. Test Cases - Entity Extraction

### Test Case 3.1: Brand Extraction
**Mục đích:** Kiểm tra chatbot có trích xuất được thương hiệu không

**Input:**
```
"Tôi muốn mua giày Nike"
"Giày Adidas"
"Puma có không?"
```

**Expected Output:**
- Entity: `brand` = "Nike" / "Adidas" / "Puma"

---

### Test Case 3.2: Gender Extraction
**Mục đích:** Kiểm tra chatbot có trích xuất được giới tính không

**Input:**
```
"Giày nam"
"Tìm giày nữ"
"Unisex"
```

**Expected Output:**
- Entity: `gender` = "Nam" / "Nữ" / "Unisex"

---

### Test Case 3.3: Price Extraction
**Mục đích:** Kiểm tra chatbot có trích xuất được khoảng giá không

**Input:**
```
"Giày dưới 2 triệu"
"Tìm giày rẻ"
"Giày đắt"
```

**Expected Output:**
- Entity: `max_price` hoặc price range

---

## 4. Test Cases - Multi-turn Conversation

### Test Case 4.1: Missing Information - Product Search
**Mục đích:** Kiểm tra chatbot có hỏi lại khi thiếu thông tin không

**Input Sequence:**
1. User: "Tôi muốn mua giày"
2. Bot: Hỏi về thương hiệu và giới tính
3. User: "Nike nam"
4. Bot: Hiển thị sản phẩm

**Expected Output:**
- Lần 1: Bot hỏi thêm thông tin
- Lần 2: Bot hiển thị sản phẩm phù hợp

**Cách test:**
```bash
# Request 1
POST /api/ai/chat/
{
  "message": "Tôi muốn mua giày",
  "session_id": "test_session_multiturn"
}

# Request 2 (cùng session_id)
POST /api/ai/chat/
{
  "message": "Nike nam",
  "session_id": "test_session_multiturn"
}
```

---

### Test Case 4.2: Follow-up Questions
**Mục đích:** Kiểm tra chatbot có nhớ context từ câu trước không

**Input Sequence:**
1. User: "Tìm giày Nike"
2. Bot: Hiển thị sản phẩm Nike
3. User: "Có màu đen không?"
4. Bot: Hiển thị sản phẩm Nike màu đen

**Expected Output:**
- Bot nhớ context về thương hiệu Nike từ câu trước

---

## 5. Test Cases - Fallback Handling

### Test Case 5.1: Gemini API Quota Exceeded
**Mục đích:** Kiểm tra chatbot có fallback khi API quota hết không

**Input:**
```
"Tìm giày Nike"
```

**Expected Output:**
- Vẫn trả về response (không lỗi)
- Sử dụng fallback response với logic thông minh
- Có thể vẫn hiển thị sản phẩm phù hợp

**Cách test:**
- Tạm thời disable Gemini API key hoặc giả lập lỗi quota

---

### Test Case 5.2: Gemini API Timeout
**Mục đích:** Kiểm tra chatbot có xử lý timeout không

**Input:**
```
"Gợi ý giày đẹp"
```

**Expected Output:**
- Vẫn trả về response trong thời gian hợp lý
- Sử dụng fallback response

---

## 6. Test Cases - Metrics & Analytics

### Test Case 6.1: Metrics Tracking
**Mục đích:** Kiểm tra metrics có được cập nhật không

**Cách test:**
1. Gửi một số requests đến chatbot
2. Kiểm tra metrics:
```bash
GET /api/ai/metrics/?days=1
```

**Expected Output:**
- `total_interactions` tăng lên
- `product_searches` tăng nếu có product_search intent
- `unique_users` và `unique_sessions` được cập nhật

---

### Test Case 6.2: Conversion Rate
**Mục đích:** Kiểm tra conversion rate có được tính đúng không

**Cách test:**
1. Gửi các product_search requests
2. Gửi product click events (cần implement trong frontend)
3. Kiểm tra metrics:
```bash
GET /api/ai/metrics/?days=1
```

**Expected Output:**
- `conversion_rate` = (product_clicks / product_searches) * 100

---

### Test Case 6.3: Analytics Endpoint
**Mục đích:** Kiểm tra analytics endpoint có hoạt động không

**Cách test:**
```bash
GET /api/ai/analytics/?days=7
```

**Expected Output:**
- Intent statistics
- Sentiment statistics
- Feedback statistics

---

## 7. Test Cases - Product Search

### Test Case 7.1: Search by Brand
**Mục đích:** Kiểm tra tìm kiếm theo thương hiệu

**Input:**
```
"Tìm giày Nike"
"Giày Adidas"
```

**Expected Output:**
- Chỉ hiển thị sản phẩm của thương hiệu được yêu cầu
- Có link đến sản phẩm

---

### Test Case 7.2: Search by Brand and Gender
**Mục đích:** Kiểm tra tìm kiếm với nhiều filters

**Input:**
```
"Tìm giày Nike nam"
"Giày Adidas nữ"
```

**Expected Output:**
- Hiển thị sản phẩm phù hợp với cả brand và gender
- Sản phẩm được sắp xếp theo relevance

---

### Test Case 7.3: Search by Price Range
**Mục đích:** Kiểm tra tìm kiếm theo khoảng giá

**Input:**
```
"Tìm giày dưới 1 triệu"
"Giày rẻ"
```

**Expected Output:**
- Chỉ hiển thị sản phẩm trong khoảng giá được yêu cầu

---

## 8. Test Cases - Context Memory

### Test Case 8.1: Conversation Memory
**Mục đích:** Kiểm tra chatbot có nhớ context không

**Input Sequence:**
1. User: "Xin chào"
2. Bot: "Xin chào! Tôi là Footy..."
3. User: "Tìm giày Nike"
4. Bot: Hiển thị sản phẩm Nike
5. User: "Còn Adidas không?"
6. Bot: Hiển thị sản phẩm Adidas (nhớ context đang tìm giày)

**Expected Output:**
- Bot nhớ context từ các câu trước
- Response phù hợp với context

---

## 9. Test Cases - Feedback

### Test Case 9.1: Positive Feedback
**Mục đích:** Kiểm tra feedback tích cực có được lưu không

**Cách test:**
```bash
POST /api/ai/feedback/
{
  "session_id": "test_session",
  "message": "Tìm giày Nike",
  "response": "Em đã tìm thấy...",
  "intent": "product_search",
  "feedback_type": "positive"
}
```

**Expected Output:**
- Feedback được lưu vào database
- Metrics `positive_feedback` tăng lên

---

### Test Case 9.2: Negative Feedback
**Mục đích:** Kiểm tra feedback tiêu cực có được lưu không

**Cách test:**
```bash
POST /api/ai/feedback/
{
  "session_id": "test_session",
  "message": "Tìm giày",
  "response": "...",
  "intent": "product_search",
  "feedback_type": "negative"
}
```

**Expected Output:**
- Feedback được lưu vào database
- Metrics `negative_feedback` tăng lên

---

## 10. Test Script - Python

Tạo file `test_chatbot.py` để chạy các test cases:

```python
import requests
import json

BASE_URL = "http://localhost:8000/api/ai"

def test_greeting():
    """Test Case 1.1: Greeting Intent"""
    response = requests.post(f"{BASE_URL}/chat/", json={
        "message": "Xin chào",
        "session_id": "test_greeting"
    })
    data = response.json()
    assert data['intent'] == 'greeting'
    assert data['confidence'] > 0.5
    print("✅ Test Case 1.1: PASSED")

def test_product_search():
    """Test Case 1.2: Product Search Intent"""
    response = requests.post(f"{BASE_URL}/chat/", json={
        "message": "Tôi muốn mua giày Nike",
        "session_id": "test_product_search"
    })
    data = response.json()
    assert data['intent'] == 'product_search'
    assert data['confidence'] > 0.5
    print("✅ Test Case 1.2: PASSED")

def test_multi_turn():
    """Test Case 4.1: Multi-turn Conversation"""
    session_id = "test_multiturn"
    
    # Request 1
    response1 = requests.post(f"{BASE_URL}/chat/", json={
        "message": "Tôi muốn mua giày",
        "session_id": session_id
    })
    data1 = response1.json()
    # Bot có thể hỏi thêm thông tin
    assert 'needs_clarification' in data1 or data1['intent'] == 'product_search'
    
    # Request 2
    response2 = requests.post(f"{BASE_URL}/chat/", json={
        "message": "Nike nam",
        "session_id": session_id
    })
    data2 = response2.json()
    assert data2['intent'] == 'product_search'
    print("✅ Test Case 4.1: PASSED")

def test_metrics():
    """Test Case 6.1: Metrics Tracking"""
    # Gửi một số requests
    for i in range(3):
        requests.post(f"{BASE_URL}/chat/", json={
            "message": f"Test message {i}",
            "session_id": f"test_metrics_{i}"
        })
    
    # Kiểm tra metrics
    response = requests.get(f"{BASE_URL}/metrics/?days=1")
    data = response.json()
    assert data['summary']['total_interactions'] > 0
    print("✅ Test Case 6.1: PASSED")

def test_fallback():
    """Test Case 5.1: Fallback Handling"""
    # Test với message bình thường
    response = requests.post(f"{BASE_URL}/chat/", json={
        "message": "Tìm giày Nike",
        "session_id": "test_fallback"
    })
    data = response.json()
    # Vẫn phải có response (không lỗi)
    assert 'content' in data
    assert len(data['content']) > 0
    print("✅ Test Case 5.1: PASSED")

if __name__ == "__main__":
    print("🚀 Bắt đầu test chatbot...")
    try:
        test_greeting()
        test_product_search()
        test_multi_turn()
        test_metrics()
        test_fallback()
        print("\n✅ Tất cả test cases đã PASSED!")
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
```

---

## 11. Hướng dẫn chạy test

### Bước 1: Start Django server
```bash
cd shoe_store
python manage.py runserver
```

### Bước 2: Chạy test script
```bash
python test_chatbot.py
```

### Bước 3: Test manual bằng Postman/curl

#### Test Greeting:
```bash
curl -X POST http://localhost:8000/api/ai/chat/ \
  -H "Content-Type: application/json" \
  -d '{"message": "Xin chào", "session_id": "test1"}'
```

#### Test Product Search:
```bash
curl -X POST http://localhost:8000/api/ai/chat/ \
  -H "Content-Type: application/json" \
  -d '{"message": "Tìm giày Nike", "session_id": "test2"}'
```

#### Test Metrics:
```bash
curl -X GET http://localhost:8000/api/ai/metrics/?days=7
```

#### Test Analytics:
```bash
curl -X GET http://localhost:8000/api/ai/analytics/?days=30
```

---

## 12. Checklist Test

- [ ] Intent detection hoạt động đúng
- [ ] Sentiment analysis hoạt động đúng
- [ ] Entity extraction hoạt động đúng
- [ ] Multi-turn conversation hoạt động đúng
- [ ] Fallback handling hoạt động khi API lỗi
- [ ] Metrics tracking hoạt động đúng
- [ ] Analytics endpoint hoạt động đúng
- [ ] Product search hoạt động đúng
- [ ] Context memory hoạt động đúng
- [ ] Feedback system hoạt động đúng

---

## Lưu ý

1. Đảm bảo Django server đang chạy trước khi test
2. Đảm bảo database đã có dữ liệu sản phẩm
3. Đảm bảo Gemini API key đã được cấu hình (hoặc test với fallback)
4. Chạy migrations trước khi test metrics:
   ```bash
   python manage.py migrate
   ```

---

## Kết luận

Sau khi chạy tất cả test cases, bạn sẽ có thể đánh giá được:
- Chatbot có hoạt động đúng không
- Các tính năng mới có hoạt động không
- Có bugs nào cần fix không

Good luck! 🚀

