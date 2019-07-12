import React from 'react';
import {Button, DatePicker} from 'antd';

const {RangePicker} = DatePicker;

const moment = require('moment');


export class DatePickerBar extends React.Component {

    static disabledDate(current) {
        return current > moment() || current < moment(new Date(2019, 6, 1));
    }

    componentDidMount() {
        this.setState({dates: [moment(), moment()]})
    }

    render() {
        const DivStyle = {
            margin: '0px 0px 0px 0px',
            position: 'absolute',
            zIndex: 1000,
            right: '12px',
            top: '14px'
        };
        return (
            <div style={DivStyle}>
                <RangePicker
                    disabledDate={DatePickerBar.disabledDate}
                    showTime={{
                        hideDisabledOptions: true
                    }}
                    onChange={x => this.onChange(x)}
                    onOk={x => this.onChange(x)}/>
                <Button type="primary"
                        icon="search"
                        style={{marginLeft: "10px"}}
                        onClick={() => this.props.onSearch(this.state.dates)}>
                    Search
                </Button>
            </div>
        );
    };

    onChange(dates) {
        this.setState({dates: dates.map((v) => v.unix())});
    }
}