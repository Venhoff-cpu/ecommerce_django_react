from rest_framework.response import Response
from rest_framework.views import APIView

from .products import products


class GetProductsView(APIView):
    http_method_names = ['get']
    authentication_classes = []

    def get(self, request):
        products_id = request.query_params.get("product_id")
        if products_id:
            for product in products:
                if product["_id"] == products_id:
                    return Response(product)

        return Response(products)

