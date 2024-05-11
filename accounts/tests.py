from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework.views import status
from accounts.models import User
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken

class UserAuthenticationTestCase(APITestCase):
    """
    Test Cases for the User Model
    """

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='testuser@email.com', 
            username='testuser', 
            password='testpass'
        )

    def test_token_obtain_pair(self):
        """
        Test case to verify the obtainment of authentication tokens via API.
        """
        response = self.client.post(
            reverse('token_obtain_pair'), 
            {
                'email': 'testuser@email.com', 
                'password': 'testpass'
            }
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(settings.SIMPLE_JWT['AUTH_COOKIE'] in response.cookies)
        self.assertTrue(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'] in response.cookies)

    def test_token_obtain_pair_wrong_credentials(self):
        """
        Test case to verify that unauthorized access is denied when using incorrect credentials to obtain tokens.
        """
        response = self.client.post(
            reverse('token_obtain_pair'), 
            {
                'email': 'wronguser@email', 
                'password': 'wrongpass'
            }
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_registration(self):
        """
        Test case to verify the user registration functionality via API.
        """
        response = self.client.post(
            reverse('registration'), 
            {
                'username': 'testuser1', 
                'email': 'testuser@example.com',
                'password': 'testpass',
                'confirmPassword': 'testpass'
            }
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testuser').exists())
        self.assertTrue(settings.SIMPLE_JWT['AUTH_COOKIE'] in response.cookies)
        self.assertTrue(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'] in response.cookies)

    def test_registration_existing_user(self):
        """
        Test case to verify that registration fails when attempting to create an account with an existing username.
        """
        User.objects.create_user(username='existinguser', password='testpass')
        response = self.client.post(reverse('registration'),
            {
                'username': 'existinguser', 
                'email': 'testuser@example.com',
                'password': 'testpass',
                'confirmPassword': 'testpass'
            }
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
