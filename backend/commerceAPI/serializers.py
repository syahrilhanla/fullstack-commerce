from rest_framework import serializers
from .models import Cart, CartItem, Product, Category, Order, OrderItem, Review
import re

# Helper for camelCase conversion
def camel_case(s):
    return re.sub(r'_([a-z])', lambda m: m.group(1).upper(), s)

class CamelCaseModelSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        return {camel_case(key): value for key, value in data.items()}

class ProductSerializer(CamelCaseModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class CategorySerializer(CamelCaseModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class OrderSerializer(CamelCaseModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
        
class OrderItemsSerializer(CamelCaseModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class ReviewSerializer(CamelCaseModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class CartSerializer(CamelCaseModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'

class CartItemSerializer(CamelCaseModelSerializer):
    class Meta:
        model = CartItem
        fields = '__all__'