# core/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser  # Sử dụng AbstractUser để tùy chỉnh User
from django.utils import timezone

class User(AbstractUser):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    role = models.IntegerField(choices=((0, 'Customer'), (1, 'Admin')), default=0)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.username

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    image = models.ImageField(upload_to='categories/', null=True, blank=True)
    description = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Brand(models.Model):
    name = models.CharField(max_length=50)
    image = models.ImageField(upload_to='brands/', null=True, blank=True)
    
    def __str__(self):
        return self.name

class Size(models.Model):
    value = models.CharField(max_length=10, unique=True)
    
    def __str__(self):
        return self.value
    
class Color(models.Model):
    value = models.CharField(max_length=20, unique=True)
    
    def __str__(self):
        return self.value

class Gender(models.Model):
    name = models.CharField(max_length=20, unique=True)
    
    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    originalPrice = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock_quantity = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    gender = models.ForeignKey(Gender, on_delete=models.CASCADE, related_name='products', null=True, blank=True)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='products')
    sizes = models.ManyToManyField(Size, related_name='products')
    colors = models.ManyToManyField(Color, related_name='products')
    sales_count = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class Image(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='product_images/', blank=True, null=True, default='')

    def __str__(self):
        return f"Image for {self.product.name}"


class Banner(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='banners/', blank=True, null=True)
    link = models.URLField(blank=True, null=True, default='')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)

class Promotion(models.Model):
    code = models.CharField(max_length=20, unique=True)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True) 
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.code} - {self.discount_percentage}%"

class ProductPromotion(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    promotion = models.ForeignKey(Promotion, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)  # Cho phép null
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, default=None)
    shipping_address = models.ForeignKey('ShippingAddress', on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)  # Thêm
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)  # Thêm
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)  # Thêm
    promotion_code = models.CharField(max_length=20, blank=True, null=True)  # Thêm
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Chờ xử lý'),
            ('confirmed', 'Đã xác nhận'),
            ('shipped', 'Đang giao hàng'),
            ('delivered', 'Đã giao hàng'),
            ('cancelled', 'Đã hủy')
        ],
        default='pending'
    )
    payment_method = models.CharField(max_length=50, blank=True, null=True, default='')
    payment_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('processing', 'Processing'),
            ('paid', 'Paid'),
            ('refunded', 'Refunded'),
            ('failed', 'Failed')
        ],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

class OrderDetail(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    size = models.CharField(max_length=20, blank=True, null=True)
    color = models.CharField(max_length=30, blank=True, null=True)

class Payment(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    transaction_id = models.CharField(max_length=100)
    status = models.CharField(max_length=20)
    payment_date = models.DateTimeField(auto_now_add=True)
    gateway_response = models.TextField()

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, default=None)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    added_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order = models.ForeignKey('Order', on_delete=models.CASCADE, null=True, blank=True)  # Thêm trường order
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    title = models.CharField(max_length=100)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('product', 'user', 'order')  # Mỗi user chỉ đánh giá 1 lần cho 1 sản phẩm trong 1 đơn hàng
    
    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.rating}⭐)"


class ShippingAddress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shipping_addresses')
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    district = models.CharField(max_length=100, blank=True, null=True)
    ward = models.CharField(max_length=100, blank=True, null=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_default', '-created_at']
    
    def __str__(self):
        return f"{self.full_name} - {self.address}, {self.city}"
    
    def save(self, *args, **kwargs):
        # Nếu đặt làm default, bỏ default của các địa chỉ khác
        if self.is_default:
            ShippingAddress.objects.filter(user=self.user, is_default=True).update(is_default=False)
        super().save(*args, **kwargs)


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('order_confirmed', 'Đơn hàng được xác nhận'),
        ('order_shipped', 'Đơn hàng đã giao hàng'),
        ('order_delivered', 'Đơn hàng đã giao thành công'),
        ('order_cancelled', 'Đơn hàng bị hủy'),
        ('promotion', 'Khuyến mãi mới'),
        ('system', 'Thông báo hệ thống'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField(default='')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    related_order = models.ForeignKey('Order', on_delete=models.CASCADE, null=True, blank=True)
    related_product = models.ForeignKey('Product', on_delete=models.CASCADE, null=True, blank=True)
    product_image = models.URLField(max_length=500, blank=True, null=True)
    action_button_text = models.CharField(max_length=50, blank=True, null=True)
    action_url = models.CharField(max_length=200, blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"


class ChatbotConversation(models.Model):
    """Model để lưu lịch sử hội thoại với AI chatbot"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    session_id = models.CharField(max_length=100, null=True, blank=True)  # Cho anonymous users
    message = models.TextField()
    response = models.TextField()
    intent = models.CharField(max_length=50)
    response_type = models.CharField(max_length=20, default='message')
    sentiment = models.JSONField(null=True, blank=True)
    confidence_score = models.FloatField(default=0.0)
    processing_time = models.FloatField(default=0.0)  # Thời gian xử lý (ms)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Chatbot Conversation'
        verbose_name_plural = 'Chatbot Conversations'
    
    def __str__(self):
        user_info = self.user.username if self.user else f"Anonymous-{self.session_id}"
        return f"{user_info} - {self.intent} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class ChatbotFeedback(models.Model):
    """Model để lưu feedback của user về chatbot"""
    user_id = models.CharField(max_length=100, null=True, blank=True)  # User ID hoặc None
    session_id = models.CharField(max_length=100, null=True, blank=True)  # Session ID cho anonymous users
    message = models.TextField(blank=True)  # User's original message
    response = models.TextField(blank=True)  # Bot's response
    intent = models.CharField(max_length=50, blank=True)  # Intent detected
    feedback_type = models.CharField(max_length=20, choices=[('positive', 'Positive'), ('negative', 'Negative')], default='positive')  # Thumbs up/down
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Feedback {self.feedback_type} - {self.intent} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class ChatbotMetrics(models.Model):
    """Model để lưu metrics và analytics của chatbot"""
    date = models.DateField(unique=True, db_index=True)
    total_interactions = models.IntegerField(default=0)  # Tổng số lượt tương tác
    unique_users = models.IntegerField(default=0)  # Số user duy nhất
    unique_sessions = models.IntegerField(default=0)  # Số session duy nhất
    product_searches = models.IntegerField(default=0)  # Số lượt tìm kiếm sản phẩm
    product_clicks = models.IntegerField(default=0)  # Số lượt click vào sản phẩm
    product_purchases = models.IntegerField(default=0)  # Số lượt mua hàng từ chatbot
    promotion_views = models.IntegerField(default=0)  # Số lượt xem khuyến mãi
    order_queries = models.IntegerField(default=0)  # Số lượt hỏi về đơn hàng
    positive_feedback = models.IntegerField(default=0)  # Số feedback tích cực
    negative_feedback = models.IntegerField(default=0)  # Số feedback tiêu cực
    avg_confidence_score = models.FloatField(default=0.0)  # Điểm confidence trung bình
    avg_processing_time = models.FloatField(default=0.0)  # Thời gian xử lý trung bình (ms)
    conversion_rate = models.FloatField(default=0.0)  # Tỷ lệ chuyển đổi (product_clicks / product_searches)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date']
        verbose_name = 'Chatbot Metric'
        verbose_name_plural = 'Chatbot Metrics'
    
    def __str__(self):
        return f"Metrics {self.date} - {self.total_interactions} interactions"
    
    def calculate_conversion_rate(self):
        """Tính tỷ lệ chuyển đổi"""
        if self.product_searches > 0:
            self.conversion_rate = (self.product_clicks / self.product_searches) * 100
        else:
            self.conversion_rate = 0.0
        return self.conversion_rate


class IntentTraining(models.Model):
    """Model để lưu training data cho intents"""
    intent_name = models.CharField(max_length=50, unique=True)  # Ví dụ: "product_search", "ask_size"
    description = models.TextField(blank=True)  # Mô tả intent
    keywords = models.JSONField(default=list)  # List keywords: ["tìm", "search", "giày"]
    phrases = models.JSONField(default=list)  # List phrases: ["tìm giày nike", "cho tôi xem sản phẩm"]
    response_template = models.TextField(blank=True)  # Template response
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['intent_name']
        verbose_name = 'Intent Training'
        verbose_name_plural = 'Intent Training Data'
    
    def __str__(self):
        return f"{self.intent_name} ({len(self.keywords)} keywords, {len(self.phrases)} phrases)"


class BotConfig(models.Model):
    """Model để lưu cấu hình bot (response rules, features)"""
    key = models.CharField(max_length=100, unique=True)  # Ví dụ: "auto_show_links", "alternatives_limit"
    value = models.JSONField()  # Giá trị config (có thể là bool, int, string, object)
    description = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['key']
        verbose_name = 'Bot Configuration'
        verbose_name_plural = 'Bot Configurations'
    
    def __str__(self):
        return f"{self.key} = {self.value}"


class ConversationTag(models.Model):
    """Model để tag conversations cho training"""
    conversation = models.ForeignKey(ChatbotConversation, on_delete=models.CASCADE, related_name='tags')
    tag_name = models.CharField(max_length=50)  # Ví dụ: "fallback", "wrong_intent", "needs_training"
    note = models.TextField(blank=True)  # Ghi chú cho admin
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ('conversation', 'tag_name')
    
    def __str__(self):
        return f"{self.tag_name} - {self.conversation.id}"


class Alert(models.Model):
    """Model để lưu alerts và notifications cho admin"""
    ALERT_TYPES = [
        ('high_fallback', 'High Fallback Rate'),
        ('api_error', 'API Error'),
        ('db_error', 'Database Error'),
        ('low_confidence', 'Low Confidence Score'),
        ('slow_response', 'Slow Response Time'),
        ('system', 'System Alert'),
    ]
    
    alert_type = models.CharField(max_length=50, choices=ALERT_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    severity = models.CharField(max_length=20, choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High'), ('critical', 'Critical')], default='medium')
    is_resolved = models.BooleanField(default=False)
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.alert_type} - {self.title} ({self.severity})"