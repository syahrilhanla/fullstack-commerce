from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, OrderViewSet, ReviewViewSet, CartViewSet, CartItemViewSet, register, login, refresh, get_user, logout, checkout, success_payment

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'cart-items', CartItemViewSet, basename='cart-items')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('auth/refresh/', refresh, name='refresh'),
    path('me/', get_user, name='me'),
    path('auth/logout/', logout, name='logout'),
    path('checkout/', checkout, name='checkout'),
    path('success-payment/', success_payment, name='success_payment'),
]
