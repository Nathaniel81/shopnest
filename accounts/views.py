from core.authenticate import CustomAuthentication
from django.conf import settings
from django.db.models import Count
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt import tokens
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.throttling import AnonRateThrottle

from .models import User
from .serializers import (MyTokenObtainPairSerializer, RegistrationSerializer,
                          UserSerializer)


class LoginRateThrottle(AnonRateThrottle):
    rate = '5/hour'

class MyTokenObtainPairView(TokenObtainPairView):
    """
    Custom token obtain pair view for setting cookies on successful token retrieval.
    """

    serializer_class = MyTokenObtainPairSerializer
    throttle_classes = [LoginRateThrottle]

    def post(self, request, *args, **kwargs):
        """
        Handle POST request for token generation.

        This method overrides the default post method of TokenObtainPairView to set cookies
        for access and refresh tokens if the request is successful.

        Args:
            request (HttpRequest): The request object.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: The HTTP response.

        """

        # Call the super method to perform default token generation
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.pop('access', None)
            refresh_token = response.data.pop('refresh', None)
            # Set httponly flag for access and refresh tokens
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=access_token,
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=refresh_token,
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )
        return response

class RegistrationView(generics.CreateAPIView):
    """
    Custom registration view for creating user accounts and setting authentication cookies.
    """

    serializer_class = RegistrationSerializer

    def create(self, request, *args, **kwargs):
        """
        Handle POST request for user registration.

        This method overrides the default create method of CreateAPIView to create user accounts,
        set cookies for access and refresh tokens, and return a response with user data.

        Args:
            request (HttpRequest): The request object.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: The HTTP response.

        """

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializedData = serializer.save(serializer.validated_data)

        # Construct the response with serialized user data
        response = Response({
            'id': serializedData['id'],
            'username': serializedData['username'],
            'email': serializedData['email'],
        })
        access_token =  serializedData.get('access_token')
        refresh_token =  serializedData.get('refresh_token')

        # Set httponly flag for access and refresh tokens in cookies
        response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=access_token,
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
        )
        response.set_cookie(
               key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
               value=refresh_token,
               expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
               secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
               httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
               samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
        )

        return response

class LogoutView(APIView):
    """
    Custom view for logging out users by blacklisting refresh tokens and deleting cookies.
    """

    def post(self, request):
        """
        Handle POST request for logging out users.

        This method blacklists the refresh token, deletes authentication cookies,
        and returns a response indicating successful logout.

        Args:
            request (HttpRequest): The request object.

        Returns:
            Response: The HTTP response.
        """

        try:
            refreshToken = request.COOKIES.get(
                settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
            # Instantiate a RefreshToken object
            token = tokens.RefreshToken(refreshToken)
            token.blacklist()

            response = Response({'LoggedOut'})
            # Delete authentication cookies
            response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
            response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])

            return response

        except tokens.TokenError as e:
            # If there's a TokenError, still construct a response and delete cookies
            response = Response({'LoggedOut'})
            response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
            response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        
            return response
        except Exception as e:
            raise exceptions.ParseError("Invalid token")

class RefreshTokenView(APIView):
    """
    Custom view for refreshing access tokens.
    """

    def post(self, request):
        """
        Handle POST request for refreshing access tokens.

        This method retrieves the refresh token from cookies, generates new access and
        refresh tokens, sets cookies with the new tokens, and returns a response.

        Args:
            request (HttpRequest): The request object.

        Returns:
            Response: The HTTP response.
        """
        # Retrieve refresh token from cookies
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        # Check if refresh token is missing
        if not refresh_token:
            return Response({'error': 'Refresh token is missing'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            # Instantiate a RefreshToken object
            token = RefreshToken(refresh_token)
            new_access_token = str(token.access_token)
            new_refresh_token = str(token)

            response = Response()
            # Set httponly flag for access and refresh tokens in cookies
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=new_access_token,
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=new_refresh_token,
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
