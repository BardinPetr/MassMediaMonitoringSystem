import React from 'react';
import {scaleThreshold} from '@vx/scale';
import {hsvToHex} from "colorsys";
import {LegendItem, LegendLabel, LegendThreshold} from '@vx/legend';
import {mapValue} from '../utils/CalcUtils'

const style = {
    // zIndex: 10000,
    position: 'absolute',
    left: 10,
    bottom: 35
};


export class LegendBar extends React.Component {

    constructor(props) {
        super(props);
        this.thresholdScale = this.thresholdScale.bind(this);
        this.state = {
            tmax: 100,
            tmin: 0
        }
    };

    componentDidMount() {
    }

    thresholdScale = (array) => {
        let col = [];
        var MAX = array[(array.length - 1)];
        var MIN = array[0];
        console.log(1, this);
        if((array.length === 1) && (array[0] !== 0)){
            MAX = this.state.tmax;
            MIN = this.state.tmin;
        }
        if((array.length === 0) || (array[0] === 0)){
            MAX = 100;
            MIN = 0;
        }
        this.state = {tmax: MAX, tmin: MIN};
        console.log(2, this);
        for(let i = 0; i < array.length; i++)
            col.push(hsvToHex({h: mapValue(array[i], MIN, MAX, 0, 90), s: 100, v: 100}));
        return col;
    };

    render() {
        const {dataArray} = this.props;
        let a = this.thresholdScale(dataArray);


        return (
            <Legend title="Тональность, %">
                <LegendThreshold
                    labelDelimiter='до'
                    labelLower='Меньше, чем '
                    scale={scaleThreshold({range: a, domain: dataArray})}>
                    {labels => {
                        return labels.reverse().map((label, i) => {
                            const size = 15;
                            return (
                                <LegendItem
                                    key={`legend-quantile-${i}`}
                                    margin="1px 0">
                                    <svg width={size} height={size}>
                                        <rect fill={label.value} width={size} height={size}/>
                                    </svg>
                                    <LegendLabel align={'left'} margin={'2px 0 0 10px'}>
                                        {label.text}
                                    </LegendLabel>
                                </LegendItem>
                            );
                        });
                    }}
                </LegendThreshold>
            </Legend>
        )
    }
}

function Legend({title, children}) {
    return (
        <div className="legend" style={style}>
            <div className="title">{title}</div>
            {children}
        </div>
    );
}