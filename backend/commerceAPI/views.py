from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from .models import Product, Category, Order, Review, Cart, CartItem
from .serializers import ProductSerializer, CategorySerializer, OrderSerializer, ReviewSerializer

# Create your views here.
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer