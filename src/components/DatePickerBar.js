import React from 'react';
import {Button, DatePicker} from 'antd';

const {RangePicker} = DatePicker;
import {CheckBox} from "./CheckBox"

const moment = require('moment');


export class DatePickerBar extends React.Component {

    static disabledDate(current) {
        return current > moment() || current < moment(new Date(2019, 6, 1));
    }

    componentDidMount() {
        this.setState({dates: [moment(), moment()].map((v) => v.unix())})
        this.setState({sr: '', ar: ''})
    }

    render() {
        const DivStyle = {
            margin: '0px 0px 0px 0px',
            position: 'absolute',
            zIndex: 1000,
            right: '12px',
            top: '14px',
            width: '300px',
            float: 'right',
            textAlign: 'right'
        };
        const DivDivStyle = {
            margin: '10px 0px 0px 0px',
        };
        return (
            <div style={DivStyle}>
                <div style={{textAlign: 'center'}}>
                    <RangePicker
                        disabledDate={DatePickerBar.disabledDate}
                        showTime={{
                            hideDisabledOptions: true
                        }}
                        onChange={x => this.onChange(x)}
                        onOk={x => this.onChange(x)}
                        format="DD.MM.YY"
                        separator=" ~ "/>
                </div>
                <div style={DivDivStyle}>
                    <CheckBox dataArray={['Женщины', 'Мужчины', 'Группы']}
                        style={{width: 300}}
                        func={e => this.setState({sr: e})}>Выберите половые группы</CheckBox>
                </div>
                <div style={DivDivStyle}>
                    <CheckBox dataArray={['0-14', '15-21', '22-35', '36-50', '51+']}
                    style={{width: 300}}
                    func={e => this.setState({ar: e})}>Выберите возрастный группы</CheckBox>
                </div>
                <div style={DivDivStyle}>
                    <Button type="primary"
                            icon="search"
                            style={{marginLeft: "10px"}}
                            onClick={() => this.props.onSearch({time: this.state.dates, sr: this.state.sr, ar: this.state.ar})}>
                        Search
                    </Button>
                </div>
            </div>
        );
    };

    onChange(dates) {
        this.setState({dates: dates.map((v) => v.unix())});
    }
}