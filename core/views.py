from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from rest_framework import generics, status
from django.db.models import Q
from core.authenticate import CustomAuthentication
from django.shortcuts import get_object_or_404
from rest_framework.response import Response

class ProductsAPIView(generics.ListAPIView):
    """
    View for listing products.

    This view returns a list of all products.
    """

    serializer_class = ProductSerializer

    def get_queryset(self):
        category = self.request.query_params.get('category', '')
        if category:
            queryset = Product.objects.filter(Q(category__name__iexact=category))
        else:
            queryset = Product.objects.all()
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

        This method filters the queryset to include only products containing the search query in their name and belonging to the specified category.
        """

        query = self.request.query_params.get('query', '')
        queryset = Product.objects.filter(Q(name__icontains=query))
        category = self.request.query_params.get('category', '')
        if category:
            queryset = queryset.filter(category__name__iexact=category)
        return queryset

class SaveProductView(generics.GenericAPIView):
    """
    View for saving a product.

    This view allows authenticated users to save a product.
    """

    authentication_classes = [CustomAuthentication]

    def post(self, request, *args, **kwargs):
        """
        Handle POST request for saving a product.

        This method adds the authenticated user to the 'saved_by' field of the product.
        """

        if request.user.is_anonymous:
            raise PermissionDenied("You must be logged in to save a product")

        product = get_object_or_404(Product, id=self.kwargs.get('pk'))
        product.saved_by.add(request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)

class UnsaveProductView(generics.GenericAPIView):
    """
    View for unsaving a product.

    This view allows authenticated users to unsave a product.
    """

    authentication_classes = [CustomAuthentication]

    def post(self, request, *args, **kwargs):
        """
        Handle POST request for unsaving a product.

        This method removes the authenticated user from the 'saved_by' field of the product.
        """

        if request.user.is_anonymous:
            raise PermissionDenied("You must be logged in to unsave a product")

        product = get_object_or_404(Product, id=self.kwargs.get('pk'))
        product.saved_by.remove(request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)
