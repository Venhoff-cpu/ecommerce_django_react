from django.contrib.auth.models import User

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from ..serializers import UserSerializer
from ..serializers.user_serializer import UserSerializerWithToken


class UserPermission(permissions.BasePermission):
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
        ]:
            return True
        else:
            return False

    def has_object_permission(self, request, view, obj):
        # Deny actions on objects if the user is not authenticated
        if not request.user.is_authenticated:
            return False

        if view.action == "retrieve":
            return request.user.is_superuser
        elif view.action in ["update", "partial_update"]:
            return obj == request.user or request.user.is_superuser
        elif view.action == "destroy":
            return request.user.is_superuser
        elif view.action == "get_profile":
            return True

        return False


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (UserPermission,)

    @action(["GET"], detail=False)
    def get_profile(self, request):
        user = request.user
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = UserSerializerWithToken(data=request.data, many=False)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
