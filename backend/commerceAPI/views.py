from rest_framework import viewsets, filters
from .models import Product, Category, Order, Review, Cart, CartItem
from .serializers import ProductSerializer, CategorySerializer, OrderSerializer, ReviewSerializer, CartSerializer, CartItemSerializer

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.http import JsonResponse

from django_filters.rest_framework import DjangoFilterBackend
import requests
from datetime import datetime
import os
from dotenv import load_dotenv
import base64
load_dotenv()

# Create your views here.

@permission_classes([AllowAny])
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'category', 'tags']
    filterset_fields = ['category', 'price', 'rating', 'stock', 'brand']
    ordering_fields = ['created_at', 'updated_at', 'price', 'rating']

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['user']
    ordering_fields = ['created_at', 'updated_at']

    @action(detail=False, methods=['post'])
    def add_to_cart(self, request, pk=None):
        cartExists = Cart.objects.filter(user=request.user).exists()

        if not cartExists:
            cart = Cart.objects.create(user=request.user)
        else:
            cart = Cart.objects.get(user=request.user)

        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity')

        if not product_id:
            return Response({"error": "Product ID is required"}, status=400)

        try:
            product = Product.objects.get(id=product_id)
            
            cart_item = CartItem.objects.filter(cart=cart, product=product).first()
            if cart_item:
                cart_item.quantity += quantity
            else:
                cart_item = CartItem.objects.create(cart=cart, product=product, quantity=quantity)
        except Product.MultipleObjectsReturned:
            return Response({"error": "Multiple products found with the same ID"}, status=400)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        cart_item.save()
        return Response({"message": "Product added to cart", "cart_item": CartItemSerializer(cart_item).data})

    @action(detail=False, methods=['get'])
    def cart_items(self, request, pk=None):
        user = request.user
        
        cart_items = CartItem.objects.filter(cart__user=user)
        cart_items_serializer = CartItemSerializer(cart_items, many=True)
                    
        product_ids = [item["product"] for item in cart_items_serializer.data]
        products = Product.objects.filter(id__in=product_ids)
        product_serializer = ProductSerializer(products, many=True)
        
        product_map = {p["id"]: p for p in product_serializer.data}
                        
        product_response = [
            {
                "id": item["id"],
                "productId": product_map[item["product"]]["id"],
                "cartId": item["cart"],
                "title": product_map[item["product"]]["title"],
                "price": product_map[item["product"]]["price"],
                "quantity": item["quantity"],
                "total": product_map[item["product"]]["price"] * item["quantity"],
                "discountPercentage": product_map[item["product"]]["discountPercentage"],
                "thumbnail": product_map[item["product"]]["thumbnail"],
                "stock": product_map[item["product"]]["stock"],
                "minimumOrderQuantity": product_map[item["product"]]["minimumOrderQuantity"],
            }
            for item in cart_items_serializer.data
        ]
        
        return Response(product_response)
    
    @action(detail=True, methods=['put'])
    def update_cart_item(self, request, pk=None):
        cart_item_id = request.data.get('cart_item_id')
        quantity = request.data.get('quantity')

        if not cart_item_id or quantity is None:
            return Response({"error": "Cart item ID and quantity are required"}, status=400)

        try:
            cart_item = CartItem.objects.get(id=cart_item_id, cart__user=request.user)
            cart_item.quantity = quantity
            cart_item.save()
            return Response({"message": "Cart item updated successfully", "cart_item": CartItemSerializer(cart_item).data})
        except CartItem.DoesNotExist:
            return Response({"error": "Cart item not found"}, status=404)

class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['cart', 'user', 'product']
    ordering_fields = ['created_at', 'updated_at']

@permission_classes([AllowAny])
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['product_id']
    ordering_fields = ['product_id']

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    email = request.data.get('email')

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)
    
    user = User.objects.create_user(
        username=username,
        password=password,
        first_name=first_name,
        last_name=last_name,
        email=email
    )
    user.save()
    return Response({"message": "User created successfully"}, status=201)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user is not None:
        # Generate JWT token here
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        response = JsonResponse(
            {
            "refresh": str(refresh),
            "access": access_token,
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
            },
            status=200,
        )

        # Set HttpOnly cookie for refresh token
        response.set_cookie(
            key='refresh_token',
            value=refresh,
            httponly=True,
            secure=False,  # Set to True if using HTTPS
            samesite="Lax",
            path="/",
        )

        return response
    else:
        return Response({"error": "Invalid credentials"}, status=400)
     
@api_view(['POST'])
@permission_classes([AllowAny])   
def refresh(request):
    refresh_token = request.COOKIES.get('refresh_token')

    if not refresh_token:
        return Response({"error": "No refresh token provided"}, status=400)

    try:
        refresh = RefreshToken(refresh_token)
        new_access = str(refresh.access_token)

        return Response({"access": new_access})
    except TokenError:
        return Response({"detail": "Invalid or expired refresh token."}, status=401)
    
@api_view(['GET'])
def get_user(request):
    user = request.user

    if user.is_authenticated:
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        })
    else:
        return Response({"error": "User not authenticated"}, status=401)
    
@api_view(['POST'])
def logout(request):
    response = Response({"message": "Logged out successfully"})
    response.delete_cookie('refresh_token')
    return response

@api_view(['POST'])
def checkout(request):
    user = request.user
    if not user.is_authenticated:
        return Response({"error": "User not authenticated"}, status=401)

    cart = Cart.objects.filter(user=user).first()
    if not cart:
        return Response({"error": "Cart not found"}, status=404)

    total_price = sum(item.product.price * item.quantity for item in cart.items.all())
    
    try:
        api_key = os.getenv('XENDIT_API_KEY')
        base64_api_key = base64.b64encode(f"{api_key}:".encode()).decode()

        headers = {
            "Authorization": f"Basic {base64_api_key}",
        }
        
        payload = request.data        
        payment_response = requests.post(
            "https://api.xendit.co/v2/invoices",
            headers=headers,
            json=payload
        )
        payment_response.raise_for_status()  # Raise an error for bad responses
        payment_data = payment_response.json()
        
    except requests.RequestException as e:   
        return Response({"error": "Payment processing failed", "details": str(e)}, status=500)
    
    # Here you would typically create an Order object and process the payment
    # For simplicity, we will just return the total price
    return Response({
        "total_price": total_price,
        "payment_data": payment_data,
    })