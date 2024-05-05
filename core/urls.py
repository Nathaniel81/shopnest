from django.urls import path
from . import views


urlpatterns = [
    path('', views.ProductsAPIView.as_view(), name='products'), 
    path('search/', views.SearchProductsAPIView.as_view(), name='search_posts'),
    path('<str:pk>/', views.ProductDetailAPIView.as_view(), name='product_detail'),
]
