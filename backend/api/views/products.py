from rest_framework import viewsets

from ..models import Product
from ..serializers import ProductSerializer


class ProductsViewset(viewsets.ModelViewSet):
    http_method_names = ["get"]
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    authentication_classes = []
