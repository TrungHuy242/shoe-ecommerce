from django.shortcuts import render
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings
from .models import Product, Category, Brand, Image, Banner, Promotion, ProductPromotion, Customer, Cart, CartItem, Order, OrderDetail, Payment, Wishlist, Notification, FAQ, ChatBotConversation
from .serializers import ProductSerializer, CategorySerializer, BrandSerializer, ImageSerializer, BannerSerializer, PromotionSerializer, ProductPromotionSerializer, CustomerSerializer, CartSerializer, CartItemSerializer, OrderSerializer, OrderDetailSerializer, PaymentSerializer, WishlistSerializer, NotificationSerializer, FAQSerializer, ChatBotConversationSerializer,CustomTokenObtainPairSerializer
import google.generativeai as genai
from .permissions import IsAdminOrReadOnly, IsCustomerOrAdmin
from django.contrib.auth.models import User
from core.models import Customer
from rest_framework import status

# Create your views here.
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'brand', 'color', 'size', 'price']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'stock_quantity']

    def perform_create(self, serializer):
        # Tự động cập nhật unit_price nếu cần
        serializer.save()
    
    from rest_framework.decorators import action
    from rest_framework.response import Response
    # Gợi ý sản phẩn liên quan dựa theo danh mục
    @action(detail=True, methods=['get'])
    def suggestions(self, request, pk=None):
        product = self.get_object()
        suggestions = Product.objects.filter(category=product.category).exclude(id=pk)[:3]
        serializer =self.get_serializer(suggestions, many=True)
        return Response(serializer.data)
    

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
class ProductPromotionViewSet(viewsets.ModelViewSet):
    queryset = ProductPromotion.objects.all()
    serializer_class = ProductPromotionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsCustomerOrAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['customer', 'status', 'payment_method']
    search_fields = ['id']

    # Tự động tính total_price từ OrderDetail
    def perform_create(self, serializer):
        order = serializer.save()
        order.total_price = sum(detail.unit_price * detail.quantity for detail in order.orderdetail_set.all())
        order.save()
    
class OrderDetailViewSet(viewsets.ModelViewSet):
    queryset = OrderDetail.objects.all()
    serializer_class = OrderDetailSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ChatBotConversationViewSet(viewsets.ModelViewSet):
    queryset = ChatBotConversation.objects.all()
    serializer_class = ChatBotConversationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    

# Chat box
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

class ChatbotView(APIView):
    def post(self, request):
        message = request.data.get('message', '')
        customer_id = request.data.get('customer_id', None)

        prompt = f"""
        Bạn là chatbot tư vấn thân thiện cho cửa hàng giày dép. Hãy trả lời bằng tiếng Việt, vui vẻ, hữu ích.
        Tin nhắn người dùng: "{message}"
        Nếu hỏi về sản phẩm (giá, size, màu), gợi ý sản phẩm liên quan với link mua (giả định /products/{{id}}).
        Nếu hỏi FAQ (đổi trả, vận chuyển), trả lời từ FAQ.
        Nếu tra cứu đơn hàng, yêu cầu mã đơn và query.
        Nếu không hiểu, chuyển sang nhân viên (gửi notification).
        Giữ phản hồi ngắn gọn, thân thiện.
        """
        gemini_response = model.generate_content(prompt).text

        reply = gemini_response
        if "giá" in message.lower() or "sản phẩm" in message.lower():
            products = Product.objects.filter(name__icontains="giày")[:3]
            if products.exists():
                suggestions = [f"{p.name} - Giá: {p.price} VND - Link: /products/{p.id}" for p in products]
                reply += "\nGợi ý sản phẩm: " + ", ".join(suggestions)
            else:
                reply += "\nHiện tại chưa có sản phẩm để gợi ý. Vui lòng quay lại sau nhé!"
        elif "đơn hàng" in message.lower():
            if customer_id:
                orders = Order.objects.filter(customer_id=customer_id)
                if orders.exists():
                    reply += "\nĐơn hàng của bạn: " + ", ".join([f"Mã: {o.id}, Trạng thái: {o.status}" for o in orders])
                else:
                    reply += "\nKhông tìm thấy đơn hàng nào."
            else:
                reply += "\nVui lòng đăng nhập để tra cứu đơn hàng."
        elif "faq" in message.lower():
            faqs = FAQ.objects.all()[:2]
            if faqs.exists():
                reply += "\nCâu trả lời FAQ: " + " ".join([f"{q.question}: {q.answer}" for q in faqs])
            else:
                reply += "\nChưa có thông tin FAQ. Vui lòng liên hệ nhân viên!"

        if customer_id:
            ChatBotConversation.objects.create(customer_id=customer_id, message_content=message, is_by_staff=False)

        if "không hiểu" in gemini_response.lower():
            reply += "\nTôi sẽ chuyển bạn đến nhân viên tư vấn!"

        return Response({"reply": reply})

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_401_UNAUTHORIZED:
            return Response({"detail": "Sai tài khoản hoặc mật khẩu"}, status=status.HTTP_401_UNAUTHORIZED)
        return response

class RegisterView(APIView):
    def post(self, request):
        data = request.data
        try:
            if User.objects.filter(username=data['username']).exists():
                return Response({"username": ["Tên đăng nhập đã tồn tại"]}, status=status.HTTP_400_BAD_REQUEST)
            if User.objects.filter(email=data['email']).exists():
                return Response({"email": ["Email đã tồn tại"]}, status=status.HTTP_400_BAD_REQUEST)
            user = User.objects.create_user(username=data['username'], email=data['email'], password=data['password'])
            Customer.objects.create(user=user, name=data['name'], email=data['email'], role=0)
            return Response({"message": "Đăng ký thành công"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)