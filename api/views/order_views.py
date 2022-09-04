from rest_framework import viewsets, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.models import Order
from api.serializers import OrderSerializer


class OrderPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == "list":
            return request.user.is_authenticated and request.user.is_superuser
        elif view.action == "create":
            return True
        elif view.action in [
            "retrieve",
            "update",
            "partial_update",
            "destroy",
            "get_profile",
            "update_profile",
        ]:
            return True
        else:
            return False

    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user.is_authenticated:
            return False
        user = request.user
        if view.action == "retrieve":
            return user.is_superuser or obj.user == user
        elif view.action in ["update", "partial_update"]:
            return user.is_superuser or obj.user == user
        elif view.action == "destroy":
            return request.user.is_superuser

        return False


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    queryset = (
        Order.objects.select_related("user")
        .prefetch_related("order_items", "shipping_address")
        .all()
    )
    permission_classes = (OrderPermission,)

    def create(self, request, *args, **kwargs):
        data = request.data
        req_user = request.user
        data["user"] = req_user
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
