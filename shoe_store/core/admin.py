from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Product, Category, Brand, Image, Banner, Promotion, ProductPromotion, Customer, Cart, CartItem, Order, OrderDetail, Payment, Wishlist, Notification, FAQ, ChatBotConversation
admin.site.register(Product)
admin.site.register(Category)
admin.site.register(Brand)
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
