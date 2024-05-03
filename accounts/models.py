from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField


class User(AbstractUser):
    username = models.CharField(max_length=40, unique=True)
    email = models.EmailField(unique=True)
    profile_picture = CloudinaryField('image', null=True, blank=True)
    address = models.TextField(null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username
