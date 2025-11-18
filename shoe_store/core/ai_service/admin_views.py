"""
Admin Dashboard APIs for Chatbot Management
Cung cấp APIs cho 7 nhóm chức năng:
1. Dashboard tổng quan
2. Conversation & logs management
3. Intent training
4. Response & rules config
5. Context & memory
6. Test & simulation
7. Alert & monitoring
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Q, Count, Avg, Sum, F
from django.utils import timezone
from datetime import timedelta, datetime
from django.core.cache import cache

from ..models import (
    ChatbotConversation, ChatbotFeedback, ChatbotMetrics,
    IntentTraining, BotConfig, ConversationTag, Alert, User
)
from .chatbot import footy_ai


class DashboardOverviewView(APIView):
    """1️⃣ Dashboard tổng quan: Số lượng tương tác, success/fallback, câu hỏi phổ biến, tốc độ phản hồi"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Get time range
            period = request.query_params.get('period', 'day')  # day, week, month
            days = {'day': 1, 'week': 7, 'month': 30}.get(period, 7)
            
            end_date = timezone.now()
            start_date = end_date - timedelta(days=days)
            
            # 1. Số lượng tương tác
            interactions = ChatbotConversation.objects.filter(
                created_at__gte=start_date
            )
            total_interactions = interactions.count()
            
            # 2. Success vs Fallback
            success_count = interactions.filter(
                response_type='message',
                confidence_score__gte=0.7
            ).count()
            fallback_count = interactions.filter(
                Q(response_type='fallback') | Q(confidence_score__lt=0.7)
            ).count()
            
            # 3. Câu hỏi phổ biến nhất
            popular_questions = interactions.values('message').annotate(
                count=Count('id')
            ).order_by('-count')[:10]
            
            # 4. Tốc độ phản hồi
            avg_response_time = interactions.aggregate(
                avg_time=Avg('processing_time')
            )['avg_time'] or 0
            
            # 5. Success rate
            success_rate = (success_count / total_interactions * 100) if total_interactions > 0 else 0
            
            return Response({
                'period': period,
                'date_range': {
                    'start': start_date.isoformat(),
                    'end': end_date.isoformat(),
                    'days': days
                },
                'interactions': {
                    'total': total_interactions,
                    'success': success_count,
                    'fallback': fallback_count,
                    'success_rate': round(success_rate, 2)
                },
                'popular_questions': [
                    {'message': q['message'], 'count': q['count']}
                    for q in popular_questions
                ],
                'performance': {
                    'avg_response_time_ms': round(avg_response_time, 2),
                    'avg_confidence': round(
                        interactions.aggregate(avg=Avg('confidence_score'))['avg'] or 0, 3
                    )
                }
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ConversationManagementView(APIView):
    """2️⃣ Quản lý conversation & logs: Xem lịch sử, tìm kiếm, highlight, tag, note"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Lấy danh sách conversations với filters"""
        try:
            # Filters
            search = request.query_params.get('search', '')
            user_id = request.query_params.get('user_id', '')
            session_id = request.query_params.get('session_id', '')
            intent = request.query_params.get('intent', '')
            has_fallback = request.query_params.get('has_fallback', '')
            tag = request.query_params.get('tag', '')
            date_from = request.query_params.get('date_from', '')
            date_to = request.query_params.get('date_to', '')
            page = int(request.query_params.get('page', 1))
            page_size = int(request.query_params.get('page_size', 20))
            
            # Build query
            queryset = ChatbotConversation.objects.select_related('user').prefetch_related('tags')
            
            if search:
                queryset = queryset.filter(
                    Q(message__icontains=search) | 
                    Q(response__icontains=search)
                )
            
            if user_id:
                queryset = queryset.filter(user_id=user_id)
            
            if session_id:
                queryset = queryset.filter(session_id=session_id)
            
            if intent:
                queryset = queryset.filter(intent=intent)
            
            if has_fallback == 'true':
                queryset = queryset.filter(
                    Q(response_type='fallback') | Q(confidence_score__lt=0.7)
                )
            
            if tag:
                queryset = queryset.filter(tags__tag_name=tag)
            
            if date_from:
                queryset = queryset.filter(created_at__gte=date_from)
            
            if date_to:
                queryset = queryset.filter(created_at__lte=date_to)
            
            # Pagination
            total = queryset.count()
            start = (page - 1) * page_size
            conversations = queryset.order_by('-created_at')[start:start + page_size]
            
            # Format response
            results = []
            for conv in conversations:
                results.append({
                    'id': conv.id,
                    'user_id': conv.user_id,
                    'session_id': conv.session_id,
                    'message': conv.message,
                    'response': conv.response,
                    'intent': conv.intent,
                    'response_type': conv.response_type,
                    'confidence_score': conv.confidence_score,
                    'processing_time': conv.processing_time,
                    'sentiment': conv.sentiment,
                    'created_at': conv.created_at.isoformat(),
                    'tags': [{'name': t.tag_name, 'note': t.note} for t in conv.tags.all()],
                    'has_fallback': conv.response_type == 'fallback' or conv.confidence_score < 0.7
                })
            
            return Response({
                'total': total,
                'page': page,
                'page_size': page_size,
                'total_pages': (total + page_size - 1) // page_size,
                'results': results
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ConversationTagView(APIView):
    """Thêm/xóa tag cho conversation"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, conversation_id):
        """Thêm tag"""
        try:
            tag_name = request.data.get('tag_name')
            note = request.data.get('note', '')
            
            conversation = ChatbotConversation.objects.get(id=conversation_id)
            tag, created = ConversationTag.objects.get_or_create(
                conversation=conversation,
                tag_name=tag_name,
                defaults={'note': note}
            )
            
            if not created:
                tag.note = note
                tag.save()
            
            return Response({'success': True, 'tag': {'name': tag.tag_name, 'note': tag.note}})
        except ChatbotConversation.DoesNotExist:
            return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request, conversation_id, tag_name):
        """Xóa tag"""
        try:
            ConversationTag.objects.filter(
                conversation_id=conversation_id,
                tag_name=tag_name
            ).delete()
            return Response({'success': True})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class IntentTrainingView(APIView):
    """3️⃣ Training data & intents: CRUD intents, keywords, phrases"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, intent_id=None):
        """Lấy danh sách hoặc chi tiết intent"""
        try:
            if intent_id:
                intent = IntentTraining.objects.get(id=intent_id)
                return Response({
                    'id': intent.id,
                    'intent_name': intent.intent_name,
                    'description': intent.description,
                    'keywords': intent.keywords,
                    'phrases': intent.phrases,
                    'response_template': intent.response_template,
                    'is_active': intent.is_active,
                    'created_at': intent.created_at.isoformat(),
                    'updated_at': intent.updated_at.isoformat()
                })
            else:
                intents = IntentTraining.objects.all()
                return Response({
                    'results': [{
                        'id': i.id,
                        'intent_name': i.intent_name,
                        'description': i.description,
                        'keywords_count': len(i.keywords),
                        'phrases_count': len(i.phrases),
                        'is_active': i.is_active
                    } for i in intents]
                })
        except IntentTraining.DoesNotExist:
            return Response({'error': 'Intent not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        """Tạo intent mới"""
        try:
            intent = IntentTraining.objects.create(
                intent_name=request.data.get('intent_name'),
                description=request.data.get('description', ''),
                keywords=request.data.get('keywords', []),
                phrases=request.data.get('phrases', []),
                response_template=request.data.get('response_template', ''),
                is_active=request.data.get('is_active', True)
            )
            return Response({'success': True, 'id': intent.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self, request, intent_id):
        """Cập nhật intent"""
        try:
            intent = IntentTraining.objects.get(id=intent_id)
            intent.intent_name = request.data.get('intent_name', intent.intent_name)
            intent.description = request.data.get('description', intent.description)
            intent.keywords = request.data.get('keywords', intent.keywords)
            intent.phrases = request.data.get('phrases', intent.phrases)
            intent.response_template = request.data.get('response_template', intent.response_template)
            intent.is_active = request.data.get('is_active', intent.is_active)
            intent.save()
            return Response({'success': True})
        except IntentTraining.DoesNotExist:
            return Response({'error': 'Intent not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request, intent_id):
        """Xóa intent"""
        try:
            IntentTraining.objects.filter(id=intent_id).delete()
            return Response({'success': True})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TestIntentView(APIView):
    """Test intent ngay trong admin"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Test message với bot"""
        try:
            message = request.data.get('message', '')
            if not message:
                return Response({'error': 'Message required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Test với bot
            response_data = footy_ai.process_message(message, user_id=None, session_id='test-session')
            
            return Response({
                'message': message,
                'response': response_data,
                'timestamp': timezone.now().isoformat()
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BotConfigView(APIView):
    """4️⃣ Response & rules: Chỉnh response template, rules, bật/tắt features"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, config_key=None):
        """Lấy config"""
        try:
            if config_key:
                config = BotConfig.objects.get(key=config_key)
                return Response({
                    'key': config.key,
                    'value': config.value,
                    'description': config.description,
                    'updated_at': config.updated_at.isoformat()
                })
            else:
                configs = BotConfig.objects.all()
                return Response({
                    'results': {c.key: {
                        'value': c.value,
                        'description': c.description,
                        'updated_at': c.updated_at.isoformat()
                    } for c in configs}
                })
        except BotConfig.DoesNotExist:
            return Response({'error': 'Config not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        """Tạo/cập nhật config"""
        try:
            key = request.data.get('key')
            value = request.data.get('value')
            description = request.data.get('description', '')
            
            config, created = BotConfig.objects.update_or_create(
                key=key,
                defaults={'value': value, 'description': description}
            )
            
            # Clear cache nếu cần
            cache.delete(f'bot_config_{key}')
            
            return Response({
                'success': True,
                'created': created,
                'key': config.key,
                'value': config.value
            }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ContextMemoryView(APIView):
    """5️⃣ Context & memory: Xem bot nhớ gì, quản lý context mapping, reset context"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Lấy context memory cho user/session"""
        try:
            user_id = request.query_params.get('user_id')
            session_id = request.query_params.get('session_id')
            
            if not user_id and not session_id:
                return Response({'error': 'user_id or session_id required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Lấy preferences từ memory
            memory_key = f"user_prefs_{user_id or session_id}"
            preferences = footy_ai.memory.get_user_preferences(user_id or session_id)
            
            # Lấy conversation history
            conversations = ChatbotConversation.objects.filter(
                Q(user_id=user_id) if user_id else Q(session_id=session_id)
            ).order_by('-created_at')[:10]
            
            return Response({
                'user_id': user_id,
                'session_id': session_id,
                'preferences': preferences,
                'recent_conversations': [{
                    'message': c.message,
                    'intent': c.intent,
                    'created_at': c.created_at.isoformat()
                } for c in conversations]
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request):
        """Reset context cho user/session"""
        try:
            user_id = request.data.get('user_id')
            session_id = request.data.get('session_id')
            
            if not user_id and not session_id:
                return Response({'error': 'user_id or session_id required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Clear memory
            footy_ai.memory.clear_user_preferences(user_id or session_id)
            
            return Response({'success': True, 'message': 'Context cleared'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TestSimulationView(APIView):
    """6️⃣ Test & simulation: Test chat trực tiếp, thử cases mới"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Simulate conversation"""
        try:
            messages = request.data.get('messages', [])  # List of messages
            user_id = request.data.get('user_id', 'test-user')
            session_id = request.data.get('session_id', 'test-session')
            
            results = []
            for message in messages:
                response_data = footy_ai.process_message(message, user_id, session_id)
                results.append({
                    'input': message,
                    'output': response_data,
                    'timestamp': timezone.now().isoformat()
                })
            
            return Response({
                'results': results,
                'total_messages': len(messages)
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AlertView(APIView):
    """7️⃣ Alert & monitoring: Xem alerts, resolve alerts"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Lấy alerts"""
        try:
            is_resolved = request.query_params.get('is_resolved')
            severity = request.query_params.get('severity')
            alert_type = request.query_params.get('alert_type')
            limit = int(request.query_params.get('limit', 50))
            
            queryset = Alert.objects.all()
            
            if is_resolved is not None:
                queryset = queryset.filter(is_resolved=is_resolved == 'true')
            
            if severity:
                queryset = queryset.filter(severity=severity)
            
            if alert_type:
                queryset = queryset.filter(alert_type=alert_type)
            
            alerts = queryset.order_by('-created_at')[:limit]
            
            return Response({
                'results': [{
                    'id': a.id,
                    'alert_type': a.alert_type,
                    'title': a.title,
                    'message': a.message,
                    'severity': a.severity,
                    'is_resolved': a.is_resolved,
                    'created_at': a.created_at.isoformat(),
                    'resolved_at': a.resolved_at.isoformat() if a.resolved_at else None
                } for a in alerts]
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        """Tạo alert mới"""
        try:
            alert = Alert.objects.create(
                alert_type=request.data.get('alert_type'),
                title=request.data.get('title'),
                message=request.data.get('message'),
                severity=request.data.get('severity', 'medium')
            )
            return Response({
                'success': True,
                'id': alert.id
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def patch(self, request, alert_id):
        """Resolve alert"""
        try:
            alert = Alert.objects.get(id=alert_id)
            alert.is_resolved = True
            alert.resolved_at = timezone.now()
            alert.save()
            return Response({'success': True})
        except Alert.DoesNotExist:
            return Response({'error': 'Alert not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

