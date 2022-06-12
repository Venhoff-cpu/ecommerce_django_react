from rest_framework import viewsets

from ..models import Product
from ..serializers import ProductSerializer


class ProductsViewset(viewsets.ModelViewSet):
    http_method_names = ["get"]
    serializer_class = ProductSerializer
    authentication_classes = []

    def get_queryset(self):
        """
        Optionally restricts the returned products to supplied product_id in URL.
        """
        queryset = Product.objects.all()
        product_id = self.request.query_params.get('product_id')
        if product_id is not None:
            queryset = queryset.filter(id=product_id)
        return queryset
