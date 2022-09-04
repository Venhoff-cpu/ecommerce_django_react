import React, {useEffect} from 'react'
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import {Link, useParams} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/message'
import Loader from "../components/loader";
import {getOrderDetails, payOrder} from '../actions/order_actions'
import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/order_constants'
import * as PropTypes from "prop-types";

function PayPalButton(props) {
    return null;
}

PayPalButton.propTypes = {
    amount: PropTypes.any,
    onSuccess: PropTypes.func
};

function OrderScreen() {
    // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
    // This is the main reason to wrap the PayPalButtons in a new component
    const [{ isPending }] = usePayPalScriptReducer();
    const { orderId } = useParams();
    const dispatch = useDispatch();

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, error, loading } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    if (!loading && !error) {
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }

    useEffect(() => {
        if (!order || successPay || order.id !== Number(orderId)){
            dispatch({type: ORDER_PAY_RESET})
            dispatch(getOrderDetails(orderId))
        }
    }, [dispatch, order, orderId, successPay])


    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult))
    }

    return loading ? ( <Loader />) :
        error ? (
            <Message variant="danger">{error}</Message>
        ) :
        (
        <div>
            <h1>Order: {order.id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name: </strong> {order.user.name}</p>
                            <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                            <p>
                                <strong>Shipping: </strong>
                                {order.shippingAddress.address},  {order.shippingAddress.city}
                                {'  '}
                                {order.shippingAddress.postalCode},
                                {'  '}
                                {order.shippingAddress.country}
                            </p>
                             {order.isDelivered ? (
                                 <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                             ) : (
                                 <Message variant='warning'>Not Delivered</Message>
                             )}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                                <p>
                                    <strong>Method: </strong>
                                    {order.paymentMethod}
                                </p>
                                {order.isPaid ? (
                                    <Message variant='success'>Paid on {order.paidAt}</Message>
                                ) : (
                                    <Message variant='warning'>Not Paid</Message>
                                )}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? <Message variant='info'>
                                Your order is empty
                            </Message> : (
                                    <ListGroup variant='flush'>
                                        {order.orderItems.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image src={item.image} alt={item.name} fluid rounded />
                                                    </Col>

                                                    <Col>
                                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                    </Col>

                                                    <Col md={4}>
                                                        {item.qty} X ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}
                                    <PayPalButtons
                                        disabled={isPending}
                                        fundingSource={undefined}
                                        createOrder={(data, actions) => {
                                            return actions.order
                                                .create({
                                                    purchase_units: [
                                                        {
                                                            amount: {
                                                                value: order.totalPrice,
                                                            },
                                                        },
                                                    ],
                                                })
                                                .then((orderId) => {
                                                    // Your code here after create the order
                                                    return orderId;
                                                });
                                        }}
                                        onApprove={function (data, actions) {
                                            return actions.order.capture().then(function () {
                                                successPaymentHandler(data)
                                            });
                                        }}
                                    />
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default OrderScreen;
