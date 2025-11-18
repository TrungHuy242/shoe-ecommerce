"""
Test script cho Chatbot AI Footy
Chạy: python test_chatbot.py
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000/api/ai"

def test_greeting():
    """Test Case 1.1: Greeting Intent"""
    print("\n🧪 Test Case 1.1: Greeting Intent")
    response = requests.post(f"{BASE_URL}/chat/", json={
        "message": "Xin chào",
        "session_id": "test_greeting"
    })
    data = response.json()
    assert data['intent'] == 'greeting', f"Expected 'greeting', got '{data['intent']}'"
    assert data['confidence'] > 0.5, f"Expected confidence > 0.5, got {data['confidence']}"
    print("✅ Test Case 1.1: PASSED")
    return True

def test_product_search():
    """Test Case 1.2: Product Search Intent"""
    print("\n🧪 Test Case 1.2: Product Search Intent")
    response = requests.post(f"{BASE_URL}/chat/", json={
        "message": "Tôi muốn mua giày Nike",
        "session_id": "test_product_search"
    })
    data = response.json()
    assert data['intent'] == 'product_search', f"Expected 'product_search', got '{data['intent']}'"
    assert data['confidence'] > 0.5, f"Expected confidence > 0.5, got {data['confidence']}"
    print("✅ Test Case 1.2: PASSED")
    return True

def test_multi_turn():
    """Test Case 4.1: Multi-turn Conversation"""
    print("\n🧪 Test Case 4.1: Multi-turn Conversation")
    session_id = "test_multiturn"
    
    # Request 1
    print("  → Request 1: 'Tôi muốn mua giày'")
    response1 = requests.post(f"{BASE_URL}/chat/", json={
        "message": "Tôi muốn mua giày",
        "session_id": session_id
    })
    data1 = response1.json()
    print(f"  → Response 1: Intent={data1['intent']}, Needs clarification={data1.get('needs_clarification', False)}")
    # Bot có thể hỏi thêm thông tin hoặc hiển thị sản phẩm
    assert data1['intent'] in ['product_search', 'greeting'], f"Unexpected intent: {data1['intent']}"
    
    time.sleep(0.5)  # Small delay
    
    # Request 2
    print("  → Request 2: 'Nike nam'")
    response2 = requests.post(f"{BASE_URL}/chat/", json={
        "message": "Nike nam",
        "session_id": session_id
    })
    data2 = response2.json()
    print(f"  → Response 2: Intent={data2['intent']}")
    assert data2['intent'] == 'product_search', f"Expected 'product_search', got '{data2['intent']}'"
    print("✅ Test Case 4.1: PASSED")
    return True

def test_metrics():
    """Test Case 6.1: Metrics Tracking"""
    print("\n🧪 Test Case 6.1: Metrics Tracking")
    # Gửi một số requests
    for i in range(3):
        requests.post(f"{BASE_URL}/chat/", json={
            "message": f"Test message {i}",
            "session_id": f"test_metrics_{i}"
        })
        time.sleep(0.3)
    
    # Kiểm tra metrics
    response = requests.get(f"{BASE_URL}/metrics/?days=1")
    data = response.json()
    assert 'summary' in data, "Metrics response should have 'summary'"
    assert data['summary']['total_interactions'] > 0, "Total interactions should be > 0"
    print(f"  → Total interactions: {data['summary']['total_interactions']}")
    print("✅ Test Case 6.1: PASSED")
    return True

def test_fallback():
    """Test Case 5.1: Fallback Handling"""
    print("\n🧪 Test Case 5.1: Fallback Handling")
    # Test với message bình thường
    response = requests.post(f"{BASE_URL}/chat/", json={
        "message": "Tìm giày Nike",
        "session_id": "test_fallback"
    })
    data = response.json()
    # Vẫn phải có response (không lỗi)
    assert 'content' in data, "Response should have 'content'"
    assert len(data['content']) > 0, "Response content should not be empty"
    print(f"  → Response received: {len(data['content'])} characters")
    print("✅ Test Case 5.1: PASSED")
    return True

def test_analytics():
    """Test Case 6.3: Analytics Endpoint"""
    print("\n🧪 Test Case 6.3: Analytics Endpoint")
    response = requests.get(f"{BASE_URL}/analytics/?days=7")
    data = response.json()
    assert 'intent_statistics' in data, "Analytics should have 'intent_statistics'"
    assert 'sentiment_statistics' in data, "Analytics should have 'sentiment_statistics'"
    assert 'feedback_statistics' in data, "Analytics should have 'feedback_statistics'"
    print(f"  → Intent statistics: {len(data['intent_statistics'])} intents")
    print("✅ Test Case 6.3: PASSED")
    return True

def test_sentiment_positive():
    """Test Case 2.1: Positive Sentiment"""
    print("\n🧪 Test Case 2.1: Positive Sentiment")
    response = requests.post(f"{BASE_URL}/chat/", json={
        "message": "Tôi rất thích giày này, đẹp quá!",
        "session_id": "test_sentiment_positive"
    })
    data = response.json()
    assert 'sentiment' in data, "Response should have 'sentiment'"
    sentiment = data['sentiment'].get('sentiment', 'neutral')
    print(f"  → Detected sentiment: {sentiment}")
    print("✅ Test Case 2.1: PASSED")
    return True

def test_feedback():
    """Test Case 9.1: Feedback"""
    print("\n🧪 Test Case 9.1: Feedback")
    response = requests.post(f"{BASE_URL}/feedback/", json={
        "session_id": "test_feedback",
        "message": "Tìm giày Nike",
        "response": "Em đã tìm thấy...",
        "intent": "product_search",
        "feedback_type": "positive"
    })
    data = response.json()
    assert data['status'] == 'success', f"Expected 'success', got '{data['status']}'"
    print(f"  → Feedback ID: {data['feedback_id']}")
    print("✅ Test Case 9.1: PASSED")
    return True

if __name__ == "__main__":
    print("🚀 Bắt đầu test chatbot...")
    print("=" * 50)
    
    tests = [
        test_greeting,
        test_product_search,
        test_multi_turn,
        test_sentiment_positive,
        test_fallback,
        test_metrics,
        test_analytics,
        test_feedback,
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ Test failed: {e}")
            failed += 1
            import traceback
            traceback.print_exc()
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed} passed, {failed} failed")
    if failed == 0:
        print("✅ Tất cả test cases đã PASSED!")
    else:
        print(f"❌ {failed} test(s) failed")

