import React from 'react';
import { Container } from 'react-bootstrap';
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Header from "./components/header";
import Footer from "./components/footer";
import HomeScreen from "./screens/home_screen";
import ProductScreen from "./screens/product_screen";
import CartScreen from "./screens/cart_screen";

const App = () => {
  return (
    <BrowserRouter>
        <Header />
      <main className="py-3">
          <Container >
              <Routes>
                  {" "}
                  <Route path='/' element={<HomeScreen />} exact />
                  <Route path='/product/:prodId' element={<ProductScreen />} />
                  <Route path='/cart/:prodId' element={<CartScreen />} />
                  <Route path='/cart' element={<CartScreen />} />
              </Routes>
          </Container>
      </main>
        <Footer />
    </BrowserRouter>
  );
}

export default App;
