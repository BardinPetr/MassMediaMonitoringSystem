import React from 'react';
import {scaleThreshold} from '@vx/scale';
import {hsvToHex} from "colorsys";
import {LegendItem, LegendLabel, LegendThreshold} from '@vx/legend';

const thresholdScale = {
    range: [hsvToHex({h: 0, s: 100, v: 100}), hsvToHex({h: 18, s: 100, v: 100}), hsvToHex({h: 36, s: 100, v: 100}),
        hsvToHex({h: 54, s: 100, v: 100}), hsvToHex({h: 72, s: 100, v: 100}), hsvToHex({h: 90, s: 100, v: 100})]
};

const style = {
    // zIndex: 10000,
    position: 'absolute',
    left: 10,
    bottom: 35
};


export class LegendBar extends React.Component {

    render() {
        const {dataArray} = this.props;

        return (
            <Legend title="Тональность">
                <LegendThreshold
                    labelDelimiter='до'
                    labelLower='Меньше, чем '
                    scale={scaleThreshold({range: thresholdScale.range, domain: dataArray})}>
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