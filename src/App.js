import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import React, {Component} from 'react';
import Polygon from './data/Polygon';
import {hsvToHex} from "colorsys";
import MapGL from 'react-map-gl';
import Line from './data/Line';
import 'antd/dist/antd.css';
import axios from 'axios';
import {DatePickerBar} from "./components/DatePickerBar";
import {PlotMarker} from "./components/PlotMarker";
import {getGeoCenter} from "./utils/GeoUtils";
import {InfoDrawer} from "./components/InfoDrawer";
import {mapValue} from "./utils/CalcUtils";

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ29sZGZvcjEiLCJhIjoiY2p4c3BzeThxMGpzejNtbzF5YmgxM2ttOSJ9.f2knfkaI5bt5avgiS5qDlw'; // eslint-disable-line


export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            viewport: {
                latitude: 43.407890,
                longitude: 39.946131,
                zoom: 10,
                bearing: 0,
                pitch: 0
            },
            mapSources: [],
            points: [],
            drawerVisibility: false,
            drawerData: {}
        };

        this._mapRef = React.createRef();
        this.handleMapLoaded = this.handleMapLoaded.bind(this);
    };

    makePolygonLayer = (id, source, color) => {
        return {
            id, source,
            type: 'fill',
            layout: {},
            paint: {
                'fill-color': color,
                'fill-opacity': 0.2
            }
        }
    };

    makeLineLayer = (id, source, color) => {
        return {
            id, source,
            type: 'line',
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': color,
                'line-width': 3
            }
        }
    };

    _onViewportChange = (viewport) => this.setState({viewport});

    getMap = () => this._mapRef.current ? this._mapRef.current.getMap() : null;

    getColor = (data) => {
        const map = this.getMap();
        const MIN = Math.min.apply(null, data.filter((x) => x !== -1).map((x) => x.display_count));
        const MAX = Math.max.apply(null, data.map((x) => x.display_count));

        this.state.mapSources.forEach((e) => {
            try {
                map.removeLayer(e);
                map.removeSource(e);
            } catch {
            }
        });
        this.setState({
            mapSources: [],
            points: []
        });


        for (let i = 0; i < data.length; i++) {
            if (data[i] === -1) continue;

            const color = hsvToHex({h: mapValue(data[i].display_count, MIN, MAX, -120, 0), s: 100, v: 100});
            const str = i.toString();

            const id1 = 'Polygon' + str,
                id2 = 'Line' + str;

            let d = Polygon[i];
            d.features[0].properties["data"] = data[i];

            map.addSource(id1, {type: 'geojson', data: d});
            map.addSource(id2, {type: 'geojson', data: Line[i]});

            map.addLayer(this.makePolygonLayer(id1, id1, color));
            map.addLayer(this.makeLineLayer(id2, id2, color));

            const center = getGeoCenter(Polygon[i].features[0].geometry.coordinates[0]);
            this.setState({
                mapSources: [...this.state.mapSources, id1, id2],
                points: [...this.state.points, {geo: center, data: data[i]}]
            })
        }
    };

    renderCityMarker = (data, index) => <PlotMarker key={`marker-${index}`}
                                                    data={data}/>;

    handleMapLoaded = () => {
        this.refreshData([0, 10000000000])
    };

    refreshData = (dates) => {
        axios.get('/api/clusters', {
                params: {
                    start: dates[0],
                    end: dates[1]
                }
            }
        ).then((response) => {
            // handle response
            let array = [];
            console.log('Data response: ', response.data);
            Polygon.forEach((item) => {
                let save = 0;
                response.data.forEach((i) => {
                    if (i._id === item.features[0].properties.name) {
                        array.push({display_count: i.count, ...i});
                        save = 1;
                    }
                });
                if (save === 0) {
                    array.push(-1);
                }
            });
            this.getColor(array);
        }).catch((error) => {
            // handle error
            console.log('Data response error: ', error);
        });
    };

    onMapClick = (e) => {
        let data = JSON.parse(e.features[0].properties.data);
        this.setState({drawerData: data, drawerVisibility: true});
    };

    render() {
        return (
            <div style={{position: 'absolute', width: '100%', height: '100%', minHeight: '70vh'}}>
                <AutoSizer>
                    {({height, width}) => (
                        <MapGL
                            ref={this._mapRef}
                            {...this.state.viewport}
                            width={width}
                            height={height}
                            mapStyle={'mapbox://styles/mapbox/light-v10'}
                            onViewportChange={this._onViewportChange}
                            mapboxApiAccessToken={MAPBOX_TOKEN}
                            onLoad={this.handleMapLoaded}
                            onClick={this.onMapClick}
                        >
                            {this.state.points.map(this.renderCityMarker)}
                        </MapGL>)}
                </AutoSizer>
                <DatePickerBar onSearch={(x) => this.refreshData(x)}/>
                <InfoDrawer data={this.state.drawerData}
                            open={this.state.drawerVisibility}
                            onClose={() => {
                                this.setState({drawerVisibility: false})
                            }}/>
                />
            </div>
        );
    }
}
