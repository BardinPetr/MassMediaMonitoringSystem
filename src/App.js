import React, {Component} from "react";
import {BrowserRouter as Router} from "react-router-dom";
import BaseRouter from "./routes";
import "antd/dist/antd.css";

import CustomLayout from "./containers/Layout";

class App extends Component {
    render() {
        return (
            <Router>
                <CustomLayout {...this.props}>
                    <BaseRouter/>
                </CustomLayout>
            </Router>
        );
    }
}

export default App;