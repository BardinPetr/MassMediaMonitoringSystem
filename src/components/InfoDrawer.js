import {Col, Drawer, Row, Statistic} from 'antd';
import {mapValue} from "../utils/CalcUtils";
import {hsvToHex} from "colorsys";
import Card from "antd/es/card";
import {Pie} from "@nivo/pie";
import React from "react";
import '../drawer.less';
import {Bar} from "@nivo/bar";

const cards_style = {
    marginBottom: "10px",
    markerStart: "0px",
    markerEnd: "0px"
};

export class InfoDrawer extends React.Component {
    dwidth = (window.innerWidth < window.innerHeight) ? window.innerWidth - 20 : 320;

    renderPieSex = () => {
        let height = this.dwidth - 15 * 2, width = this.dwidth - 15 * 2;
        const data = this.props.data.sex.filter((x) => x.value !== 0);
        return (
            <Pie
                width={width}
                height={height}
                padAngle={2}
                cornerRadius={10}
                enableRadialLabels={false}
                colors={(x) => hsvToHex({
                    h: mapValue(x.polarity, 0, 1, 0, 90),
                    s: 100,
                    v: 100
                })
                }
                tooltip={(x) => {
                    return (
                        <div>
                            <a>{x.id}</a>
                            <br/>
                            <a>Всего: {x.value}</a>
                            <br/>
                            <a>Ср.тональность:<br/>
                            {(x.polarity * 100).toFixed(2)} %</a>
                        </div>
                    );
                }}
                margin={{top: 20, right: 0, bottom: 60, left: 0}}
                data={data}
                legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        itemWidth: 60,
                        itemHeight: 18,
                        itemTextColor: '#444',
                        translateY: 35,
                        itemDirection: 'top-to-bottom',
                        symbolShape: 'circle'
                    }
                ]}
            />);
    };


    renderPieAge = () => {
        let height = this.dwidth - 15 * 2, width = this.dwidth - 15 * 2;
        const data = this.props.data.age.filter((x) => x.value !== 0);
        return (
            <Pie
                width={width}
                height={height}
                padAngle={2}
                cornerRadius={10}
                enableRadialLabels={false}
                colors={(x) => hsvToHex({
                    h: mapValue(x.polarity, 0, 1, 0, 90),
                    s: 100,
                    v: 100
                })
                }
                tooltip={(x) => {
                    return (
                        <div>
                            <a>{x.id}</a>
                            <br/>
                            <a>Всего: {x.value}</a>
                            <br/>
                            <a>Ср.тональность:<br/>
                            {(x.polarity * 100).toFixed(2)} %</a>
                        </div>
                    );
                }}
                margin={{top: 20, right: 0, bottom: 60, left: 0}}
                data={data}
                legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        itemWidth: 60,
                        itemHeight: 18,
                        itemTextColor: '#444',
                        translateY: 35,
                        itemDirection: 'top-to-bottom',
                        symbolShape: 'circle'
                    }
                ]}
            />);
    };

    renderChartSex() {
        let height = this.dwidth - 15 * 2, width = this.dwidth - 15 * 2;
        var data = this.props.data.sex;
        data.map(x =>
            x.polarity = parseFloat((x.polarity * 100).toFixed(1)));
        //console.log(data);
        return (
            <Bar
                width={width}
                height={height}
                data={data}
                keys={['value']}
                indexBy="id"
                margin={{top: 30, right: 30, bottom: 40, left: 60}}
                padding={0.3}
                colors={(x) => hsvToHex({
                    h: mapValue(x.data.polarity, 0, 100, 0, 90),
                    s: 100,
                    v: 100
                })
                }
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Пол',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Тональность',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                labelTextColor={{from: 'color', modifiers: [['darker', 1.6]]}}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
            />
        );
    }

    renderChartGroup() {
        let height = this.dwidth - 15 * 2, width = this.dwidth - 15 * 2;
        const data = this.props.data;
        let data1 = [{id: 'Новости', polarity: data.npolarity, count: data.ncount},
            {id: 'Группы', polarity: data.gpolarity, count: data.gcount},
            {id: 'Люди', polarity: data.upolarity, count: data.ucount}];
        console.log(data1);
        return (
            <Bar
                width={width}
                height={height}
                data={data1}
                keys={['count']}
                indexBy="id"
                margin={{top: 30, right: 30, bottom: 40, left: 60}}
                padding={0.3}
                colors={(x) => hsvToHex({
                    h: mapValue(x.data.polarity, 0, 1, 0, 90),
                    s: 100,
                    v: 100
                })}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Источники',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Количестов',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                labelTextColor={{from: 'color', modifiers: [['darker', 1.6]]}}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                tooltip={(x) => {
                    return (
                        <div>
                            <a>{x.data.id}</a>
                            <br/>
                            <a>Всего: {x.value}</a>
                            <br/>
                            <a>Ср.тональность:<br/>
                            {(x.data.polarity * 100).toFixed(2)} %</a>
                        </div>
                    );
                }}
            />
        );
    }

    renderContent() {
        var age = 0, sex = 0;
        this.props.data.sex.forEach(x => {
            sex += x.value;
        });
        this.props.data.age.forEach(x => {
            age += x.value;
        });
        return (
            <div>
                <Card style={{marginBottom: "10px", padding: "15px"}}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Statistic title="Всего постов" value={this.props.data.count}/>
                        </Col>
                        <Col span={12}>
                            <Statistic title="Тональность" value={(this.props.data.polarity * 100).toFixed(2).toString() + ' %'}
                                       precision={2}/>
                        </Col>
                    </Row>
                </Card>
                {(sex !== 0) 
                ? <Card title="Распределение по полу" style={cards_style}>
                    {this.renderPieSex()}
                </Card> : <div/>}
                {(age !== 0)
                    ? <Card title="Распределение по возрастам" style={cards_style}>
                        {this.renderPieAge()}
                    </Card> : <div/>}
                <Card title="Распределение источникам" style={cards_style}>
                    {this.renderChartGroup()}
                </Card>
            </div>
        )
    }

    render() {
        //console.log(window.innerWidth < window.innerHeight
        if (this.props.data)
            return (
                <div>
                    <Drawer
                        width={Math.min(350, Math.max(window.innerWidth, this.dwidth))}
                        title={`${this.props.data.name}`}
                        placement="left"
                        closable={true}
                        visible={this.props.open}
                        onClose={this.props.onClose}
                    >
                        {this.props.open ? this.renderContent() : ""}
                    </Drawer>
                </div>
            );
    }
}