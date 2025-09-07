from django.db import models
from django.contrib.auth.models import User  # Sử dụng User built-in cho Customer sau

class Category(models.Model):
    name = models.CharField(max_length=50)
    image = models.ImageField(upload_to='categories/', null=True, blank=True)
    description = models.CharField(max_length=255)

class Brand(models.Model):
    name = models.CharField(max_length=50)
    logo_url = models.CharField(max_length=255)

class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    originalPrice = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    size = models.CharField(max_length=20)
    color = models.CharField(max_length=50)
    stock_quantity = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    rating = models.FloatField(default=0.0)
    reviews = models.IntegerField(default=0)
    isOnSale = models.BooleanField(default=False)

class Image(models.Model):
    url = models.CharField(max_length=255)
    alt_text = models.CharField(max_length=100)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')

class Banner(models.Model):
    image_url = models.CharField(max_length=255)
    title = models.CharField(max_length=100)
    link_to_product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)

class Promotion(models.Model):
    code = models.CharField(max_length=20, unique=True)
    discount_value = models.DecimalField(max_digits=5, decimal_places=2)
    expiry_date = models.DateField()

class ProductPromotion(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    promotion = models.ForeignKey(Promotion, on_delete=models.CASCADE)

class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  # Kết nối với auth
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100, unique=True)
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255)
    role = models.IntegerField(choices=((0, 'Customer'), (1, 'Admin')), default=0)  # 0: khách, 1: admin

    def __str__(self):
        return self.name

class Cart(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    added_at = models.DateTimeField(auto_now_add=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20)  # 'pending', 'shipped', etc.
    order_date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=50)  # 'COD', 'Momo', etc.
    created_at = models.DateTimeField(auto_now_add=True)

class OrderDetail(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

class Payment(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    transaction_id = models.CharField(max_length=100)
    status = models.CharField(max_length=20)
    payment_date = models.DateTimeField(auto_now_add=True)
    gateway_response = models.TextField()

class Wishlist(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

class Notification(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    related_id = models.IntegerField()  # ID liên quan
    is_read = models.BooleanField(default=False)
    sent_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

class FAQ(models.Model):
    faq_id = models.AutoField(primary_key=True)  
    question = models.CharField(max_length=1000)  
    answer = models.CharField(max_length=2000)   
    category = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

class ChatBotConversation(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    message_content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_by_staff = models.BooleanField(default=False)  # Để chuyển sang nhân viên