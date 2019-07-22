import React from 'react';
import {scaleThreshold} from '@vx/scale';
import {hsvToHex} from "colorsys";
import {LegendItem, LegendLabel, LegendThreshold} from '@vx/legend';
import {mapValue} from'../utils/CalcUtils'

const style = {
    // zIndex: 10000,
    position: 'absolute',
    left: 10,
    bottom: 35
};


export class LegendBar extends React.Component {

    thresholdScale = (array) => {
        let col = [];
        let MAX = array[(array.length - 1)];
        if(MAX === 0)MAX = 100;
        if(array.length < 2)MAX = 100;
        //console.log(MAX);
        for(let i = 0; i < array.length; i++)
            col.push(hsvToHex({h: mapValue(array[i], array[0], MAX, 0, 90), s: 100, v: 100}));
        return col;
    }

    render() {
        const {dataArray} = this.props;
        

        return (
            <Legend title="Тональность">
                <LegendThreshold
                    labelDelimiter='до'
                    labelLower='Меньше, чем '
                    scale={scaleThreshold({range: this.thresholdScale(dataArray), domain: dataArray})}>
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