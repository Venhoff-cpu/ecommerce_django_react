from rest_framework.routers import DefaultRouter

from .views import ProductsViewset

router = DefaultRouter()

urlpatterns = [
    router.register(r"products", ProductsViewset, basename="products")
]
