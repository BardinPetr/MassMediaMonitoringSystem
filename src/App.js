import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import React, {Component} from "react";
import {connect} from 'react-redux';

import {addDataToMap} from 'kepler.gl/actions';
import KeplerGl from 'kepler.gl';

import Button from './components/button';
import "antd/dist/antd.css";

import mapConfig from "./data/map_config"

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ29sZGZvcjEiLCJhIjoiY2p4bGtncjZ3MDZoYjNzcWhuM2J0dWM1ZyJ9.y2_uVrkzdNmjkXnsvw_xdA'; // eslint-disable-line

class App extends Component {
    componentDidMount() {
        this.publishData({})
    }

    publishData(data) {
        this.props.dispatch(
            addDataToMap({
                datasets: {
                    info: {
                        label: 'Mass Media Monitoring',
                        id: 'mmm_data'
                    },
                    data: data
                },
                option: {
                    centerMap: true,
                    readOnly: false
                },
                config: mapConfig
            })
        );
    }

    render() {
        return (
            <div style={{position: 'absolute', width: '100%', height: '100%', minHeight: '70vh'}}>
                <Button onClick={this.publishData}>Replace Data</Button>
                <AutoSizer>
                    {({height, width}) => (
                        <KeplerGl
                            mapboxApiAccessToken={MAPBOX_TOKEN}
                            id="map"
                            width={width}
                            height={height}
                        />
                    )}
                </AutoSizer>
            </div>
        );
    }
}

//mapConfig
const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
