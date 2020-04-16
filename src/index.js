import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./App.scss";
import "bootstrap/dist/css/bootstrap.css";
import { setCurrentUser } from "./actions/authActions";
import firebase from "./firebase";

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        store.dispatch(setCurrentUser(user));
    } else {
        store.dispatch(setCurrentUser({}));
    }
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById("root")
    );
});

serviceWorker.unregister();
