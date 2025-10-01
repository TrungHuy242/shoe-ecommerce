from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

# Create router for ViewSets
router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'brands', views.BrandViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'images', views.ImageViewSet)
router.register(r'banners', views.BannerViewSet)
router.register(r'promotions', views.PromotionViewSet)
router.register(r'carts', views.CartViewSet)
router.register(r'cart-items', views.CartItemViewSet)
router.register(r'orders', views.OrderViewSet)
router.register(r'order-details', views.OrderDetailViewSet)
router.register(r'payments', views.PaymentViewSet)
router.register(r'wishlists', views.WishlistViewSet)
router.register(r'notifications', views.NotificationViewSet)
router.register(r'sizes', views.SizeViewSet)
router.register(r'colors', views.ColorViewSet)
router.register(r'genders', views.GenderViewSet)

urlpatterns = [
    # Health check
    path('health/', views.health_check, name='health_check'),
    
    # Authentication
    path('auth/login/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    
    # API routes
    path('', include(router.urls)),
]