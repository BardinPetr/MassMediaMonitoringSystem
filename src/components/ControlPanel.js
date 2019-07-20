import React from 'react';
import {Button, Icon} from 'antd';
import Logo1 from '../data/subrine.svg';
import Logo2 from '../data/grapes1.svg';
import Logo3 from '../data/sea.svg';

export class ControlPanel extends React.Component {

    render() {

        const DivStyle = {
            margin: '0px 0px 0px 0px',
            position: "sticky",
            zIndex: 1000,
            margin: '14px 0px 0px 12px',
            width: '40px',
            textAlign: 'left',
            float: 'left'
        };
        const DivDivStyle = {
            margin: '10px 0px 0px 0px',
        };

        const ButtonStyle = {
            width: '32px',
            height: '32px',
            textAlign: 'left',
            padding: '1px 0px 0px 5px'
        };

        return (
            <div style={DivStyle} className='control-panel'>
                <div>
                    <Button type="primary"
                            style={ButtonStyle}
                            onClick={() => this.props.onChange({latitude: 68.969563, longitude: 33.074540, zoom: 10})}
                    ><Icon component={Logo1}/></Button>
                </div>
                <div style={DivDivStyle}>
                    <Button type="primary"
                            style={ButtonStyle}
                            onClick={() => this.props.onChange({latitude: 43.407890, longitude: 39.946131, zoom: 10})}
                    ><Icon component={Logo2}/></Button>
                </div>
                <div style={DivDivStyle}>
                    <Button type="primary"
                            style={ButtonStyle}
                            onClick={() => this.props.onChange({
                                latitude: 43.9305694876073,
                                longitude: 38.35977202178216,
                                zoom: 7.753681963006117
                            })}
                    ><Icon component={Logo3}/></Button>
                </div>
            </div>
        )
    }

}