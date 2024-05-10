from django.urls import path
from . import views


urlpatterns = [
    path('', views.StripeCheckoutView.as_view(), name='stripe_checkout'),
    path('confirm_payment/', views.ConfirmPaymentView.as_view(), name='confirm_payment'),
]
