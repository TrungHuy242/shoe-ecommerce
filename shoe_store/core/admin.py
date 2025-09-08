# core/admin.py
from django.contrib import admin
from .models import Category, Brand, Size, Color, Gender, Product, Image, Banner, Promotion, ProductPromotion, Customer, Cart, CartItem, Order, OrderDetail, Payment, Wishlist, Notification, FAQ, ChatBotConversation

# Tùy chỉnh hiển thị Product
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category', 'gender', 'brand', 'stock_quantity', 'isOnSale')
    list_filter = ('category', 'gender', 'brand', 'isOnSale')
    filter_horizontal = ('sizes', 'colors')  # Sử dụng filter_horizontal để dễ chọn nhiều size và color

# Đăng ký các model với tùy chỉnh
admin.site.register(Category)
admin.site.register(Brand)
admin.site.register(Size)
admin.site.register(Color)
admin.site.register(Gender)
admin.site.register(Product, ProductAdmin)
admin.site.register(Image)
admin.site.register(Banner)
admin.site.register(Promotion)
admin.site.register(ProductPromotion)
admin.site.register(Customer)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderDetail)
admin.site.register(Payment)
admin.site.register(Wishlist)
admin.site.register(Notification)
admin.site.register(FAQ)
admin.site.register(ChatBotConversation)