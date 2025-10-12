"""
AI Service Views for FootFashion Chatbot
Endpoint: /api/ai/chat/
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.db.models import Q
from django.utils import timezone
from django.conf import settings
from django.core.cache import cache
import uuid

from ..models import Product, Promotion, Order, ChatbotConversation, ChatbotFeedback
from .chatbot import footy_ai


def get_full_image_url(image_path):
    """Get full URL for image"""
    if image_path:
        return f"{settings.BACKEND_ORIGIN}{image_path}"
    return None


class AIChatView(APIView):
    """
    AI Shopping Assistant "Footy" - Advanced Version
    Endpoint: /api/ai/chat/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            # Handle both DRF request and regular Django request
            user_id = str(request.user.id) if request.user.is_authenticated else None
            
            if hasattr(request, 'data'):
                message = request.data.get('message', '').strip()
                session_id = request.data.get('session_id', str(uuid.uuid4())) if not user_id else None
            else:
                message = request.POST.get('message', '').strip()
                session_id = request.POST.get('session_id', str(uuid.uuid4())) if not user_id else None
            
            if not message:
                return Response({
                    "type": "message",
                    "content": "Xin chào! Tôi là Footy, trợ lý mua sắm của FootFashion! 👋\n\nTôi có thể giúp bạn:\n🔍 Tìm kiếm giày dép\n💡 Gợi ý sản phẩm\n🎉 Xem khuyến mãi\n📦 Kiểm tra đơn hàng\n\nBạn cần gì nhé?",
                    "intent": "greeting",
                    "confidence": 0.9,
                    "timestamp": timezone.now().isoformat()
                })
            
            # Detect intent using AI với confidence score
            intent, confidence = footy_ai.detect_intent(message)
            
            # Handle different intents
            if intent == "greeting":
                response_data = footy_ai.process_message(message, user_id, session_id)
                
            elif intent == "product_search":
                # Use intelligent AI response for product search
                response_data = footy_ai.process_message(message, user_id, session_id)
                
            elif intent == "recommendation":
                # Use intelligent AI response for recommendations
                response_data = footy_ai.process_message(message, user_id, session_id)
                
            elif intent == "promotion":
                # Use intelligent AI response for promotions
                response_data = footy_ai.process_message(message, user_id, session_id)
                
            elif intent == "order_status":
                # Use intelligent AI response for order status
                response_data = footy_ai.process_message(message, user_id, session_id)
                    
            elif intent == "help":
                # Use intelligent AI response for help
                response_data = footy_ai.process_message(message, user_id, session_id)
                
            elif intent == "order_change_request":
                # Use intelligent AI response for order change requests
                response_data = footy_ai.process_message(message, user_id, session_id)
                
            else:
                # Unknown intent - use AI to generate response
                response_data = footy_ai.process_message(message, user_id, session_id)
            
            # Log conversation to database
            self._log_conversation_to_db(user_id, session_id, message, response_data, intent, confidence)
            
            return Response(response_data)
            
        except Exception as e:
            print(f"AI Chat error: {e}")
            import traceback
            traceback.print_exc()
            return Response({
                "type": "message",
                "content": "Xin lỗi, tôi gặp sự cố kỹ thuật. Vui lòng thử lại sau! 😅",
                "intent": "error",
                "timestamp": timezone.now().isoformat()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _log_conversation_to_db(self, user_id, session_id, message, response_data, intent, confidence):
        """Log conversation to database"""
        try:
            # Lưu vào database
            conversation = ChatbotConversation.objects.create(
                user_id=user_id,
                session_id=session_id,
                message=message,
                response=response_data.get('content', ''),
                intent=intent,
                response_type=response_data.get('type', 'message'),
                sentiment=response_data.get('sentiment'),
                confidence_score=confidence,
                processing_time=response_data.get('processing_time', 0.0)
            )
            
            # Cũng lưu vào cache để admin dashboard có thể truy cập nhanh
            cache_key = f"chat_log_{timezone.now().date()}"
            logs = cache.get(cache_key, [])
            log_data = {
                'id': conversation.id,
                'user_id': user_id,
                'session_id': session_id,
                'message': message[:100],
                'intent': intent,
                'confidence': confidence,
                'response_type': response_data.get('type', 'message'),
                'sentiment': response_data.get('sentiment'),
                'timestamp': conversation.created_at.isoformat()
            }
            logs.append(log_data)
            cache.set(cache_key, logs, 86400)  # 24 hours
            
            print(f"✅ Conversation logged to DB: {conversation.id}")
            
        except Exception as e:
            print(f"❌ Database logging error: {e}")
            import traceback
            traceback.print_exc()


class AILogsView(APIView):
    """
    API endpoint for viewing AI conversation logs (admin only)
    Endpoint: /api/ai/logs/
    """
    permission_classes = [AllowAny]  # Simplified for demo
    
    def get(self, request):
        """Get conversation logs from database for admin dashboard"""
        try:
            # Get logs from database (last 7 days)
            seven_days_ago = timezone.now() - timezone.timedelta(days=7)
            conversations = ChatbotConversation.objects.filter(
                created_at__gte=seven_days_ago
            ).order_by('-created_at')[:100]  # Limit to 100 recent conversations
            
            # Convert to list format
            logs = []
            for conv in conversations:
                logs.append({
                    'id': conv.id,
                    'user_id': conv.user_id,
                    'session_id': conv.session_id,
                    'message': conv.message[:100],
                    'intent': conv.intent,
                    'confidence': conv.confidence_score,
                    'response_type': conv.response_type,
                    'sentiment': conv.sentiment,
                    'processing_time': conv.processing_time,
                    'timestamp': conv.created_at.isoformat()
                })
            
            # Statistics
            intent_stats = {}
            sentiment_stats = {'positive': 0, 'negative': 0, 'neutral': 0}
            avg_confidence = 0
            avg_processing_time = 0
            
            for conv in conversations:
                # Intent statistics
                intent_stats[conv.intent] = intent_stats.get(conv.intent, 0) + 1
                
                # Sentiment statistics
                if conv.sentiment:
                    sentiment = conv.sentiment.get('sentiment', 'neutral')
                    sentiment_stats[sentiment] = sentiment_stats.get(sentiment, 0) + 1
                
                # Average confidence and processing time
                avg_confidence += conv.confidence_score
                avg_processing_time += conv.processing_time
            
            if conversations:
                avg_confidence /= len(conversations)
                avg_processing_time /= len(conversations)
            
            return Response({
                "message": "AI Chat logs retrieved successfully from database",
                "total_conversations": len(logs),
                "intent_statistics": intent_stats,
                "sentiment_statistics": sentiment_stats,
                "average_confidence": round(avg_confidence, 3),
                "average_processing_time": round(avg_processing_time, 2),
                "recent_logs": logs[:50],  # Last 50 conversations
                "date_range": f"Last 7 days"
            })
            
        except Exception as e:
            print(f"Database logs retrieval error: {e}")
            return Response({
                "message": "Failed to retrieve logs from database",
                "error": str(e),
                "logs": []
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        """Log conversation manually (for testing)"""
        try:
            log_data = request.data
            cache_key = f"chat_log_{timezone.now().date()}"
            logs = cache.get(cache_key, [])
            logs.append(log_data)
            cache.set(cache_key, logs, 86400)
            
            return Response({
                "message": "Log added successfully",
                "log_id": len(logs)
            })
            
        except Exception as e:
            return Response({
                "message": "Failed to add log",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
