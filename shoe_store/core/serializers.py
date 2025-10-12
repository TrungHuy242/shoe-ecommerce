# core/serializers.py
from rest_framework import serializers
from .models import Product, Category, Brand, Image, Banner, Promotion, ProductPromotion, Cart, CartItem, Order, OrderDetail, Payment, Wishlist, Notification, Size, Color, Gender, User, Review, ShippingAddress
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db.models import Avg, Count

def get_product_rating(product_id):
    """Lấy rating trung bình từ bảng Review"""
    avg_rating = Review.objects.filter(product_id=product_id).aggregate(avg=Avg('rating'))['avg']
    return round(avg_rating, 1) if avg_rating else 0.0

def get_product_reviews_count(product_id):
    """Lấy số lượng reviews từ bảng Review"""
    return Review.objects.filter(product_id=product_id).count()

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class GenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gender
        fields = '__all__'

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = '__all__'

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = '__all__'
class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'
        
class ProductSerializer(serializers.ModelSerializer):
    sizes = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Size.objects.all()
    )
    colors = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Color.objects.all()
    )
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    gender = serializers.PrimaryKeyRelatedField(queryset=Gender.objects.all())
    brand = serializers.PrimaryKeyRelatedField(queryset=Brand.objects.all())
    images = ImageSerializer(many=True, read_only=True)
    rating = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'
    
    def get_rating(self, obj):
        return get_product_rating(obj.id)
    
    def get_reviews(self, obj):
        return get_product_reviews_count(obj.id)


class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = '__all__'

class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = '__all__'
    
    def validate_discount_percentage(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("Discount percentage must be between 0 and 100")
        return value
    
    def validate_code(self, value):
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Promotion code must be at least 2 characters long")
        return value.strip().upper()
    
    def validate(self, data):
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        if start_date and end_date and start_date >= end_date:
            raise serializers.ValidationError("End date must be after start date")
        
        return data

class ProductPromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductPromotion
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = '__all__'

class OrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDetail
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
class FAQCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # placeholder
        fields = []
        
class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # placeholder
        fields = []
        
class UnansweredQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = []


class ChatSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # placeholder
        fields = []
        
class ChatBotConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # placeholder
        fields = []

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Ensure FE can recognize role and user profile fields directly from token call
        try:
            data['role'] = getattr(self.user, 'role', 0) or 0
        except Exception:
            data['role'] = 0
        data['user_id'] = self.user.id
        # convenient fields
        data['username'] = self.user.username
        data['name'] = getattr(self.user, 'name', '')
        data['email'] = getattr(self.user, 'email', '')
        return data


# Optional Helper serializers
class ProductAvailabilitySerializer(serializers.Serializer):
    query = serializers.CharField(required=True, allow_blank=False)

class OrderStatusSerializer(serializers.Serializer):
    code = serializers.CharField(required=True, allow_blank=False)

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'product', 'user', 'order', 'user_name', 'user_username', 'rating', 'title', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def validate_rating(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value
    
    def validate_title(self, value):
        if not value or len(value.strip()) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long")
        return value.strip()
    
    def validate_comment(self, value):
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError("Comment must be at least 10 characters long")
        return value.strip()


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = ['id', 'user', 'full_name', 'email', 'phone', 'address', 'city', 'district', 'ward', 'is_default', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        # Tự động gán user hiện tại
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


# Cập nhật OrderSerializer sau khi ShippingAddressSerializer đã được định nghĩa
class OrderSerializer(serializers.ModelSerializer):
    shipping_address = ShippingAddressSerializer(read_only=True)
    shipping_address_id = serializers.PrimaryKeyRelatedField(
        queryset=ShippingAddress.objects.all(),
        source='shipping_address',
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Order
        fields = '__all__'
        depth = 1  # Include related objects


class NotificationSerializer(serializers.ModelSerializer):
    related_product_name = serializers.CharField(source='related_product.name', read_only=True)
    related_product_price = serializers.DecimalField(source='related_product.price', max_digits=10, decimal_places=0, read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'type', 'title', 'message', 'is_read', 'created_at', 'related_order', 
                 'related_product', 'related_product_name', 'related_product_price', 
                 'product_image', 'action_button_text', 'action_url']
        read_only_fields = ['created_at']