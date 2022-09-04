from api.models import Order, OrderItem, Product, ShippingAddress
from django.db import transaction
from rest_framework import serializers

from .user_serializer import UserSerializer


class ShippingAddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = ShippingAddress
        exclude = ["order"]


class OrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderItem
        exclude = ["order"]


class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, write_only=True)
    shipping_address = ShippingAddressSerializer(many=False, write_only=True)
    items = serializers.SerializerMethodField(read_only=True)
    address = serializers.SerializerMethodField(read_only=True)
    serialized_user = serializers.SerializerMethodField(read_only=True, method_name="get_user")

    class Meta:
        model = Order
        fields = "__all__"

    def get_items(self, obj):
        order_items = obj.order_items.all()
        return OrderItemSerializer(order_items, many=True).data

    def get_address(self, obj):
        shipping_address = obj.shipping_address
        return ShippingAddressSerializer(shipping_address).data

    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data

    @transaction.atomic
    def create(self, validated_data):
        order_items = validated_data.pop("order_items")
        shipping_address = validated_data.pop("shipping_address")

        order = Order.objects.create(**validated_data)
        bulk_order_items = list()
        for item in order_items:
            product = Product.objects.get(id=item["product"].id)
            order_item = OrderItem(
                product=product,
                name=product.name,
                image=product.image.url,
                order=order,
                qty=item["qty"],
                price=item["price"],
            )
            product.count_in_stock -= item["qty"]
            product.save()
            bulk_order_items.append(order_item)

        OrderItem.objects.bulk_create(bulk_order_items)

        shipping_address["order"] = order
        ShippingAddress.objects.create(**shipping_address)

        return order
