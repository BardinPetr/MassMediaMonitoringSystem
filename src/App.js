import React, {Component} from "react";
import MapGL from 'react-map-gl';
import {colors} from './SetupColor'
import Polygon from './data/Polygon'
import Line from './data/Line'
import "antd/dist/antd.css";

const axios = require('axios');
var colorsys = require('colorsys');

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ29sZGZvcjEiLCJhIjoiY2p4c3BzeThxMGpzejNtbzF5YmgxM2ttOSJ9.f2knfkaI5bt5avgiS5qDlw'; // eslint-disable-line


export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewport: {
                latitude: 44.89,
                longitude: 37.31,
                zoom: 12,
                bearing: 0,
                pitch: 0
            },
            earthquakes: null
        };

        this._mapRef = React.createRef();
        this._handleMapLoaded = this._handleMapLoaded.bind(this);
        this._onViewportChang = this._onViewportChange.bind(this);
        //this.publishData = this.publishData.bind(this);
    };

    componentDidMount() {

    };


    _mkHeatmapLayer = (id, source, count) => {
        const MAX_ZOOM_LEVEL = 12;
        return {
            id, source, maxzoom: MAX_ZOOM_LEVEL, type: 'heatmap',
            paint: {
                'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 6, 1],
                'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, MAX_ZOOM_LEVEL, 3],
                'heatmap-color': colors[count],
                'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, MAX_ZOOM_LEVEL, 20],
                'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]

            }
        };
    };

    _mkCircleLayer = (id, source, count) => {
        const MIN_ZOOM_LEVEL = 7;
        return {
            id, source, minzoom: MIN_ZOOM_LEVEL, type: 'circle',
            paint: {
                "circle-radius": ["interpolate", ["linear"], ["zoom"], 7, ["interpolate", ["linear"], ["get", "mag"], 1, 1, 6, 4], 16,
                    ["interpolate", ["linear"], ["get", "mag"], 1, 5, 6, 50]],
                "circle-color": ["interpolate",
                    ["linear"],
                    ["get", "mag"],
                    1, "rgba(33,102,172,0)",
                    2, "rgb(103,169,207)",
                    3, "rgb(209,229,240)",
                    4, "rgb(253,219,199)",
                    5, "rgb(239,138,98)",
                    6, "rgb(178,24,43)"
                ],
                "circle-stroke-color": "white",
                "circle-stroke-width": 1,
                "circle-opacity": ["interpolate", ["linear"], ["zoom"], 7, 0, 8, 1]
            }
        }
    };

    _mkPolygonLayer = (id, source, color) => {
        return {
            id, source,
            "type": "fill",
            "layout": {},
            "paint": {
                "fill-color": color,
                "fill-opacity": 0.2
            }
        }
    };

    _mkLineLayer = (id, source, color) => {
        return {
            id, source,
            "type": "line",
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": color,
                "line-width": 3
            }
        }
    };

    _onViewportChange = (viewport) => {
        this.setState({viewport});
    };

    _getMap = () => {
        return this._mapRef.current ? this._mapRef.current.getMap() : null;
    };

    _getColor = (data) => {
        const map = this._getMap();
        const MIN = Math.min.apply(null, data);
        const MAX = Math.max.apply(null, data);
        var i;
        for (i = 0; i < 5; i++) {
            var color = colorsys.hsvToHex({h: this._map(data[i], MIN, MAX, -120, 0), s: 100, v: 100});
            console.log(color);
            var str = i.toString();
            map.addSource(("Polygon" + str), {type: 'geojson', data: Polygon[i]});
            map.addLayer(this._mkPolygonLayer(("Polygon" + str), ("Polygon" + str), color));
            map.addSource(("Line" + str), {type: 'geojson', data: Line[i]});
            map.addLayer(this._mkLineLayer(("Line" + str), ("Line" + str), color));
        }

    };

    _map = (x, in_min, in_max, out_min, out_max) => {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    };

    _creatData = (data) => {
        var array = [];
        for (var item of data) {
            array.push({"type": "Feature", "geometry": {"type": "Point", "coordinates": [item.lat, item.lng, 0.0]}});
        }
        console.log(array);

    };

    _handleMapLoaded = (event) => {
        axios.get('/api/clusters', {
                params: {
                    start: 0,
                    end: 10000000000
                }
            }
        ).then((response) => {
            // handle reaponse
            var array = [];
            console.log('Data response: ', response);
            for (var item in Polygon) {
                for (var i in response) {
                    if (i._id == item.features.properties.name) {
                        array.push(i.count);
                    }
                }
            }

            this._getColor(array);

        }).catch((error) => {
            // handle error
            console.log('Data response error: ', error);

        });
    };

    _mkFeatureCollection = (features) => {
        {
            'FeatureCollection', features
        }
    };

    setMapData = (features) => {
        const map = this._getMap();
        if (map) {
            map.getSource(SOURCE_ID[0]).setData(this._mkFeatureCollection(features));
        }
    };


    buttonPressed(data, func, e) {
        console.log('Data search', data);


        //axios regiest with data
        /*
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

        });*/
    };


    render() {
        const {viewport} = this.state;
        return (
            <div>
                <MapGL
                    ref={this._mapRef}
                    {...this.state.viewport}
                    width={1920}
                    height={1080}
                    mapStyle={'mapbox://styles/mapbox/light-v10'}
                    onViewportChange={this._onViewportChange}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                    onLoad={this._handleMapLoaded}
                />
            </div>
        );
    }
}

//mapConfig
//const mapStateToProps = state => state;
//const dispatchToProps = dispatch => ({dispatch});
//onLoad={this._handleMapLoaded}
//export default connect(mapStateToProps, dispatchToProps)(App);


/*<KeplerGl
                        mapboxApiAccessToken={MAPBOX_TOKEN}
                        id="map"
                        width={width}
                        height={height}
                    />*/