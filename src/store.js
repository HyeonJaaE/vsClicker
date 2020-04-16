import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const initialState = {};
const middleware = [thunk];

const store = createStore(rootReducer, initialState, compose(applyMiddleware(...middleware)));

export default store;

/*

createStore(reducer, [preloadedState], [enhancer])
compose to enhance a store with applyMiddleware and a few developer tools from the redux-devtools package.

*/
