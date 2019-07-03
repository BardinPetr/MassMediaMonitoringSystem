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
            "dataId": "my_data",
            "label": "Hello",
            "color": [
              18,
              147,
              154
            ],
            "columns": {
              "lat": "dropoff_latitude",
              "lng": "dropoff_longitude"
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
                  "#00FF00",
                  "#74FF00",
                  "#96FF00",
                  "#FFC300",
                  "#FF9600",
                  "#FF7400",
                  "#FF0000"
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
              "name": "trip_distance",
              "type": "real"
            },
            "colorScale": "quantile"
          }
        }
      ],
      "interactionConfig": {
        "tooltip": {
          "fieldsToShow": {
            "my_data": [
              "VendorID",
              "tpep_pickup_datetime",
              "tpep_dropoff_datetime",
              "passenger_count",
              "trip_distance"
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
}
