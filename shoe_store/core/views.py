from django.shortcuts import render
from fastapi import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from .models import Product, Category, Brand, Image, Banner, Promotion, ProductPromotion, Customer, Cart, CartItem, Order, OrderDetail, Payment, Wishlist, Notification, FAQ, ChatBotConversation
from .serializers import ProductSerializer, CategorySerializer, BrandSerializer, ImageSerializer, BannerSerializer, PromotionSerializer, ProductPromotionSerializer, CustomerSerializer, CartSerializer, CartItemSerializer, OrderSerializer, OrderDetailSerializer, PaymentSerializer, WishlistSerializer, NotificationSerializer, FAQSerializer, ChatBotConversationSerializer
import spacy

# Create your views here.
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

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
    permission_classes = [IsAuthenticatedOrReadOnly]

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
    

