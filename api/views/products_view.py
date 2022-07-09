from rest_framework import viewsets

from ..models import Product
from ..serializers import ProductSerializer


class ProductsViewSet(viewsets.ModelViewSet):
    http_method_names = ["get"]
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
