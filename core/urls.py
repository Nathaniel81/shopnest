from django.urls import path
from . import views


urlpatterns = [
    path('', views.ProductsAPIView.as_view(), name='products'), 
]
