# core/views.py
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings
from .models import Product, Category, Brand, Image, Banner, Promotion, ProductPromotion, User, Cart, CartItem, Order, OrderDetail, Payment, Wishlist, Notification, Size, Color, Gender, Review, ShippingAddress
from .notification_utils import send_order_created_notification, send_order_confirmed_notification, send_order_shipped_notification, send_order_delivered_notification, send_order_cancelled_notification
from .serializers import ProductSerializer, CategorySerializer, BrandSerializer, ImageSerializer, BannerSerializer, PromotionSerializer, ProductPromotionSerializer, UserSerializer, CartSerializer, CartItemSerializer, OrderSerializer, OrderDetailSerializer, PaymentSerializer, WishlistSerializer, NotificationSerializer, CustomTokenObtainPairSerializer, SizeSerializer, ColorSerializer, GenderSerializer, ProductAvailabilitySerializer, OrderStatusSerializer, ReviewSerializer, ShippingAddressSerializer
from .permissions import IsAdminOrReadOnly, IsCustomerOrAdmin
from rest_framework import status
from rest_framework.decorators import action ,api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.db.models import F, Q
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import re
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.serializers import Serializer, IntegerField, CharField
from core.models import Product, OrderDetail
import difflib
from django.db.models import Count
from django.utils import timezone
from datetime import datetime, timedelta
from django_filters import rest_framework as django_filters
from decimal import Decimal
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth import authenticate
import secrets
import string

# Chatbot functionality removed

# Create your views here
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class BrandViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer

class SizeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Size.objects.all()
    serializer_class = SizeSerializer

class ColorViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Color.objects.all()
    serializer_class = ColorSerializer

class GenderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Gender.objects.all()
    serializer_class = GenderSerializer

class ImageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Image.objects.all()
    serializer_class = ImageSerializer

class BannerViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer

class PromotionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer

    def perform_create(self, serializer):
        """Override để gửi thông báo khi tạo khuyến mãi mới"""
        promotion = serializer.save()
        
        # Chỉ admin mới có thể tạo khuyến mãi
        if self.request.user.is_staff or (hasattr(self.request.user, 'role') and self.request.user.role == 1):
            # Gửi thông báo cho tất cả user
            from .notification_utils import send_promotion_notification
            from .models import User
            
            users = User.objects.filter(role=0)  # Chỉ gửi cho customer
            title = f"Khuyến mãi mới: {promotion.code}"
            message = f"Chương trình khuyến mãi '{promotion.code}' đã được áp dụng với mức giảm giá {promotion.discount_percentage}%. Hãy nhanh tay mua sắm!"
            
            send_promotion_notification(users, title, message, promotion)

class ProductPromotionViewSet(viewsets.ModelViewSet):
    queryset = ProductPromotion.objects.all()
    serializer_class = ProductPromotionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class CartViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

class CartItemViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)

class OrderPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['user', 'status', 'payment_method']
    search_fields = ['id']
    ordering_fields = ['created_at', 'updated_at', 'total']
    ordering = ['-created_at']
    pagination_class = OrderPagination

    def get_queryset(self):
        """
        Filter orders:
        - Admin (role=1): Xem tất cả orders
        - Customer (role=0): Chỉ xem orders của mình
        """
        user = self.request.user
        
        # Kiểm tra nếu user là admin (role=1)
        if hasattr(user, 'role') and user.role == 1:
            # Admin xem tất cả orders
            queryset = Order.objects.all().order_by('-created_at')
            print(f"🔍 Admin {user.username} - Total orders: {queryset.count()}")
            return queryset
        else:
            # Customer chỉ xem orders của mình
            queryset = Order.objects.filter(user=user).order_by('-created_at')
            print(f"🔍 Customer {user.username} - User orders: {queryset.count()}")
            return queryset

    def perform_create(self, serializer):
        # Chỉ lưu order, KHÔNG tính lại total nếu frontend đã gửi
        order = serializer.save(user=self.request.user)
        
        # Chỉ tính total nếu frontend chưa gửi hoặc gửi = 0
        if not order.total and order.subtotal:
            subtotal = float(order.subtotal or 0)
            discount = float(order.discount_amount or 0)
            shipping = float(order.shipping_fee or 0)
            order.total = subtotal - discount + shipping
            order.save(update_fields=['total'])
            print(f"📦 Calculated total for order {order.id}: {order.total}")
        else:
            print(f"📦 Order {order.id} created with frontend total: {order.total}")
        
        # Gửi thông báo đơn hàng được tạo
        send_order_created_notification(order)

    def update(self, request, *args, **kwargs):
        """Override update để gửi thông báo khi status thay đổi"""
        old_order = self.get_object()
        old_status = old_order.status
        
        response = super().update(request, *args, **kwargs)
        
        if response.status_code == 200:
            new_order = self.get_object()
            new_status = new_order.status
            
            # Gửi thông báo khi status thay đổi
            if old_status != new_status:
                if new_status == 'confirmed':
                    send_order_confirmed_notification(new_order)
                elif new_status == 'shipped':
                    send_order_shipped_notification(new_order)
                elif new_status == 'delivered':
                    send_order_delivered_notification(new_order)
                elif new_status == 'cancelled':
                    send_order_cancelled_notification(new_order)
        
        return response

    @action(detail=True, methods=['post'])
    def confirm_delivery(self, request, pk=None):
        """User xác nhận đã nhận hàng"""
        order = self.get_object()
        
        if order.user != request.user:
            return Response({'error': 'Không có quyền truy cập đơn hàng này'}, status=status.HTTP_403_FORBIDDEN)
        
        if order.status != 'shipped':
            return Response({'error': 'Đơn hàng chưa được giao hàng'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Cập nhật status thành delivered
        order.status = 'delivered'
        order.save()
        
        # Gửi thông báo đã giao hàng thành công
        send_order_delivered_notification(order)
        
        return Response({'message': 'Đã xác nhận nhận hàng thành công'})

    def recalculate_total(self, order_id):
        """Tính lại total của order sau khi có OrderDetail"""
        try:
            order = Order.objects.get(id=order_id)
            
            # Ưu tiên dùng subtotal, discount, shipping từ frontend
            if order.subtotal is not None:
                subtotal = float(order.subtotal or 0)
                discount = float(order.discount_amount or 0)
                shipping = float(order.shipping_fee or 0)
                calculated_total = subtotal - discount + shipping
            else:
                # Fallback: tính từ OrderDetail
                calculated_total = sum(
                    float(detail.unit_price) * detail.quantity 
                    for detail in order.orderdetail_set.all()
                )
            
            if order.total != calculated_total:
                order.total = calculated_total
                order.save(update_fields=['total'])
                print(f"💰 Recalculated order {order_id} total: {calculated_total}")
            
            return order
        except Order.DoesNotExist:
            print(f"❌ Order {order_id} not found for recalculation")
            return None
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def cancel(self, request, pk=None):
        try:
            with transaction.atomic():
                order = self.get_object()
                
                # Admin có thể hủy bất kỳ đơn nào, customer chỉ hủy đơn của mình
                if not (request.user.role == 1 or order.user_id == request.user.id):
                    return Response({"detail": "Bạn không có quyền hủy đơn hàng"}, status=status.HTTP_403_FORBIDDEN)
                    
                if order.status == 'cancelled':
                    return Response({"detail": "Đơn hàng đã bị hủy"}, status=status.HTTP_400_BAD_REQUEST)

                details = OrderDetail.objects.select_related('product').filter(order=order)
                for d in details:
                    Product.objects.filter(pk=d.product_id).update(
                        stock_quantity=F('stock_quantity') + d.quantity,
                        sales_count=F('sales_count') - d.quantity
                    )
                order.status = 'cancelled'
                order.total = 0
                order.save(update_fields=['status','total'])
                
                # Gửi thông báo hủy đơn hàng
                send_order_cancelled_notification(order)
                
                return Response({'message': 'Đã hủy đơn và hoàn kho thành công'})
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def confirm_received(self, request, pk=None):
        try:
            with transaction.atomic():
                order = self.get_object()
                
                # Admin có thể confirm bất kỳ đơn nào, customer chỉ confirm đơn của mình
                if not (request.user.role == 1 or order.user_id == request.user.id):
                    return Response({"detail": "Bạn không có quyền xác nhận đơn hàng"}, status=status.HTTP_403_FORBIDDEN)
                    
                if order.status == 'cancelled':
                    return Response({"detail": "Đơn hàng đã bị hủy"}, status=status.HTTP_400_BAD_REQUEST)
                
                order.status = 'delivered'
                order.save(update_fields=['status'])
                
                if(order.payment_method or '').lower() == 'cod':
                    latest = Payment.objects.filter(order=order).order_by('-payment_date').first()
                    if latest:
                        if latest.status == 'paid':
                            latest.status = 'paid'
                            latest.save(update_fields=['status'])
                    else:
                        Payment.objects.create(
                            order=order,
                            transaction_id = f"COD-{order.id}-{int(timezone.now().timestamp())}",
                            status = 'paid',
                            gateway_response = "COD confirmed by user"
                        )
            return Response({'message': 'Xác nhận đã nhận hàng thành công','status': 'delivered'})
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
                

class OrderDetailViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = OrderDetail.objects.all()
    serializer_class = OrderDetailSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['order']

    def create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)

                product = serializer.validated_data['product']
                qty = int(serializer.validated_data['quantity'])
                order_id = serializer.validated_data['order'].id

                # Khóa dòng sản phẩm để cập nhật an toàn
                product_locked = Product.objects.select_for_update().get(pk=product.id)

                if product_locked.stock_quantity < qty:
                    return Response({"detail": "Số lượng tồn kho không đủ"}, status=status.HTTP_400_BAD_REQUEST)

                # Tạo OrderDetail
                self.perform_create(serializer)

                # Cập nhật stock và sales count
                Product.objects.filter(pk=product_locked.id).update(
                    stock_quantity=F('stock_quantity') - qty,
                    sales_count=F('sales_count') + qty
                )

                # Tính lại total của order (quan trọng!)
                from .views import OrderViewSet
                order_viewset = OrderViewSet()
                order_viewset.recalculate_total(order_id)

                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
                
        except Product.DoesNotExist:
            return Response({"detail": "Sản phẩm không tồn tại"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"❌ OrderDetail create error: {str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class PaymentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['order', 'status']

class WishlistViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)  # Thay customer bằng user

# Removed duplicate NotificationViewSet
      

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class ProductFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    brand = django_filters.CharFilter(field_name='brand__name', lookup_expr='icontains')
    category = django_filters.CharFilter(field_name='category__name', lookup_expr='icontains')
    gender = django_filters.CharFilter(field_name='gender__name', lookup_expr='icontains')
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    
    class Meta:
        model = Product
        fields = []


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('brand', 'category', 'gender').prefetch_related('sizes', 'colors', 'images')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'brand__name', 'category__name']
    ordering_fields = ['price', 'sales_count', 'name']
    ordering = ['-sales_count']  # Sắp xếp theo số lượng bán


class OrderStatusView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        serializer = OrderStatusSerializer(data=request.data)
        if serializer.is_valid():
            order_code = serializer.validated_data['code']
            try:
                order = Order.objects.get(id=order_code, user=request.user)
                return Response({
                    "order_id": order.id,
                    "status": order.status,
                    "total": order.total,
                    "created_at": order.created_at
                })
            except Order.DoesNotExist:
                return Response({"detail": "Order not found"}, status=404)
        return Response(serializer.errors, status=400)


class ProductAvailabilityView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def post(self, request, *args, **kwargs):
        serializer = ProductAvailabilitySerializer(data=request.data)
        if serializer.is_valid():
            query = serializer.validated_data['query']
            products = Product.objects.filter(
                Q(name__icontains=query) | 
                Q(description__icontains=query) |
                Q(brand__name__icontains=query)
            ).select_related('brand', 'category', 'gender').prefetch_related('sizes', 'colors', 'images')
            
            results = []
            for product in products[:10]:  # Limit to 10 results
                results.append({
                    'id': product.id,
                    'name': product.name,
                    'brand': product.brand.name,
                    'price': float(product.price),
                    'stock_quantity': product.stock_quantity,
                    'available': product.stock_quantity > 0
                })
            
            return Response({"products": results})
        return Response(serializer.errors, status=400)


class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        data = request.data
        try:
            user = User.objects.create_user(
                username=data.get('username', ''),
                email=data.get('email', ''),
                password=data.get('password', ''),
                name=data.get('name', ''),
                phone=data.get('phone', ''),
                address=data.get('address', ''),
                role=data.get('role', 0)  # Mặc định là Customer (0)
            )
            return Response({"message": "Đăng ký thành công", "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        
        if not current_password or not new_password:
            return Response({"detail": "Current password and new password are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        if not user.check_password(current_password):
            return Response({"detail": "Current password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()
        
        return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        if not email:
            return Response({"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # Send email with reset link
            reset_link = f"{settings.BACKEND_ORIGIN}/reset-password?token={token}&email={email}"
            send_mail(
                'Reset Password - FootFashion',
                f'Click the link to reset your password: {reset_link}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            
            return Response({"message": "Reset link sent to your email"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ValidateResetTokenView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        token = request.data.get('token')
        email = request.data.get('email')
        
        if not token or not email:
            return Response({"detail": "Token and email are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            if default_token_generator.check_token(user, token):
                return Response({"valid": True}, status=status.HTTP_200_OK)
            else:
                return Response({"valid": False, "detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"valid": False, "detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        token = request.data.get('token')
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not token or not email or not password:
            return Response({"detail": "Token, email and password are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            if default_token_generator.check_token(user, token):
                user.set_password(password)
                user.save()
                return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        return Review.objects.select_related('user', 'product', 'order').order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ShippingAddressViewSet(viewsets.ModelViewSet):
    queryset = ShippingAddress.objects.all()
    serializer_class = ShippingAddressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ShippingAddress.objects.filter(user=self.request.user).order_by('-is_default', '-created_at')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications"""
        count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({"unread_count": count})
    
    @action(detail=False, methods=['post'])
    def mark_as_read(self, request):
        notification_ids = request.data.get('notification_ids', [])
        Notification.objects.filter(
            id__in=notification_ids,
            user=request.user
        ).update(is_read=True)
        return Response({"message": "Notifications marked as read"})
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({"message": "All notifications marked as read"})
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark single notification as read"""
        notification = self.get_object()
        if notification.user != request.user:
            return Response({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        
        notification.is_read = True
        notification.save()
        return Response({"message": "Notification marked as read"})


def guardrail_answer(message, user_id=None, request=None):
    return {"reply": "Chatbot is disabled.", "source": "ai", "products": [], "need_staff": False}


class UnansweredViewSet(viewsets.ReadOnlyModelViewSet):
    pass