import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import React, {Component} from 'react';
import Polygon from './data/Polygon';
import {hsvToHex} from "colorsys";
import MapGL, {FlyToInterpolator} from 'react-map-gl';
import Line from './data/Line';
import 'antd/dist/antd.css';
import axios from 'axios';
import {DatePickerBar} from "./components/DatePickerBar";
import {PlotMarker} from "./components/PlotMarker";
import {LegendBar} from "./components/LegendBar"
import {InfoDrawer} from "./components/InfoDrawer";
import {getGeoCenter} from "./utils/GeoUtils";
import {mapValue} from "./utils/CalcUtils";
import {ControlPanel} from "./components/ControlPanel"
import {message} from 'antd';

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
            drawerData: {},
            loaded: 0,
            boarderCity: [],
            dataResponse: [],
            colorCity: [],
            dataArray: [0, 0, 0, 0, 0, 0],
            sr: '',
            ar: ''
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
        //console.log(viewport)
        this.setState({viewport});
        if (this.state.loaded === 1) {
            this.inMap();
        }
    };

    _goToViewport = ({longitude, latitude, zoom}) => {
        this._onViewportChange({
            latitude,
            longitude,
            zoom,
            transitionInterpolator: new FlyToInterpolator(),
            transitionDuration: 3000
        });
    };

    inMap = () => {
        let coord = this.getMap().getBounds();
        let ar = [];
        this.state.boarderCity.forEach((item, i) => {
            if ((coord._sw.lat < item._ne.lat) &&
                (coord._sw.lng < item._ne.lng) &&
                (coord._ne.lat > item._sw.lat) &&
                (coord._ne.lng > item._sw.lng)) {
                ar.push(item);
            } else {
                ar.push(-1);
            }
        });
        this.setColor(ar);
    };

    getMap = () => this._mapRef.current ? this._mapRef.current.getMap() : null;

    setColor = (data) => {
        let array = [];

        let MIN = Infinity;
        let MAX = -Infinity;

        data.forEach((item, i) => {
            if (item !== -1 && this.state.dataResponse[i] !== -1) {
                array.push(this.state.dataResponse[i]);
                if (this.state.dataResponse[i].polarity > MAX) MAX = this.state.dataResponse[i].polarity;
                if (this.state.dataResponse[i].polarity < MIN) MIN = this.state.dataResponse[i].polarity;
            } else array.push(-1);
        });

        const map = this.getMap();

        let col = [];
        let delt = (MAX - MIN) / 5;
        for (let i = 0; i < 6; i++) col.push((MIN + (delt * i)).toFixed(1));

        let rt = 0;

        if (MIN === Infinity) col = [0, 0, 0, 0, 0, 0];

        for (let i = 0; i < array.length; i++) {
            if (this.state.dataResponse[i] === -1) continue;

            let color = -1;
            if (MIN !== Infinity) {
                if (array[i] !== -1) {
                    color = hsvToHex({h: mapValue(array[i].polarity, MIN, MAX, 0, 90), s: 100, v: 100});
                    if (MIN === MAX) {
                        color = this.state.colorCity[i];
                        if (this.state.colorCity[i] === -1) color = '#ff0000';
                    }
                }
            }

            if (this.state.colorCity[i] === color) continue;
            rt = 1;

            const str = i.toString();
            const id1 = 'Polygon' + str,
                id2 = 'Line' + str;

            if (color === -1) {
                try {
                    if (map.getLayer(id1)) map.removeLayer(id1);
                    if (map.getLayer(id2)) map.removeLayer(id2);
                } catch {
                }
            } else {
                if (this.state.colorCity[i] !== -1) {
                    try {
                        if (map.getLayer(id1)) map.removeLayer(id1);
                        if (map.getLayer(id2)) map.removeLayer(id2);
                    } catch {
                    }
                }
                map.addLayer(this.makePolygonLayer(id1, id1, color));
                map.addLayer(this.makeLineLayer(id2, id2, color));
            }
            this.state.colorCity[i] = color;
        }
        if (rt === 1) {
            this.setState({dataArray: col});
        }

    };

    getData = (data) => {
        const map = this.getMap();
        console.log('Drawing data', data);
        this.state.mapSources.forEach((e) => {
            try {
                if (map.getLayer(e)) map.removeLayer(e);
                if (map.getSource(e)) map.removeSource(e);
            } catch {
            }
        });
        this.setState({
            mapSources: [],
            points: [],
            dataResponse: data,
            dataArray: [0, 0, 0, 0, 0, 0],
        });

        let ar = [];

        for (let i = 0; i < data.length; i++) {
            ar.push(-1);
            if (data[i] === -1) continue;

            const str = i.toString();
            const id1 = 'Polygon' + str,
                id2 = 'Line' + str;
            let d = Polygon[i];
            d.features[0].properties["data"] = this.state.dataResponse[i];

            map.addSource(id1, {type: 'geojson', data: d});
            map.addSource(id2, {type: 'geojson', data: Line[i]});

            const center = Polygon[i].features[0].geometry.type === 'Polygon' ? getGeoCenter(Polygon[i].features[0].geometry.coordinates[0]) : getGeoCenter(Polygon[i].features[0].geometry.coordinates[0][0]);

            this.setState({
                mapSources: [...this.state.mapSources, id1, id2],
                points: [...this.state.points, {geo: center, data: data[i]}]
            })
        }
        this.setState({
            colorCity: ar
        });
        this.inMap();
    };

    renderCityMarker = (data, index) => <PlotMarker key={`marker-${index}`}
                                                    data={data}/>;

    handleMapLoaded = () => {
        const map = this.getMap();
        let Input = 0;
        if (Input !== 0) {
            Input.forEach(i => {
                const str = i.toString();
                const id1 = 'Polygo' + str,
                    id2 = 'Lin' + str;
                map.addSource(id1, {type: 'geojson', data: Polygon[i]});
                map.addSource(id2, {type: 'geojson', data: Line[i]});
                map.addLayer(this.makePolygonLayer(id1, id1, "#00ff00"));
                map.addLayer(this.makeLineLayer(id2, id2, "#00ff00"));
            });
        } else this.refreshData({time: [0, 10000000000]});
        this.setState({loaded: 1});
        let array = [];
        Polygon.forEach((item, i) => {
            let lng_MAX = -Infinity,
                lat_MAX = -Infinity,
                lng_MIN = Infinity,
                lat_MIN = Infinity;

            if (item.features[0].geometry.type === 'Polygon')
                item.features[0].geometry.coordinates[0].forEach((item) => {
                    if (item[0] > lng_MAX) lng_MAX = item[0];
                    if (item[0] < lng_MIN) lng_MIN = item[0];
                    if (item[1] > lat_MAX) lat_MAX = item[1];
                    if (item[1] < lat_MIN) lat_MIN = item[1];
                });
            else
                item.features[0].geometry.coordinates.forEach(i => {
                    i[0].forEach((item) => {
                        if (item[0] > lng_MAX) lng_MAX = item[0];
                        if (item[0] < lng_MIN) lng_MIN = item[0];
                        if (item[1] > lat_MAX) lat_MAX = item[1];
                        if (item[1] < lat_MIN) lat_MIN = item[1];
                    })
                });

            let array1 = this.state.boarderCity;
            array1.push({
                _ne: {lng: lng_MAX, lat: lat_MAX},
                _sw: {lng: lng_MIN, lat: lat_MIN}
            });
            this.setState({boarderCity: array1});
            array.push(-1);
        });
        console.log('Border City:', this.state.boarderCity);
        this.setState({colorCity: array, dataResponse: array});
    };

    openLoading = () => {
        let msg = message.loading('Загрузка данных', 0);
        this.setState({loadingMsg: msg});
    };

    closeLoading = (error) => {
        if (this.state.loadingMsg) {
            this.state.loadingMsg();
            if (!error) message.success('Загрузка успешно завершена', 5);
            else message.error('Ошибка загрузки данных', 5);
        }
    };

    refreshData = (dates) => {
        let Return = {
            start: dates.time[0],
            end: dates.time[1]
        };
        if (dates.sr !== '') Return = {...Return, sr: dates.sr};
        if (dates.ar !== '') Return = {...Return, ar: dates.ar};
        if (dates.dsr !== '') Return = {...Return, dsr: dates.dsr};
        console.log(Return);
        this.openLoading();
        axios.get('/api/clusters-sa', {
                params: Return
            }
        ).then((response) => {
            let array = [];
            console.log('Data response: ', JSON.parse(JSON.stringify(response.data)));
            for (let y = 0; y < Polygon.length; y++) {
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].name === Polygon[y].features[0].properties.name) {
                        array.push({...response.data[i]});
                        response.data.splice(i, 1);
                        break;
                    }
                }
                if (y === array.length) {
                    array.push(-1);
                    console.log(Polygon[y].features[0].properties.name);
                }
            }
            this.closeLoading(false);
            this.getData(array);
        }).catch((error) => {
            console.log('Data response error: ', error);
            this.closeLoading(true);
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
                        </MapGL>
                    )}
                </AutoSizer>
                <DatePickerBar onSearch={(x) => this.refreshData(x)}/>
                <ControlPanel onChange={(x) => this._goToViewport(x)}/>
                <LegendBar dataArray={this.state.dataArray}/>
                <InfoDrawer data={this.state.drawerData}
                            open={this.state.drawerVisibility}
                            onClose={() => {
                                this.setState({drawerVisibility: false})
                            }}/>
            </div>
        );
    }
}
