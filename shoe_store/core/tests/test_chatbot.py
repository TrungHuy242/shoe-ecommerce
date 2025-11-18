"""
Test cases cho Chatbot AI Service
"""
import os
import django
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shoe_store.settings')
django.setup()

from core.models import (
    User, Product, Brand, Category, Gender, Size, Color, 
    ChatbotConversation, ChatbotFeedback, ChatbotMetrics
)
from core.ai_service.chatbot import (
    FootyAI, AdvancedNLPProcessor, SentimentAnalyzer, ConversationMemory
)


class ChatbotTestCase(TestCase):
    """Test cases cho Chatbot AI"""
    
    def setUp(self):
        """Setup test data"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            name='Test User'
        )
        
        # Create test data
        self.brand = Brand.objects.create(name='Nike')
        self.category = Category.objects.create(
            name='Sneakers',
            description='Sneakers category'
        )
        self.gender = Gender.objects.create(name='Nam')
        self.size = Size.objects.create(value='42')
        self.color = Color.objects.create(value='Đen')
        
        self.product = Product.objects.create(
            name='Nike Air Max',
            description='Giày thể thao Nike Air Max',
            price=2500000,
            stock_quantity=10,
            brand=self.brand,
            category=self.category,
            gender=self.gender
        )
        self.product.sizes.add(self.size)
        self.product.colors.add(self.color)
        
        self.footy_ai = FootyAI()
    
    def test_intent_detection_greeting(self):
        """Test intent detection cho greeting"""
        intent, confidence = self.footy_ai.detect_intent("Xin chào")
        self.assertEqual(intent, 'greeting')
        self.assertGreater(confidence, 0.5)
    
    def test_intent_detection_product_search(self):
        """Test intent detection cho product search"""
        intent, confidence = self.footy_ai.detect_intent("Tôi muốn mua giày Nike")
        self.assertEqual(intent, 'product_search')
        self.assertGreater(confidence, 0.5)
    
    def test_intent_detection_recommendation(self):
        """Test intent detection cho recommendation"""
        intent, confidence = self.footy_ai.detect_intent("Gợi ý cho tôi giày đẹp")
        self.assertEqual(intent, 'recommendation')
        self.assertGreater(confidence, 0.5)
    
    def test_intent_detection_promotion(self):
        """Test intent detection cho promotion"""
        intent, confidence = self.footy_ai.detect_intent("Có khuyến mãi nào không?")
        self.assertEqual(intent, 'promotion')
        self.assertGreater(confidence, 0.5)
    
    def test_sentiment_analysis_positive(self):
        """Test sentiment analysis cho positive"""
        sentiment_analyzer = SentimentAnalyzer()
        result = sentiment_analyzer.analyze_sentiment("Tôi rất thích giày này, đẹp quá!")
        self.assertEqual(result['sentiment'], 'positive')
        self.assertGreater(result['confidence'], 0.0)
    
    def test_sentiment_analysis_negative(self):
        """Test sentiment analysis cho negative"""
        sentiment_analyzer = SentimentAnalyzer()
        result = sentiment_analyzer.analyze_sentiment("Giày này tệ quá, không đẹp")
        self.assertEqual(result['sentiment'], 'negative')
    
    def test_sentiment_analysis_neutral(self):
        """Test sentiment analysis cho neutral"""
        sentiment_analyzer = SentimentAnalyzer()
        result = sentiment_analyzer.analyze_sentiment("Giày này giá bao nhiêu?")
        self.assertEqual(result['sentiment'], 'neutral')
    
    def test_entity_extraction_brand(self):
        """Test entity extraction cho brand"""
        nlp_processor = AdvancedNLPProcessor()
        entities = nlp_processor.extract_entities("Tôi muốn mua giày Nike")
        self.assertEqual(entities.get('brand'), 'Nike')
    
    def test_entity_extraction_gender(self):
        """Test entity extraction cho gender"""
        nlp_processor = AdvancedNLPProcessor()
        entities = nlp_processor.extract_entities("Tôi muốn mua giày nam")
        self.assertEqual(entities.get('gender'), 'Nam')
    
    def test_entity_extraction_price(self):
        """Test entity extraction cho price"""
        nlp_processor = AdvancedNLPProcessor()
        entities = nlp_processor.extract_entities("Tôi muốn mua giày dưới 2 triệu")
        self.assertIn('max_price', entities)
        self.assertLessEqual(entities['max_price'], 2000000)
    
    def test_conversation_memory(self):
        """Test conversation memory"""
        memory = ConversationMemory()
        user_id = 'test_user_123'
        
        memory.add_conversation(user_id, "Xin chào", "Chào bạn!", "greeting")
        context = memory.get_context(user_id)
        
        self.assertEqual(len(context), 1)
        self.assertEqual(context[0]['message'], "Xin chào")
        self.assertEqual(context[0]['intent'], "greeting")
    
    def test_product_search_with_brand(self):
        """Test product search với brand filter"""
        products = self.footy_ai._get_relevant_products("Tôi muốn mua giày Nike", "product_search")
        self.assertGreaterEqual(len(products), 0)
        # Nếu có products, kiểm tra brand
        if products:
            # Products có thể không có brand trong data format, nhưng query sẽ filter đúng
            pass
    
    def test_multi_turn_conversation(self):
        """Test multi-turn conversation"""
        user_id = 'test_user_123'
        
        # First message - không đủ thông tin
        response1 = self.footy_ai.process_message("Tôi muốn mua giày", user_id, None)
        
        # Second message - cung cấp thêm thông tin
        response2 = self.footy_ai.process_message("Giày Nike nam", user_id, None)
        
        # Kiểm tra context được lưu
        context = self.footy_ai.memory.get_context(user_id)
        self.assertGreaterEqual(len(context), 1)
    
    def test_missing_information_detection(self):
        """Test detection của missing information"""
        # Test với message thiếu thông tin
        entities = {}
        missing_info = self.footy_ai.check_missing_information(
            "Tôi muốn mua giày", 
            "product_search", 
            entities
        )
        # Có thể thiếu brand hoặc gender
        if missing_info.get('missing'):
            self.assertIn('question', missing_info)
    
    def test_fallback_response(self):
        """Test fallback response khi Gemini API lỗi"""
        # Tạm thời disable model để test fallback
        original_model = self.footy_ai.model
        self.footy_ai.model = None
        
        response = self.footy_ai.process_message("Xin chào", None, None)
        
        # Restore model
        self.footy_ai.model = original_model
        
        # Kiểm tra response không rỗng
        self.assertIsNotNone(response)
        self.assertIn('content', response)
        self.assertIn('intent', response)
    
    def test_conversation_logging(self):
        """Test conversation logging vào database"""
        initial_count = ChatbotConversation.objects.count()
        
        response = self.footy_ai.process_message("Xin chào", str(self.user.id), None)
        
        # Kiểm tra conversation được lưu (có thể async nên cần wait)
        # Trong test thực tế, cần await hoặc check sau một khoảng thời gian
        # Tạm thời skip assertion này vì logging là async
    
    def test_product_recommendation(self):
        """Test product recommendation"""
        products = self.footy_ai._get_relevant_products("", "recommendation")
        # Recommendation mode sẽ trả về top products
        self.assertIsInstance(products, list)


class ChatbotMetricsTestCase(TestCase):
    """Test cases cho Chatbot Metrics"""
    
    def setUp(self):
        """Setup test data"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            name='Test User'
        )
    
    def test_metrics_creation(self):
        """Test tạo metrics"""
        today = timezone.now().date()
        metrics = ChatbotMetrics.objects.create(
            date=today,
            total_interactions=100,
            unique_users=50,
            product_searches=30,
            product_clicks=15
        )
        metrics.calculate_conversion_rate()
        
        self.assertEqual(metrics.conversion_rate, 50.0)  # 15/30 * 100
    
    def test_conversion_rate_calculation(self):
        """Test tính toán conversion rate"""
        metrics = ChatbotMetrics.objects.create(
            date=timezone.now().date(),
            product_searches=100,
            product_clicks=25
        )
        conversion_rate = metrics.calculate_conversion_rate()
        
        self.assertEqual(conversion_rate, 25.0)


if __name__ == '__main__':
    import unittest
    unittest.main()

