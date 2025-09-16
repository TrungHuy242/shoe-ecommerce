# core/views.py
from ast import Or
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings
from .models import Product, Category, Brand, Image, Banner, Promotion, ProductPromotion, User, Cart, CartItem, Order, OrderDetail, Payment, Wishlist, Notification, FAQ, ChatBotConversation, Size, Color, Gender
from .serializers import ProductSerializer, CategorySerializer, BrandSerializer, ImageSerializer, BannerSerializer, PromotionSerializer, ProductPromotionSerializer, UserSerializer, CartSerializer, CartItemSerializer, OrderSerializer, OrderDetailSerializer, PaymentSerializer, WishlistSerializer, NotificationSerializer, FAQSerializer, ChatBotConversationSerializer, CustomTokenObtainPairSerializer, SizeSerializer, ColorSerializer, GenderSerializer
import google.generativeai as genai
from .permissions import IsAdminOrReadOnly, IsCustomerOrAdmin
from rest_framework import status
from rest_framework.decorators import action ,api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.db.models import F


# Create your views here.
# Create your views here.
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'category__name': ['exact'],
        'gender__name': ['exact'],
        'brand__name': ['exact'],
        'sizes__value': ['exact'],
        'colors__value': ['exact'],
        'price': ['gte', 'lte'],
    }
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'stock_quantity']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        sort = self.request.query_params.get('sort', '')
        if sort == 'price-asc':
            queryset = queryset.order_by('price')
        elif sort == 'price-desc':
            queryset = queryset.order_by('-price')
        elif sort == 'newest':
            queryset = queryset.order_by('-id')  # Sắp xếp theo ID giảm dần (mới nhất)
        print(f"Filtered queryset: {list(queryset.values('id', 'name', 'category__name', 'gender__name', 'brand__name'))}")
        return queryset

    def perform_create(self, serializer):
        product = serializer.save()
        images_data = self.request.FILES.getlist('images')
        for image_data in images_data:
            Image.objects.create(product=product, image=image_data)

    def update(self, request, pk=None):
        product = self.get_object()
        serializer = self.get_serializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            # Handle new images
            new_images = request.FILES.getlist('images')
            for image in new_images:
                Image.objects.create(product=product, image=image)

            # Handle images to delete
            images_to_delete = request.data.getlist('images_to_delete')
            for image_id in images_to_delete:
                try:
                    image = Image.objects.get(pk=image_id, product=product)
                    image.delete()
                except Image.DoesNotExist:
                    pass  # Handle the case where the image doesn't exist

            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    @action(detail=True, methods=['get'])
    def suggestions(self, request, pk=None):
        product = self.get_object()
        suggestions = Product.objects.filter(category=product.category).exclude(id=pk)[:3]
        serializer = self.get_serializer(suggestions, many=True)
        return Response(serializer.data)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save()

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]  # Đổi thành AllowAny nếu muốn công khai

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [AllowAny]  # Đổi thành AllowAny nếu muốn công khai

class SizeViewSet(viewsets.ModelViewSet):
    queryset = Size.objects.all()
    serializer_class = SizeSerializer
    permission_classes = [IsAdminOrReadOnly]

class ColorViewSet(viewsets.ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer
    permission_classes = [IsAdminOrReadOnly]

class GenderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Gender.objects.all()
    serializer_class = GenderSerializer
    permission_classes = [AllowAny]  # Thay IsAuthenticatedOrReadOnly bằng AllowAny

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

class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsCustomerOrAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['user', 'status', 'payment_method']  # Thay 'customer' bằng 'user'
    search_fields = ['id']

    def perform_create(self, serializer):
        order = serializer.save(user=self.request.user)  # Gán user hiện tại
        order.total = sum(detail.unit_price * detail.quantity for detail in order.orderdetail_set.all())
        order.save()
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def cancel(self, request, pk=None):
        try:
            with transaction.atomic():
                order = self.get_object()
                if not (request.user.is_superuser or order.user_id == request.user.id):
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
                return Response({'message': 'Đã hủy đơn và hoàn kho thành công'})
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class OrderDetailViewSet(viewsets.ModelViewSet):
    queryset = OrderDetail.objects.all()
    serializer_class = OrderDetailSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['order']

    def create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)

                product = serializer.validated_data['product']
                qty = int(serializer.validated_data['quantity'])

                # khóa dòng sản phẩm để cập nhật an toàn
                product_locked = Product.objects.select_for_update().get(pk=product.id)

                if product_locked.stock_quantity < qty:
                    return Response({"detail": "Số lượng tồn kho không đủ"}, status=status.HTTP_400_BAD_REQUEST)

                self.perform_create(serializer)

                Product.objects.filter(pk=product_locked.id).update(
                    stock_quantity=F('stock_quantity') - qty,
                    sales_count=F('sales_count') + qty
                )

                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Product.DoesNotExist:
            return Response({"detail": "Sản phẩm không tồn tại"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)  # Thay customer bằng user

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)  # Thay customer bằng user

class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ChatBotConversationViewSet(viewsets.ModelViewSet):
    queryset = ChatBotConversation.objects.all()
    serializer_class = ChatBotConversationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return ChatBotConversation.objects.filter(user=self.request.user)  # Thay customer bằng user

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

class ChatbotView(APIView):
    def post(self, request):
        message = request.data.get('message', '')
        user_id = request.data.get('user_id', None)  # Thay customer_id bằng user_id

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
            if user_id:
                orders = Order.objects.filter(user_id=user_id)
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

        if user_id:
            ChatBotConversation.objects.create(user_id=user_id, message_content=message, is_by_staff=False)

        if "không hiểu" in gemini_response.lower():
            reply += "\nTôi sẽ chuyển bạn đến nhân viên tư vấn!"
            # Tạo notification (giả lập)
            Notification.objects.create(user_id=user_id, title="Chuyển sang nhân viên", type="chat", related_id=0)

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
            user = User.objects.create_user(
                username=data['username'],
                email=data['email'],
                password=data['password'],
                name=data.get('name', ''),
                phone=data.get('phone', ''),
                address=data.get('address', ''),
                role=data.get('role', 0)  # Mặc định là Customer (0)
            )
            return Response({"message": "Đăng ký thành công", "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_customer_by_user(request):
    user = request.user  # Lấy user hiện tại từ JWT
    serializer = UserSerializer(user)
    return Response(serializer.data)