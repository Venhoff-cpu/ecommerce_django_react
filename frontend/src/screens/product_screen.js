import React, {useEffect, useState} from 'react'
import {Link, useParams, useNavigate, createSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Row, Col, Image, ListGroup, Button, Card, Form} from "react-bootstrap"

import {listProductDetails} from "../actions/product_actions";
import Rating from "../components/rating";
import Loader from "../components/loader";
import Message from "../components/message";


const ProductScreen = () => {
    const [qty, setQty] = useState(1);
    const dispatch = useDispatch();
    const {loading, error, product} = useSelector((state) => state.productDetails);

    const { prodId } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(listProductDetails(prodId))
    }, [prodId, dispatch])

    const addToCartHandler = () => {
        const params = {qty:qty}
        navigate({
            pathname: `/cart/${prodId}`,
            search: `?${createSearchParams(params)}`,
        });
    }

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
                                <Rating prodRating={product.rating} numReviews={product.num_reviews} />
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
                                            {product.count_in_stock > 0 ? "In Stock" : "Out of stock"}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                {product.count_in_stock > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                Qty
                                            </Col>
                                            <Col xs="auto" className="my-1">
                                                <Form.Control
                                                    as="select"
                                                    value={qty}
                                                    onChange={(e) => setQty(e.target.value)}
                                                >
                                                    {
                                                        [...Array(product.count_in_stock).keys()].map(
                                                            (x) => (
                                                                <option key={x+1} value={x+1}>
                                                                    { x + 1 }
                                                                </option>
                                                            )
                                                        )
                                                    }
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>)
                                }
                                <ListGroup.Item>
                                    <div className="d-grid gap-2">
                                        <Button
                                            onClick={addToCartHandler}
                                            type="button"
                                            disabled={product.count_in_stock === 0}
                                        >
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