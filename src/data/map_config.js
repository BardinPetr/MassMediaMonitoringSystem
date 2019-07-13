module.exports = {
    "version": "v1",
    "config": {
        "visState": {
            "filters": [],
            "layers": [
                {
                    "id": "6vcue0g",
                    "type": "cluster",
                    "config": {
                        "dataId": "mmm_data",
                        "label": "Comment",
                        "color": [
                            18,
                            147,
                            154
                        ],
                        "columns": {
                            "lat": "latitude",
                            "lng": "longitude"
                        },
                        "isVisible": true,
                        "visConfig": {
                            "opacity": 0.1,
                            "clusterRadius": 45,
                            "colorRange": {
                                "name": "Global Warming",
                                "type": "sequential",
                                "category": "Uber",
                                "colors": [
                                    "#FFC300",
                                    "#FF0000",
                                    "#00FF00"
                                    // "#35C300",
                                    // "#94C300",
                                    // "#FF9600",
                                    // "#FF7400",
                                ]
                            },
                            "radiusRange": [
                                16.9,
                                54
                            ],
                            "hi-precision": false,
                            "colorAggregation": "average"
                        },
                        "textLabel": {
                            "field": null,
                            "color": [
                                255,
                                255,
                                255
                            ],
                            "size": 50,
                            "offset": [
                                0,
                                0
                            ],
                            "anchor": "middle"
                        }
                    },
                    "visualChannels": {
                        "colorField": {
                            "name": "value",
                            "type": "real"
                        },
                        "colorScale": "quantile"
                    }
                }
            ],
            "interactionConfig": {
                "tooltip": {
                    "fieldsToShow": {
                        "mmm_data": [
                            "latitude",
                            "longitude",
                            "value",
                            "comment"
                        ]
                    },
                    "enabled": true
                },
                "brush": {
                    "size": 0.5,
                    "enabled": false
                }
            },
            "layerBlending": "normal",
            "splitMaps": []
        },
        "mapState": {
            "bearing": 24,
            "dragRotate": true,
            "latitude": 55.75366962795825,
            "longitude": 37.57261711807422,
            "pitch": 50,
            "zoom": 12.333506182983669,
            "isSplit": false
        },
        "mapStyle": {
            "styleType": "dark",
            "topLayerGroups": {
                "building": true
            },
            "visibleLayerGroups": {
                "label": true,
                "road": true,
                "border": false,
                "building": true,
                "water": true,
                "land": true
            },
            "mapStyles": {}
        }
    }
};
