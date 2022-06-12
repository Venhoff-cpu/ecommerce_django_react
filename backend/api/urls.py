from rest_framework.routers import DefaultRouter
from django.urls import path, include

from .views import ProductsViewset

router = DefaultRouter()

router.register(r"products", ProductsViewset, basename="products")

urlpatterns = [
    path("", include(router.urls)),
]
