from rest_framework.routers import DefaultRouter
from django.urls import path, include


from .views import ProductsViewSet, TokenObtainView, UserProfileViewSet, OrderViewSet

router = DefaultRouter()

router.register(r"products", ProductsViewSet, basename="products")
router.register(r"users", UserProfileViewSet, basename="users")
router.register(r"order", OrderViewSet, basename="orders")

urlpatterns = [
    path("", include(router.urls)),
    path("login/", TokenObtainView.as_view(), name="token_obtain_pair"),
]
