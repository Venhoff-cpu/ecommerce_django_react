import React from 'react'
import {Row, Col} from "react-bootstrap"

import productsDummy from "../productsDummy";
import Product from "../components/product";

const HomeScreen = () => {
    return (
        <div>
            <h1>Latest Products</h1>
            <Row>
                {productsDummy.map(product => {
                    return (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                            <Product product={product}/>
                        </Col>
                    )
                })}
            </Row>
        </div>
    )
}

export default HomeScreen;
