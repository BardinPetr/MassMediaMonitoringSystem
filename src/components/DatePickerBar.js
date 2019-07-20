import React from 'react';
import {Button, DatePicker} from 'antd';
import {CheckBox} from "./CheckBox"

const {RangePicker} = DatePicker;

const moment = require('moment');

export class DatePickerBar extends React.Component {

    componentDidMount() {
        this.setState({dates: [0, moment().unix()]});
        this.setState({sr: '', ar: '', dsr: ''})
    }

    render() {
        const DivStyle = {
            margin: '0px 0px 0px 0px',
            position: "sticky",
            zIndex: 1000,
            right: '12px',
            top: '14px',
            width: '300px',
            textAlign: 'right',
            float: 'right'
        };

        const DivDivStyle = {
            margin: '10px 0px 0px 0px',
        };

        const gender = ['Женщины', 'Мужчины', 'Группы'];
        const age = ['0-14', '15-21', '22-35', '36-50', '51+'];
        const source = ['Vk', 'Новости']
        return (
            <div style={DivStyle}>
                <div style={{textAlign: 'center'}}>
                    <RangePicker
                        showTime={{
                            hideDisabledOptions: true
                        }}
                        onChange={x => this.onChange(x)}
                        onOk={x => this.onChange(x)}
                        disabledDate={(current) => current > moment()}
                        format="DD.MM.YY"
                        separator=" ~ "/>
                </div>
                <div style={DivDivStyle}>
                    <CheckBox dataArray={gender}
                              style={{width: 300}}
                              mode="multiple"
                              func={e => this.setState({sr: e})}>Выберите половую группу</CheckBox>
                </div>
                <div style={DivDivStyle}>
                    <CheckBox dataArray={age}
                              style={{width: 300}}
                              defaultValue={age}
                              mode="multiple"
                              func={e => this.setState({ar: e})}>Выберите возрастный группы</CheckBox>
                </div>
                <div style={DivDivStyle}>
                    <CheckBox dataArray={source}
                              style={{width: 300}}
                              defaultValue={source}
                              mode="multiple"
                              func={e => this.setState({dsr: e})}>Выберите провайдера новостей</CheckBox>
                </div>
                <div style={{margin: '10px 0px 10px 0px'}}>
                    <Button type="primary"
                            icon="search"
                            style={{marginLeft: "10px"}}
                            onClick={() => this.props.onSearch({
                                time: this.state.dates,
                                sr: this.state.sr,
                                dsr: this.state.dsr,
                                ar: this.state.ar
                            })}>
                        Поиск
                    </Button>
                </div>
            </div>
        );
    };

    onChange(dates) {
        this.setState({dates: dates.map((v) => v.unix())});
    }
}