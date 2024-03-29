import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import {Row, Col} from "react-bootstrap"

import Product from "../components/product";
import { listProducts } from "../actions/product_actions"
import Loader from "../components/loader";
import Message from "../components/message";

const HomeScreen = () => {
    const dispatch = useDispatch();
    const productList = useSelector((state) => state.productList)
    const {error, loading, products} = productList
    useEffect(() => {
        dispatch(listProducts())
    }, [dispatch])

    return (
        <div>
            <h1>Latest Products</h1>
            {loading ? <Loader />
                : error ? <Message variant="danger">{error}</Message>: <Row>
                {products.map(product => {
                    return (
                        <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
                            <Product product={product}/>
                        </Col>
                    )
                })}
                </Row>
            }

        </div>
    )
}

export default HomeScreen;
