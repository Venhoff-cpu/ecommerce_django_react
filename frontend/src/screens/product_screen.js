import React, {useEffect, useState} from 'react'
import { Link, useParams } from "react-router-dom";
import {Row, Col, Image, ListGroup, Button, Card} from "react-bootstrap"
import axios from "axios";

import Rating from "../components/rating";

const ProductScreen = ({ match }) => {
    const [product, setProduct] = useState([])
    const { id } = useParams()

    useEffect(() => {
        const fetchProduct = async () => {
            const params = new URLSearchParams([['product_id', id]]);
            const { data } = await axios.get('/api/products', { params })
            setProduct(data)
        }
        fetchProduct();
    }, [])
    return (
        <div>
            <Link to="/" className="btn btn-light my-3">
                Go Back
            </Link>
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
            {product.name}
        </div>
    )
};

export default ProductScreen;