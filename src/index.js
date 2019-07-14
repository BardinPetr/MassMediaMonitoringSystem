import registerServiceWorker from "./registerServiceWorker";
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import ReactDOM from "react-dom";
import store from './store';
import React from "react";
import App from "./App";

const app = (
    <Provider store={store}>
        <Router>
            <Route path="/" component={App}/>
        </Router>
    </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
registerServiceWorker();
