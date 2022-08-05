import { legacy_createStore as createStore, combineReducers, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import { composeWithDevTools } from "redux-devtools-extension";
import { productListReducers, productDetailsReducer } from "./reducers/product_reducers";
import cartReducer from "./reducers/cart_reducers";
import {
    userDetailsReducer,
    userLoginReducer,
    userRegisterReducer,
    userUpdateProfileReducer
} from "./reducers/user_reducers"
import {orderCreateReducer} from "./reducers/order_reducers";


const reducer = combineReducers({
    productList: productListReducers,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    orderCreate: orderCreateReducer,
})

const cartItemsFromStorage = localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : []

const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null

const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ?
    JSON.parse(localStorage.getItem('shippingAddress')) : {}

const initialState = {
    cart: {
       cartItems: cartItemsFromStorage,
        shippingAddress: shippingAddressFromStorage,
    },
    userLogin: {userInfo: userInfoFromStorage}
}
const middleware = [thunk]

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store;
