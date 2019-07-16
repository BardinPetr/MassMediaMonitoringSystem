import React from 'react';
import { Select } from 'antd';
import { array } from 'prop-types';
const { Option } = Select;



const Style = {
    // zIndex: 10000,
    //position: 'absolute',
    //top: 50
};


export class CheckBox extends React.Component {

    getChildren = (array) =>{
        let ar = [];
        array.forEach(item => ar.push(<Option key={item}>{item}</Option>));
        return ar;

    }

    render() {
        const {dataArray, style, func, children} = this.props;

        return (
            <Select
                mode="multiple"
                style={{...Style, ...style}}
                placeholder={children}
                defaultValue={[]}
                onChange={(value) => {
                    let Return = '';
                    value.forEach(item => {Return = Return + dataArray.indexOf(item)});
                    func(Return);
                }}
                >
                {this.getChildren(dataArray)}
            </Select>
        )
    }
}