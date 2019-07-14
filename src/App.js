import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import React, {Component} from 'react';
import Polygon from './data/Polygon';
import {hsvToHex} from "colorsys";
import MapGL, {FullscreenControl, NavigationControl} from 'react-map-gl';
import Line from './data/Line';
import 'antd/dist/antd.css';
import axios from 'axios';
import {DatePickerBar} from "./components/DatePickerBar";
import {PlotMarker} from "./components/PlotMarker";
import {LegendBar} from "./components/LegendBar"
import {getGeoCenter} from "./utils/GeoUtils";

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ29sZGZvcjEiLCJhIjoiY2p4c3BzeThxMGpzejNtbzF5YmgxM2ttOSJ9.f2knfkaI5bt5avgiS5qDlw'; // eslint-disable-line

const fullscreenControlStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: '10px'
};

const navStyle = {
    position: 'absolute',
    top: 36,
    left: 0,
    padding: '10px'
};


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
            loaded: 0,
            boarderCity: [],
            dataResponse: [],
            colorCity: [],
            dataArray: [0, 0, 0, 0, 0, 0]
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

    _onViewportChange = (viewport) => {
        this.setState({viewport});
        if(this.state.loaded === 1){
            this.inMap();
        }
    }

    inMap = () => {
        let coord = this.getMap().getBounds();
        let ar = [];
        this.state.boarderCity.forEach((item, i) =>
        {
            if ((coord._sw.lat < item._ne.lat) &&
                (coord._sw.lng < item._ne.lng) &&
                (coord._ne.lat > item._sw.lat) &&
                (coord._ne.lng > item._sw.lng)){
                    ar.push(item);
                }
            else{
                ar.push(-1);
            }
        })
        this.setColor(ar);
    }

    getMap = () => this._mapRef.current ? this._mapRef.current.getMap() : null;

    setColor = (data) => {
        let array = []
        data.forEach((item, i) => {
            if(item !== -1 && this.state.dataResponse[i] !== -1){
                array.push(this.state.dataResponse[i])
            }
            else{
                array.push(-1);
            }
        });

        const map = this.getMap();
        const MIN = Math.min.apply(null, array.filter((x) => (x !== -1)).map((x) => x.count));
        const MAX = Math.max.apply(null, array.filter((x) => (x !== -1)).map((x) => x.count));
        
        let col = []
        let delt = (MAX - MIN) / 5;
        for(let i = 0; i < 6; i++){
            col.push(MIN + (delt * i));
        }
        
        let rt = 0;

        if(MIN === Infinity){
            col = [0, 0, 0, 0, 0, 0]
        }

        console.log(col);
        for(let i = 0; i < array.length; i++){
            if (this.state.dataResponse[i] === -1) continue;

            const color = -1;
            if(MIN !== Infinity){
                if(array[i] !== -1){
                    color = hsvToHex({h: this.mapValue(array[i].count, MIN, MAX, -120, 0), s: 100, v: 100});
                    if(MIN === MAX){
                        color = '#0000ff';
                    }
                }
            }

            if(this.state.colorCity[i] === color) continue;
            rt = 1;

            const str = i.toString();
            const id1 = 'Polygon' + str,
                id2 = 'Line' + str;

            if (color === -1){
                try {
                    map.removeLayer(id1);
                    map.removeLayer(id2);
                } catch {
                }
            }
            else {
                if(this.state.colorCity[i] !== -1){
                    try {
                        map.removeLayer(id1);
                        map.removeLayer(id2);
                    } catch {
                    }
                }
                map.addLayer(this.makePolygonLayer(id1, id1, color));
                map.addLayer(this.makeLineLayer(id2, id2, color));
            }
            this.state.colorCity[i] = color;
        }
        if(rt === 1){
            this.setState({dataArray: col});
        }

    }

    getData = (data) => {
        const map = this.getMap();

        this.state.mapSources.forEach((e) => {
            try {
                map.removeLayer(e);
                map.removeSource(e);
            } catch {
            }
        });
        this.setState({
            mapSources: [],
            points: [],
            dataResponse: data
        });

        for (let i = 0; i < data.length; i++) {
            if (data[i] === -1) continue;

            const str = i.toString();
            const id1 = 'Polygon' + str,
                id2 = 'Line' + str;
            let d = Polygon[i];
            d.features[0].properties["data"] = this.state.dataResponse[i];

            map.addSource(id1, {type: 'geojson', data: d});
            map.addSource(id2, {type: 'geojson', data: Line[i]});

            const center = getGeoCenter(Polygon[i].features[0].geometry.coordinates[0]);
            this.setState({
                mapSources: [...this.state.mapSources, id1, id2],
                points: [...this.state.points, {geo: center, data: data[i]}]
            })
        }
        this.inMap();
    };

    renderCityMarker = (data, index) => <PlotMarker key={`marker-${index}`}
                                                    data={data}/>;

    mapValue = (x, in_min, in_max, out_min, out_max) => (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;

    handleMapLoaded = () => {
        this.refreshData([0, 10000000000])
        this.setState({loaded: 1});
        let array = [];
        Polygon.forEach((item, i) => {
            let lng = item.features[0].geometry.coordinates[0].map((x) => x[0]);
            let lat = item.features[0].geometry.coordinates[0].map((x) => x[1]);
            let array1 = this.state.boarderCity;
            array1.push({_ne:{lng: Math.max.apply(null, lng), lat: Math.max.apply(null, lat)},
                _sw:{lng: Math.min.apply(null, lng), lat: Math.min.apply(null, lat)}});
            this.setState({boarderCity: array1});
            array.push(-1);
        });
        this.setState({colorCity: array, dataResponse: array});
    };

    refreshData = (dates) => {
        axios.get('/api/clusters', {
                params: {
                    start: dates[0],
                    end: dates[1]
                }
            }
        ).then((response) => {
            let array = [];
            console.log('Data response: ', response.data);
            Polygon.forEach((item) => {
                let save = 0;
                response.data.forEach((i) => {
                    if (i._id === item.features[0].properties.name) {
                        array.push({...i});
                        save = 1;
                    }
                });
                if (save === 0) {
                    array.push(-1);
                }
            });
            this.getData(array);
        }).catch((error) => console.log('Data response error: ', error));
    };

    onMapClick = (e) => {
        let data = JSON.parse(e.features[0].properties.data);
        console.log(data)
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

                            <div className="fullscreen" style={fullscreenControlStyle}>
                                <FullscreenControl/>
                            </div>
                            <div className="nav" style={navStyle}>
                                <NavigationControl/>
                            </div>
                        </MapGL>)}
                </AutoSizer>
                <DatePickerBar onSearch={(x) => this.refreshData(x)}/>
                <LegendBar dataArray={this.state.dataArray}/>
            </div>
        );
    }
}
