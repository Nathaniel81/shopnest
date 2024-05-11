from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from core.authenticate import CustomAuthentication

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class ProductsAPIView(generics.ListAPIView):
    """
    View for listing products.

    This view returns a list of all products.
    """

    serializer_class = ProductSerializer

    def get_queryset(self):
        category = self.request.query_params.get('category', '')

        if category:
            queryset = Product.objects.filter(
                Q(category__name__iexact=category) & 
                Q(countInStock__gt=0))
        else:
            queryset = Product.objects.filter(countInStock__gt=0)

        return queryset

class CategoriesAPIView(generics.ListAPIView):
    """
    View for listing products.

    This view returns a list of all products.
    """

    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer

class ProductDetailAPIView(generics.RetrieveAPIView):
    """
    View for retrieving a single product.

    This view allows users to retrieve specific post.
    """

    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class SearchProductsAPIView(generics.ListAPIView):
    """
    View for searching products.

    This view returns a list of products filtered by a search query and category.
    """

    serializer_class = ProductSerializer

    def get_queryset(self):
        """
        Get the queryset of products filtered by a search query and category.

        This method filters the queryset to include only products containing the search query
        in their name and belonging to the specified category.
        """

        query = self.request.query_params.get('query', '')
        queryset = Product.objects.filter(Q(name__icontains=query) & Q(countInStock__gt=0))
        category = self.request.query_params.get('category', '')
        if category:
            queryset = queryset.filter(category__name__iexact=category)
        return queryset
