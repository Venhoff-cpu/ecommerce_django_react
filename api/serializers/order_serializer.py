from api.models import Order, OrderItem, Product, ShippingAddress
from django.db import transaction
from rest_framework import serializers

from .product_serializer import ProductSerializer


class ShippingAddressSerializer(serializers.ModelSerializer):
    order = serializers.IntegerField(read_only=True)

    class Meta:
        model = ShippingAddress
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
    order = serializers.IntegerField(read_only=True)
    # product = ProductSerializer(many=False, read_only=True)
    product = serializers.IntegerField(required=False)

    class Meta:
        model = OrderItem
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, write_only=True)
    shipping_address = ShippingAddressSerializer(many=False, write_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Order
        fields = "__all__"

    @transaction.atomic
    def create(self, validated_data):
        order_items = validated_data.pop("order_items")
        shipping_address = validated_data.pop("shipping_address")

        order = Order.objects.create(**validated_data)
        bulk_order_items = list()
        for item in order_items:
            product = Product.objects.get(id=item["product"])
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
