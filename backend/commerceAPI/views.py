from rest_framework import viewsets, filters
from .models import Product, Category, Order, Review, Cart, CartItem
from .serializers import ProductSerializer, CategorySerializer, OrderSerializer, ReviewSerializer

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.http import JsonResponse

from django_filters.rest_framework import DjangoFilterBackend

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

    print("Username:", username)

    user = authenticate(username=username, password=password)
    if user is not None:
        # Generate JWT token here
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        print("Access Token:", access_token)
        print("Refresh Token:", str(refresh))

        response = JsonResponse(
            {
            "refresh": str(refresh),
            "access": access_token,
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

    print(refresh_token)
    print(request.COOKIES)
    print(request)

    if not refresh_token:
        return Response({"error": "No refresh token provided"}, status=400)

    try:
        refresh = RefreshToken(refresh_token)
        new_access = str(refresh.access_token)

        return Response({"access": new_access})
    except TokenError:
        return Response({"detail": "Invalid or expired refresh token."}, status=401)