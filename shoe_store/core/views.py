# core/views.py
from ast import Or
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings
from urllib3 import response
from .models import Product, Category, Brand, Image, Banner, Promotion, ProductPromotion, User, Cart, CartItem, Order, OrderDetail, Payment, Wishlist, Notification, Size, Color, Gender
from .serializers import ProductSerializer, CategorySerializer, BrandSerializer, ImageSerializer, BannerSerializer, PromotionSerializer, ProductPromotionSerializer, UserSerializer, CartSerializer, CartItemSerializer, OrderSerializer, OrderDetailSerializer, PaymentSerializer, WishlistSerializer, NotificationSerializer, CustomTokenObtainPairSerializer, SizeSerializer, ColorSerializer, GenderSerializer, ProductAvailabilitySerializer, OrderStatusSerializer
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

class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
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
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def confirm_received(self, request, pk=None):
        try:
            with transaction.atomic():
                order = self.get_object()
                if not (request.user.is_superuser or order.user_id == request.user.id):
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
            return Response({'message': 'Xác nhận đã nhận hàng thành công','status': 'delivered'})
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

class NotificationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)  # Thay customer bằng user
      

class ChatbotView(APIView):
    def post(self, request):
        return Response({"detail": "Chatbot is disabled."}, status=404)

        # Nếu chỉ hỏi phù hợp hay không -> xin phép gợi ý
        suitability_only = any(kw in msg_lower for kw in [
            "phù hợp", "phu hop", "được không", "duoc khong", "ok không", "ok khong", "thế nào", "the nao"
        ])
        if suitability_only and not explicit_intent:
            reply = (reply or "Dạ mình nghĩ phù hợp đó ạ.") + " Bạn có muốn mình gợi ý vài mẫu để tham khảo không? Trả lời 'có' để xem."
            products = []
            request.session['awaiting_suggestion'] = True
            request.session['awaiting_text'] = message

        # Lấy sản phẩm trực tiếp từ DB theo yêu cầu: name/brand + gender/size/color (2-3 sản phẩm)
        if explicit_intent:
            qs = Product.objects.select_related('brand','category','gender').prefetch_related('sizes','colors','images').all()

            # Phát hiện giới tính
            gender = None
            if re.search(r"\bnam\b", msg_lower):
                gender = "Nam"
                qs = qs.filter(gender__name__icontains=gender)
            elif re.search(r"\bnữ\b|\bnu\b", msg_lower):
                gender = "Nữ"
                qs = qs.filter(gender__name__icontains=gender)

            # Phát hiện size
            import re as _re
            size_match = _re.search(r"size\s*(\d+)", msg_lower) or _re.search(r"\b(\d{2})\b", msg_lower)
            if size_match:
                qs = qs.filter(sizes__value__iexact=size_match.group(1))

            # Phát hiện màu
            colors = list(Product.objects.values_list('colors__value', flat=True).distinct())
            color_token = None
            m_color = _re.search(r"màu\s+([\wÀ-ỹ]+)", msg_lower)
            if m_color:
                color_token = m_color.group(1)
            if not color_token:
                for c in colors:
                    if c and c.lower() in msg_lower:
                        color_token = c
                        break
            if color_token:
                qs = qs.filter(colors__value__iexact=color_token)

            # Tên/Thương hiệu
            brand_token = None
            # Cụm 'thương hiệu X' hoặc 'brand X'
            m_brand_phrase = re.search(r"(?:thương\s*hiệu|brand)\s+([\wÀ-ỹ]+)", msg_lower)
            if m_brand_phrase:
                brand_token = m_brand_phrase.group(1)
            m_brand = re.search(r"\b(adidas|puma|nike|converse|vans)\b", msg_lower)
            if m_brand:
                brand_token = m_brand.group(1)

            strict_qs = qs
            if brand_token:
                strict_qs = strict_qs.filter(brand__name__icontains=brand_token)
            strict_qs = strict_qs.filter(
                Q(name__icontains=message) | Q(brand__name__icontains=message)
            ) if message else strict_qs

            # Ý định 'gợi ý' và 'bán chạy'/'hot'
            suggest_intent = any(k in msg_lower for k in ["gợi ý", "goi y", "recommend", "tư vấn", "tu van"]) 
            view_intent = any(k in msg_lower for k in ["xem", "show", "cho tôi xem", "cho toi xem"]) 
            hot_intent = suggest_intent or any(k in msg_lower for k in ["bán chạy", "ban chay", "hot", "lượt bán nhiều nhất", "luot ban nhieu nhat"]) 
            limit_n = 2 if hot_intent else 3

            found = []
            base_qs = strict_qs if strict_qs.exists() else qs
            if hot_intent:
                base_qs = base_qs.order_by('-sales_count')
            # Nếu 'xem' kèm brand xác định -> ưu tiên lọc theo brand, không fallback text
            if view_intent and brand_token:
                base_qs = qs.filter(brand__name__icontains=brand_token)
            for p in base_qs.distinct()[:limit_n]:
                img = p.images.first()
                if img and img.image:
                    try:
                        img_url = img.image.url
                    except Exception:
                        img_url = f"/media/{img.image}"
                else:
                    img_url = ""
                if request is not None and img_url and img_url.startswith('/'):
                    try:
                        img_url = request.build_absolute_uri(img_url)
                    except Exception:
                        pass
                found.append({
                    "id": p.id,
                    "name": p.name,
                    "price": float(p.price),
                    "image_url": img_url,
                    "link": f"/product/{p.id}",
                    "sizes": list(p.sizes.values_list('value', flat=True)),
                    "colors": list(p.colors.values_list('value', flat=True)),
                    "brand": p.brand.name if p.brand else "",
                    "sales_count": p.sales_count
                })

            # Fallback rộng theo category nếu chưa có kết quả
            if not found and gender and not (view_intent and brand_token):
                fallback_cat = f"Giày {gender}"
                fb_qs = Product.objects.select_related('brand','category','gender').prefetch_related('sizes','colors','images').filter(
                    category__name__icontains=fallback_cat
                )
                if hot_intent:
                    fb_qs = fb_qs.order_by('-sales_count')
                fb_qs = fb_qs[:limit_n]
                for p in fb_qs:
                    img = p.images.first()
                    if img and img.image:
                        try:
                            img_url = img.image.url
                        except Exception:
                            img_url = f"/media/{img.image}"
                    else:
                        img_url = ""
                    if request is not None and img_url and img_url.startswith('/'):
                        try:
                            img_url = request.build_absolute_uri(img_url)
                        except Exception:
                            pass
                    found.append({
                        "id": p.id,
                        "name": p.name,
                        "price": float(p.price),
                        "image_url": img_url,
                        "link": f"/product/{p.id}",
                        "sizes": list(p.sizes.values_list('value', flat=True)),
                        "colors": list(p.colors.values_list('value', flat=True)),
                        "brand": p.brand.name if p.brand else "",
                        "sales_count": p.sales_count
                    })

            if found:
                products = found
                # Tạo reply ngắn gọn dựa AI có context sản phẩm (tránh xin lỗi)
                try:
                    ai = simple_ai.generate(message, user_id=user_id, products=products)
                    reply = ai.get("reply") or reply
                except Exception:
                    # Fallback văn bản đơn giản theo intent
                    if view_intent and brand_token:
                        reply = reply or f"Mình gửi bạn vài mẫu {brand_token} để bạn xem nha!"
                    elif hot_intent:
                        reply = reply or "Top bán chạy nè!"
                    else:
                        reply = reply or "Mình gửi bạn vài gợi ý nha!"

                # Lưu vào session cho 'xem hình' ở lượt sau
                try:
                    request.session['context_products'] = products
                except Exception:
                    pass
                if brand_token:
                    request.session['query_brand'] = brand_token
                # Nếu là 'xem' theo brand: trả sớm, không qua các nhánh fallback khác
                if view_intent and brand_token:
                    conv = ChatBotConversation.objects.create(
                        user_id=user_id,
                        message_content=message,
                        reply_content=reply,
                        source="ai"
                    )
                    return Response({
                        "reply": reply,
                        "products": products,
                        "conversation_id": conv.id,
                        "source": "ai",
                        "need_staff": False,
                        "session_id": session_id,
                        "query_brand": brand_token
                    })
        # Nếu người dùng chỉ muốn "xem hình" thì ưu tiên trả về products của lượt trước
        see_image_intent = any(k in msg_lower for k in ["xem hình", "xem hinh", "hình ảnh", "hinh anh", "xem ảnh", "xem anh"])
        if see_image_intent and not products:
            prev = request.session.get('context_products') or []
            if prev:
                products = prev
                reply = (reply or "Mình gửi lại hình các mẫu vừa gợi ý nha.")

        # Fallback AI ngắn gọn nếu guardrail không đủ
        if source == 'ai' and not products and "Xin lỗi, mình chưa có thông tin" in reply:
            composed = (f"NGỮ CẢNH 10 PHÚT GẦN NHẤT:\n{history_text}\n——\nCÂU HỎI: {message}") if history_text else message
            # Truyền products ngữ cảnh (nếu có) để AI nói tự nhiên hơn
            ctx_products = request.session.get('context_products') or []
            ai = simple_ai.generate(composed, user_id=user_id, products=ctx_products)
            reply = ai.get("reply") or reply
            # Không ép products ở đây; sanity filter phía trên đã xử lý ý định xem/gợi ý

        # Lưu/consolidate fail_count trong ChatSession
        cs, _ = ChatSession.objects.get_or_create(session_id=session_id, defaults={"user_id": user_id, "expires_at": now + timedelta(minutes=10)})
        if "Xin lỗi" in reply and not products:
            cs.fail_count = (cs.fail_count or 0) + 1
            need_staff = need_staff or (cs.fail_count >= 2)
        else:
            cs.fail_count = 0
        cs.last_activity = now
        cs.expires_at = now + timedelta(minutes=10)
        cs.save(update_fields=['fail_count', 'last_activity', 'expires_at'])

        # Lưu hội thoại
        conv = ChatBotConversation.objects.create(
            user_id=user_id,
            message_content=message,
            reply_content=reply,
            source=source
        )

        # Lưu unanswered nếu fallback
        if "Xin lỗi" in reply and not products:
            ua, created = UnansweredQuestion.objects.get_or_create(
                message=message,
                defaults={'user_id': user_id}
            )
            if not created:
                ua.hit_count = (ua.hit_count or 1) + 1
                ua.save(update_fields=['hit_count', 'last_seen_at'])

        return Response({
            "reply": reply,
            "products": products,
            "conversation_id": conv.id,
            "source": source,
            "need_staff": need_staff,
            "session_id": session_id,
            "query_brand": request.session.get('query_brand') or ""
        })

# Thêm API cho thống kê chatbot
    

# Thêm API xuất CSV
    

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

class ProductRateSerializer(Serializer):
    rating = IntegerField(min_value=1, max_value=5)
    comment = CharField(required=False, allow_blank=True)

class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(method='filter_category')  # nhận id hoặc tên
    category__name = django_filters.CharFilter(field_name='category__name', lookup_expr='iexact')
    gender__name = django_filters.CharFilter(field_name='gender__name', lookup_expr='iexact')
    brand__name = django_filters.CharFilter(field_name='brand__name', lookup_expr='iexact')
    sizes__value = django_filters.CharFilter(field_name='sizes__value', lookup_expr='iexact')
    colors__value = django_filters.CharFilter(field_name='colors__value', lookup_expr='iexact')
    price__gte = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price__lte = django_filters.NumberFilter(field_name='price', lookup_expr='lte')

    def filter_category(self, qs, name, value):
        v = (value or '').strip()
        if v.isdigit():
            return qs.filter(category_id=int(v))
        return qs.filter(category__name__iexact=v)

    class Meta:
        model = Product
        fields = []

class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'stock_quantity', 'sales_count']
    
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

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def rate(self, request, pk=None):
        ser = ProductRateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        rating = ser.validated_data['rating']

        purchased = OrderDetail.objects.filter(
            product_id=pk, order__user=request.user, order__status='delivered'
        ).exists()
        if not purchased:
            return Response({'detail': 'Bạn chưa mua sản phẩm này.'}, status=status.HTTP_403_FORBIDDEN)

        p = Product.objects.get(pk=pk)
        cur_reviews = int(p.reviews or 0)
        cur_rating = float(p.rating or 0.0)
        new_reviews = cur_reviews + 1
        new_rating = ((cur_rating * cur_reviews) + rating) / new_reviews
        p.reviews = new_reviews
        p.rating = new_rating
        p.save(update_fields=['reviews', 'rating'])
        return Response({'rating': p.rating, 'reviews': p.reviews}, status=status.HTTP_200_OK)

def build_product_suggestions(query_text, request=None, limit=5, filters=None):
    q = (query_text or "").lower()

    size = None
    for s in Product.objects.values_list('sizes__value', flat=True).distinct():
        if s and s.lower() in q:
            size = s
            break
    color = None
    for c in Product.objects.values_list('colors__value', flat=True).distinct():
        if c and c.lower() in q:
            color = c
            break
    brand = None
    for b in Product.objects.values_list('brand__name', flat=True).distinct():
        if b and b.lower() in q:
            brand = b
            break
    gender = None
    if ' nam ' in f" {q} ":
        gender = 'Nam'
    if ' nữ ' in f" {q} " or ' nu ' in f" {q} ":
        gender = 'Nữ'

    qs = Product.objects.select_related('brand','category','gender').prefetch_related('sizes','colors','images').all()
    if brand:
        qs = qs.filter(brand__name__iexact=brand)
    if size:
        qs = qs.filter(sizes__value__iexact=size)
    if color:
        qs = qs.filter(colors__value__iexact=color)
    if gender:
        qs = qs.filter(gender__name__iexact=gender)

    # apply explicit filters if provided
    f = filters or {}
    if f.get('brand'):
        qs = qs.filter(brand__name__iexact=f['brand'])
    if f.get('size'):
        qs = qs.filter(sizes__value__iexact=f['size'])
    if f.get('color'):
        qs = qs.filter(colors__value__iexact=f['color'])
    if f.get('gender'):
        qs = qs.filter(gender__name__iexact=f['gender'])
    if f.get('price_min') is not None:
        qs = qs.filter(price__gte=f['price_min'])
    if f.get('price_max') is not None:
        qs = qs.filter(price__lte=f['price_max'])

    origin = getattr(settings, 'BACKEND_ORIGIN', 'http://127.0.0.1:8000')

    def _collect(qset, n):
        out = []
        for p in qset.distinct()[:n]:
            img = p.images.first()
            if img and img.image:
                try:
                    img_url = img.image.url
                except Exception:
                    img_url = f"/media/{img.image}"
                if request is not None and img_url.startswith('/'):
                    try:
                        img_url = request.build_absolute_uri(img_url)
                    except Exception:
                        pass
                else:
                    if img_url.startswith('/'):
                        img_url = f"{origin}{img_url}"
            else:
                img_url = ""
            out.append({
                "id": p.id,
                "name": p.name,
                "price": float(p.price),
                "brand": p.brand.name if p.brand else "",
                "sizes": list(p.sizes.values_list('value', flat=True)),
                "colors": list(p.colors.values_list('value', flat=True)),
                "image_url": img_url,
                "link": f"/product/{p.id}"
            })
        return out

    items = _collect(qs, limit)
    if items:
        return items

    # Progressive relaxation: drop size -> drop brand -> drop gender, keep price/color if any
    fdict = dict(f) if f else {}
    base_qs = Product.objects.select_related('brand','category','gender').prefetch_related('sizes','colors','images').all()

    def _apply(qset, ff):
        qx = qset
        if ff.get('brand'):
            qx = qx.filter(brand__name__iexact=ff['brand'])
        if ff.get('size'):
            qx = qx.filter(sizes__value__iexact=ff['size'])
        if ff.get('color'):
            qx = qx.filter(colors__value__iexact=ff['color'])
        if ff.get('gender'):
            qx = qx.filter(gender__name__iexact=ff['gender'])
        if ff.get('price_min') is not None:
            qx = qx.filter(price__gte=ff['price_min'])
        if ff.get('price_max') is not None:
            qx = qx.filter(price__lte=ff['price_max'])
        return qx

    if fdict.get('size'):
        ff = dict(fdict); ff.pop('size', None)
        items = _collect(_apply(base_qs, ff), limit)
        if items:
            return items
    if fdict.get('brand'):
        ff = dict(fdict); ff.pop('brand', None)
        items = _collect(_apply(base_qs, ff), limit)
        if items:
            return items
    if fdict.get('gender'):
        ff = dict(fdict); ff.pop('gender', None)
        items = _collect(_apply(base_qs, ff), limit)
        if items:
            return items

    # Final fallback: top sellers
    return _collect(base_qs.order_by('-sales_count'), limit)
class ProductAvailabilityView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        ser = ProductAvailabilitySerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        query_text = ser.validated_data['query']
        items = build_product_suggestions(query_text, request=request, limit=5)
        return Response({"products": items})

class OrderStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]  # yêu cầu login

    def post(self, request):
        from .serializers import OrderStatusSerializer
        from .models import Order

        ser = OrderStatusSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        code = ser.validated_data['code']

        try:
            order_id = int(code.strip())
            order = Order.objects.get(pk=order_id, user=request.user)
        except Exception:
            return Response({"status": "not_found"}, status=404)

        return Response({
            "id": order.id,
            "status": order.status,
            "payment_status": order.payment_status,
            "total": float(order.total),
            "created_at": order.created_at
        })

def guardrail_answer(message, user_id=None, request=None):
    return {"reply": "Chatbot is disabled.", "source": "ai", "products": [], "need_staff": False}

class UnansweredViewSet(viewsets.ReadOnlyModelViewSet):
    pass