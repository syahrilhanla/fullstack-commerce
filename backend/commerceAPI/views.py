from rest_framework import viewsets, filters
from .models import Product, Category, Order, Review, Cart, CartItem
from .serializers import ProductSerializer, CategorySerializer, OrderSerializer, ReviewSerializer
from django_filters.rest_framework import DjangoFilterBackend

# Create your views here.
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