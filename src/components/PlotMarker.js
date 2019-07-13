import React from 'react';
import {BaseControl} from 'react-map-gl';

export class PlotMarker extends BaseControl {
    _render() {
        const {data: point} = this.props;
        const [x, y] = this._context.viewport.project(point.geo);
        console.log();
        const markerStyle = {
            fontSize: 'large',
            fontWeight: 600,
            position: 'absolute',
            left: x,
            top: y,
            WebkitTransform: `translate(-50%, 0)`
        };

        return (
            <div ref={this._containerRef}
                 style={markerStyle}>
                {this._context.viewport.zoom > 9 ? point.data.display_count : ""}
            </div>
        );
    }
}