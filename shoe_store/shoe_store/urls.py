"""
URL configuration for shoe_store project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from core.views import (
    ProductViewSet, CategoryViewSet, BrandViewSet, BannerViewSet, ImageViewSet,
    PromotionViewSet, CartItemViewSet, CartViewSet, OrderViewSet, OrderDetailViewSet,
    PaymentViewSet, WishlistViewSet, NotificationViewSet, CustomTokenObtainPairView,
    RegisterView, SizeViewSet, ColorViewSet, GenderViewSet, UserViewSet, ReviewViewSet,
    ChangePasswordView, ForgotPasswordView, ValidateResetTokenView, ResetPasswordView,
    ShippingAddressViewSet, ProductAvailabilityView, OrderStatusView
)
from core.ai_service.views import AIChatView, AILogsView, AIFeedbackView
from core.ai_service.metrics_views import ChatbotMetricsView, ChatbotAnalyticsView
from core.ai_service.admin_views import (
    DashboardOverviewView, ConversationManagementView, ConversationTagView,
    IntentTrainingView, TestIntentView, BotConfigView, ContextMemoryView,
    TestSimulationView, AlertView
)



router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet),
router.register(r'brands', BrandViewSet),
router.register(r'banners', BannerViewSet),
router.register(r'images', ImageViewSet),
router.register(r'promotions', PromotionViewSet),
router.register(r'cart-items', CartItemViewSet),
router.register(r'carts', CartViewSet),
router.register(r'orders', OrderViewSet),
router.register(r'order-details', OrderDetailViewSet),
router.register(r'payments', PaymentViewSet),
router.register(r'wishlists', WishlistViewSet),
router.register(r'notifications', NotificationViewSet, basename='notification'),
# FAQ endpoints removed
# Chatbot endpoints disabled per request
router.register(r'sizes', SizeViewSet)
router.register(r'colors', ColorViewSet)
router.register(r'genders', GenderViewSet)
router.register(r'users', UserViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'shipping-addresses', ShippingAddressViewSet, basename='shippingaddress')



urlpatterns = [
    path('api/', include(router.urls)),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # AI Service endpoints (Advanced Footy Chatbot)
    path('api/ai/chat/', AIChatView.as_view(), name='ai-chat'),
    path('api/ai/logs/', AILogsView.as_view(), name='ai-logs'),
    path('api/ai/feedback/', AIFeedbackView.as_view(), name='ai-feedback'),
    path('api/ai/metrics/', ChatbotMetricsView.as_view(), name='ai-metrics'),
    path('api/ai/analytics/', ChatbotAnalyticsView.as_view(), name='ai-analytics'),
    # Admin Dashboard APIs
    path('api/ai/admin/dashboard/', DashboardOverviewView.as_view(), name='ai-admin-dashboard'),
    path('api/ai/admin/conversations/', ConversationManagementView.as_view(), name='ai-admin-conversations'),
    path('api/ai/admin/conversations/<int:conversation_id>/tags/', ConversationTagView.as_view(), name='ai-admin-conversation-tags'),
    path('api/ai/admin/conversations/<int:conversation_id>/tags/<str:tag_name>/', ConversationTagView.as_view(), name='ai-admin-conversation-tag-delete'),
    path('api/ai/admin/intents/', IntentTrainingView.as_view(), name='ai-admin-intents'),
    path('api/ai/admin/intents/<int:intent_id>/', IntentTrainingView.as_view(), name='ai-admin-intent-detail'),
    path('api/ai/admin/test-intent/', TestIntentView.as_view(), name='ai-admin-test-intent'),
    path('api/ai/admin/config/', BotConfigView.as_view(), name='ai-admin-config'),
    path('api/ai/admin/config/<str:config_key>/', BotConfigView.as_view(), name='ai-admin-config-detail'),
    path('api/ai/admin/context/', ContextMemoryView.as_view(), name='ai-admin-context'),
    path('api/ai/admin/test-simulation/', TestSimulationView.as_view(), name='ai-admin-test-simulation'),
    path('api/ai/admin/alerts/', AlertView.as_view(), name='ai-admin-alerts'),
    path('api/ai/admin/alerts/<int:alert_id>/resolve/', AlertView.as_view(), name='ai-admin-alert-resolve'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/products/check-availability/', ProductAvailabilityView.as_view(), name='product-availability'),
    path('api/orders/check-status/', OrderStatusView.as_view(), name='order-status'),
    # Password management endpoints
    path('api/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('api/forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('api/validate-reset-token/', ValidateResetTokenView.as_view(), name='validate-reset-token'),
    path('api/reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    # Removed: path('api/promotions/validate/', ValidatePromotionView.as_view(), name='validate-promotion'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
