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
    """Quản lý ngữ cảnh hội thoại nâng cao với User Preferences Tracking"""
    
    def __init__(self, max_size: int = 5):
        self.memories = {}  # user_id -> deque of conversations
        self.max_size = max_size
        self.pending_questions = {}  # user_id -> dict với thông tin câu hỏi đang chờ
        self.user_preferences = {}  # user_id -> dict của preferences (brand, gender, price_range, etc.)
    
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
        if user_id in self.pending_questions:
            del self.pending_questions[user_id]
    
    def set_pending_question(self, user_id: str, question_type: str, context: Dict):
        """Lưu pending question cho multi-turn conversation"""
        self.pending_questions[user_id] = {
            'question_type': question_type,
            'context': context,
            'timestamp': timezone.now().isoformat()
        }
    
    def get_pending_question(self, user_id: str) -> Optional[Dict]:
        """Lấy pending question nếu có"""
        return self.pending_questions.get(user_id)
    
    def clear_pending_question(self, user_id: str):
        """Xóa pending question sau khi đã có đủ thông tin"""
        if user_id in self.pending_questions:
            del self.pending_questions[user_id]
    
    def update_user_preferences(self, user_id: str, entities: Dict):
        """Cập nhật preferences của user dựa trên entities được trích xuất"""
        if user_id not in self.user_preferences:
            self.user_preferences[user_id] = {
                'favorite_brands': [],
                'favorite_gender': None,
                'price_range': {'min': None, 'max': None},
                'favorite_colors': [],
                'favorite_categories': [],
                'search_count': 0,
                'last_updated': timezone.now().isoformat()
            }
        
        prefs = self.user_preferences[user_id]
        prefs['search_count'] += 1
        prefs['last_updated'] = timezone.now().isoformat()
        
        # Update favorite brands
        if 'brand' in entities and entities['brand'] not in prefs['favorite_brands']:
            prefs['favorite_brands'].append(entities['brand'])
            if len(prefs['favorite_brands']) > 5:  # Keep top 5
                prefs['favorite_brands'] = prefs['favorite_brands'][-5:]
        
        # Update favorite gender (most recent)
        if 'gender' in entities:
            prefs['favorite_gender'] = entities['gender']
        
        # Update price range
        if 'max_price' in entities:
            if prefs['price_range']['max'] is None or entities['max_price'] > prefs['price_range']['max']:
                prefs['price_range']['max'] = entities['max_price']
        if 'min_price' in entities:
            if prefs['price_range']['min'] is None or entities['min_price'] < prefs['price_range']['min']:
                prefs['price_range']['min'] = entities['min_price']
        
        # Update favorite colors
        if 'color' in entities and entities['color'] not in prefs['favorite_colors']:
            prefs['favorite_colors'].append(entities['color'])
            if len(prefs['favorite_colors']) > 3:  # Keep top 3
                prefs['favorite_colors'] = prefs['favorite_colors'][-3:]
        
        # Update favorite categories
        if 'category' in entities and entities['category'] not in prefs['favorite_categories']:
            prefs['favorite_categories'].append(entities['category'])
            if len(prefs['favorite_categories']) > 3:  # Keep top 3
                prefs['favorite_categories'] = prefs['favorite_categories'][-3:]
    
    def get_user_preferences(self, user_id: str) -> Dict:
        """Lấy preferences của user"""
        return self.user_preferences.get(user_id, {})


class ProductContextBuilder:
    """Xây dựng context sản phẩm từ database"""
    
    @staticmethod
    def get_products_context(limit: int = 15) -> str:
        """Lấy context sản phẩm từ database - Optimized for speed"""
        try:
            # Lấy sản phẩm với thông tin đầy đủ - Giảm limit để tăng tốc độ
            products = Product.objects.select_related('brand', 'category', 'gender').prefetch_related(
                'sizes', 'colors', 'images'
            ).order_by('-sales_count', '-id')[:limit]  # Ưu tiên sản phẩm bán chạy
            
            if not products.exists():
                return "Hiện tại cửa hàng chưa có sản phẩm nào."
            
            context_lines = []
            for product in products:
                # Tạo mô tả ngắn gọn cho từng sản phẩm - Tối ưu cho tốc độ
                description_parts = []
                
                # Tên và thương hiệu
                description_parts.append(f"{product.name} - {product.brand.name}")
                
                # Giá
                price_formatted = f"{product.price:,.0f} VND"
                description_parts.append(f"Giá: {price_formatted}")
                
                # Mô tả ngắn - Giảm độ dài để tăng tốc độ
                if product.description:
                    short_desc = product.description[:80].strip()  # Giảm từ 100 xuống 80
                    if len(product.description) > 80:
                        short_desc += "..."
                    description_parts.append(f"Mô tả: {short_desc}")
                
                # Giới tính
                if product.gender:
                    description_parts.append(f"Giới tính: {product.gender.name}")
                
                # Sizes có sẵn - Giảm số lượng
                sizes = product.sizes.all()[:3]  # Giảm từ 5 xuống 3
                if sizes:
                    size_values = [str(size.value) for size in sizes]
                    description_parts.append(f"Sizes: {', '.join(size_values)}")
                
                # Màu sắc có sẵn - Giảm số lượng
                colors = product.colors.all()[:2]  # Giảm từ 3 xuống 2
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
        """Lấy context khuyến mãi - Optimized for speed"""
        try:
            now = timezone.now()
            promotions = Promotion.objects.filter(
                is_active=True,
                start_date__lte=now,
                end_date__gte=now
            ).order_by('-discount_percentage')[:5]  # Giảm từ 10 xuống 5
            
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
    """Xử lý ngôn ngữ tự nhiên nâng cao với Fuzzy Matching"""
    
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
        
        # Spell correction dictionary (common typos)
        self.spell_corrections = {
            'giay': 'giày',
            'dep': 'dép',
            'mau': 'màu',
            'gia': 'giá',
            're': 'rẻ',
            'dat': 'đắt',
            'tim': 'tìm',
            'den': 'đen',
            'trang': 'trắng',
            'do': 'đỏ',
            'tot': 'tốt',
            'nhe': 'nhẹ',
            'em': 'êm',
            'co': 'có',
            'ko': 'không',
            'k': 'không'
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
    
    def correct_spelling(self, text: str) -> str:
        """Sửa lỗi chính tả phổ biến trong tiếng Việt"""
        words = text.split()
        corrected_words = []
        
        for word in words:
            # Check if word needs correction
            corrected_word = self.spell_corrections.get(word.lower(), word)
            corrected_words.append(corrected_word)
        
        return ' '.join(corrected_words)
    
    def normalize_text(self, text: str) -> str:
        """Chuẩn hóa text: lowercase, spell correction, expand synonyms"""
        text = text.lower().strip()
        
        # Spell correction first
        text = self.correct_spelling(text)
        
        # Expand synonyms
        for key, synonyms in self.synonyms.items():
            for synonym in synonyms:
                if synonym in text:
                    text = text.replace(synonym, key)
        
        return text
    
    def fuzzy_match(self, message: str, intents: List[str]) -> Tuple[str, float]:
        """
        Fuzzy matching để nhận diện intent với độ tin cậy cao
        Sử dụng pattern matching và sequence similarity
        Returns: (intent, confidence_score)
        """
        message_normalized = self.normalize_text(message)
        best_intent = 'unknown'
        best_confidence = 0.0
        
        # Try to match against all intent patterns
        for intent, patterns in self.intent_patterns.items():
            for pattern, base_confidence in patterns:
                if re.search(pattern, message_normalized):
                    # Pattern matched, calculate final confidence
                    # Base confidence từ pattern + boost từ keyword density
                    keyword_boost = self._calculate_keyword_density(message_normalized, intent)
                    final_confidence = min(base_confidence + keyword_boost, 1.0)
                    
                    if final_confidence > best_confidence:
                        best_confidence = final_confidence
                        best_intent = intent
        
        # If no pattern matched, try keyword-based matching
        if best_confidence < 0.3:
            intent_keywords = self._get_intent_keywords()
            for intent, keywords in intent_keywords.items():
                match_count = sum(1 for keyword in keywords if keyword in message_normalized)
                if match_count > 0:
                    keyword_confidence = min(match_count * 0.2, 0.6)  # Max 0.6 for keyword matching
                    if keyword_confidence > best_confidence:
                        best_confidence = keyword_confidence
                        best_intent = intent
        
        return best_intent, best_confidence
    
    def _calculate_keyword_density(self, text: str, intent: str) -> float:
        """Tính độ mật độ keyword cho intent"""
        intent_keywords = {
            'product_search': ['giày', 'dép', 'tìm', 'mua', 'nike', 'adidas', 'puma', 'vans', 'converse'],
            'recommendation': ['gợi ý', 'đề xuất', 'recommend', 'suggest', 'tốt', 'đẹp', 'hay'],
            'promotion': ['khuyến mãi', 'giảm giá', 'sale', 'discount', 'voucher', 'mã'],
            'order_status': ['đơn hàng', 'order', 'giao hàng', 'vận chuyển', 'tracking'],
            'greeting': ['chào', 'hello', 'hi', 'hey'],
            'help': ['giúp', 'help', 'hỗ trợ', 'hướng dẫn']
        }
        
        keywords = intent_keywords.get(intent, [])
        if not keywords:
            return 0.0
        
        match_count = sum(1 for keyword in keywords if keyword in text)
        return min(match_count * 0.1, 0.3)  # Max boost 0.3
    
    def _get_intent_keywords(self) -> Dict[str, List[str]]:
        """Lấy danh sách keywords cho mỗi intent"""
        return {
            'greeting': ['chào', 'hello', 'hi', 'hey', 'xin chào'],
            'product_search': ['giày', 'dép', 'tìm', 'mua', 'xem', 'nike', 'adidas', 'puma', 'vans', 'converse', 'shoe', 'sneaker'],
            'recommendation': ['gợi ý', 'đề xuất', 'recommend', 'suggest', 'nên', 'tốt', 'đẹp', 'hay', 'top'],
            'promotion': ['khuyến mãi', 'giảm giá', 'sale', 'discount', 'voucher', 'mã', 'coupon'],
            'order_status': ['đơn hàng', 'order', 'giao hàng', 'vận chuyển', 'ship', 'tracking'],
            'help': ['giúp', 'help', 'hỗ trợ', 'hướng dẫn', 'làm sao'],
            'order_change_request': ['đổi', 'thay đổi', 'change', 'swap', 'muốn đổi']
        }
    
    def extract_entities(self, text: str) -> Dict[str, Any]:
        """Trích xuất entities từ text với độ chính xác cao"""
        entities = {}
        normalized_text = self.normalize_text(text)
        original_text = text.lower()
        
        # Extract brand với nhiều variations
        brands = {
            'nike': ['nike', 'nike air', 'air max', 'jordan', 'air force'],
            'adidas': ['adidas', 'adidas originals', 'ultraboost', 'yeezy', 'stan smith'],
            'puma': ['puma', 'puma suede', 'puma rs'],
            'vans': ['vans', 'vans old skool', 'vans sk8'],
            'converse': ['converse', 'chuck taylor', 'all star', 'converse all star']
        }
        
        for brand_key, brand_variations in brands.items():
            for variation in brand_variations:
                if variation in original_text:
                    entities['brand'] = brand_key.capitalize()
                    break
            if 'brand' in entities:
                break
        
        # Extract gender với nhiều variations
        if any(word in normalized_text for word in ['nam', 'male', 'men', 'đàn ông', 'con trai']):
            if 'nữ' not in normalized_text:  # Make sure not "nam nữ"
                entities['gender'] = 'Nam'
        elif any(word in normalized_text for word in ['nữ', 'nu', 'female', 'women', 'phụ nữ', 'con gái']):
            entities['gender'] = 'Nữ'
        elif 'unisex' in normalized_text or 'nam nữ' in normalized_text:
            entities['gender'] = 'Unisex'
        
        # Extract size với nhiều formats
        size_patterns = [
            r'size\s*(\d{2})',
            r'(\d{2})\s*size',
            r'số\s*(\d{2})',
            r'(\d{2})\s*số',
            r'cỡ\s*(\d{2})',
            r'kích\s*cỡ\s*(\d{2})'
        ]
        for pattern in size_patterns:
            match = re.search(pattern, normalized_text)
            if match:
                size_value = match.group(1)
                if 35 <= int(size_value) <= 48:  # Valid shoe size range
                    entities['size'] = size_value
                    break
        
        # Extract color với nhiều variations
        colors_mapping = {
            'đen': ['đen', 'den', 'black', 'đen nhám'],
            'trắng': ['trắng', 'trang', 'white', 'trắng tinh'],
            'đỏ': ['đỏ', 'do', 'red', 'đỏ tươi'],
            'xanh': ['xanh', 'blue', 'navy', 'xanh dương', 'xanh lá'],
            'vàng': ['vàng', 'vang', 'yellow', 'vàng cam'],
            'nâu': ['nâu', 'nau', 'brown', 'be'],
            'hồng': ['hồng', 'hong', 'pink', 'hồng nhạt'],
            'xám': ['xám', 'xam', 'gray', 'grey', 'xám nhạt'],
            'cam': ['cam', 'orange'],
            'tím': ['tím', 'tim', 'purple', 'violet']
        }
        
        for color_key, color_variations in colors_mapping.items():
            for variation in color_variations:
                if variation in normalized_text:
                    entities['color'] = color_key
                    break
            if 'color' in entities:
                break
        
        # Extract price range với nhiều formats
        price_patterns = [
            (r'dưới\s*(\d+)\s*(triệu|tr|k|vnd)', 'max'),
            (r'(\d+)\s*(triệu|tr|k|vnd)\s*trở\s*xuống', 'max'),
            (r'ít\s*hơn\s*(\d+)\s*(triệu|tr|k|vnd)', 'max'),
            (r'không\s*quá\s*(\d+)\s*(triệu|tr|k|vnd)', 'max'),
            (r'trên\s*(\d+)\s*(triệu|tr|k|vnd)', 'min'),
            (r'(\d+)\s*(triệu|tr|k|vnd)\s*trở\s*lên', 'min'),
            (r'từ\s*(\d+)\s*(triệu|tr|k|vnd)', 'min'),
            (r'khoảng\s*(\d+)\s*(triệu|tr|k|vnd)', 'range')
        ]
        
        for pattern, price_type in price_patterns:
            match = re.search(pattern, normalized_text)
            if match:
                amount = int(match.group(1))
                unit = match.group(2)
                
                # Convert to VND
                if 'triệu' in unit or 'tr' in unit:
                    price_value = amount * 1000000
                elif 'k' in unit:
                    price_value = amount * 1000
                elif 'vnd' in unit:
                    price_value = amount
                else:
                    continue
                
                # Set price entity
                if price_type == 'max':
                    entities['max_price'] = price_value
                elif price_type == 'min':
                    entities['min_price'] = price_value
                elif price_type == 'range':
                    # For "khoảng X triệu", set both min and max
                    entities['min_price'] = price_value * 0.8
                    entities['max_price'] = price_value * 1.2
                break
        
        # Extract category/type
        categories = {
            'sneaker': ['sneaker', 'giày thể thao', 'giày chạy bộ', 'running'],
            'boot': ['boot', 'giày cao cổ', 'giày bốt'],
            'sandal': ['sandal', 'dép', 'giày sandal', 'dép quai'],
            'casual': ['giày casual', 'giày thường ngày', 'giày đi chơi'],
            'formal': ['giày tây', 'giày công sở', 'giày lịch sự']
        }
        
        for category_key, category_variations in categories.items():
            for variation in category_variations:
                if variation in normalized_text:
                    entities['category'] = category_key
                    break
            if 'category' in entities:
                break
        
        # Extract purpose/use case
        purposes = {
            'running': ['chạy bộ', 'running', 'tập gym', 'thể thao'],
            'casual': ['đi chơi', 'dạo phố', 'casual', 'thường ngày'],
            'work': ['đi làm', 'công sở', 'văn phòng', 'work'],
            'formal': ['dự tiệc', 'formal', 'lịch sự', 'sang trọng']
        }
        
        for purpose_key, purpose_variations in purposes.items():
            for variation in purpose_variations:
                if variation in normalized_text:
                    entities['purpose'] = purpose_key
                    break
            if 'purpose' in entities:
                break
        
        return entities


class SentimentAnalyzer:
    """Phân tích cảm xúc người dùng nâng cao với Negation Handling và Intensity Detection"""
    
    def __init__(self):
        # Từ khóa cảm xúc tiếng Việt
        self.positive_words = [
            'tốt', 'đẹp', 'hay', 'tuyệt', 'ok', 'được', 'thích', 'yêu', 'hài lòng',
            'vui', 'hạnh phúc', 'thú vị', 'thích thú', 'cảm ơn', 'thanks', 'perfect',
            'awesome', 'great', 'excellent', 'amazing', 'wonderful', 'chất', 'xịn', 
            'đỉnh', 'pro', 'cool', 'nice', 'ổn', 'xuất sắc', 'tuyệt vời'
        ]
        self.negative_words = [
            'tệ', 'xấu', 'dở', 'không thích', 'ghét', 'bực', 'tức', 'khó chịu',
            'không hài lòng', 'thất vọng', 'buồn', 'lo lắng', 'không ok', 'bad',
            'terrible', 'awful', 'horrible', 'disappointed', 'angry', 'kém', 'tệ hại',
            'không tốt', 'không đẹp', 'không hay'
        ]
        self.urgent_words = [
            'gấp', 'khẩn cấp', 'nhanh', 'ngay', 'lập tức', 'urgent', 'asap',
            'immediately', 'quickly', 'fast', 'hurry'
        ]
        # Từ phủ định
        self.negation_words = [
            'không', 'chẳng', 'chưa', 'đừng', 'không phải', 'chả', 'ko', 'k',
            'never', 'not', 'no', 'none'
        ]
        # Từ tăng cường (intensifiers)
        self.intensifiers = {
            'rất': 2.0, 'cực': 2.5, 'quá': 2.0, 'siêu': 2.5, 'hơi': 0.5,
            'khá': 1.5, 'very': 2.0, 'too': 2.0, 'extremely': 2.5, 'quite': 1.5,
            'cực kỳ': 2.5, 'vô cùng': 2.5, 'hơi bị': 1.5, 'lắm': 2.0
        }
    
    def analyze_sentiment(self, message: str) -> Dict[str, Any]:
        """Phân tích cảm xúc từ tin nhắn với negation handling và intensity"""
        message_lower = message.lower()
        words = message_lower.split()
        
        score = 0
        positive_count = 0
        negative_count = 0
        
        # Advanced sentiment analysis với context
        for i, word in enumerate(words):
            # Check negation trước từ hiện tại (trong window 3 từ)
            is_negated = False
            intensity_multiplier = 1.0
            
            # Check negation trong 3 từ trước đó
            for j in range(max(0, i-3), i):
                if words[j] in self.negation_words:
                    is_negated = True
                    break
            
            # Check intensifier trong 2 từ trước đó
            for j in range(max(0, i-2), i):
                if words[j] in self.intensifiers:
                    intensity_multiplier = self.intensifiers[words[j]]
                    break
            
            # Tính sentiment score
            if word in self.positive_words:
                if is_negated:
                    score -= 1 * intensity_multiplier
                    negative_count += 1
                else:
                    score += 1 * intensity_multiplier
                    positive_count += 1
            elif word in self.negative_words:
                if is_negated:
                    score += 1 * intensity_multiplier
                    positive_count += 1
                else:
                    score -= 1 * intensity_multiplier
                    negative_count += 1
        
        # Xác định sentiment
        if score > 0.5:
            sentiment = 'positive'
        elif score < -0.5:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'
        
        # Calculate confidence based on score strength
        confidence = min(abs(score) / max(len(words), 1), 1.0)
        
        # Xác định urgency
        urgent_count = sum(1 for word in self.urgent_words if word in message_lower)
        is_urgent = urgent_count > 0 or message.count('!') >= 2 or '???' in message
        
        return {
            'sentiment': sentiment,
            'confidence': confidence,
            'is_urgent': is_urgent,
            'positive_words': positive_count,
            'negative_words': negative_count,
            'sentiment_score': score  # Raw score for debugging
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
        """Initialize Gemini model with proper API key - Optimized for speed"""
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
                # Sử dụng Gemini 2.5 Flash - Model nhanh nhất và mạnh nhất hiện tại
                self.model = genai.GenerativeModel('gemini-2.5-flash')
                logger.info("Gemini 2.5 Flash model initialized successfully - Optimized for speed")
            else:
                logger.warning("GEMINI_API_KEY not found, Gemini model not initialized")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini 2.5 Flash model: {e}")
            # Fallback to Pro model if Flash is not available
            try:
                if api_key:
                    genai.configure(api_key=api_key)
                    self.model = genai.GenerativeModel('gemini-2.5-pro')
                    logger.info("Fallback to Gemini 2.5 Pro model")
            except Exception as fallback_error:
                logger.error(f"Fallback to Pro model also failed: {fallback_error}")
                # Final fallback to 1.5 Pro
            try:
                if api_key:
                    genai.configure(api_key=api_key)
                    self.model = genai.GenerativeModel('gemini-1.5-pro-latest')
                    logger.info("Fallback to Gemini 1.5 Pro Latest model")
            except Exception as fallback_error:
                logger.error(f"Fallback model also failed: {fallback_error}")
    
    def check_missing_information(self, message: str, intent: str, entities: Dict) -> Optional[Dict]:
        """
        Kiểm tra thông tin còn thiếu và trả về câu hỏi cần hỏi lại
        QUAN TRỌNG: Chỉ hỏi lại 1 lần khi thực sự thiếu thông tin QUAN TRỌNG
        Returns: Dict với 'missing': True/False, 'question': str nếu thiếu
        """
        message_lower = message.lower()
        
        # Nếu đang chờ trả lời từ multi-turn conversation
        # Logic này sẽ được xử lý trong process_message
        
        # Kiểm tra thiếu thông tin cho product_search
        if intent == 'product_search':
            # KHÔNG hỏi lại nếu có ít nhất 1 entity (brand hoặc gender hoặc price)
            # Chỉ hỏi khi hoàn toàn không có thông tin gì
            if not entities or len(entities) == 0:
                # Hoàn toàn không có thông tin → Hỏi 1 lần duy nhất
                return {
                    'missing': True,
                    'missing_fields': ['any'],
                    'question': "Bạn muốn tìm giày thương hiệu nào, hay để em gợi ý mấy đôi bán chạy nhất? 😊",
                    'question_type': 'product_search_details'
                }
            
            # Có ít nhất 1 entity → KHÔNG hỏi lại, tìm luôn
            # Ví dụ: "tìm giày Nike" → Tìm tất cả Nike (nam/nữ/unisex)
            # Ví dụ: "giày nam" → Tìm tất cả giày nam các hãng
        
        # Kiểm tra thiếu thông tin cho order_status
        if intent == 'order_status':
            # Nếu user chưa đăng nhập và không có order ID
            if 'order_id' not in entities and 'order' not in message_lower:
                return {
                    'missing': True,
                    'missing_fields': ['order_id'],
                    'question': "Bạn cho em mã đơn hàng để kiểm tra nhé! Hoặc đăng nhập để em tự check luôn 📦",
                    'question_type': 'order_status_details'
                }
        
        return {'missing': False}
    
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
                    
                    # Image/view follow-ups - IMPORTANT: Show products when asking for images
                    (r'\b(cho|cho tôi|cho mình|cho em)\b.*\b(xem|thấy|nhìn|coi)\b.*\b(hình|ảnh|hinh anh|image|photo|picture)\b', 0.95),
                    (r'\b(xem|thấy|nhìn|coi)\b.*\b(hình|ảnh|hinh anh|image|photo|picture)\b', 0.9),
                    (r'\b(có|còn)\b.*\b(hình|ảnh|hinh anh|image|photo|picture)\b', 0.85),
                    (r'\b(hình|ảnh|hinh anh|image|photo|picture)\b.*\b(của|đôi|giày|dép|sản phẩm)\b', 0.9),
                    
                    # Link follow-ups - IMPORTANT: Show products when asking for links
                    (r'\b(cho|cho tôi|cho mình|cho em|gửi|gui)\b.*\b(link|liên kết|lien ket|đường link|duong link|url)\b', 0.95),
                    (r'\b(có|co)\b.*\b(link|liên kết|lien ket|đường link|duong link|url)\b', 0.9),
                    (r'\b(link|liên kết|lien ket|đường link|duong link|url)\b.*\b(sản phẩm|san pham|đôi|giày|dép)\b', 0.9),
                    (r'\b(gửi|gui|cho)\b.*\b(link|liên kết|lien ket)\b.*\b(xem|mình|tôi)\b', 0.95),
                    
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
                if last_intent == 'product_search' and any(word in message_lower for word in ['còn', 'có', 'khác', 'nào', 'ủa', 'không', 'size', 'giá', 'màu', 'thương hiệu', 'brand', 'đôi', 'giày', 'hình', 'ảnh', 'xem', 'cho xem', 'hình ảnh', 'hinh anh', 'link', 'liên kết', 'lien ket', 'gửi link', 'gui link']):
                    return 'product_search', 0.8
                elif last_intent == 'promotion' and any(word in message_lower for word in ['còn', 'có', 'khác', 'nào', 'khuyến mãi', 'sale']):
                    return 'promotion', 0.8
                elif last_intent == 'order_status' and any(word in message_lower for word in ['còn', 'có', 'khác', 'nào', 'đơn hàng', 'order']):
                    return 'order_status', 0.8
                elif last_intent == 'order_change_request' and any(word in message_lower for word in ['đổi', 'sang', 'màu', 'size', 'trắng', 'đen', 'xanh', 'đỏ']):
                    return 'order_change_request', 0.8
        
        # Greeting detection - check FIRST before everything else
        greeting_keywords = ['hey', 'hello', 'hi', 'chào', 'xin chào', 'xin chao', 'chao', 'chao ban', 'chào bạn']
        if any(keyword in message_lower for keyword in greeting_keywords) or len(message.strip()) < 3:
            # Only return greeting if not in the middle of a conversation flow
            if not context or len(context) == 0:
                return 'greeting', 0.95
            # If context exists but last intent was greeting, still return greeting
            elif context and len(context) > 0:
                last_intent = context[-1].get('intent', '')
                if last_intent == 'greeting' or any(keyword in message_lower for keyword in greeting_keywords):
                    return 'greeting', 0.9
        
        # Sử dụng NLP processor để detect intent
        intent, confidence = self.nlp_processor.fuzzy_match(message, [])
        
        # Nếu confidence thấp, thử các pattern đơn giản và keyword-based detection
        if confidence < 0.4:  # Lower threshold for better coverage
            # Greeting detection (fallback)
            greeting_keywords = ['hey', 'hello', 'hi', 'chào', 'xin chào', 'xin chao', 'chao', 'chao ban', 'chào bạn']
            if any(keyword in message_lower for keyword in greeting_keywords):
                return 'greeting', 0.8
            
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
    
    def generate_intelligent_response(self, message: str, intent: str, context: List[Dict] = None, user_id: str = None, entities: Dict = None) -> Dict[str, Any]:
        """Tạo phản hồi thông minh bằng Gemini Flash với context từ database - Optimized for speed"""
        # Ensure model is initialized
        if not self.model:
            self._initialize_gemini_model()
        
        # Extract entities if not provided
        if not entities:
            entities = self.nlp_processor.extract_entities(message)
        
        # Check for pending questions (multi-turn conversation)
        if user_id:
            pending_question = self.memory.get_pending_question(user_id)
            if pending_question:
                # User đang trả lời câu hỏi từ multi-turn conversation
                question_type = pending_question.get('question_type')
                if question_type == 'product_search_details':
                    # Extract entities từ câu trả lời
                    new_entities = self.nlp_processor.extract_entities(message)
                    
                    # Nếu đã có đủ thông tin, clear pending question và tiếp tục
                    if 'brand' in new_entities or 'gender' in new_entities:
                        self.memory.clear_pending_question(user_id)
                        # Combine với context trước đó
                        prev_context = pending_question.get('context', {})
                        entities = {**prev_context, **new_entities}
                        # Update message để tìm kiếm tốt hơn
                        message = f"{pending_question.get('context', {}).get('original_message', '')} {message}"
                    else:
                        # Vẫn thiếu thông tin, hỏi lại
                        return {
                            'content': "Em vẫn chưa rõ lắm 😅 Bạn có thể nói rõ hơn về thương hiệu hoặc giới tính được không ạ? Ví dụ: 'Nike nam' hoặc 'Adidas nữ'",
                            'products': [],
                            'promotions': [],
                            'needs_clarification': True
                        }
        
        # ✅ BƯỚC 1: TẮT RULE CLARIFY - Để Gemini tự xử lý thông minh
        # Gemini Flash mạnh hơn code rule 100 lần
        # KHÔNG check missing info nữa, để LLM tự suy luận và quyết định
        
        # DISABLED: check_missing_information()
        # missing_info = self.check_missing_information(message, intent, entities)
        # → Để Gemini tự xử lý dựa vào context và prompt
        
        if not self.model:
            return self._get_enhanced_fallback_response(intent, context, message, entities)
        
        try:
            # Xây dựng context từ database - Tối ưu cho tốc độ
            product_context = self.context_builder.get_products_context(10)  # Giảm từ 20 xuống 10
            promotion_context = self.context_builder.get_promotions_context()
            
            # Xây dựng conversation context - Tối ưu
            conversation_context = ""
            if context and len(context) > 0:
                recent_messages = context[-2:]  # Giảm từ 3 xuống 2 tin nhắn gần nhất
                for conv in recent_messages:
                    conversation_context += f"Khách: {conv['message']}\n"
                    conversation_context += f"Footy: {conv['response'][:80]}...\n"  # Giảm từ 100 xuống 80
            
            # Get user preferences if available
            user_prefs = self.memory.get_user_preferences(user_id) if user_id else {}
            
            # Build user preferences context
            prefs_context = ""
            if user_prefs and user_prefs.get('search_count', 0) > 0:
                prefs_lines = []
                if user_prefs.get('favorite_brands'):
                    prefs_lines.append(f"- Thương hiệu yêu thích: {', '.join(user_prefs['favorite_brands'])}")
                if user_prefs.get('favorite_gender'):
                    prefs_lines.append(f"- Giới tính: {user_prefs['favorite_gender']}")
                if user_prefs.get('favorite_colors'):
                    prefs_lines.append(f"- Màu sắc yêu thích: {', '.join(user_prefs['favorite_colors'])}")
                if prefs_lines:
                    prefs_context = "\n\nSở thích khách hàng (từ lịch sử):\n" + "\n".join(prefs_lines)
            
            # Build entities context
            entities_context = ""
            if entities:
                entity_lines = []
                if 'brand' in entities:
                    entity_lines.append(f"Thương hiệu: {entities['brand']}")
                if 'gender' in entities:
                    entity_lines.append(f"Giới tính: {entities['gender']}")
                if 'max_price' in entities:
                    entity_lines.append(f"Giá tối đa: {entities['max_price']:,} VND")
                if 'min_price' in entities:
                    entity_lines.append(f"Giá tối thiểu: {entities['min_price']:,} VND")
                if 'color' in entities:
                    entity_lines.append(f"Màu sắc: {entities['color']}")
                if 'category' in entities:
                    entity_lines.append(f"Loại: {entities['category']}")
                if 'purpose' in entities:
                    entity_lines.append(f"Mục đích: {entities['purpose']}")
                if entity_lines:
                    entities_context = "\n\nThông tin khách yêu cầu:\n" + ", ".join(entity_lines)
            
            # Prompt ChatGPT v3 - FOCUS ON LINKS CONTROL
            # Note: Backend sẽ quyết định khi nào thêm links dựa vào intent
            prompt = f"""You are Footy, an AI shopping assistant for FootFashion.

Personality: friendly, Gen Z, tự nhiên, không máy móc, không lặp.

📦 THÔNG TIN SẢN PHẨM:
{product_context}

🎉 KHUYẾN MÃI:
{promotion_context}

💬 HỘI THOẠI TRƯỚC:
{conversation_context}{prefs_context}{entities_context}

❓ USER: "{message}"

🎯 RULES FOR LINKS (TUÂN THỦ NGHIÊM NGẶT):

1. **Only provide product links when EXPLICITLY requested**
   - User phải nói rõ: "Cho tôi link X", "Gợi ý 2 sản phẩm", "Link Air Max 270", "Tìm giày Nike", "Show giày"
   - Nếu user CHỈ hỏi về tính năng, size, màu, giá → KHÔNG show link
   - VD: "Giày này chống nước không?" → Trả lời về chống nước, KHÔNG kèm link

2. **Exact requested products only**
   - User hỏi 1 sản phẩm → trả 1 link đúng sản phẩm
   - User hỏi 2 sản phẩm → trả 2 link đúng, KHÔNG thêm
   - KHÔNG show products mặc định hay gợi ý lung tung

3. **Alternatives**
   - Nếu sản phẩm không có → chỉ gợi ý 1-2 sản phẩm gần nhất, KHÔNG nhiều hơn

4. **Maintain context**
   - User hỏi về "nó", "đôi này" → hiểu là sản phẩm cuối cùng
   - KHÔNG tự động show link khi hỏi follow-up về tính năng

5. **No spam**
   - KHÔNG show link sau mỗi câu trả lời
   - Chỉ show khi user explicitly yêu cầu hoặc alternatives cần gợi ý

📝 SẢN PHẨM MẪU:
- Nike Air Max 270: 2.58tr, size 36-38, Đen/Xanh, chạy nhẹ, ko chống nước
- Nike Air Jordan: 12.3tr, size 38-39, Xanh/Nâu, da tổng hợp, hạn chế nước
- Adidas Ultraboost: 3.9tr, size 39-43, Trắng/Đen, chạy êm, chống nước nhẹ
- Puma Velocity: 2.3tr, size 40-44, Xám, chạy tốt, thoáng khí

💡 Style: Ngắn, rõ, Gen Z, ít emoji (max 1-2), không reset conversation.

🚫 CRITICAL - KHI KHÔNG ĐƯỢC SHOW LINKS:
- User hỏi: "Giày này chống nước không?" → Trả lời về chống nước, KHÔNG show link
- User hỏi: "Có size 40 không?" → Trả lời về size, KHÔNG show link
- User hỏi: "Có màu đen không?" → Trả lời về màu, KHÔNG show link
- User hỏi: "Giá bao nhiêu?" → Trả lời giá, KHÔNG show link

✅ CHỈ SHOW LINKS KHI:
- User nói: "Tìm giày", "Gợi ý", "Cho tôi link", "Show sản phẩm", "Xem giày"
- Sản phẩm không có → gợi ý alternatives (1-2 sản phẩm)

Trả lời (ngắn, tự nhiên, KHÔNG spam links):"""

            # Gọi Gemini Flash API với timeout ngắn
            response = self.model.generate_content(prompt)
            
            if response and response.text:
                ai_response = response.text.strip()
            else:
                return self._get_enhanced_fallback_response(intent, context, message, entities)
            
            # ✅ FIX 1, 3: Check nếu nên show product links + Extract số lượng user yêu cầu
            message_lower = message.lower()
            should_show_links = self._should_show_product_links(message, intent, context)
            requested_count = self._extract_requested_count(message)  # ✅ FIX 3: Detect số lượng user yêu cầu
            
            # Legacy checks (keep for compatibility)
            image_related_keywords = ['hình ảnh', 'hinh anh', 'ảnh', 'anh', 'image', 'photo', 'picture', 'hình', 'hin']
            is_asking_about_images = any(keyword in message_lower for keyword in image_related_keywords)
            
            link_related_keywords = ['link', 'liên kết', 'lien ket', 'gửi link', 'gui link', 'cho link', 'có link', 'co link', 'link sản phẩm', 'link san pham', 'đường link', 'duong link', 'url']
            is_asking_for_links = any(keyword in message_lower for keyword in link_related_keywords)
            
            # OVERRIDE: Nếu hỏi về images/links → considered as explicit request
            if is_asking_about_images or is_asking_for_links:
                should_show_links = True
                # Nếu user hỏi "cho tôi link" → có thể là 1 sản phẩm
                if 'link' in message_lower and not requested_count:
                    requested_count = 1
            
            # Check if we should ask for confirmation before showing products
            should_ask_confirmation = self._should_ask_product_confirmation(message, intent, context)
            
            # Check if user is asking about images/links in context of products
            # If last intent was product_search/recommendation, show products even when asking for images/links
            has_product_context = False
            if context and len(context) > 0:
                last_intent = context[-1].get('intent', '')
                if last_intent in ['product_search', 'recommendation']:
                    has_product_context = True
            
            # ✅ NEW LOGIC: Chỉ show links khi should_show_links = True
            # Nếu user chỉ hỏi về features (size, màu, chống nước) → KHÔNG show links
            if not should_show_links:
                return {
                    'content': ai_response,
                    'products': [],  # Không show products khi user chỉ hỏi về features
                    'promotions': []
                }
            
            # If asking for links (with or without product context), ALWAYS show products directly - NO confirmation
            if is_asking_for_links:
                # User is asking for links of products mentioned before - show immediately
                # QUAN TRỌNG: Ưu tiên sử dụng last message để giữ lại filters (brand, gender, etc.)
                products_data = []
                if context and len(context) > 0:
                    last_message = context[-1].get('message', '')
                    if last_message:
                        # Ưu tiên 1: Sử dụng last message trước (chứa brand filter)
                        products_data = self._get_relevant_products(last_message, 'product_search')
                        logger.info(f"Getting products from last message (for links): {last_message[:50]}... Found {len(products_data)} products")
                        
                        # Nếu không tìm được, thử combine với current message
                        if not products_data:
                            search_message = f"{last_message} {message}"
                            products_data = self._get_relevant_products(search_message, 'product_search')
                            logger.info(f"Trying combined message for links. Found {len(products_data)} products")
                
                # Nếu vẫn không có, thử tìm trong toàn bộ context (tìm brand trong các message trước)
                if not products_data and context and len(context) > 0:
                    # Tìm brand trong các message trước đó
                    for conv in reversed(context[-3:]):  # Xem 3 message gần nhất
                        prev_message = conv.get('message', '').lower()
                        brands = ['nike', 'adidas', 'puma', 'vans', 'converse']
                        for brand in brands:
                            if brand in prev_message:
                                products_data = self._get_relevant_products(conv.get('message', ''), 'product_search')
                                if products_data:
                                    logger.info(f"Found products from previous context message with brand '{brand}' for links. Found {len(products_data)} products")
                                    break
                        if products_data:
                            break
                
                # Nếu có product context nhưng không tìm được products, không fallback (giữ lại filters)
                # Nếu KHÔNG có product context, fallback về top products
                if not products_data:
                    if has_product_context:
                        logger.warning(f"No products found for link request with product context. Last message: {context[-1].get('message', '')[:50] if context else 'N/A'}")
                    else:
                        # Không có product context, lấy top products
                        products_data = self._get_relevant_products('', 'recommendation')
                        logger.info(f"No product context for link request, using top products. Found {len(products_data)} products")
                
                # Thêm links vào content (CHỈ khi should_show_links = True)
                if products_data and should_show_links:
                    links_text = self._format_products_as_links(products_data)
                    ai_response = ai_response + links_text
                elif not products_data and should_show_links:
                    # Nếu user yêu cầu xem nhưng không có products
                    ai_response = ai_response + "\n\nHiện không tìm thấy sản phẩm phù hợp. Bạn thử từ khóa khác nha"
                
                promotions_data = self._get_relevant_promotions(context[-1].get('message', '') if context else message, 'product_search')
                return {
                    'content': ai_response,
                    'products': [],  # Không trả về products array nữa, chỉ trả về links trong content
                    'promotions': promotions_data
                }
            
            # ✅ SIMPLIFIED LOGIC: Show products based on should_show_links flag
            # Chỉ show khi user EXPLICITLY request
            if should_show_links:
                # Get products based on intent
                search_message = message
                if (is_asking_about_images or is_asking_for_links) and context and len(context) > 0:
                    last_message = context[-1].get('message', '')
                    if last_message:
                        search_message = f"{last_message} {message}"
                
                # ✅ FIX 3, 4: Truyền requested_count và context vào
                products_data = self._get_relevant_products(
                    search_message, 
                    intent if intent in ['product_search', 'recommendation'] else 'product_search',
                    requested_count=requested_count,  # ✅ FIX 3: Tuân thủ số lượng
                    context=context  # ✅ FIX 4: Context-aware
                )
                
                # Thêm links vào content
                if products_data:
                    links_text = self._format_products_as_links(products_data)
                    ai_response = ai_response + links_text
                    logger.info(f"✅ FIX 1, 3: Showing {len(products_data)} products (user requested: {requested_count})")
                elif is_asking_for_links:
                    ai_response = ai_response + "\n\nHiện không tìm thấy sản phẩm phù hợp. Bạn thử từ khóa khác nha"
                
                promotions_data = self._get_relevant_promotions(search_message, intent if intent in ['product_search', 'recommendation'] else 'product_search')
                
                return {
                    'content': ai_response,
                    'products': [],
                    'promotions': promotions_data
                }
            else:
                # ✅ FIX 1: User chỉ hỏi về features, KHÔNG show products
                logger.info(f"✅ FIX 1: Not showing links (feature question only)")
                return {
                    'content': ai_response,
                    'products': [],
                    'promotions': []
                }
                
        except Exception as e:
            logger.error(f"Gemini Flash API error: {e}")
            error_str = str(e).lower()
            
            # Improved error handling với các loại lỗi khác nhau
            if "quota" in error_str or "429" in error_str or "rate limit" in error_str:
                logger.warning("Gemini API quota exceeded, using enhanced fallback response")
                return self._get_enhanced_fallback_response(intent, context, message, entities)
            elif "api key" in error_str or "authentication" in error_str:
                logger.error("Gemini API key invalid, using fallback response")
                return self._get_enhanced_fallback_response(intent, context, message, entities)
            elif "timeout" in error_str or "timed out" in error_str:
                logger.warning("Gemini API timeout, using fallback response")
                return self._get_enhanced_fallback_response(intent, context, message, entities)
            else:
                logger.error(f"Unknown Gemini API error: {e}")
                return self._get_enhanced_fallback_response(intent, context, message, entities)
    
    def generate_ai_response(self, message: str, intent: str, context: List[Dict] = None, sentiment: Dict = None, confidence: float = 0.0) -> str:
        """Wrapper method để tương thích với code cũ"""
        response_data = self.generate_intelligent_response(message, intent, context)
        if isinstance(response_data, dict):
            return response_data.get('content', '')
        return response_data
    
    def _should_show_product_links(self, message: str, intent: str, context: List[Dict] = None) -> bool:
        """
        Xác định có nên show product links không
        CHỈ show khi user EXPLICITLY yêu cầu - STRICT MODE
        Returns True nếu cần show, False nếu chỉ trả lời text
        """
        message_lower = message.lower()
        
        # Keywords yêu cầu xem sản phẩm EXPLICITLY (phải có)
        explicit_request_keywords = [
            'tìm', 'tim', 'find', 'search',
            'gợi ý', 'goi y', 'suggest', 'recommend',
            'cho tôi', 'cho toi', 'show', 'xem',
            'link', 'sản phẩm', 'san pham',
            'đề xuất', 'de xuat', 'muốn xem', 'muon xem',
            'có giày', 'co giay', 'có sản phẩm', 'co san pham'
        ]
        
        # Keywords hỏi về FEATURES (KHÔNG cần show products)
        feature_question_keywords = [
            'chống nước', 'chong nuoc', 'waterproof',
            'độ bền', 'do ben', 'durability', 'bền',
            'fit chân', 'fit chan', 'ôm chân', 'om chan',
            'size', 'cỡ', 'co', 'kích cỡ', 'kich co',
            'màu', 'mau', 'color', 'màu sắc',
            'giá', 'gia', 'price', 'bao nhiêu',
            'chất liệu', 'chat lieu', 'material',
            'nặng', 'nang', 'weight', 'nhẹ', 'nhe',
            'còn', 'con', 'có không', 'co khong'
        ]
        
        # Context pronouns (cần check xem có context không)
        context_pronouns = ['nó', 'no', 'đôi này', 'doi nay', 'giày này', 'giay nay', 'cái này', 'cai nay']
        
        # ✅ FIX 1: Nếu là follow-up question về features → KHÔNG show
        if any(keyword in message_lower for keyword in feature_question_keywords):
            # Nếu KHÔNG có explicit request keyword → không show products
            if not any(keyword in message_lower for keyword in explicit_request_keywords):
                return False
        
        # ✅ FIX 4: Nếu là context pronoun ("nó", "đôi này") mà KHÔNG có explicit request → KHÔNG show
        if any(pronoun in message_lower for pronoun in context_pronouns):
            # Chỉ show nếu có explicit request keyword
            if not any(keyword in message_lower for keyword in explicit_request_keywords):
                return False
        
        # Check nếu user EXPLICITLY request products
        if any(keyword in message_lower for keyword in explicit_request_keywords):
            return True
        
        # Check nếu intent là product_search hoặc recommendation → show (nhưng chỉ khi có explicit request)
        if intent in ['product_search', 'recommendation']:
            # Chỉ show nếu có explicit request keyword
            if any(keyword in message_lower for keyword in explicit_request_keywords):
                return True
        
        # Default: KHÔNG show (STRICT MODE)
        return False
    
    def _extract_requested_count(self, message: str) -> Optional[int]:
        """
        Trích xuất số lượng sản phẩm user yêu cầu
        Returns: số lượng (1, 2, 3...) hoặc None nếu không rõ
        """
        message_lower = message.lower()
        
        # Patterns để detect số lượng
        patterns = [
            r'(?:cho tôi|cho toi|gợi ý|goi y|đề xuất|de xuat|show|xem)\s*(?:cho tôi|cho toi)?\s*(\d+)\s*(?:sản phẩm|san pham|đôi|doi|giày|giay|link)',
            r'(\d+)\s*(?:sản phẩm|san pham|đôi|doi|giày|giay|link)',
            r'(?:một|mot|1)\s*(?:sản phẩm|san pham|đôi|doi|giày|giay)',
            r'(?:hai|2)\s*(?:sản phẩm|san pham|đôi|doi|giày|giay)',
            r'(?:ba|3)\s*(?:sản phẩm|san pham|đôi|doi|giày|giay)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, message_lower)
            if match:
                if match.group(1):
                    return int(match.group(1))
                # Check text numbers
                if 'một' in message_lower or 'mot' in message_lower:
                    return 1
                elif 'hai' in message_lower:
                    return 2
                elif 'ba' in message_lower:
                    return 3
        
        # Check explicit single product request
        single_product_keywords = ['một đôi', 'mot doi', '1 đôi', '1 doi', 'link', 'sản phẩm này', 'san pham nay']
        if any(keyword in message_lower for keyword in single_product_keywords):
            # Nếu có tên sản phẩm cụ thể → 1
            product_names = ['air max', 'jordan', 'ultraboost', 'velocity', 'superstar', 'nmd']
            if any(name in message_lower for name in product_names):
                return 1
        
        return None
    
    def _should_ask_product_confirmation(self, message: str, intent: str, context: List[Dict] = None) -> bool:
        """
        Xác định có nên hỏi user trước khi show products không
        Returns True nếu cần hỏi, False nếu show products ngay
        """
        message_lower = message.lower()
        
        # Case 0: User đang yêu cầu xem hình ảnh/link → KHÔNG hỏi xác nhận, show ngay
        image_keywords = ['hình ảnh', 'hinh anh', 'ảnh', 'anh', 'image', 'photo', 'picture', 'hình', 'hin', 'xem hình', 'cho xem']
        link_keywords = ['link', 'liên kết', 'lien ket', 'gửi link', 'gui link', 'cho link', 'có link', 'co link', 'link sản phẩm', 'link san pham', 'đường link', 'duong link', 'url']
        if any(keyword in message_lower for keyword in image_keywords) or any(keyword in message_lower for keyword in link_keywords):
            # Nếu có product context hoặc intent là product_search/recommendation → show ngay
            if context and len(context) > 0:
                last_intent = context[-1].get('intent', '')
                if last_intent in ['product_search', 'recommendation']:
                    return False  # Show products immediately
            if intent in ['product_search', 'recommendation']:
                return False  # Show products immediately
        
        # Case 1: User đã confirm (nói 'có', 'xem', 'show', etc.)
        confirmation_keywords = [
            'có', 'xem', 'show', 'cho xem', 'muốn xem', 'muốn', 
            'được', 'ok', 'oke', 'yes', 'yeah', 'yep', 'ừ', 'uh', 
            'đồng ý', 'cho tôi xem', 'hiển thị', 'list'
        ]
        if any(keyword in message_lower for keyword in confirmation_keywords):
            # Check context: nếu câu trước đó là pending products → show ngay
            if context and len(context) > 0:
                last_conv = context[-1]
                if last_conv.get('response', '').find('Bạn có muốn xem') != -1:
                    return False  # User confirmed, show products
        
        # Case 2: User từ chối (nói 'không', 'không muốn', etc.)
        rejection_keywords = ['không', 'ko', 'k', 'no', 'chưa', 'thôi', 'không cần']
        if any(keyword == message_lower or keyword + ' ' in message_lower for keyword in rejection_keywords):
            return False  # Don't show products, user rejected
        
        # Case 3: First time product search/recommendation → Ask first
        if intent in ['product_search', 'recommendation']:
            # Check if this is a follow-up or first request
            if context and len(context) > 0:
                last_intent = context[-1].get('intent', '')
                # If last message was asking for confirmation, don't ask again
                if last_intent in ['product_search', 'recommendation']:
                    return False  # Already in product flow, show directly
            return True  # First request, ask confirmation
        
        # Case 4: Other intents (greeting, help, etc.) → Don't show products
        return False
    
    def _get_relevant_products(self, message: str, intent: str, user_id: str = None, requested_count: Optional[int] = None, context: List[Dict] = None) -> List[Dict]:
        """
        Lấy sản phẩm liên quan với Advanced Entity-Based Filtering
        ✅ FIX 3: Tuân thủ số lượng user yêu cầu (1:1, 2:2)
        ✅ FIX 4: Context-aware cho "nó", "đôi này"
        """
        try:
            message_lower = message.lower()
            
            # ✅ FIX 4: Context mapping cho "nó", "đôi này"
            context_pronouns = ['nó', 'no', 'đôi này', 'doi nay', 'giày này', 'giay nay', 'cái này', 'cai nay']
            is_context_pronoun = any(pronoun in message_lower for pronoun in context_pronouns)
            
            # Nếu là context pronoun, tìm sản phẩm từ conversation trước
            if is_context_pronoun and context and len(context) > 0:
                # Tìm sản phẩm cuối cùng được nhắc đến
                for conv in reversed(context[-5:]):  # Xem 5 message gần nhất
                    last_message = conv.get('message', '')
                    if last_message:
                        # Extract entities từ last message
                        last_entities = self.nlp_processor.extract_entities(last_message)
                        if last_entities:
                            # Sử dụng entities từ last message để tìm sản phẩm
                            message = last_message  # Override message với last message
                            logger.info(f"✅ FIX 4: Context pronoun detected, using last message: {last_message[:50]}")
                            break
            
            # Lấy sản phẩm dựa trên intent
            if intent in ['product_search', 'recommendation']:
                # Extract entities from message
                entities = self.nlp_processor.extract_entities(message)
                
                # Tìm kiếm sản phẩm dựa trên entities với scoring
                from django.db.models import Case, When, Value, IntegerField
                
                # Build filters using entities - use AND logic
                filters = Q()  # Start with empty Q for AND conditions
                score_cases = []
                has_filters = False
                
                # Brand filter (MUST match if specified)
                if 'brand' in entities:
                    brand = entities['brand']
                    filters &= Q(brand__name__icontains=brand)  # AND condition
                    score_cases.append(When(brand__name__icontains=brand, then=Value(10)))
                    has_filters = True
                    logger.info(f"🎯 Brand filter: {brand}")
                
                # Gender filter (MUST match if specified)
                if 'gender' in entities:
                    gender = entities['gender']
                    filters &= Q(gender__name__icontains=gender)  # AND condition
                    score_cases.append(When(gender__name__icontains=gender, then=Value(8)))
                    has_filters = True
                    logger.info(f"🎯 Gender filter: {gender}")
                
                # Category filter (MUST match if specified)
                if 'category' in entities:
                    category = entities['category']
                    filters &= Q(category__name__icontains=category)  # AND condition
                    score_cases.append(When(category__name__icontains=category, then=Value(7)))
                    has_filters = True
                    logger.info(f"🎯 Category filter: {category}")
                
                # Price filter (MUST match if specified)
                if 'max_price' in entities:
                    max_price = entities['max_price']
                    filters &= Q(price__lte=max_price)  # AND condition
                    score_cases.append(When(price__lte=max_price, then=Value(5)))
                    has_filters = True
                    logger.info(f"🎯 Max price filter: {max_price}")
                
                if 'min_price' in entities:
                    min_price = entities['min_price']
                    filters &= Q(price__gte=min_price)  # AND condition
                    score_cases.append(When(price__gte=min_price, then=Value(5)))
                    has_filters = True
                    logger.info(f"🎯 Min price filter: {min_price}")
                
                # Size filter (optional, adds bonus score if match)
                if 'size' in entities:
                    size = entities['size']
                    score_cases.append(When(sizes__value=size, then=Value(3)))
                    logger.info(f"🎯 Size preference: {size}")
                
                # Color filter (optional, adds bonus score if match)
                if 'color' in entities:
                    color = entities['color']
                    score_cases.append(When(colors__value__icontains=color, then=Value(3)))
                    logger.info(f"🎯 Color preference: {color}")
                
                # Quality keywords scoring (bonus points)
                if any(word in message_lower for word in ['tốt', 'chất lượng', 'đẹp', 'hay', 'bán chạy']):
                    score_cases.append(When(sales_count__gt=10, then=Value(6)))
                
                # Purpose-based scoring
                if 'purpose' in entities:
                    purpose = entities['purpose']
                    if purpose == 'running':
                        score_cases.append(When(category__name__icontains='sneaker', then=Value(4)))
                    elif purpose == 'casual':
                        score_cases.append(When(category__name__icontains='casual', then=Value(4)))
                    logger.info(f"🎯 Purpose: {purpose}")
                
                # Query products with AND logic
                if has_filters:
                    products = Product.objects.select_related('brand', 'category', 'gender').prefetch_related(
                        'sizes', 'colors', 'images'
                    ).filter(filters).distinct()  # All conditions must match
                    
                    logger.info(f"📊 Querying products with {len([k for k in entities.keys()])} filters. Total found: {products.count()}")
                    
                    # ✅ FIX 3: Tuân thủ số lượng user yêu cầu
                    # Default: 3 sản phẩm, nhưng nếu user yêu cầu 1 hoặc 2 → chỉ show đúng số đó
                    limit = requested_count if requested_count and requested_count <= 3 else 3
                    
                    # Apply scoring
                    if score_cases:
                        products = products.annotate(
                            relevance_score=Case(
                                *score_cases,
                                default=Value(0),
                                output_field=IntegerField()
                            )
                        ).order_by('-relevance_score', '-sales_count', '-id')[:limit]
                    else:
                        products = products.order_by('-sales_count', '-id')[:limit]
                    
                    logger.info(f"✅ FIX 3: User requested {requested_count}, showing {limit} products")
                else:
                    # Recommendation mode: lấy top trending products
                    logger.info(f"📊 No specific filters, using recommendation mode (top sellers)")
                    limit = requested_count if requested_count and requested_count <= 3 else 3
                    products = Product.objects.select_related('brand', 'category', 'gender').prefetch_related(
                        'sizes', 'colors', 'images'
                    ).order_by('-sales_count', '-id')[:limit]
                
                # Convert to frontend format
                # ✅ FIX 2: Đảm bảo link thật từ database (không fake)
                products_data = []
                for product in products:
                    # ✅ FIX 2: Link thật từ database - format: /product/{id}
                    # Đảm bảo product.id tồn tại và hợp lệ
                    if product.id:
                        product_link = f"/product/{product.id}"  # Link thật, click được
                    else:
                        logger.warning(f"⚠️ Product {product.name} không có ID, skip")
                        continue
                    
                    products_data.append({
                        'id': product.id,
                        'name': product.name,
                        'brand': product.brand.name if product.brand else 'Unknown',
                        'price': float(product.price),
                        'image': None,  # No images in response
                        'link': product_link,  # ✅ Link thật từ database
                        'description': product.description[:100] if product.description else '',
                        'sales_count': product.sales_count
                    })
                
                # Log để debug
                if products_data:
                    logger.info(f"✅ Returning {len(products_data)} products")
                else:
                    logger.warning(f"⚠️ No products found for filters: {entities}")
                
                return products_data
            
            return []
            
        except Exception as e:
            logger.error(f"❌ Error getting relevant products: {e}")
            import traceback
            traceback.print_exc()
            return []
    
    def _format_products_as_links(self, products_data: List[Dict]) -> str:
        """
        Format products thành markdown links để thêm vào content
        ✅ FIX 2: Đảm bảo chỉ dùng link thật từ database, không fake
        """
        if not products_data:
            return ""
        
        links_text = "\n\n🔗 Link sản phẩm:\n"
        for i, product in enumerate(products_data, 1):
            product_name = product.get('name', 'Sản phẩm')
            product_link = product.get('link', '')
            product_id = product.get('id')
            
            # ✅ FIX 2: Đảm bảo link thật từ database
            # Nếu không có link hoặc link không hợp lệ → tạo link thật từ ID
            if not product_link or product_link == '#' or not product_link.startswith('/product/'):
                if product_id:
                    # Tạo link thật từ database ID
                    product_link = f"/product/{product_id}"
                    logger.info(f"✅ FIX 2: Generated real link from DB: {product_link}")
                else:
                    # Nếu không có ID → skip sản phẩm này
                    logger.warning(f"⚠️ FIX 2: Product {product_name} không có ID, skip")
                    continue
            
            # Đảm bảo link là relative path (không có domain)
            if product_link.startswith('http'):
                # Extract path từ full URL
                from urllib.parse import urlparse
                parsed = urlparse(product_link)
                product_link = parsed.path
            
            # ✅ FIX 2: Validate link format (phải là /product/{id})
            if not product_link.startswith('/product/'):
                logger.warning(f"⚠️ FIX 2: Invalid link format: {product_link}, skip")
                continue
            
            # Format dưới dạng markdown link để frontend có thể parse và render thành clickable
            links_text += f"{i}. [{product_name}]({product_link})\n"
        
        return links_text
    
    def _get_relevant_promotions(self, message: str, intent: str) -> List[Dict]:
        """Lấy promotions liên quan dựa trên message và intent"""
        try:
            if intent == 'promotion' or 'khuyến mãi' in message.lower() or 'sale' in message.lower():
                now = timezone.now()
                promotions = Promotion.objects.filter(
                    is_active=True,
                    start_date__lte=now,
                    end_date__gte=now
                ).order_by('-discount_percentage')[:2]
                
                promotions_data = []
                for promo in promotions:
                    promotions_data.append({
                        'code': promo.code,
                        'discount_percentage': promo.discount_percentage,
                        'description': promo.description or f"Giảm {promo.discount_percentage}%",
                        'end_date': promo.end_date.isoformat() if promo.end_date else None
                    })
                
                return promotions_data
            
            return []
            
        except Exception as e:
            logger.error(f"Error getting relevant promotions: {e}")
            return []
    
    def _get_enhanced_fallback_response(self, intent: str, context: List[Dict] = None, message: str = "", entities: Dict = None) -> Dict[str, Any]:
        """
        Phản hồi dự phòng nâng cao khi Gemini API lỗi
        QUAN TRỌNG: Trả lời ngay, không hỏi lại nhiều
        """
        if not entities:
            entities = self.nlp_processor.extract_entities(message) if message else {}
        
        # Enhanced responses với thông tin từ entities - NGẮN GỌN, TRẢ LỜI NGAY
        if intent == 'product_search':
            # ✅ FIX 3: Extract số lượng user yêu cầu
            requested_count = self._extract_requested_count(message) if message else None
            
            # Luôn tìm kiếm và trả về sản phẩm, không hỏi lại
            products_data = self._get_relevant_products(message, intent, requested_count=requested_count, context=context)
            
            if products_data:
                links_text = self._format_products_as_links(products_data)
                
                # Tạo câu trả lời ngắn gọn, Gen Z style, ít emoji
                if entities.get('brand') and entities.get('gender'):
                    content = f"Đây là {entities['brand']} {entities['gender']} mình tìm được 👟"
                elif entities.get('brand'):
                    content = f"Mấy đôi {entities['brand']} này bạn xem nha"
                elif entities.get('gender'):
                    content = f"Giày {entities['gender']} hot nhất đây"
                elif entities.get('max_price'):
                    price_text = f"{entities['max_price']:,}" if entities['max_price'] >= 1000000 else f"{entities['max_price']//1000}k"
                    content = f"Giày dưới {price_text} đây nè"
                else:
                    content = "Top giày bán chạy đây"
                
                content += f"\n\n{links_text}"
                return {
                    'content': content,
                    'products': [],
                    'promotions': []
                }
            else:
                # ✅ FIX 5: Không tìm được sản phẩm → Gợi ý CHỈ 1-2 alternatives (KHÔNG 3, KHÔNG 5)
                content = "Sản phẩm này hết rồi bạn. Để mình gợi ý 1-2 đôi tương tự nha"
                # Lấy CHỈ 1-2 top products làm alternatives (KHÔNG nhiều hơn)
                alt_products = self._get_relevant_products('', 'recommendation', requested_count=2, context=context)[:2]  # ✅ FIX 5: CHỈ 2 sản phẩm
                if alt_products:
                    links_text = self._format_products_as_links(alt_products)
                    content += f"\n\n{links_text}"
                    logger.info(f"✅ FIX 5: Showing {len(alt_products)} alternatives (limited to 1-2)")
                return {
                    'content': content,
                    'products': [],
                    'promotions': []
                }
        
        elif intent == 'recommendation':
            # ✅ FIX 3: Extract số lượng user yêu cầu
            requested_count = self._extract_requested_count(message) if message else None
            products_data = self._get_relevant_products('', 'recommendation', requested_count=requested_count, context=context)
            if products_data:
                links_text = self._format_products_as_links(products_data)
                content = f"Top giày hot nhất đây nè\n\n{links_text}"
            else:
                content = "Đang cập nhật sản phẩm mới, bạn quay lại sau nha"
        
        elif intent == 'promotion':
            promotions_data = self._get_relevant_promotions(message, intent)
            if promotions_data:
                promo_text = "\n".join([f"• {p['code']} - Giảm {p['discount_percentage']}%" for p in promotions_data])
                content = f"Khuyến mãi hot:\n\n{promo_text}\n\nDùng khi thanh toán nha"
            else:
                content = "Hiện chưa có khuyến mãi. Mình báo ngay khi có deal mới"
        
        elif intent == 'order_status':
            content = "Bạn cho mình mã đơn hàng để check nhé! Hoặc đăng nhập để mình tự kiểm tra"
        
        else:
            # Default fallback - Gen Z style, ít emoji (max 1-2)
            responses = {
                'greeting': "Chào bạn! Mình là Footy 👋\n\nMình giúp bạn:\n• Tìm giày phù hợp\n• Tư vấn sản phẩm\n• Check khuyến mãi\n• Tra đơn hàng\n\nBạn cần gì nào?",
                'order_change_request': "Ok nhé! Bạn muốn đổi gì? Mình hỗ trợ liền",
                'help': "Mình giúp được gì cho bạn? Tìm giày, tư vấn, khuyến mãi hay tra đơn đều ok nha",
                # Gen Z, không "em chưa hiểu", tích cực
                'unknown': "Bạn muốn tìm giày hay tư vấn gì nào? Cứ hỏi thoải mái"
            }
            content = responses.get(intent, responses['unknown'])
        
        return {
            'content': content,
            'products': [],
            'promotions': []
        }
    
    def _get_fallback_response(self, intent: str, context: List[Dict] = None) -> str:
        """Phản hồi dự phòng - Gen Z style, ít emoji (max 1-2)"""
        responses = {
            'greeting': "Chào bạn! Mình là Footy 👋\n\nMình giúp bạn:\n• Tìm giày\n• Tư vấn\n• Khuyến mãi\n• Tra đơn\n\nBạn cần gì nào?",
            'product_search': "Bạn muốn tìm giày thế nào? Chạy bộ, dạo phố hay công sở?",
            'recommendation': "Để mình gợi ý mấy đôi hot cho bạn nha",
            'promotion': "Đang check khuyến mãi cho bạn",
            'order_status': "Bạn cho mình mã đơn hàng để check nhé",
            'order_change_request': "Bạn muốn đổi gì nào? Mình hỗ trợ liền",
            'help': "Mình giúp được gì cho bạn? Cứ hỏi thoải mái",
            # Gen Z, tích cực, không "chưa hiểu"
            'unknown': "Bạn muốn tìm giày hay tư vấn gì nào? Cứ nói thoải mái"
        }
        return responses.get(intent, responses['unknown'])
    
    def get_cached_response(self, message: str, intent: str) -> Optional[str]:
        """Lấy phản hồi từ cache - Optimized for speed"""
        # Tạo cache key đơn giản hơn để tăng tốc độ
        cache_key = f"footy_{hash(message.lower().strip())}_{intent}"
        return cache.get(cache_key)
    
    def cache_response(self, message: str, intent: str, response: str):
        """Lưu phản hồi vào cache - Optimized for speed"""
        # Tạo cache key đơn giản hơn và tăng thời gian cache
        cache_key = f"footy_{hash(message.lower().strip())}_{intent}"
        cache.set(cache_key, response, 7200)  # Cache 2 giờ thay vì 1 giờ
    
    
    def process_message(self, message: str, user_id: str = None, session_id: str = None) -> Dict[str, Any]:
        """
        Xử lý tin nhắn chính của chatbot - Optimized for speed
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
        
        # Lấy ngữ cảnh hội thoại - Tối ưu
        context = self.memory.get_context(user_id or session_id) if (user_id or session_id) else []
        
        # Phân tích cảm xúc - Tối ưu
        sentiment = self.sentiment_analyzer.analyze_sentiment(message)
        
        # Nhận diện ý định với confidence score - Tối ưu
        intent, confidence = self.detect_intent(message, context)
        
        # Check if user is asking about images
        message_lower = message.lower()
        image_related_keywords = ['hình ảnh', 'hinh anh', 'ảnh', 'anh', 'image', 'photo', 'picture', 'hình', 'hin']
        is_asking_about_images = any(keyword in message_lower for keyword in image_related_keywords)
        
        # Check if user is asking for links
        link_related_keywords = ['link', 'liên kết', 'lien ket', 'gửi link', 'gui link', 'cho link', 'có link', 'co link', 'link sản phẩm', 'link san pham', 'đường link', 'duong link', 'url']
        is_asking_for_links = any(keyword in message_lower for keyword in link_related_keywords)
        
        # Check if user is asking about images/links in context of products
        has_product_context = False
        if context and len(context) > 0:
            last_intent = context[-1].get('intent', '')
            if last_intent in ['product_search', 'recommendation']:
                has_product_context = True
        
        # Extract entities để sử dụng trong generate_intelligent_response
        entities = self.nlp_processor.extract_entities(message)
        
        # Update user preferences based on entities
        if user_id and entities:
            self.memory.update_user_preferences(user_id, entities)
        
        # Kiểm tra cache trước - Ưu tiên cache để tăng tốc độ
        cached_response = self.get_cached_response(message, intent)
        if cached_response:
            # Cache chỉ lưu content, cần lấy thêm products và promotions
            # Show products if: intent is product_search/recommendation OR asking for images/links with product context
            if is_asking_about_images and not has_product_context and intent not in ['product_search', 'recommendation']:
                products_data = []
                promotions_data = []
            elif intent in ['product_search', 'recommendation'] or (is_asking_about_images and has_product_context) or (is_asking_for_links and has_product_context):
                # If asking for images/links with product context, use last message from context
                search_message = message
                if (is_asking_about_images or is_asking_for_links) and has_product_context and context and len(context) > 0:
                    last_message = context[-1].get('message', '')
                    if last_message:
                        search_message = f"{last_message} {message}"
                products_data = self._get_relevant_products(search_message, intent if intent in ['product_search', 'recommendation'] else 'product_search')
                # Nếu không tìm được products và đang yêu cầu xem hình ảnh/link, thử lấy từ context
                if not products_data and (is_asking_about_images or is_asking_for_links) and context and len(context) > 0:
                    last_message = context[-1].get('message', '')
                    if last_message:
                        products_data = self._get_relevant_products(last_message, 'product_search')
                # Chỉ fallback về top products nếu KHÔNG có product context (giữ lại filters nếu có context)
                if not products_data and (is_asking_about_images or is_asking_for_links) and not has_product_context:
                    products_data = self._get_relevant_products('', 'recommendation')
                elif not products_data and (is_asking_about_images or is_asking_for_links) and has_product_context:
                    logger.warning(f"No products found for image/link request with product context. Search message: {search_message}")
                
                # Thêm links vào content thay vì trả về products array
                response_content = cached_response
                if products_data:
                    links_text = self._format_products_as_links(products_data)
                    response_content = cached_response + links_text
                
                promotions_data = self._get_relevant_promotions(search_message, intent if intent in ['product_search', 'recommendation'] else 'product_search')
            else:
                products_data = []
                promotions_data = []
                response_content = cached_response
            
            ai_response_data = {
                'content': response_content,
                'products': [],  # Không trả về products array nữa, chỉ trả về links trong content
                'promotions': promotions_data
            }
            logger.info(f"✅ Using cached response for intent: {intent}")
        else:
            # Tạo phản hồi AI với confidence - Chỉ khi không có cache
            ai_response_data = self.generate_intelligent_response(message, intent, context, user_id, entities)
            # Lưu vào cache chỉ content (trừ khi đang trong multi-turn conversation)
            if not ai_response_data.get('needs_clarification', False):
                self.cache_response(message, intent, ai_response_data.get('content', ''))
            logger.info(f"🔄 Generated new response for intent: {intent}")
        
        # Tính thời gian xử lý
        processing_time = (time.time() - start_time) * 1000  # ms
        
        # Chuẩn bị response data
        response_data = {
            "type": "message",
            "content": ai_response_data.get('content', ''),
            "products": ai_response_data.get('products', []),
            "promotions": ai_response_data.get('promotions', []),
            "intent": intent,
            "confidence": confidence,
            "sentiment": sentiment,
            "processing_time": processing_time,
            "timestamp": timezone.now().isoformat()
        }
        
        # Lưu vào memory - Chỉ khi cần thiết
        if user_id or session_id:
            self.memory.add_conversation(user_id or session_id, message, ai_response_data.get('content', ''), intent)
        
        return response_data


# Global instance
footy_ai = FootyAI()
