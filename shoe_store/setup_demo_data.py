#!/usr/bin/env python
"""
Script to setup demo data for shoe store project
Run this after migrations to populate the database with sample data
"""

import os
import django
from django.core.management import execute_from_command_line

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shoe_store.settings_demo')
django.setup()

from core.models import *
from django.contrib.auth.hashers import make_password

def create_demo_data():
    print("🚀 Setting up demo data...")
    
    # Create admin user
    if not User.objects.filter(username='admin').exists():
        admin_user = User.objects.create(
            username='admin',
            email='admin@shoestore.com',
            name='Admin User',
            role=1,  # Admin role
            password=make_password('admin123')
        )
        print("✅ Admin user created (username: admin, password: admin123)")
    
    # Create customer user
    if not User.objects.filter(username='customer').exists():
        customer_user = User.objects.create(
            username='customer',
            email='customer@example.com',
            name='Demo Customer',
            role=0,  # Customer role
            password=make_password('customer123')
        )
        print("✅ Customer user created (username: customer, password: customer123)")
    
    # Create categories
    categories_data = [
        {'name': 'Sneakers', 'description': 'Comfortable sneakers for daily wear'},
        {'name': 'Boots', 'description': 'Stylish boots for all seasons'},
        {'name': 'Sandals', 'description': 'Summer sandals and flip-flops'},
        {'name': 'Formal Shoes', 'description': 'Professional formal footwear'},
    ]
    
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults={'description': cat_data['description']}
        )
        if created:
            print(f"✅ Category created: {category.name}")
    
    # Create brands
    brands_data = ['Nike', 'Adidas', 'Puma', 'Converse', 'Vans']
    for brand_name in brands_data:
        brand, created = Brand.objects.get_or_create(name=brand_name)
        if created:
            print(f"✅ Brand created: {brand.name}")
    
    # Create sizes
    sizes_data = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
    for size_value in sizes_data:
        size, created = Size.objects.get_or_create(value=size_value)
        if created:
            print(f"✅ Size created: {size.value}")
    
    # Create colors
    colors_data = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Brown', 'Gray']
    for color_value in colors_data:
        color, created = Color.objects.get_or_create(value=color_value)
        if created:
            print(f"✅ Color created: {color.value}")
    
    # Create genders
    genders_data = ['Men', 'Women', 'Unisex']
    for gender_name in genders_data:
        gender, created = Gender.objects.get_or_create(name=gender_name)
        if created:
            print(f"✅ Gender created: {gender.name}")
    
    # Create sample products
    if Product.objects.count() < 10:
        products_data = [
            {
                'name': 'Nike Air Max 270',
                'description': 'Comfortable running shoes with air cushioning technology',
                'price': 150.00,
                'originalPrice': 180.00,
                'stock_quantity': 50,
                'category': 'Sneakers',
                'brand': 'Nike',
                'gender': 'Unisex'
            },
            {
                'name': 'Adidas Ultraboost 22',
                'description': 'Premium running shoes with boost technology',
                'price': 180.00,
                'originalPrice': 200.00,
                'stock_quantity': 30,
                'category': 'Sneakers',
                'brand': 'Adidas',
                'gender': 'Men'
            },
            {
                'name': 'Converse Chuck Taylor',
                'description': 'Classic canvas sneakers, timeless design',
                'price': 65.00,
                'originalPrice': 75.00,
                'stock_quantity': 100,
                'category': 'Sneakers',
                'brand': 'Converse',
                'gender': 'Unisex'
            },
            {
                'name': 'Puma RS-X',
                'description': 'Retro-inspired chunky sneakers',
                'price': 120.00,
                'originalPrice': 140.00,
                'stock_quantity': 25,
                'category': 'Sneakers',
                'brand': 'Puma',
                'gender': 'Women'
            },
            {
                'name': 'Vans Old Skool',
                'description': 'Classic skate shoes with side stripe',
                'price': 60.00,
                'originalPrice': 70.00,
                'stock_quantity': 75,
                'category': 'Sneakers',
                'brand': 'Vans',
                'gender': 'Unisex'
            }
        ]
        
        for product_data in products_data:
            category = Category.objects.get(name=product_data['category'])
            brand = Brand.objects.get(name=product_data['brand'])
            gender = Gender.objects.get(name=product_data['gender'])
            
            product, created = Product.objects.get_or_create(
                name=product_data['name'],
                defaults={
                    'description': product_data['description'],
                    'price': product_data['price'],
                    'originalPrice': product_data['originalPrice'],
                    'stock_quantity': product_data['stock_quantity'],
                    'category': category,
                    'brand': brand,
                    'gender': gender,
                    'rating': 4.5,
                    'reviews': 25
                }
            )
            
            if created:
                # Add sizes and colors to product
                sizes = Size.objects.filter(value__in=['38', '39', '40', '41', '42'])
                colors = Color.objects.filter(value__in=['Black', 'White', 'Red'])
                product.sizes.set(sizes)
                product.colors.set(colors)
                print(f"✅ Product created: {product.name}")
    
    print("🎉 Demo data setup completed!")
    print("\n📝 Demo accounts:")
    print("Admin: username=admin, password=admin123")
    print("Customer: username=customer, password=customer123")

if __name__ == '__main__':
    create_demo_data()