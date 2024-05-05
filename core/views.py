from .models import Product
from .serializers import ProductSerializer
from rest_framework import generics
from django.db.models import Q

class ProductsAPIView(generics.ListAPIView):
    """
    View for listing products.

    This view returns a list of all products.
    """

    queryset = Product.objects.all()
    serializer_class = ProductSerializer

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

    This view returns a list of products filtered by a search query.
    """

    serializer_class = ProductSerializer

    def get_queryset(self):
        """
        Get the queryset of products filtered by a search query.

        This method filters the queryset to include only products containing the search query in their caption.
        """

        query = self.request.query_params.get('query', '')
        queryset = Product.objects.filter(Q(name__icontains=query))
        return queryset
