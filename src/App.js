import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import React, {Component} from "react";
import {connect} from 'react-redux';
import {FiSearch} from 'react-icons/fi';


import {addDataToMap} from 'kepler.gl/actions';
import KeplerGl from 'kepler.gl';
import KeplerGlSchema from 'kepler.gl/schemas';

import Search from './components/SearchBar';
import "antd/dist/antd.css";

import mapConfig from "./data/map_config";

const axios = require('axios');

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ29sZGZvcjEiLCJhIjoiY2p4c3BzeThxMGpzejNtbzF5YmgxM2ttOSJ9.f2knfkaI5bt5avgiS5qDlw'; // eslint-disable-line

class App extends Component {

    constructor(props) {
        super(props);
        this.publishData = this.publishData.bind(this);
    };

    componentDidMount() {

        const dataset = {
            data: '',
            info: {
                label: 'Mass Media Monitoring',
                id: 'mmm_data'
            },
        };

        const options = {
            centerMap: true,
            readOnly: false
        };

        this.props.dispatch(addDataToMap({datasets: dataset, config: mapConfig}));
    };

    getMapConfig() {

        const {keplerGl} = this.props;
        const {map} = keplerGl;
        return KeplerGlSchema.getConfigToSave(map);
    };

    publishData(data) {
        console.log(data);
        this.props.dispatch(
            addDataToMap({
                datasets: {
                    data,
                    info: {
                        label: 'Mass Media Monitoring',
                        id: 'mmm_data'
                    }
                },
                config: mapConfig
            })
        );
    };

    buttonPressed(data, func, e) {
        console.log('Data search', data);

        //axios regiest with data

        axios.get('/api/points', {
                params: {
                    query: data
                }
            }
        ).then((response) => {
            // handle reaponse
            console.log('Data response', response.data);

            func(response.data);
        }).catch((error) => {
            // handle error
            console.log('Data response error', error);

        });
    };


    render() {
        return (
            <div style={{position: 'absolute', width: '100%', height: '100%', minHeight: '70vh'}}>
                <Search Ref={(data, e) => {
                    this.buttonPressed(data, this.publishData, e);
                }} ButText={<FiSearch/>}>Search...</Search>
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
