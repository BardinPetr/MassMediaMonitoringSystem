import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import React, {Component} from "react";
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';

import {addDataToMap} from 'kepler.gl/actions';
import KeplerGl from 'kepler.gl';

import Button from './components/button';
import Search from './components/SearchBar';
import "antd/dist/antd.css";

import mapConfig from "./data/map_config"

import SearchField from "react-search-field";

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

    buttonPressed(data, e){
        console.log('Data search', data);
        //axios regiest with data
        //send dataBase to publishData(dataBase)
    }
    render() {
        return (
            <div style={{position: 'absolute', width: '100%', height: '100%', minHeight: '70vh'}}>
                <Search Ref={this.buttonPressed}>Search...</Search>
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
