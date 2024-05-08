from django.urls import path
from . import views


urlpatterns = [
    path('', views.ProductsAPIView.as_view(), name='products'), 
    path('search/', views.SearchProductsAPIView.as_view(), name='search_posts'),
    path('categories/', views.CategoriesAPIView.as_view(), name='categories'),
    path('<str:pk>/save/', views.SaveProductView.as_view(), name='save_product'),
    path('<str:pk>/unsave/',views.UnsaveProductView.as_view(), name='unsave_product'),
    path('<str:pk>/', views.ProductDetailAPIView.as_view(), name='product_detail'),
]
