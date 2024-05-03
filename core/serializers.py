from rest_framework import serializers
from .models import Product, Category
from cloudinary.utils import cloudinary_url


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for handling Category objects.

    This serializer serializes Category objects, converting them into JSON format.
    """

    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer for handling Product objects.

    This serializer serializes Product objects, converting them into JSON format.
    """

    category = CategorySerializer()
    is_new = serializers.SerializerMethodField()
    old_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'
    
    def get_is_new(self, obj):
        """
        Method to determine if the product is new.
        """

        return obj.is_new

    def get_old_price(self, obj):
        """
        Method to determine the products old price.
        """

        return obj.old_price

    def to_representation(self, instance):
        """
        Convert the Product instance to a representation.

        This method overrides the default to_representation method to include the file URL.
        """

        representation = super().to_representation(instance)
        if instance.main_image:
            # Add the file URL to the representation
            representation['main_image'] = cloudinary_url(instance.main_image.public_id)[0]
        return representation
