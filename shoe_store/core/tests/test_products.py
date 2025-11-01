"""
Test file để kiểm tra tất cả chức năng quản lý sản phẩm
Chạy test: python manage.py test core.tests.test_products.ProductManagementTestCase
"""

from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from core.models import Product, Category, Brand, Gender, Size, Color, Image
from decimal import Decimal
from PIL import Image as PILImage
import io

User = get_user_model()


def create_test_image():
    """Tạo một test image file"""
    img = PILImage.new('RGB', (100, 100), color='red')
    img_file = io.BytesIO()
    img.save(img_file, format='JPEG')
    img_file.seek(0)
    return img_file


class ProductManagementTestCase(TestCase):
    """Test tất cả chức năng quản lý sản phẩm"""
    
    def setUp(self):
        """Setup test data"""
        # Tạo admin user
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@test.com',
            password='testpass123',
            role=1  # Admin
        )
        
        # Tạo customer user
        self.customer_user = User.objects.create_user(
            username='customer',
            email='customer@test.com',
            password='testpass123',
            role=0  # Customer
        )
        
        # Tạo test data
        self.category = Category.objects.create(
            name='Sneakers',
            description='Giày thể thao'
        )
        
        self.brand = Brand.objects.create(name='Nike')
        
        self.gender = Gender.objects.create(name='Nam')
        
        self.size1 = Size.objects.create(value='40')
        self.size2 = Size.objects.create(value='41')
        
        self.color1 = Color.objects.create(value='Đen')
        self.color2 = Color.objects.create(value='Trắng')
        
        # API client
        self.client = APIClient()
        
    def test_1_create_product_as_admin(self):
        """Test 1: Thêm sản phẩm mới (Admin)"""
        print("\n🧪 Test 1: Thêm sản phẩm mới (Admin)")
        
        self.client.force_authenticate(user=self.admin_user)
        
        # Tạo test images
        image1 = create_test_image()
        image2 = create_test_image()
        
        # Tạo FormData
        data = {
            'name': 'Nike Air Max 270',
            'description': 'Giày thể thao cao cấp',
            'price': '2500000',
            'originalPrice': '3000000',
            'stock_quantity': '100',
            'category': str(self.category.id),
            'gender': str(self.gender.id),
            'brand': str(self.brand.id),
            'sizes': [str(self.size1.id), str(self.size2.id)],
            'colors': [str(self.color1.id), str(self.color2.id)],
        }
        
        files = {
            'images': [
                ('images', image1, 'image/jpeg'),
                ('images', image2, 'image/jpeg'),
            ]
        }
        
        # Gửi request
        response = self.client.post('/api/products/', data, format='multipart')
        
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.data}")
        
        # Kiểm tra
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 1)
        
        product = Product.objects.first()
        self.assertEqual(product.name, 'Nike Air Max 270')
        self.assertEqual(product.sizes.count(), 2)
        self.assertEqual(product.colors.count(), 2)
        
        # Kiểm tra images
        images = Image.objects.filter(product=product)
        self.assertEqual(images.count(), 2)
        
        print("   ✅ Test 1 PASSED: Sản phẩm được tạo thành công với images")
        
    def test_2_create_product_as_customer_fails(self):
        """Test 2: Customer không thể thêm sản phẩm"""
        print("\n🧪 Test 2: Customer không thể thêm sản phẩm")
        
        self.client.force_authenticate(user=self.customer_user)
        
        data = {
            'name': 'Test Product',
            'description': 'Test',
            'price': '1000000',
            'stock_quantity': '10',
            'category': str(self.category.id),
            'brand': str(self.brand.id),
            'sizes': [str(self.size1.id)],
            'colors': [str(self.color1.id)],
        }
        
        response = self.client.post('/api/products/', data, format='json')
        
        print(f"   Status Code: {response.status_code}")
        
        # Customer không thể tạo (chỉ được đọc)
        self.assertIn(response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_405_METHOD_NOT_ALLOWED])
        
        print("   ✅ Test 2 PASSED: Customer không thể thêm sản phẩm")
        
    def test_3_list_products(self):
        """Test 3: Xem danh sách sản phẩm"""
        print("\n🧪 Test 3: Xem danh sách sản phẩm")
        
        # Tạo một số sản phẩm
        product1 = Product.objects.create(
            name='Product 1',
            description='Description 1',
            price=Decimal('1000000'),
            stock_quantity=10,
            category=self.category,
            brand=self.brand,
        )
        product1.sizes.add(self.size1)
        product1.colors.add(self.color1)
        
        product2 = Product.objects.create(
            name='Product 2',
            description='Description 2',
            price=Decimal('2000000'),
            stock_quantity=20,
            category=self.category,
            brand=self.brand,
        )
        product2.sizes.add(self.size2)
        product2.colors.add(self.color2)
        
        # Không cần authenticate để xem danh sách
        response = self.client.get('/api/products/')
        
        print(f"   Status Code: {response.status_code}")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Kiểm tra response format
        if 'results' in response.data:
            products = response.data['results']
        else:
            products = response.data if isinstance(response.data, list) else []
        
        self.assertGreaterEqual(len(products), 2)
        
        # Kiểm tra dữ liệu
        product_names = [p['name'] for p in products]
        self.assertIn('Product 1', product_names)
        self.assertIn('Product 2', product_names)
        
        print(f"   ✅ Test 3 PASSED: Tìm thấy {len(products)} sản phẩm trong danh sách")
        
    def test_4_get_product_detail(self):
        """Test 4: Xem chi tiết sản phẩm"""
        print("\n🧪 Test 4: Xem chi tiết sản phẩm")
        
        product = Product.objects.create(
            name='Detail Product',
            description='Test description',
            price=Decimal('1500000'),
            stock_quantity=15,
            category=self.category,
            brand=self.brand,
            gender=self.gender,
        )
        product.sizes.add(self.size1, self.size2)
        product.colors.add(self.color1, self.color2)
        
        # Tạo images
        Image.objects.create(product=product, image='test1.jpg')
        Image.objects.create(product=product, image='test2.jpg')
        
        response = self.client.get(f'/api/products/{product.id}/')
        
        print(f"   Status Code: {response.status_code}")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Detail Product')
        self.assertEqual(len(response.data['sizes']), 2)
        self.assertEqual(len(response.data['colors']), 2)
        self.assertEqual(len(response.data['images']), 2)
        
        print("   ✅ Test 4 PASSED: Chi tiết sản phẩm đầy đủ")
        
    def test_5_update_product(self):
        """Test 5: Sửa sản phẩm"""
        print("\n🧪 Test 5: Sửa sản phẩm")
        
        self.client.force_authenticate(user=self.admin_user)
        
        product = Product.objects.create(
            name='Old Name',
            description='Old Description',
            price=Decimal('1000000'),
            stock_quantity=10,
            category=self.category,
            brand=self.brand,
        )
        product.sizes.add(self.size1)
        product.colors.add(self.color1)
        
        # Update data
        image1 = create_test_image()
        
        data = {
            'name': 'New Name',
            'description': 'New Description',
            'price': '2000000',
            'originalPrice': '2500000',
            'stock_quantity': '20',
            'category': str(self.category.id),
            'brand': str(self.brand.id),
            'sizes': [str(self.size1.id), str(self.size2.id)],
            'colors': [str(self.color1.id), str(self.color2.id)],
        }
        
        files = {
            'images': [('images', image1, 'image/jpeg')]
        }
        
        response = self.client.put(f'/api/products/{product.id}/', data, format='multipart')
        
        print(f"   Status Code: {response.status_code}")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        product.refresh_from_db()
        self.assertEqual(product.name, 'New Name')
        self.assertEqual(product.sizes.count(), 2)
        self.assertEqual(product.colors.count(), 2)
        
        # Kiểm tra image mới được thêm
        images = Image.objects.filter(product=product)
        self.assertGreaterEqual(images.count(), 1)
        
        print("   ✅ Test 5 PASSED: Sản phẩm được cập nhật thành công")
        
    def test_6_delete_product(self):
        """Test 6: Xóa sản phẩm"""
        print("\n🧪 Test 6: Xóa sản phẩm")
        
        self.client.force_authenticate(user=self.admin_user)
        
        product = Product.objects.create(
            name='To Delete',
            description='Will be deleted',
            price=Decimal('1000000'),
            stock_quantity=10,
            category=self.category,
            brand=self.brand,
        )
        
        product_id = product.id
        
        response = self.client.delete(f'/api/products/{product_id}/')
        
        print(f"   Status Code: {response.status_code}")
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Product.objects.filter(id=product_id).exists())
        
        print("   ✅ Test 6 PASSED: Sản phẩm được xóa thành công")
        
    def test_7_filter_products_by_category(self):
        """Test 7: Lọc sản phẩm theo category"""
        print("\n🧪 Test 7: Lọc sản phẩm theo category")
        
        category2 = Category.objects.create(name='Boots', description='Giày bốt')
        
        product1 = Product.objects.create(
            name='Sneaker Product',
            description='Test',
            price=Decimal('1000000'),
            stock_quantity=10,
            category=self.category,
            brand=self.brand,
        )
        
        product2 = Product.objects.create(
            name='Boot Product',
            description='Test',
            price=Decimal('2000000'),
            stock_quantity=20,
            category=category2,
            brand=self.brand,
        )
        
        # Filter by category
        response = self.client.get('/api/products/', {'category': 'Sneakers'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        if 'results' in response.data:
            products = response.data['results']
        else:
            products = response.data if isinstance(response.data, list) else []
        
        product_names = [p['name'] for p in products]
        self.assertIn('Sneaker Product', product_names)
        self.assertNotIn('Boot Product', product_names)
        
        print(f"   ✅ Test 7 PASSED: Filter theo category hoạt động đúng")
        
    def test_8_search_products(self):
        """Test 8: Tìm kiếm sản phẩm"""
        print("\n🧪 Test 8: Tìm kiếm sản phẩm")
        
        Product.objects.create(
            name='Nike Air Max',
            description='Giày Nike',
            price=Decimal('1000000'),
            stock_quantity=10,
            category=self.category,
            brand=self.brand,
        )
        
        Product.objects.create(
            name='Adidas Superstar',
            description='Giày Adidas',
            price=Decimal('2000000'),
            stock_quantity=20,
            category=self.category,
            brand=self.brand,
        )
        
        # Search
        response = self.client.get('/api/products/', {'search': 'Nike'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        if 'results' in response.data:
            products = response.data['results']
        else:
            products = response.data if isinstance(response.data, list) else []
        
        product_names = [p['name'] for p in products]
        self.assertIn('Nike Air Max', product_names)
        
        print(f"   ✅ Test 8 PASSED: Tìm kiếm hoạt động đúng")
        
    def run_all_tests(self):
        """Chạy tất cả tests"""
        print("\n" + "="*60)
        print("🚀 BẮT ĐẦU TEST TẤT CẢ CHỨC NĂNG QUẢN LÝ SẢN PHẨM")
        print("="*60)
        
        try:
            self.test_1_create_product_as_admin()
            self.test_2_create_product_as_customer_fails()
            self.test_3_list_products()
            self.test_4_get_product_detail()
            self.test_5_update_product()
            self.test_6_delete_product()
            self.test_7_filter_products_by_category()
            self.test_8_search_products()
            
            print("\n" + "="*60)
            print("✅ TẤT CẢ TESTS ĐÃ HOÀN THÀNH!")
            print("="*60)
        except Exception as e:
            print(f"\n❌ LỖI TRONG QUÁ TRÌNH TEST: {str(e)}")
            import traceback
            traceback.print_exc()

