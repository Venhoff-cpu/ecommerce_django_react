from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .user_serializer import UserSerializerWithToken


class TokenObtainSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        serializer_data = UserSerializerWithToken(self.user).data
        for k, v in serializer_data.items():
            data[k] = v
        return data
