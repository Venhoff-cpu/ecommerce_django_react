import axios from "axios";
import {CART_REMOVE_ITEM, CART_ADD_ITEM} from "../constants/cart_constants";

const addToCart = (id, qty) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/products/${id}`)
    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            product: data.id,
            name: data.name,
            image: data.image,
            price: data.price,
            count_in_stock: data.count_in_stock,
            qty
        }
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id,
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}


export { addToCart, removeFromCart};