from decimal import Decimal

from django.test import TestCase, override_settings
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings

from accounts.models import User

from .models import Category, Order, OrderItem, Product
from .serializers import ProductSerializer


# class CategoryAPITestCase(APITestCase):
#     """
#     Test case for Product
#     """

#     def setUp(self):
#         self.client = APIClient()
#         self.category = Category.objects.create(name='Electronics', image='electronics-img.png')
#         self.assertEqual(Category.objects.count(), 1)

#     def test_category_str_method(self):
#         self.assertEqual(str(self.category), 'Electronics')

#     def test_get_categories(self):
#         response = self.client.get(reverse('categories'))
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

class ProductAPITestCase(TestCase):
    """
    Test case for Product
    """

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.category1 = Category.objects.create(name='TestCategory1')
        self.category2 = Category.objects.create(name='TestCategory2')
        self.product = Product.objects.create(
            user=self.user,
            name='TestProduct',
            brand='TestBrand',
            category=self.category1,
            description='TestDescription',
            price=Decimal('123.45'),
            countInStock=0,
        )
        self.product1 = Product.objects.create(
            user=self.user,
            name='TestProduct1',
            brand='TestBrand',
            category=self.category1,
            description='TestDescription',
            price=Decimal('123.45'),
            countInStock=10,
        )
        self.product2 = Product.objects.create(
            user=self.user,
            name='TestProduct2',
            brand='TestBrand',
            category=self.category2,
            description='TestDescription',
            price=Decimal('123.45'),
            countInStock=0,
        )

        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

    def test_is_new(self):
        """
        Test case to verify the 'is_new' property of the Product model.
        """
        # Test that a product created just now is considered new
        self.assertTrue(self.product.is_new)

        # Test that a product created 8 days ago is not considered new
        old_product = Product.objects.create(
            user=self.user,
            name='OldProduct',
            brand='TestBrand',
            category=self.category1,
            description='TestDescription',
            price=Decimal('123.45'),
            countInStock=10,
        )
        old_product.createdAt = timezone.now() - timezone.timedelta(days=8)
        old_product.save()

        self.assertFalse(old_product.is_new)

    def test_get_products(self):
        """
        Test case to verify the retrieval of all products via API.
        """

        response = self.client.get(reverse('products'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_get_products_by_category(self):
        """
        Test case to verify the retrieval of products by category via API.
        """

        response = self.client.get(reverse('products'), {'category': 'TestCategory1'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_product_detail(self):
        """
        Test case to verify the retrieval of product details via API.
        """

        response = self.client.get(reverse('product-detail', kwargs={'pk': self.product1.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'TestProduct1')

    def test_get_product_detail_not_found(self):
        """
        Test case to verify that an error is returned when trying to retrieve details of a non-existent product via API.
        """

        response = self.client.get(reverse('product-detail', kwargs={'pk': 9999}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_search_products(self):
        """
        Test case to verify the search functionality for products via API.
        """
        response = self.client.get(reverse('search-products-list'), {'query': 'TestProduct'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Only one product matches the search query and is in stock
        self.assertEqual(len(response.data), 1)
    
    def test_search_products_by_category(self):
        """
        Test case to verify the search functionality for products by category via API.
        """
        response = self.client.get(reverse('search-products-list'), 
            {
                'query': 'TestProduct', 
                'category': 'TestCategory1'
            }
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'TestProduct1')

