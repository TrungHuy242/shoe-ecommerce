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
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import ProductViewSet, CategoryViewSet, BrandViewSet, BannerViewSet, ImageViewSet, ProductPromotionViewSet, PromotionViewSet, CustomerViewSet, CartItemViewSet, CartViewSet, OrderViewSet, OrderDetailViewSet ,PaymentViewSet, WishlistViewSet, NotificationViewSet, FAQViewSet,ChatBotConversationViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'products', ProductViewSet),
router.register(r'categories', CategoryViewSet),
router.register(r'brands', BrandViewSet),
router.register(r'banners', BannerViewSet),
router.register(r'images', ImageViewSet),
router.register(r'product-promotions', ProductPromotionViewSet),
router.register(r'promotions', PromotionViewSet),
router.register(r'customers', CustomerViewSet),
router.register(r'cart-items', CartItemViewSet),
router.register(r'carts', CartViewSet),
router.register(r'orders', OrderViewSet),
router.register(r'order-details', OrderDetailViewSet),
router.register(r'payments', PaymentViewSet),
router.register(r'wishlists', WishlistViewSet),
router.register(r'notifications', NotificationViewSet),
router.register(r'faqs', FAQViewSet),
router.register(r'chatbot-conversations', ChatBotConversationViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
