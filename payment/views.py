import stripe
from django.conf import settings
from django.utils import timezone
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from core.authenticate import CustomAuthentication
from core.models import Order, OrderItem, Product

stripe.api_key = settings.STRIPE_SECRET_KEY


class StripeCheckoutView(APIView):
    authentication_classes = [CustomAuthentication]

    def post(self, request):
        if request.user.is_anonymous:
            raise PermissionDenied("You must be logged in to unsave a product")
        line_items = []
        for item in request.data.get('items', []):
            try:
                price = float(item['price'])
            except ValueError:
                return Response(
                    {'error': f"Invalid price value: {item['price']}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            line_items.append({
                'price_data': {
                'currency': 'usd',
                'product_data': {
                    'name': item['name'],
                    'description': item['description'],
                    'images': [item['main_image']],
                },
                'unit_amount': int(price * 100),
                },
                'quantity': item['quantity'],
            })

        try:
            checkout_session = stripe.checkout.Session.create(
                line_items=line_items,
                payment_method_types=['card'],
                mode='payment',
                success_url=settings.SITE_URL + '/?success=true&session_id={CHECKOUT_SESSION_ID}',
                cancel_url=settings.SITE_URL + '/?canceled=true',
            )

            return Response({'url': checkout_session.url})
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ConfirmPaymentView(APIView):
    authentication_classes = [CustomAuthentication]

    def post(self, request):
        session_id = request.data.get('session_id')
        cart_items = request.data.get('items', [])
        if session_id is None or not cart_items:
            return Response({'error': 'Missing session_id or items'}, status=400)

        try:
            checkout_session = stripe.checkout.Session.retrieve(session_id)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

        if checkout_session.payment_status == 'paid':
            # Create a new Order
            order = Order.objects.create(
                user=request.user,
                totalPrice=checkout_session.amount_total / 100,  # Convert from cents
                isPaid=True,
                paidAt=timezone.now()
            )

            # Create OrderItems for each item in the cart and decrease product countInStock
            for item in cart_items:
                product = Product.objects.get(id=item['id'])
                OrderItem.objects.create(
                    product=product,
                    order=order,
                    name=product.name,
                    qty=item['quantity'],
                    price=product.price
                )
                if product.countInStock > 0:
                    product.countInStock -= item['quantity']
                product.save()

            return Response({'status': 'Payment was successful and order was created'})
        else:
            return Response({'status': 'Payment failed'})
