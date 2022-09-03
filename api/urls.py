from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import OrderViewSet, ProductsViewSet, TokenObtainView, UserProfileViewSet

router = DefaultRouter()

router.register(r"products", ProductsViewSet, basename="products")
router.register(r"users", UserProfileViewSet, basename="users")
router.register(r"order", OrderViewSet, basename="orders")

urlpatterns = [
    path("", include(router.urls)),
    path("login/", TokenObtainView.as_view(), name="token_obtain_pair"),
]
