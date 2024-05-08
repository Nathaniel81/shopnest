from django.db import models
from accounts.models import User
from cloudinary.models import CloudinaryField
from django.utils import timezone
from decimal import Decimal


class Category(models.Model):
    name = models.CharField(max_length=200)
    image = CloudinaryField('image', null=True, blank=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    user = models.ForeignKey(User, related_name='products', on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    main_image = CloudinaryField('image', null=True, blank=True)
    brand = models.CharField(max_length=200, null=True, blank=True)
    category = models.ForeignKey(Category, related_name='products', max_length=200, null=True, blank=True, on_delete=models.SET_NULL)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    saved_by = models.ManyToManyField(User, related_name='saved_products', blank=True)

    @property
    def is_new(self):
        """
        Property to determine if the product is new based on its creation date.
        Returns True if the product is considered new, False otherwise.
        """
        # Define a threshold for what is considered "new" (e.g., products created within the last 7 days)
        threshold = timezone.now() - timezone.timedelta(days=7)
        return self.createdAt >= threshold

    @property
    def old_price(self, percent_increase=10):
        """
        Method to calculate the old price based on the current price and a percentage increase.
        """
        # Convert percent_increase to Decimal before performing the calculation
        percent_increase_decimal = Decimal(percent_increase)
        # Calculate old price using Decimal objects
        return self.price * (Decimal('1') + percent_increase_decimal / Decimal('100'))

    def __str__(self):
        return self.name

class Review(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, default=0)
    comment = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.rating)

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    taxPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    totalPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.createdAt)

class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    qty = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    image = CloudinaryField('image', null=True, blank=True)

    def __str__(self):
        return str(self.name)

class ShippingAddress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postalCode = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return str(self.address)

