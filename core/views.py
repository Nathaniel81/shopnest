from .models import Product
from .serializers import ProductSerializer
from rest_framework import generics


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
