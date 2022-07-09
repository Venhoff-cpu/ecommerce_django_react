from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(
        required=False, write_only=True, allow_blank=True
    )
    last_name = serializers.CharField(required=False, write_only=True, allow_blank=True)
    id = serializers.IntegerField(read_only=True)
    name = serializers.SerializerMethodField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "name",
            "is_superuser",
            "password",
            "first_name",
            "last_name",
        ]

    def get_name(self, obj):
        name = obj.first_name
        if name == "":
            name = obj.email

        return name

    def validate(self, attrs):
        attrs["password"] = make_password(attrs["password"])
        attrs["username"] = attrs["email"]
        return attrs


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "name",
            "is_superuser",
            "password",
            "first_name",
            "last_name",
            "token",
        ]

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)
