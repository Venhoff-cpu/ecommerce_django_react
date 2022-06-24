import React, {useEffect, useState} from 'react'
import { Link, useParams } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Row, Col, Image, ListGroup, Button, Card} from "react-bootstrap"

import {listProductDetails} from "../actions/product_actions";
import Rating from "../components/rating";
import Loader from "../components/loader";
import Message from "../components/message";


const ProductScreen = ({ match }) => {
    const dispatch = useDispatch()
    const {loading, error, product} = useSelector((state) => state.productDetails)
    const { id } = useParams()

    useEffect(() => {
        dispatch(listProductDetails(id))
    }, [id, dispatch])

    return (
        <div>
            <Link to="/" className="btn btn-light my-3">
                Go Back
            </Link>
            {
                loading ? <Loader />
                : error ? <Message variant="danger">{error}</Message>: (
                <Row>
                    <Col md={6}>
                        <Image src={product.image} alt={product.name} fluid />
                    </Col>
                    <Col md={3}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h3>{product.name}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Rating prodRating={product.rating} numReviews={product.numReviews} />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Price: ${product.price}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Description: {product.description}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={3}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            Price:
                                        </Col>
                                        <Col>
                                            <strong>${product.price}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            Status:
                                        </Col>
                                        <Col>
                                            {product.countInStock > 0 ? "In Stock" : "Out of stock"}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="d-grid gap-2">
                                        <Button type="button" disabled={product.countInStock === 0}>
                                            Add to Cart
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
                    )
            }
        </div>
    )
};

export default ProductScreen;