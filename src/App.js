import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

import Home from "./Components/Home";
import Board from "./Components/Board";
import Setting from "./Components/Setting";
import Vs from "./Components/Vs";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Profile from "./Components/Profile";

const App = () => {
    return (
        <Router>
            <Route exact path="/" component={Home} />
            <Route path="/board" component={Board} />
            <Route path="/vs/:n" component={Vs} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/Setting" component={Setting} />
            <Route path="/Profile" component={Profile} />
        </Router>
    );
};

export default App;
