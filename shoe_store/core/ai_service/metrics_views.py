"""
Metrics and Analytics Views for Chatbot
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.utils import timezone
from django.db.models import Avg, Count, Sum, Q
from datetime import timedelta

from ..models import ChatbotMetrics, ChatbotConversation, ChatbotFeedback


class ChatbotMetricsView(APIView):
    """
    API endpoint for viewing chatbot metrics and analytics
    Endpoint: /api/ai/metrics/
    """
    permission_classes = [AllowAny]  # Simplified for demo
    
    def get(self, request):
        """Get chatbot metrics"""
        try:
            # Get date range from query params
            days = int(request.query_params.get('days', 7))
            end_date = timezone.now().date()
            start_date = end_date - timedelta(days=days)
            
            # Get metrics for date range
            metrics = ChatbotMetrics.objects.filter(
                date__gte=start_date,
                date__lte=end_date
            ).order_by('-date')
            
            # Aggregate metrics
            total_interactions = sum(m.total_interactions for m in metrics)
            total_product_searches = sum(m.product_searches for m in metrics)
            total_product_clicks = sum(m.product_clicks for m in metrics)
            total_product_purchases = sum(m.product_purchases for m in metrics)
            total_promotion_views = sum(m.promotion_views for m in metrics)
            total_order_queries = sum(m.order_queries for m in metrics)
            total_positive_feedback = sum(m.positive_feedback for m in metrics)
            total_negative_feedback = sum(m.negative_feedback for m in metrics)
            
            # Calculate averages
            avg_confidence = 0.0
            avg_processing_time = 0.0
            conversion_rate = 0.0
            
            if metrics.exists():
                avg_confidence = sum(m.avg_confidence_score for m in metrics) / len(metrics)
                avg_processing_time = sum(m.avg_processing_time for m in metrics) / len(metrics)
                
                if total_product_searches > 0:
                    conversion_rate = (total_product_clicks / total_product_searches) * 100
            
            # Get unique users and sessions
            unique_users = ChatbotConversation.objects.filter(
                created_at__date__gte=start_date,
                created_at__date__lte=end_date,
                user_id__isnull=False
            ).values('user_id').distinct().count()
            
            unique_sessions = ChatbotConversation.objects.filter(
                created_at__date__gte=start_date,
                created_at__date__lte=end_date,
                session_id__isnull=False
            ).values('session_id').distinct().count()
            
            # Daily metrics
            daily_metrics = []
            for metric in metrics:
                daily_metrics.append({
                    'date': metric.date.isoformat(),
                    'total_interactions': metric.total_interactions,
                    'unique_users': metric.unique_users,
                    'unique_sessions': metric.unique_sessions,
                    'product_searches': metric.product_searches,
                    'product_clicks': metric.product_clicks,
                    'product_purchases': metric.product_purchases,
                    'promotion_views': metric.promotion_views,
                    'order_queries': metric.order_queries,
                    'positive_feedback': metric.positive_feedback,
                    'negative_feedback': metric.negative_feedback,
                    'avg_confidence_score': metric.avg_confidence_score,
                    'avg_processing_time': metric.avg_processing_time,
                    'conversion_rate': metric.conversion_rate
                })
            
            return Response({
                "message": "Chatbot metrics retrieved successfully",
                "date_range": {
                    "start_date": start_date.isoformat(),
                    "end_date": end_date.isoformat(),
                    "days": days
                },
                "summary": {
                    "total_interactions": total_interactions,
                    "unique_users": unique_users,
                    "unique_sessions": unique_sessions,
                    "product_searches": total_product_searches,
                    "product_clicks": total_product_clicks,
                    "product_purchases": total_product_purchases,
                    "promotion_views": total_promotion_views,
                    "order_queries": total_order_queries,
                    "positive_feedback": total_positive_feedback,
                    "negative_feedback": total_negative_feedback,
                    "avg_confidence_score": round(avg_confidence, 3),
                    "avg_processing_time": round(avg_processing_time, 2),
                    "conversion_rate": round(conversion_rate, 2)
                },
                "daily_metrics": daily_metrics
            })
            
        except Exception as e:
            print(f"Metrics retrieval error: {e}")
            return Response({
                "message": "Failed to retrieve metrics",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ChatbotAnalyticsView(APIView):
    """
    API endpoint for detailed chatbot analytics
    Endpoint: /api/ai/analytics/
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Get detailed analytics"""
        try:
            days = int(request.query_params.get('days', 30))
            end_date = timezone.now().date()
            start_date = end_date - timedelta(days=days)
            
            # Intent statistics
            intent_stats = ChatbotConversation.objects.filter(
                created_at__date__gte=start_date,
                created_at__date__lte=end_date
            ).values('intent').annotate(
                count=Count('id')
            ).order_by('-count')
            
            # Sentiment statistics
            sentiment_stats = {'positive': 0, 'negative': 0, 'neutral': 0}
            conversations = ChatbotConversation.objects.filter(
                created_at__date__gte=start_date,
                created_at__date__lte=end_date,
                sentiment__isnull=False
            )
            
            for conv in conversations:
                if conv.sentiment:
                    sentiment = conv.sentiment.get('sentiment', 'neutral')
                    if sentiment in sentiment_stats:
                        sentiment_stats[sentiment] += 1
            
            # Feedback statistics
            feedback_stats = ChatbotFeedback.objects.filter(
                created_at__date__gte=start_date,
                created_at__date__lte=end_date
            ).values('feedback_type').annotate(
                count=Count('id')
            )
            
            feedback_summary = {'positive': 0, 'negative': 0}
            for fb in feedback_stats:
                if fb['feedback_type'] in feedback_summary:
                    feedback_summary[fb['feedback_type']] = fb['count']
            
            # Top intents
            top_intents = list(intent_stats[:10])
            
            return Response({
                "message": "Analytics retrieved successfully",
                "date_range": {
                    "start_date": start_date.isoformat(),
                    "end_date": end_date.isoformat(),
                    "days": days
                },
                "intent_statistics": top_intents,
                "sentiment_statistics": sentiment_stats,
                "feedback_statistics": feedback_summary
            })
            
        except Exception as e:
            print(f"Analytics retrieval error: {e}")
            return Response({
                "message": "Failed to retrieve analytics",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

