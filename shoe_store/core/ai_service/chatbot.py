"""
Footy AI Assistant v2.0 - Intelligent Shopping Assistant for FootFashion
Nâng cấp với Gemini Pro và context-aware product recommendations
"""

import os
import re
import time
from typing import Dict, List, Any, Optional, Tuple
from collections import deque
import google.generativeai as genai
from django.conf import settings
from django.db.models import Q
from django.utils import timezone
from django.core.cache import cache
from difflib import SequenceMatcher
import logging

# Import Django models
from ..models import Product, Brand, Category, Gender, Size, Color, Promotion, Order

logger = logging.getLogger(__name__)

# Configure Gemini API
GEMINI_API_KEY = getattr(settings, 'GEMINI_API_KEY', None) or os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


class ConversationMemory:
    """Quản lý ngữ cảnh hội thoại trong 5 lượt gần nhất"""
    
    def __init__(self, max_size: int = 5):
        self.memories = {}  # user_id -> deque of conversations
        self.max_size = max_size
    
    def add_conversation(self, user_id: str, message: str, response: str, intent: str):
        """Thêm cuộc hội thoại vào memory"""
        if user_id not in self.memories:
            self.memories[user_id] = deque(maxlen=self.max_size)
        
        conversation = {
            'message': message,
            'response': response,
            'intent': intent,
            'timestamp': timezone.now().isoformat()
        }
        self.memories[user_id].append(conversation)
    
    def get_context(self, user_id: str) -> List[Dict]:
        """Lấy ngữ cảnh hội thoại gần nhất"""
        return list(self.memories.get(user_id, []))
    
    def clear_context(self, user_id: str):
        """Xóa ngữ cảnh của user"""
        if user_id in self.memories:
            del self.memories[user_id]


class ProductContextBuilder:
    """Xây dựng context sản phẩm từ database"""
    
    @staticmethod
    def get_products_context(limit: int = 50) -> str:
        """Lấy context sản phẩm từ database"""
        try:
            # Lấy sản phẩm với thông tin đầy đủ
            products = Product.objects.select_related('brand', 'category', 'gender').prefetch_related(
                'sizes', 'colors', 'images'
            ).order_by('-id')[:limit]
            
            if not products.exists():
                return "Hiện tại cửa hàng chưa có sản phẩm nào."
            
            context_lines = []
            for product in products:
                # Tạo mô tả ngắn gọn cho từng sản phẩm
                description_parts = []
                
                # Tên và thương hiệu
                description_parts.append(f"{product.name} - {product.brand.name}")
                
                # Giá
                price_formatted = f"{product.price:,.0f} VND"
                description_parts.append(f"Giá: {price_formatted}")
                
                # Mô tả ngắn
                if product.description:
                    # Lấy 100 ký tự đầu của mô tả
                    short_desc = product.description[:100].strip()
                    if len(product.description) > 100:
                        short_desc += "..."
                    description_parts.append(f"Mô tả: {short_desc}")
                
                # Giới tính
                if product.gender:
                    description_parts.append(f"Giới tính: {product.gender.name}")
                
                # Sizes có sẵn
                sizes = product.sizes.all()[:5]  # Lấy tối đa 5 size
                if sizes:
                    size_values = [str(size.value) for size in sizes]
                    description_parts.append(f"Sizes: {', '.join(size_values)}")
                
                # Màu sắc có sẵn
                colors = product.colors.all()[:3]  # Lấy tối đa 3 màu
                if colors:
                    color_values = [color.value for color in colors]
                    description_parts.append(f"Màu sắc: {', '.join(color_values)}")
                
                # Số lượng bán được
                if product.sales_count > 0:
                    description_parts.append(f"Đã bán: {product.sales_count} đôi")
                
                # Ghép thành một dòng
                product_line = " | ".join(description_parts)
                context_lines.append(f"- {product_line}")
            
            return "\n".join(context_lines)
            
        except Exception as e:
            logger.error(f"Error building product context: {e}")
            return "Không thể tải thông tin sản phẩm."
    
    @staticmethod
    def get_promotions_context() -> str:
        """Lấy context khuyến mãi"""
        try:
            now = timezone.now()
            promotions = Promotion.objects.filter(
                is_active=True,
                start_date__lte=now,
                end_date__gte=now
            ).order_by('-discount_percentage')[:10]
            
            if not promotions.exists():
                return "Hiện tại không có khuyến mãi nào."
            
            context_lines = []
            for promo in promotions:
                end_date_str = promo.end_date.strftime('%d/%m/%Y') if promo.end_date else "Không giới hạn"
                context_lines.append(
                    f"- Mã: {promo.code} | Giảm {promo.discount_percentage}% | Hết hạn: {end_date_str}"
                )
            
            return "\n".join(context_lines)
            
        except Exception as e:
            logger.error(f"Error building promotions context: {e}")
            return "Không thể tải thông tin khuyến mãi."


class AdvancedNLPProcessor:
    """Xử lý ngôn ngữ tự nhiên nâng cao"""
    
    def __init__(self):
        # Từ đồng nghĩa và biến thể - Enhanced for natural language
        self.synonyms = {
            'giày': ['giay', 'giày dép', 'shoe', 'shoes', 'sneaker', 'boot', 'đôi giày', 'cái giày'],
            'dép': ['dep', 'sandals', 'flip-flop', 'slipper', 'đôi dép', 'cái dép'],
            'nike': ['nike', 'nike air', 'air max', 'jordan'],
            'adidas': ['adidas', 'adidas originals', 'ultraboost'],
            'puma': ['puma', 'puma suede'],
            'vans': ['vans', 'vans old skool'],
            'converse': ['converse', 'chuck taylor', 'all star'],
            'nam': ['nam', 'male', 'men', 'đàn ông', 'con trai'],
            'nữ': ['nữ', 'nu', 'female', 'women', 'phụ nữ', 'con gái'],
            'giá': ['gia', 'price', 'cost', 'tiền', 'giá cả'],
            'rẻ': ['re', 'cheap', 'affordable', 'giá rẻ', 'hợp lý'],
            'đắt': ['dat', 'expensive', 'giá cao', 'mắc'],
            'size': ['số', 'kích cỡ', 'size', 'cỡ', 'số giày'],
            'màu': ['mau', 'color', 'colour', 'màu sắc'],
            'đen': ['den', 'black'],
            'trắng': ['trang', 'white'],
            'đỏ': ['do', 'red'],
            'xanh': ['blue', 'green'],
            'tìm': ['tim', 'find', 'search', 'look for', 'tìm kiếm'],
            'mua': ['buy', 'purchase', 'order', 'mua sắm'],
            'xem': ['see', 'view', 'look at', 'nhìn', 'coi'],
            'gợi ý': ['goi y', 'suggest', 'recommend', 'advise', 'đề xuất'],
            'khuyến mãi': ['khuyen mai', 'promotion', 'sale', 'discount', 'ưu đãi'],
            'giảm giá': ['giam gia', 'discount', 'off', 'sale', 'giảm'],
            'đơn hàng': ['don hang', 'order', 'orders', 'đơn'],
            'của tôi': ['cua toi', 'my', 'mine', 'của mình'],
            'gần đây': ['gan day', 'recent', 'lately', 'mới đây'],
            'tốt': ['tot', 'good', 'nice', 'great', 'đẹp', 'hay'],
            'đẹp': ['dep', 'beautiful', 'pretty', 'nice', 'tốt'],
            'hay': ['good', 'great', 'awesome', 'tốt', 'đẹp'],
            'cần': ['need', 'want', 'require', 'muốn'],
            'muốn': ['want', 'need', 'desire', 'cần'],
            'cho tôi': ['cho toi', 'give me', 'show me', 'tôi muốn'],
            'vài': ['some', 'a few', 'một vài', 'một số'],
            'một số': ['some', 'several', 'vài', 'một vài'],
            'hôm nay': ['hom nay', 'today', 'hiện tại', 'bây giờ']
        }
        
        # Từ khóa cảm xúc tiếng Việt - Enhanced for Gen Z
        self.positive_words = [
            'tốt', 'đẹp', 'hay', 'tuyệt', 'ok', 'được', 'thích', 'yêu', 'hài lòng',
            'vui', 'hạnh phúc', 'thú vị', 'thích thú', 'cảm ơn', 'thanks', 'perfect',
            'awesome', 'great', 'excellent', 'amazing', 'wonderful',
            'hot', 'hit', 'ngon', 'chất', 'xịn', 'đỉnh', 'pro', 'cool', 'nice',
            'ổn', 'ok', 'được', 'tuyệt vời', 'xuất sắc', 'tuyệt hảo'
        ]
        self.negative_words = [
            'tệ', 'xấu', 'dở', 'không thích', 'ghét', 'bực', 'tức', 'khó chịu',
            'không hài lòng', 'thất vọng', 'buồn', 'lo lắng', 'không ok', 'bad',
            'terrible', 'awful', 'horrible', 'disappointed', 'angry',
            'đắt', 'mắc', 'giá cao', 'sợ mau dơ', 'không bền', 'không êm',
            'khó chịu', 'không phù hợp', 'không vừa', 'chật', 'rộng',
            'không có', 'hết hàng', 'out of stock', 'sold out'
        ]
        self.urgent_words = [
            'gấp', 'khẩn cấp', 'nhanh', 'ngay', 'lập tức', 'urgent', 'asap',
            'immediately', 'quickly', 'fast', 'hurry'
        ]
        
        # Intent patterns với confidence scores - Improved for natural language
        self.intent_patterns = {
            'greeting': [
                (r'\b(xin chào|chào|hello|hi|hey|xin ch[aà]o)\b', 0.9),
                (r'\b(có ai|ai đó|có người)\b', 0.8),
                (r'\b(start|bắt đầu|begin)\b', 0.7),
                (r'\b(morning|afternoon|evening)\b', 0.6)
            ],
            'product_search': [
                # Natural language patterns
                (r'\b(tôi muốn|tôi cần|cho tôi|tìm|mua|xem|có)\b.*\b(giày|dép|sneaker|boot|sandal)\b', 0.9),
                (r'\b(giày|dép|sneaker|boot|sandal)\b.*\b(nike|adidas|puma|vans|converse)\b', 0.9),
                (r'\b(nike|adidas|puma|vans|converse)\b', 0.8),
                (r'\b(nam|nữ|unisex)\b.*\b(giày|dép)\b', 0.8),
                (r'\b(size|màu|color|giá|price|rẻ|đắt)\b', 0.7),
                (r'\b(dưới|trên|khoảng)\b.*\b(triệu|tr|k|vnd)\b', 0.8),
                (r'\b(giày nào|dép nào|có.*giày|có.*dép)\b', 0.7),
                (r'\b(chạy bộ|thể thao|công sở|đi làm|đi chơi|đi học)\b', 0.6),
                (r'\b(một đôi|vài đôi|vài cái)\b.*\b(giày|dép)\b', 0.6),
                (r'\b(êm chân|nhẹ chân|thoải mái|comfortable)\b', 0.6),
                (r'\b(đẹp|tốt|hay|nice|good)\b.*\b(giày|dép)\b', 0.6)
            ],
            'recommendation': [
                (r'\b(gợi ý|đề xuất|recommend|suggest|nên mua|bán chạy|hot|trending)\b', 0.9),
                (r'\b(giày nào|dép nào|sản phẩm nào)\b.*\b(tốt|đẹp|chất lượng|bền|hay)\b', 0.8),
                (r'\b(top|best|tốt nhất|hay nhất|đẹp nhất)\b', 0.8),
                (r'\b(phù hợp|hợp với)\b', 0.7),
                (r'\b(popular|trending|favorite)\b', 0.7),
                (r'\b(gợi ý cho|suggest for|recommend for)\b', 0.8),
                (r'\b(có gợi ý|có suggest|có recommend)\b', 0.8),
                (r'\b(đi làm|đi học|công sở|thể thao)\b.*\b(gợi ý|suggest)\b', 0.7)
            ],
            'promotion': [
                (r'\b(khuyến mãi|giảm giá|sale|discount|voucher|mã giảm|coupon|ưu đãi)\b', 0.9),
                (r'\b(mã|code|promo)\b', 0.8),
                (r'\b(giảm|discount|off)\b', 0.7),
                (r'\b(deal|offer|special)\b', 0.6),
                (r'\b(xem.*khuyến mãi|xem.*sale|có.*khuyến mãi|có.*sale)\b', 0.8),
                (r'\b(hôm nay|today|hiện tại|now)\b.*\b(khuyến mãi|sale|giảm giá)\b', 0.7),
                (r'\b(có.*khuyến mãi|có.*sale|có.*giảm giá)\b', 0.8),
                (r'\b(khuyến mãi.*hôm nay|sale.*hôm nay|giảm giá.*hôm nay)\b', 0.8)
            ],
            'order_status': [
                (r'\b(đơn hàng|order|giao hàng|vận chuyển|ship|tracking|theo dõi)\b', 0.9),
                (r'\b(trạng thái|tình trạng|status)\b', 0.8),
                (r'\b(khi nào|bao giờ|when)\b.*\b(giao|deliver)\b', 0.8),
                (r'\b(tracking|shipment|delivery)\b', 0.7),
                (r'\b(xem.*đơn hàng|xem.*order|của tôi|của mình)\b', 0.8),
                (r'\b(gần đây|recent|mới nhất|latest)\b.*\b(đơn hàng|order)\b', 0.7)
            ],
            'help': [
                (r'\b(giúp|help|hướng dẫn|hỗ trợ|support|trợ giúp)\b', 0.9),
                (r'\b(làm sao|how|như thế nào)\b', 0.8),
                (r'\b(help|hỗ trợ|guide)\b', 0.7),
                (r'\b(tutorial|instruction|manual)\b', 0.6),
                (r'\b(không biết|confused|bối rối)\b', 0.7)
            ],
            'order_change_request': [
                (r'\b(đổi|thay đổi|change|swap)\b.*\b(size|màu|color|đơn hàng|order)\b', 0.9),
                (r'\b(đặt|order)\b.*\b(hôm qua|yesterday|trước)\b.*\b(đổi|change|thay)\b', 0.9),
                (r'\b(muốn đổi|want to change|thay đổi)\b', 0.8),
                (r'\b(đổi sang|change to|switch to)\b', 0.8),
                (r'\b(size|màu|color)\b.*\b(khác|different|other)\b', 0.7)
            ]
        }
    
    def normalize_text(self, text: str) -> str:
        """Chuẩn hóa text: lowercase, remove accents, expand synonyms"""
        text = text.lower().strip()
        
        # Expand synonyms
        for key, synonyms in self.synonyms.items():
            for synonym in synonyms:
                if synonym in text:
                    text = text.replace(synonym, key)
        
        return text
    
    def fuzzy_match(self, text: str, patterns: List[Tuple[str, float]]) -> Tuple[str, float]:
        """Fuzzy matching với confidence score"""
        best_intent = 'unknown'
        best_score = 0.0
        
        normalized_text = self.normalize_text(text)
        
        for intent, pattern_list in self.intent_patterns.items():
            for pattern, base_confidence in pattern_list:
                if re.search(pattern, normalized_text):
                    # Calculate fuzzy score
                    match = re.search(pattern, normalized_text)
                    if match:
                        matched_text = match.group()
                        similarity = SequenceMatcher(None, matched_text, normalized_text).ratio()
                        final_score = base_confidence * similarity
                        
                        if final_score > best_score:
                            best_score = final_score
                            best_intent = intent
        
        return best_intent, best_score
    
    def extract_entities(self, text: str) -> Dict[str, Any]:
        """Trích xuất entities từ text"""
        entities = {}
        normalized_text = self.normalize_text(text)
        
        # Extract brand
        brands = ['nike', 'adidas', 'puma', 'vans', 'converse']
        for brand in brands:
            if brand in normalized_text:
                entities['brand'] = brand.capitalize()
                break
        
        # Extract gender
        if 'nam' in normalized_text and 'nữ' not in normalized_text:
            entities['gender'] = 'Nam'
        elif 'nữ' in normalized_text or 'nu' in normalized_text:
            entities['gender'] = 'Nữ'
        elif 'unisex' in normalized_text:
            entities['gender'] = 'Unisex'
        
        # Extract size
        size_patterns = [
            r'size\s*(\d{2})',
            r'(\d{2})\s*(size|số)',
            r'số\s*(\d{2})'
        ]
        for pattern in size_patterns:
            match = re.search(pattern, normalized_text)
            if match:
                entities['size'] = match.group(1)
                break
        
        # Extract color
        colors = ['đen', 'trắng', 'đỏ', 'xanh', 'vàng', 'nâu', 'hồng', 'xám', 'cam', 'tím']
        for color in colors:
            if color in normalized_text:
                entities['color'] = color
                break
        
        # Extract price range
        price_patterns = [
            r'dưới\s*(\d+)\s*(triệu|tr|k|vnd)',
            r'(\d+)\s*(triệu|tr|k|vnd)\s*trở xuống',
            r'ít hơn\s*(\d+)\s*(triệu|tr|k|vnd)'
        ]
        for pattern in price_patterns:
            match = re.search(pattern, normalized_text)
            if match:
                amount = int(match.group(1))
                unit = match.group(2)
                if 'triệu' in unit or 'tr' in unit:
                    entities['max_price'] = amount * 1000000
                elif 'k' in unit:
                    entities['max_price'] = amount * 1000
                elif 'vnd' in unit:
                    entities['max_price'] = amount
                break
        
        return entities


class SentimentAnalyzer:
    """Phân tích cảm xúc người dùng nâng cao"""
    
    def __init__(self):
        # Từ khóa cảm xúc tiếng Việt
        self.positive_words = [
            'tốt', 'đẹp', 'hay', 'tuyệt', 'ok', 'được', 'thích', 'yêu', 'hài lòng',
            'vui', 'hạnh phúc', 'thú vị', 'thích thú', 'cảm ơn', 'thanks', 'perfect',
            'awesome', 'great', 'excellent', 'amazing', 'wonderful'
        ]
        self.negative_words = [
            'tệ', 'xấu', 'dở', 'không thích', 'ghét', 'bực', 'tức', 'khó chịu',
            'không hài lòng', 'thất vọng', 'buồn', 'lo lắng', 'không ok', 'bad',
            'terrible', 'awful', 'horrible', 'disappointed', 'angry'
        ]
        self.urgent_words = [
            'gấp', 'khẩn cấp', 'nhanh', 'ngay', 'lập tức', 'urgent', 'asap',
            'immediately', 'quickly', 'fast', 'hurry'
        ]
    
    def analyze_sentiment(self, message: str) -> Dict[str, Any]:
        """Phân tích cảm xúc từ tin nhắn"""
        message_lower = message.lower()
        
        # Đếm từ tích cực và tiêu cực
        positive_count = sum(1 for word in self.positive_words if word in message_lower)
        negative_count = sum(1 for word in self.negative_words if word in message_lower)
        urgent_count = sum(1 for word in self.urgent_words if word in message_lower)
        
        # Xác định sentiment
        if positive_count > negative_count:
            sentiment = 'positive'
        elif negative_count > positive_count:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'
        
        # Xác định urgency
        is_urgent = urgent_count > 0 or '!' in message or '?' in message
        
        return {
            'sentiment': sentiment,
            'confidence': max(positive_count, negative_count) / len(message.split()),
            'is_urgent': is_urgent,
            'positive_words': positive_count,
            'negative_words': negative_count
        }


class FootyAI:
    """AI Shopping Assistant "Footy" cho FootFashion - Advanced Version"""
    
    def __init__(self):
        self.model = None
        self.memory = ConversationMemory()
        self.sentiment_analyzer = SentimentAnalyzer()
        self.nlp_processor = AdvancedNLPProcessor()
        self.context_builder = ProductContextBuilder()
        
        # Initialize Gemini model with proper API key
        self._initialize_gemini_model()
    
    def _initialize_gemini_model(self):
        """Initialize Gemini model with proper API key"""
        try:
            # Load API key directly from .env file
            from pathlib import Path
            from dotenv import load_dotenv
            
            # Get project root directory
            project_root = Path(__file__).resolve().parent.parent.parent.parent
            env_path = project_root / '.env'
            
            # Load .env file
            load_dotenv(env_path)
            
            # Get API key
            api_key = os.getenv('GEMINI_API_KEY')
            
            if api_key:
                genai.configure(api_key=api_key)
                # Sử dụng Gemini 2.5 Pro - Model mới nhất
                self.model = genai.GenerativeModel('gemini-2.5-pro')
                logger.info("Gemini 2.5 Pro model initialized successfully")
            else:
                logger.warning("GEMINI_API_KEY not found, Gemini model not initialized")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini model: {e}")
            # Fallback to older model if 2.5 Pro is not available
            try:
                if api_key:
                    genai.configure(api_key=api_key)
                    self.model = genai.GenerativeModel('gemini-1.5-pro-latest')
                    logger.info("Fallback to Gemini 1.5 Pro Latest model")
            except Exception as fallback_error:
                logger.error(f"Fallback model also failed: {fallback_error}")
    
    def detect_intent(self, message: str, context: List[Dict] = None) -> Tuple[str, float]:
        """
        Nhận diện ý định người dùng với fuzzy matching và confidence score
        Enhanced context awareness for follow-up questions
        Returns: (intent, confidence_score)
        """
        message_lower = message.lower()
        
        # Enhanced context analysis for follow-up questions
        if context and len(context) > 0:
            last_conversation = context[-1]
            last_intent = last_conversation.get('intent', '')
            last_message = last_conversation.get('message', '').lower()
            
            # Follow-up question patterns
            follow_up_patterns = {
                'product_search': [
                    # Brand/type follow-ups
                    (r'\b(còn|có|thêm)\b.*\b(thương hiệu|brand|hãng|nike|adidas|puma|vans|converse)\b', 0.9),
                    (r'\b(thương hiệu|brand|hãng)\b.*\b(khác|khác không|nào khác)\b', 0.9),
                    (r'\b(còn|có)\b.*\b(thương hiệu|brand|hãng)\b.*\b(khác|nào)\b', 0.9),
                    
                    # Size/color follow-ups
                    (r'\b(có|còn)\b.*\b(size|màu|color|màu sắc)\b.*\b(khác|nào|khác không)\b', 0.8),
                    (r'\b(size|màu|color)\b.*\b(khác|nào|khác không)\b', 0.8),
                    
                    # Price follow-ups
                    (r'\b(có|còn)\b.*\b(giá|price|rẻ|đắt)\b.*\b(khác|nào|khác không)\b', 0.8),
                    (r'\b(giá|price)\b.*\b(khác|nào|khác không)\b', 0.8),
                    
                    # General follow-ups
                    (r'\b(còn|có)\b.*\b(đôi|giày|dép)\b.*\b(khác|nào|khác không)\b', 0.7),
                    (r'\b(đôi|giày|dép)\b.*\b(khác|nào|khác không)\b', 0.7),
                    (r'\b(còn|có)\b.*\b(khác|nào|khác không)\b', 0.6),
                    
                    # Disappointment/confusion follow-ups
                    (r'\b(ủa|uhm|hmm|không có|không)\b.*\b(đôi|giày|dép)\b.*\b(phù hợp|tốt|đẹp)\b', 0.8),
                    (r'\b(ủa|uhm|hmm)\b.*\b(không có|không)\b.*\b(đôi|giày|dép)\b', 0.7),
                    (r'\b(không có|không)\b.*\b(đôi|giày|dép)\b.*\b(phù hợp|tốt|đẹp)\b', 0.7),
                ],
                'promotion': [
                    (r'\b(còn|có)\b.*\b(khuyến mãi|sale|discount|mã|voucher)\b.*\b(khác|nào|khác không)\b', 0.8),
                    (r'\b(khuyến mãi|sale|discount)\b.*\b(khác|nào|khác không)\b', 0.8),
                ],
                'order_status': [
                    (r'\b(còn|có)\b.*\b(đơn hàng|order)\b.*\b(khác|nào|khác không)\b', 0.8),
                    (r'\b(đơn hàng|order)\b.*\b(khác|nào|khác không)\b', 0.8),
                ]
            }
            
            # Check for follow-up patterns based on last intent
            if last_intent in follow_up_patterns:
                for pattern, confidence in follow_up_patterns[last_intent]:
                    if re.search(pattern, message_lower):
                        return last_intent, confidence
            
            # Context-based intent inheritance for short messages
            if len(message.strip()) < 30:  # Short follow-up messages
                if last_intent == 'product_search' and any(word in message_lower for word in ['còn', 'có', 'khác', 'nào', 'ủa', 'không', 'size', 'giá', 'màu', 'thương hiệu', 'brand', 'đôi', 'giày']):
                    return 'product_search', 0.8
                elif last_intent == 'promotion' and any(word in message_lower for word in ['còn', 'có', 'khác', 'nào', 'khuyến mãi', 'sale']):
                    return 'promotion', 0.8
                elif last_intent == 'order_status' and any(word in message_lower for word in ['còn', 'có', 'khác', 'nào', 'đơn hàng', 'order']):
                    return 'order_status', 0.8
                elif last_intent == 'order_change_request' and any(word in message_lower for word in ['đổi', 'sang', 'màu', 'size', 'trắng', 'đen', 'xanh', 'đỏ']):
                    return 'order_change_request', 0.8
        
        # Greeting detection - check first for better accuracy (but not for follow-up questions)
        if not context and (any(word in message_lower for word in ['hey', 'hello', 'hi', 'chào', 'xin chào', 'xin chao']) or len(message.strip()) < 3):
            return 'greeting', 0.9
        
        # Sử dụng NLP processor để detect intent
        intent, confidence = self.nlp_processor.fuzzy_match(message, [])
        
        # Nếu confidence thấp, thử các pattern đơn giản và keyword-based detection
        if confidence < 0.4:  # Lower threshold for better coverage
            # Order status detection
            if any(word in message_lower for word in ['đơn hàng', 'order', 'của tôi', 'của mình', 'gần đây', 'xem']):
                if any(word in message_lower for word in ['đơn hàng', 'order']):
                    return 'order_status', 0.7
            
            # Promotion detection
            if any(word in message_lower for word in ['khuyến mãi', 'sale', 'discount', 'giảm giá', 'mã', 'coupon', 'voucher']):
                return 'promotion', 0.7
            
            # Product search detection
            elif any(word in message_lower for word in ['giày', 'dép', 'shoe', 'sneaker', 'boot', 'sandal', 'mua', 'tìm', 'cần']):
                return 'product_search', 0.6
            
            # Recommendation detection
            elif any(word in message_lower for word in ['gợi ý', 'suggest', 'recommend', 'tốt', 'đẹp', 'hay', 'nên']):
                return 'recommendation', 0.6
            
            # Help detection
            elif any(word in message_lower for word in ['giúp', 'help', 'hướng dẫn', 'làm sao', 'như thế nào', 'không biết']):
                return 'help', 0.6
            
            # Order change request detection
            elif any(word in message_lower for word in ['đổi', 'thay đổi', 'change', 'swap', 'muốn đổi']):
                return 'order_change_request', 0.7
        
        return intent, confidence
    
    def generate_intelligent_response(self, message: str, intent: str, context: List[Dict] = None) -> str:
        """Tạo phản hồi thông minh bằng Gemini Pro với context từ database"""
        # Ensure model is initialized
        if not self.model:
            self._initialize_gemini_model()
        
        if not self.model:
            return self._get_fallback_response(intent, context)
        
        try:
            # Xây dựng context từ database (giảm số lượng để tránh quota)
            product_context = self.context_builder.get_products_context(20)
            promotion_context = self.context_builder.get_promotions_context()
            
            # Xây dựng conversation context
            conversation_context = ""
            if context and len(context) > 0:
                recent_messages = context[-3:]  # Lấy 3 tin nhắn gần nhất
                for conv in recent_messages:
                    conversation_context += f"Khách: {conv['message']}\n"
                    conversation_context += f"Footy: {conv['response'][:100]}...\n"
            
            # Tạo prompt thông minh
            prompt = f"""Bạn là Footy – nhân viên tư vấn giày dép tại cửa hàng FootFashion.

Nhiệm vụ của bạn: Trả lời thân thiện, tự nhiên, như con người thật. Sử dụng tiếng Việt tự nhiên với giọng điệu Gen Z nhưng lịch sự.

Dưới đây là danh sách sản phẩm trong cửa hàng:
{product_context}

Khuyến mãi hiện tại:
{promotion_context}

Ngữ cảnh hội thoại gần đây:
{conversation_context}

Khách hàng hỏi: "{message}"

Hướng dẫn trả lời:
- Trả lời ngắn gọn, tự nhiên, có cảm xúc
- Có thể dùng emoji nhẹ: 👟 😊 🔥 ❤️
- Nếu khách hỏi về giá, màu, thương hiệu, hãy trích xuất từ context sản phẩm
- Nếu không tìm thấy sản phẩm phù hợp, hãy nói lịch sự và gợi ý khác
- Nếu khách hỏi so sánh 2 sản phẩm, hãy so sánh nhanh ưu nhược điểm
- Luôn giữ giọng điệu nhiệt tình, thân thiện như nhân viên bán hàng thật

Hãy trả lời:"""

            # Gọi Gemini Pro API
            response = self.model.generate_content(prompt)
            
            if response and response.text:
                return response.text.strip()
            else:
                return self._get_fallback_response(intent, context)
                
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            # Check if it's a quota error
            if "quota" in str(e).lower() or "429" in str(e):
                logger.warning("Gemini API quota exceeded, using fallback response")
            return self._get_fallback_response(intent, context)
    
    def generate_ai_response(self, message: str, intent: str, context: List[Dict] = None, sentiment: Dict = None, confidence: float = 0.0) -> str:
        """Wrapper method để tương thích với code cũ"""
        return self.generate_intelligent_response(message, intent, context)
    
    def _get_fallback_response(self, intent: str, context: List[Dict] = None) -> str:
        """Phản hồi dự phòng khi Gemini API lỗi"""
        responses = {
            'greeting': "Xin chào! Tôi là Footy, trợ lý mua sắm của FootFashion! 👋\n\nTôi có thể giúp bạn:\n🔍 Tìm kiếm giày dép\n💡 Gợi ý sản phẩm\n🎉 Xem khuyến mãi\n📦 Kiểm tra đơn hàng\n\nBạn cần gì nhé?",
            'product_search': "Ok nè! 👋 Footy đây, trợ lý bán hàng của FootFashion! Bạn muốn tìm đôi giày nào phù hợp không? 😊",
            'recommendation': "Chuẩn luôn, để em gợi ý liền nha 👟 Em sẽ tìm những đôi giày phù hợp nhất cho bạn!",
            'promotion': "Em sẽ kiểm tra khuyến mãi hiện tại cho bạn nha! 🎉",
            'order_status': "Em sẽ kiểm tra trạng thái đơn hàng của bạn nha! 📦",
            'order_change_request': "Em sẽ giúp bạn thay đổi đơn hàng! Bạn muốn đổi size, màu sắc hay gì khác? 🔄",
            'help': "Ok nè! Em ở đây để giúp bạn nha 🆘 Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng!",
            'unknown': "Ui em chưa hiểu rõ ý bạn lắm 😅 Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nha! Em sẽ cố gắng hiểu hơn! 😊"
        }
        return responses.get(intent, responses['unknown'])
    
    def get_cached_response(self, message: str, intent: str) -> Optional[str]:
        """Lấy phản hồi từ cache"""
        cache_key = f"footy_response_{hash(message)}_{intent}"
        return cache.get(cache_key)
    
    def cache_response(self, message: str, intent: str, response: str):
        """Lưu phản hồi vào cache"""
        cache_key = f"footy_response_{hash(message)}_{intent}"
        cache.set(cache_key, response, 3600)  # Cache 1 giờ
    
    
    def process_message(self, message: str, user_id: str = None, session_id: str = None) -> Dict[str, Any]:
        """
        Xử lý tin nhắn chính của chatbot với advanced features
        """
        start_time = time.time()
        
        # Validate input
        if not message or not message.strip():
            return {
                "type": "message",
                "content": "Xin lỗi, tôi không hiểu. Bạn có thể hỏi về giày dép, khuyến mãi, hoặc đơn hàng nhé! 😊",
                "intent": "unknown",
                "confidence": 0.0,
                "sentiment": {"sentiment": "neutral", "confidence": 0.0},
                "processing_time": 0.0,
                "timestamp": timezone.now().isoformat()
            }
        
        # Lấy ngữ cảnh hội thoại
        context = self.memory.get_context(user_id or session_id) if (user_id or session_id) else []
        
        # Phân tích cảm xúc
        sentiment = self.sentiment_analyzer.analyze_sentiment(message)
        
        # Nhận diện ý định với confidence score
        intent, confidence = self.detect_intent(message, context)
        
        # Kiểm tra cache trước
        cached_response = self.get_cached_response(message, intent)
        if cached_response:
            ai_response = cached_response
        else:
            # Tạo phản hồi AI với confidence
            ai_response = self.generate_ai_response(message, intent, context, sentiment, confidence)
            # Lưu vào cache
            self.cache_response(message, intent, ai_response)
        
        # Tính thời gian xử lý
        processing_time = (time.time() - start_time) * 1000  # ms
        
        # Chuẩn bị response data
        response_data = {
            "type": "message",
            "content": ai_response,
            "intent": intent,
            "confidence": confidence,
            "sentiment": sentiment,
            "processing_time": processing_time,
            "timestamp": timezone.now().isoformat()
        }
        
        # Lưu vào memory
        if user_id or session_id:
            self.memory.add_conversation(user_id or session_id, message, ai_response, intent)
        
        return response_data


# Global instance
footy_ai = FootyAI()
