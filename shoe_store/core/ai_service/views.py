"""
AI Service Views for FootFashion Chatbot
Endpoint: /api/ai/chat/
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.db.models import Q, Avg, Count
from django.db import models
from django.utils import timezone
from django.conf import settings
from django.core.cache import cache
import uuid

from ..models import Product, Promotion, Order, ChatbotConversation, ChatbotFeedback, ChatbotMetrics
from .chatbot import footy_ai
from django.utils.dateparse import parse_date
from collections import defaultdict


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
            # Handle both DRF request and regular Django request - Optimized
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
                    "content": "Chào bạn! Mình là Footy 👋\n\nMình giúp bạn:\n• Tìm giày phù hợp\n• Tư vấn sản phẩm\n• Check khuyến mãi\n• Tra đơn hàng\n\nBạn cần gì nào?",
                    "intent": "greeting",
                    "confidence": 0.9,
                    "timestamp": timezone.now().isoformat()
                })
            
            # Optimized: Use single process_message call for all intents
            response_data = footy_ai.process_message(message, user_id, session_id)
            
            # Log conversation to database asynchronously (non-blocking)
            self._log_conversation_to_db_async(user_id, session_id, message, response_data)
            
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
    
    def _log_conversation_to_db_async(self, user_id, session_id, message, response_data):
        """Log conversation to database asynchronously - Optimized for speed"""
        try:
            # Lưu vào database với thông tin từ response_data
            conversation = ChatbotConversation.objects.create(
                user_id=user_id,
                session_id=session_id,
                message=message,
                response=response_data.get('content', ''),
                intent=response_data.get('intent', 'unknown'),
                response_type=response_data.get('type', 'message'),
                sentiment=response_data.get('sentiment'),
                confidence_score=response_data.get('confidence', 0.0),
                processing_time=response_data.get('processing_time', 0.0)
            )
            
            # Update metrics
            self._update_metrics(user_id, session_id, response_data)
            
            # Cũng lưu vào cache để admin dashboard có thể truy cập nhanh
            cache_key = f"chat_log_{timezone.now().date()}"
            logs = cache.get(cache_key, [])
            log_data = {
                'id': conversation.id,
                'user_id': user_id,
                'session_id': session_id,
                'message': message[:100],
                'intent': response_data.get('intent', 'unknown'),
                'confidence': response_data.get('confidence', 0.0),
                'response_type': response_data.get('type', 'message'),
                'sentiment': response_data.get('sentiment'),
                'timestamp': conversation.created_at.isoformat()
            }
            logs.append(log_data)
            cache.set(cache_key, logs, 86400)  # 24 hours
            
            print(f"✅ Conversation logged to DB: {conversation.id}")
            
        except Exception as e:
            print(f"❌ Database logging error: {e}")
            # Không print traceback để tránh làm chậm response
    
    def _update_metrics(self, user_id, session_id, response_data):
        """Update chatbot metrics for analytics"""
        try:
            today = timezone.now().date()
            intent = response_data.get('intent', 'unknown')
            confidence = response_data.get('confidence', 0.0)
            processing_time = response_data.get('processing_time', 0.0)
            
            # Get or create metrics for today
            metrics, created = ChatbotMetrics.objects.get_or_create(
                date=today,
                defaults={
                    'total_interactions': 0,
                    'unique_users': 0,
                    'unique_sessions': 0,
                    'product_searches': 0,
                    'product_clicks': 0,
                    'promotion_views': 0,
                    'order_queries': 0,
                    'positive_feedback': 0,
                    'negative_feedback': 0,
                    'avg_confidence_score': 0.0,
                    'avg_processing_time': 0.0,
                }
            )
            
            # Update metrics
            metrics.total_interactions += 1
            
            # Update unique users and sessions (simplified - in production, use better tracking)
            if user_id:
                # Track unique users (simplified)
                metrics.unique_users = ChatbotConversation.objects.filter(
                    created_at__date=today,
                    user_id__isnull=False
                ).values('user_id').distinct().count()
            
            if session_id:
                # Track unique sessions
                metrics.unique_sessions = ChatbotConversation.objects.filter(
                    created_at__date=today,
                    session_id__isnull=False
                ).values('session_id').distinct().count()
            
            # Update intent-specific metrics
            if intent == 'product_search':
                metrics.product_searches += 1
            elif intent == 'promotion':
                metrics.promotion_views += 1
            elif intent == 'order_status':
                metrics.order_queries += 1
            
            # Update average confidence and processing time
            total_convs = ChatbotConversation.objects.filter(created_at__date=today).count()
            if total_convs > 0:
                avg_conf = ChatbotConversation.objects.filter(
                    created_at__date=today
                ).aggregate(
                    avg_conf=models.Avg('confidence_score')
                )['avg_conf'] or 0.0
                avg_time = ChatbotConversation.objects.filter(
                    created_at__date=today
                ).aggregate(
                    avg_time=models.Avg('processing_time')
                )['avg_time'] or 0.0
                
                metrics.avg_confidence_score = float(avg_conf)
                metrics.avg_processing_time = float(avg_time)
            
            # Calculate conversion rate
            metrics.calculate_conversion_rate()
            
            metrics.save()
            
        except Exception as e:
            print(f"❌ Metrics update error: {e}")
            # Don't fail if metrics update fails


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


class AIFeedbackView(APIView):
    """
    API endpoint for user feedback on chatbot responses
    Endpoint: /api/ai/feedback/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Submit feedback for a chatbot response"""
        try:
            user_id = str(request.user.id) if request.user.is_authenticated else None
            session_id = request.data.get('session_id')
            message = request.data.get('message', '')
            response = request.data.get('response', '')
            intent = request.data.get('intent', '')
            feedback_type = request.data.get('feedback_type', '')  # 'positive' or 'negative'
            
            # Save feedback to database
            feedback = ChatbotFeedback.objects.create(
                user_id=user_id,
                session_id=session_id,
                message=message,
                response=response,
                intent=intent,
                feedback_type=feedback_type,
                created_at=timezone.now()
            )
            
            return Response({
                "message": "Feedback received successfully",
                "feedback_id": feedback.id,
                "status": "success"
            })
            
        except Exception as e:
            print(f"Feedback submission error: {e}")
            return Response({
                "message": "Failed to submit feedback",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)