import registerServiceWorker from "./registerServiceWorker";
import ReactDOM from "react-dom";
import React from "react";
import App from "./App";

const app = (
    <App/>
);

ReactDOM.render(app, document.getElementById("root"));
registerServiceWorker();
