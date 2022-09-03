from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from api.models import Order
from api.serializers import OrderSerializer


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()
    permission_classes = (IsAuthenticated,)
