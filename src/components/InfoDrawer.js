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
        const data = this.props.data.sex;
        return (
            <Pie
                width={width}
                height={height}
                padAngle={2}
                cornerRadius={10}
                enableRadialLabels={false}
                colors={(x) => ["#f739a6", "#5f00d7"][data.indexOf(x)]}
                tooltip={(x) => {
                    return (
                        <div>
                            <a>{x.id}</a>
                            <br/>
                            <a>Всего: {x.value}</a>
                            <br/>
                            <a>Ср.тональность: {x.polarity}</a>
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
        const data = this.props.data.age;
        return (
            <Pie
                width={width}
                height={height}
                padAngle={2}
                cornerRadius={10}
                enableRadialLabels={false}
                colors={(x) => hsvToHex({
                    h: mapValue(x.polarity, 0, 1, -120, 0),
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
                            <a>Ср.тональность: {x.polarity}</a>
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
            x.polarity = parseFloat(x.polarity.toFixed(3)));
        console.log(data);
        return (
            <Bar
                width={width}
                height={height}
                data={data}
                keys={['polarity']}
                indexBy="id"
                margin={{top: 30, right: 30, bottom: 40, left: 60}}
                padding={0.3}
                colors={(x) => ["#f739a6", "#5f00d7"][data.indexOf(x.data)]}
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

    renderContent() {
        return (
            <div>
                <Card style={{marginBottom: "10px", padding: "15px"}}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Statistic title="Всего постов" value={this.props.data.count}/>
                        </Col>
                        <Col span={12}>
                            <Statistic title="Тональность" value={this.props.data.polarity.toFixed(2)} precision={2}/>
                        </Col>
                    </Row>
                </Card>
                <Card title="Распределение по полу" style={cards_style}>
                    {this.renderPieSex()}
                    {this.renderChartSex()}
                </Card>
                <Card title="Распределение по возрастам" style={cards_style}>
                    {this.renderPieAge()}
                </Card>
            </div>
        )
    }

    render() {
        console.log(window.innerWidth < window.innerHeight)
        return (
            <div>
                <Drawer
                    width={this.dwidth + 20}
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