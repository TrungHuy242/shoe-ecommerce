from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import User
from .models import Product, Category, Brand
# Create your tests here.

class ProductAPITestCase(APITestCase):
    def setUp(self):
        # Tạo dữ liệu ban đầu cho test
        self.category = Category.objects.create(name="Giày Nam", description="Danh mục giày nam")
        self.brand = Brand.objects.create(name="Nike", logo_url="https://example.com/nike.png")
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        # Tạo một sản phẩm mẫu để test PUT/DELETE
        self.product = Product.objects.create(
            name="Giày Cũ",
            description="Sản phẩm cũ",
            price=900.00,
            size="39",
            color="Đen",
            stock_quantity=10,
            category=self.category,
            brand=self.brand
        )
        self.product_url = reverse('product-detail', args=[self.product.id])

    def test_create_product(self):
        """Test POST - Thêm sản phẩm mới"""
        url = reverse('product-list')
        data = {
            "name": "Giày Mới Test",
            "description": "Sản phẩm thử nghiệm",
            "price": 1000.00,
            "size": "40",
            "color": "Trắng",
            "stock_quantity": 20,
            "category": self.category.id,
            "brand": self.brand.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 2)  # 1 cũ + 1 mới
        self.assertEqual(response.data['name'], "Giày Mới Test")

    def test_update_product(self):
        """Test PUT - Cập nhật sản phẩm"""
        data = {
            "name": "Giày Cũ Cập Nhật",
            "description": "Sản phẩm đã sửa",
            "price": 950.00,
            "size": "40",
            "color": "Xám",
            "stock_quantity": 15,
            "category": self.category.id,
            "brand": self.brand.id
        }
        response = self.client.put(self.product_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Giày Cũ Cập Nhật")
        self.product.refresh_from_db()
        self.assertEqual(self.product.price, 950.00)

    def test_delete_product(self):
        """Test DELETE - Xóa sản phẩm"""
        response = self.client.delete(self.product_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Product.objects.count(), 0)

    def tearDown(self):
        # Xóa dữ liệu sau khi test
        Product.objects.all().delete()
        Category.objects.all().delete()
        Brand.objects.all().delete()
        User.objects.all().delete()