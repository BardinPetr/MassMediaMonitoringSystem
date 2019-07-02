import React from "react";
import {Layout} from "antd";

const {Content} = Layout;

class CustomLayout extends React.Component {
    render() {
        return (
            <Layout className="layout" style={{background: "#111", height: "100%"}}>
                <Content style={{padding: "0 16px"}}>
                    {this.props.children}
                </Content>
            </Layout>
        );
    }
}

export default CustomLayout;