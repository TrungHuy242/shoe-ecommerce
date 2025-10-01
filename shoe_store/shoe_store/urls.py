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
from rest_framework.routers import DefaultRouter
from core.views import ProductViewSet, CategoryViewSet, BrandViewSet, BannerViewSet, ImageViewSet, ProductPromotionViewSet, PromotionViewSet, CartItemViewSet, CartViewSet, OrderViewSet, OrderDetailViewSet ,PaymentViewSet, WishlistViewSet, NotificationViewSet, CustomTokenObtainPairView,RegisterView, SizeViewSet, ColorViewSet, GenderViewSet, UserViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
import re, hmac, hashlib
from django.conf import settings
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db import transaction
from core.models import Order, Payment
import difflib
from django.db.models import Count
from django.utils import timezone
from datetime import datetime, timedelta
from rest_framework.views import APIView
# Chatbot models removed
from core.views import ProductAvailabilityView, OrderStatusView



router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet),
router.register(r'brands', BrandViewSet),
router.register(r'banners', BannerViewSet),
router.register(r'images', ImageViewSet),
router.register(r'product-promotions', ProductPromotionViewSet),
router.register(r'promotions', PromotionViewSet),
router.register(r'cart-items', CartItemViewSet),
router.register(r'carts', CartViewSet),
router.register(r'orders', OrderViewSet),
router.register(r'order-details', OrderDetailViewSet),
router.register(r'payments', PaymentViewSet),
router.register(r'wishlists', WishlistViewSet),
router.register(r'notifications', NotificationViewSet),
# FAQ endpoints removed
# Chatbot endpoints disabled per request
router.register(r'sizes', SizeViewSet)
router.register(r'colors', ColorViewSet)
router.register(r'genders', GenderViewSet)
router.register(r'users', UserViewSet)



urlpatterns = [
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Chatbot endpoints removed
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/products/check-availability/', ProductAvailabilityView.as_view(), name='product-availability'),
    path('api/orders/check-status/', OrderStatusView.as_view(), name='order-status'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
