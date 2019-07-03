import registerServiceWorker from "./registerServiceWorker";
import {hashHistory, Route, Router} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import {Provider} from 'react-redux';
import ReactDOM from "react-dom";
import store from './store';
import React from "react";
import App from "./App";

const history = syncHistoryWithStore(hashHistory, store);
const app = (
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}/>
        </Router>
    </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
registerServiceWorker();
