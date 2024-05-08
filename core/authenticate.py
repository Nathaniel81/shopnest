"""
Custom authentication module for handling authentication with JWt.

This module provides a custom authentication class `CustomAuthentication`, which extends
`rest_framework_simplejwt.authentication.JWTAuthentication` to authenticate users based on
the httponly cookie access_token.

Example usage:
    from custom_auth import CustomAuthentication

    class MyView(APIView):
        authentication_classes = [CustomAuthentication]
        ...
"""

from rest_framework_simplejwt import authentication as jwt_authentication
from django.conf import settings
from rest_framework import authentication, exceptions as rest_exceptions


class CustomAuthentication(jwt_authentication.JWTAuthentication):
    """
    Custom authentication class to authenticate users based on the httponly cookie access_token.

    This class extends `rest_framework_simplejwt.authentication.JWTAuthentication` and adds
    CSRF validation enforcement.

    Attributes:
    - authentication_classes: A list of authentication classes.
    """

    def authenticate(self, request):
        """
        Authenticate the user based on the httponly cookie access_token.

        Parameters:
        - request (HttpRequest): The HTTP request object.

        Returns:
        - tuple or None: A tuple of (user, validated_token) if authentication is successful,
          or None if authentication fails.
        """

        raw_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE']) or None

        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
        except Exception as e:
            return None

        return self.get_user(validated_token), validated_token
