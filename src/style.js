export const MAP_STYLE = {
    "version": 8,
    "name": "Basic Template",
    "metadata": {
        "mapbox:origin": "basic-template",
        "mapbox:autocomposite": true,
        "mapbox:type": "template",
        "mapbox:sdk-support": {
            "js": "0.54.0",
            "android": "6.7.0",
            "ios": "4.7.0"
        }
    },
    "center": [37.61886602346476, 55.75203017396697],
    "zoom": 15.329104208436801,
    "bearing": -136.00000000000003,
    "pitch": 60,
    "sources": {
        "composite": {
            "url": "mapbox://mapbox.mapbox-streets-v8",
            "type": "vector"
        }
    },
    "sprite": "mapbox://sprites/goldfor1/cjxubv6lf7wco1cnykkt6akrg/629bpdwpqxu5j66f3aoku8h84",
    "glyphs": "mapbox://fonts/goldfor1/{fontstack}/{range}.pbf",
    "layers": [
        {
            "id": "background",
            "type": "background",
            "layout": {},
            "paint": {"background-color": "hsl(38, 48%, 86%)"}
        },
        {
            "id": "national_park",
            "type": "fill",
            "source": "composite",
            "source-layer": "landuse_overlay",
            "minzoom": 5,
            "filter": ["==", ["get", "class"], "national_park"],
            "layout": {},
            "paint": {
                "fill-color": "hsl(78, 51%, 73%)",
                "fill-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    5,
                    0,
                    6,
                    0.5
                ]
            }
        },
        {
            "id": "landuse",
            "type": "fill",
            "source": "composite",
            "source-layer": "landuse",
            "minzoom": 5,
            "filter": [
                "match",
                ["get", "class"],
                ["airport", "hospital", "park", "pitch", "school"],
                true,
                false
            ],
            "layout": {},
            "paint": {
                "fill-color": [
                    "match",
                    ["get", "class"],
                    ["airport"],
                    "hsl(345, 6%, 87%)",
                    ["hospital"],
                    "hsl(0, 56%, 89%)",
                    ["park", "pitch"],
                    "hsl(78, 51%, 74%)",
                    ["school"],
                    "#ead6c8",
                    "hsla(0, 0%, 0%, 0)"
                ],
                "fill-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    5,
                    0,
                    6,
                    1
                ]
            }
        },
        {
            "id": "waterway",
            "type": "line",
            "source": "composite",
            "source-layer": "waterway",
            "minzoom": 8,
            "filter": [
                "all",
                ["==", ["geometry-type"], "LineString"],
                ["match", ["get", "class"], ["canal", "river"], true, false]
            ],
            "layout": {"line-join": "round", "line-cap": "round"},
            "paint": {
                "line-color": "hsl(205, 76%, 70%)",
                "line-width": [
                    "interpolate",
                    ["exponential", 1.3],
                    ["zoom"],
                    8.5,
                    0.1,
                    20,
                    8
                ],
                "line-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    8,
                    0,
                    8.5,
                    1
                ]
            }
        },
        {
            "id": "water",
            "type": "fill",
            "source": "composite",
            "source-layer": "water",
            "filter": ["all"],
            "layout": {},
            "paint": {"fill-color": "hsl(205, 76%, 70%)"}
        },
        {
            "id": "aeroway-polygon",
            "type": "fill",
            "source": "composite",
            "source-layer": "aeroway",
            "minzoom": 10,
            "filter": [
                "all",
                ["==", ["geometry-type"], "Polygon"],
                [
                    "match",
                    ["get", "type"],
                    ["helipad", "runway", "taxiway"],
                    true,
                    false
                ]
            ],
            "layout": {},
            "paint": {"fill-color": "hsl(0, 0%, 77%)"}
        },
        {
            "id": "aeroway-line",
            "type": "line",
            "source": "composite",
            "source-layer": "aeroway",
            "minzoom": 9,
            "filter": [
                "all",
                ["==", ["geometry-type"], "LineString"],
                ["match", ["get", "type"], ["runway", "taxiway"], true, false]
            ],
            "layout": {},
            "paint": {
                "line-width": [
                    "interpolate",
                    ["exponential", 1.5],
                    ["zoom"],
                    10,
                    0.5,
                    18,
                    20
                ],
                "line-color": "hsl(0, 0%, 77%)"
            }
        },
        {
            "id": "pedestrian-path",
            "type": "line",
            "source": "composite",
            "source-layer": "road",
            "minzoom": 14,
            "filter": [
                "all",
                ["==", ["geometry-type"], "LineString"],
                ["!=", ["get", "type"], "platform"],
                ["match", ["get", "class"], ["path", "pedestrian"], true, false]
            ],
            "layout": {"line-join": "round", "line-cap": "round"},
            "paint": {
                "line-width": [
                    "interpolate",
                    ["exponential", 1.5],
                    ["zoom"],
                    14,
                    ["match", ["get", "class"], "pedestrian", 1, 0.75],
                    20,
                    ["match", ["get", "class"], "pedestrian", 8, 5]
                ],
                "line-color": [
                    "match",
                    ["get", "type"],
                    ["crossing", "sidewalk"],
                    "hsl(38, 35%, 80%)",
                    "hsl(38, 28%, 70%)"
                ]
            }
        },
        {
            "id": "tunnel",
            "type": "line",
            "source": "composite",
            "source-layer": "road",
            "minzoom": 13,
            "filter": [
                "all",
                ["==", ["geometry-type"], "LineString"],
                ["!=", ["get", "type"], "service:parking_aisle"],
                ["==", ["get", "structure"], "tunnel"],
                [
                    "match",
                    ["get", "class"],
                    [
                        "motorway",
                        "motorway_link",
                        "trunk",
                        "trunk_link",
                        "primary",
                        "primary_link",
                        "secondary",
                        "secondary_link",
                        "tertiary",
                        "tertiary_link",
                        "street",
                        "street_limited",
                        "service",
                        "track"
                    ],
                    true,
                    false
                ]
            ],
            "layout": {"line-join": "round"},
            "paint": {
                "line-width": [
                    "interpolate",
                    ["exponential", 1.5],
                    ["zoom"],
                    5,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary"],
                        0.5,
                        "tertiary",
                        0.01,
                        0
                    ],
                    12,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary"],
                        3,
                        ["secondary", "tertiary"],
                        2,
                        [
                            "motorway_link",
                            "trunk_link",
                            "street",
                            "street_limited"
                        ],
                        0.5,
                        0
                    ],
                    18,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary"],
                        30,
                        ["secondary", "tertiary"],
                        24,
                        [
                            "motorway_link",
                            "trunk_link",
                            "street",
                            "street_limited"
                        ],
                        12,
                        10
                    ]
                ],
                "line-color": [
                    "match",
                    ["get", "class"],
                    [
                        "primary_link",
                        "secondary_link",
                        "tertiary_link",
                        "street",
                        "street_limited",
                        "service",
                        "track"
                    ],
                    "hsl(38, 100%, 98%)",
                    "hsl(0, 0%, 100%)"
                ],
                "line-dasharray": [0.2, 0.2]
            }
        },
        {
            "id": "road",
            "type": "line",
            "source": "composite",
            "source-layer": "road",
            "minzoom": 5,
            "filter": [
                "all",
                ["==", ["geometry-type"], "LineString"],
                ["!=", ["get", "type"], "service:parking_aisle"],
                [
                    "match",
                    ["get", "structure"],
                    ["bridge", "tunnel"],
                    false,
                    true
                ],
                [
                    "match",
                    ["get", "class"],
                    [
                        "motorway",
                        "motorway_link",
                        "trunk",
                        "trunk_link",
                        "primary",
                        "primary_link",
                        "secondary",
                        "secondary_link",
                        "tertiary",
                        "tertiary_link",
                        "street",
                        "street_limited",
                        "service",
                        "track"
                    ],
                    true,
                    false
                ]
            ],
            "layout": {"line-join": "round", "line-cap": "round"},
            "paint": {
                "line-width": [
                    "interpolate",
                    ["exponential", 1.5],
                    ["zoom"],
                    5,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary"],
                        0.5,
                        "tertiary",
                        0.01,
                        0
                    ],
                    12,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary"],
                        3,
                        ["secondary", "tertiary"],
                        2,
                        [
                            "motorway_link",
                            "trunk_link",
                            "street",
                            "street_limited"
                        ],
                        0.5,
                        0
                    ],
                    18,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary"],
                        30,
                        ["secondary", "tertiary"],
                        24,
                        [
                            "motorway_link",
                            "trunk_link",
                            "street",
                            "street_limited"
                        ],
                        12,
                        10
                    ]
                ],
                "line-color": [
                    "match",
                    ["get", "class"],
                    [
                        "street",
                        "street_limited",
                        "service",
                        "track",
                        "secondary_link",
                        "tertiary_link",
                        "primary_link",
                        "trunk_link"
                    ],
                    "hsl(38, 80%, 95%)",
                    "hsl(0, 0%, 100%)"
                ]
            }
        },
        {
            "id": "bridge-case",
            "type": "line",
            "source": "composite",
            "source-layer": "road",
            "minzoom": 13,
            "filter": [
                "all",
                ["==", ["geometry-type"], "LineString"],
                ["!=", ["get", "type"], "service:parking_aisle"],
                ["==", ["get", "structure"], "bridge"],
                [
                    "match",
                    ["get", "class"],
                    [
                        "motorway",
                        "motorway_link",
                        "trunk",
                        "trunk_link",
                        "primary",
                        "primary_link",
                        "secondary",
                        "secondary_link",
                        "tertiary",
                        "tertiary_link",
                        "street",
                        "street_limited",
                        "service",
                        "track"
                    ],
                    true,
                    false
                ]
            ],
            "layout": {"line-join": "round"},
            "paint": {
                "line-width": [
                    "interpolate",
                    ["exponential", 1.5],
                    ["zoom"],
                    10,
                    1,
                    16,
                    2
                ],
                "line-color": "hsl(38, 48%, 86%)",
                "line-gap-width": [
                    "interpolate",
                    ["exponential", 1.5],
                    ["zoom"],
                    5,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary"],
                        0.5,
                        "tertiary",
                        0.01,
                        0
                    ],
                    12,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary"],
                        3,
                        ["secondary", "tertiary"],
                        2,
                        [
                            "motorway_link",
                            "trunk_link",
                            "street",
                            "street_limited"
                        ],
                        0.5,
                        0
                    ],
                    18,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary"],
                        30,
                        ["secondary", "tertiary"],
                        24,
                        [
                            "motorway_link",
                            "trunk_link",
                            "street",
                            "street_limited"
                        ],
                        12,
                        10
                    ]
                ]
            }
        },
        {
            "id": "bridge",
            "type": "line",
            "source": "composite",
            "source-layer": "road",
            "minzoom": 13,
            "filter": [
                "all",
                ["==", ["geometry-type"], "LineString"],
                ["!=", ["get", "type"], "service:parking_aisle"],
                ["==", ["get", "structure"], "bridge"],
                [
                    "match",
                    ["get", "class"],
                    [
                        "motorway",
                        "motorway_link",
                        "trunk",
                        "trunk_link",
                        "primary",
                        "primary_link",
                        "secondary",
                        "secondary_link",
                        "tertiary",
                        "tertiary_link",
                        "service",
                        "street",
                        "street_limited",
                        "track"
                    ],
                    true,
                    false
                ]
            ],
            "layout": {"line-join": "round", "line-cap": "round"},
            "paint": {
                "line-width": [
                    "interpolate",
                    ["exponential", 1.5],
                    ["zoom"],
                    5,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary"],
                        0.5,
                        "tertiary",
                        0.01,
                        0
                    ],
                    12,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary"],
                        3,
                        ["secondary", "tertiary"],
                        2,
                        [
                            "motorway_link",
                            "trunk_link",
                            "street",
                            "street_limited"
                        ],
                        0.5,
                        0
                    ],
                    18,
                    [
                        "match",
                        ["get", "class"],
                        ["motorway", "trunk", "primary"],
                        30,
                        ["secondary", "tertiary"],
                        24,
                        [
                            "motorway_link",
                            "trunk_link",
                            "street",
                            "street_limited"
                        ],
                        12,
                        10
                    ]
                ],
                "line-color": [
                    "match",
                    ["get", "class"],
                    [
                        "primary_link",
                        "secondary_link",
                        "tertiary_link",
                        "street",
                        "street_limited",
                        "service",
                        "track"
                    ],
                    "hsl(38, 100%, 98%)",
                    "hsl(0, 0%, 100%)"
                ]
            }
        },
        {
            "id": "admin-state-province",
            "type": "line",
            "source": "composite",
            "source-layer": "admin",
            "minzoom": 2,
            "filter": [
                "all",
                ["==", ["get", "admin_level"], 1],
                ["==", ["get", "disputed"], "false"],
                ["==", ["get", "maritime"], "false"],
                ["match", ["get", "worldview"], ["US", "all"], true, false]
            ],
            "layout": {"line-join": "round", "line-cap": "round"},
            "paint": {
                "line-dasharray": [
                    "step",
                    ["zoom"],
                    ["literal", [2, 0]],
                    7,
                    ["literal", [2, 2, 6, 2]]
                ],
                "line-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    7,
                    0.75,
                    12,
                    1.5
                ],
                "line-opacity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    2,
                    0,
                    3,
                    1
                ],
                "line-color": [
                    "step",
                    ["zoom"],
                    "hsl(0, 0%, 80%)",
                    4,
                    "hsl(0, 0%, 65%)"
                ]
            }
        },
        {
            "id": "admin-country",
            "type": "line",
            "source": "composite",
            "source-layer": "admin",
            "minzoom": 1,
            "filter": [
                "all",
                ["==", ["get", "admin_level"], 0],
                ["==", ["get", "disputed"], "false"],
                ["==", ["get", "maritime"], "false"],
                ["match", ["get", "worldview"], ["US", "all"], true, false]
            ],
            "layout": {"line-join": "round", "line-cap": "round"},
            "paint": {
                "line-color": "hsl(0, 0%, 50%)",
                "line-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    3,
                    0.5,
                    10,
                    2
                ]
            }
        },
        {
            "id": "admin-country-disputed",
            "type": "line",
            "source": "composite",
            "source-layer": "admin",
            "minzoom": 1,
            "filter": [
                "all",
                ["==", ["get", "admin_level"], 0],
                ["==", ["get", "disputed"], "true"],
                ["==", ["get", "maritime"], "false"],
                ["match", ["get", "worldview"], ["US", "all"], true, false]
            ],
            "layout": {"line-join": "round"},
            "paint": {
                "line-color": "hsl(0, 0%, 50%)",
                "line-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    3,
                    0.5,
                    10,
                    2
                ],
                "line-dasharray": [1.5, 1.5]
            }
        },
        {
            "id": "road-label",
            "type": "symbol",
            "source": "composite",
            "source-layer": "road",
            "minzoom": 12,
            "filter": [
                "match",
                ["get", "class"],
                [
                    "motorway",
                    "trunk",
                    "primary",
                    "secondary",
                    "tertiary",
                    "street",
                    "street_limited",
                    "pedestrian"
                ],
                true,
                false
            ],
            "layout": {
                "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
                "text-size": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    9,
                    [
                        "match",
                        ["get", "class"],
                        [
                            "motorway",
                            "trunk",
                            "primary",
                            "secondary",
                            "tertiary"
                        ],
                        10,
                        9
                    ],
                    20,
                    [
                        "match",
                        ["get", "class"],
                        [
                            "motorway",
                            "trunk",
                            "primary",
                            "secondary",
                            "tertiary"
                        ],
                        15,
                        14
                    ]
                ],
                "text-max-angle": 30,
                "text-font": ["Roboto Regular", "Arial Unicode MS Regular"],
                "symbol-placement": "line",
                "text-padding": 1,
                "text-rotation-alignment": "map",
                "text-pitch-alignment": "viewport"
            },
            "paint": {
                "text-color": "hsl(0, 0%, 0%)",
                "text-halo-color": "hsla(0, 0%, 100%, 0.95)",
                "text-halo-width": 1
            }
        },
        {
            "id": "poi-label",
            "type": "symbol",
            "source": "composite",
            "source-layer": "poi_label",
            "minzoom": 6,
            "filter": ["<=", ["get", "filterrank"], 3],
            "layout": {
                "text-line-height": 1.1,
                "text-size": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    10,
                    11,
                    18,
                    13
                ],
                "icon-image": ["concat", ["get", "maki"], "-11"],
                "text-max-angle": 38,
                "text-font": ["Roboto Regular", "Arial Unicode MS Regular"],
                "text-padding": 2,
                "text-offset": [0, 0.75],
                "text-anchor": "top",
                "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
                "text-max-width": 8
            },
            "paint": {
                "text-color": "hsl(38, 19%, 29%)",
                "text-halo-color": "hsla(0, 0%, 100%, 0.75)",
                "text-halo-width": 1,
                "text-halo-blur": 0.5
            }
        },
        {
            "id": "airport-label",
            "type": "symbol",
            "source": "composite",
            "source-layer": "airport_label",
            "minzoom": 8,
            "filter": ["all"],
            "layout": {
                "text-line-height": 1.1,
                "text-size": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    10,
                    12,
                    18,
                    18
                ],
                "icon-image": [
                    "step",
                    ["zoom"],
                    ["concat", ["get", "maki"], "-11"],
                    13,
                    ["concat", ["get", "maki"], "-15"]
                ],
                "text-font": ["Roboto Regular", "Arial Unicode MS Regular"],
                "text-padding": 2,
                "text-offset": [0, 0.75],
                "text-anchor": "top",
                "text-field": [
                    "step",
                    ["zoom"],
                    ["get", "ref"],
                    14,
                    ["coalesce", ["get", "name_en"], ["get", "name"]]
                ],
                "text-max-width": 9
            },
            "paint": {
                "text-color": "hsl(38, 19%, 29%)",
                "text-halo-color": "hsla(0, 0%, 100%, 0.95)",
                "text-halo-width": 1
            }
        },
        {
            "id": "place-neighborhood-suburb-label",
            "type": "symbol",
            "source": "composite",
            "source-layer": "place_label",
            "minzoom": 11,
            "maxzoom": 15,
            "filter": [
                "all",
                ["<=", ["get", "filterrank"], 3],
                [
                    "match",
                    ["get", "type"],
                    ["suburb", "quarter", "neighbourhood"],
                    true,
                    false
                ]
            ],
            "layout": {
                "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
                "text-transform": "uppercase",
                "text-letter-spacing": 0.15,
                "text-max-width": 8,
                "text-font": ["Roboto Regular", "Arial Unicode MS Regular"],
                "text-padding": 3,
                "text-size": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    12,
                    11,
                    16,
                    16
                ]
            },
            "paint": {
                "text-halo-color": "hsla(0, 0%, 100%, 0.95)",
                "text-halo-width": 1,
                "text-color": "hsl(38, 62%, 21%)"
            }
        },
        {
            "id": "place-town-village-hamlet-label",
            "type": "symbol",
            "source": "composite",
            "source-layer": "place_label",
            "minzoom": 6,
            "maxzoom": 14,
            "filter": [
                "all",
                [
                    "match",
                    ["get", "type"],
                    ["town", "village", "hamlet"],
                    true,
                    false
                ],
                ["<=", ["get", "filterrank"], 3]
            ],
            "layout": {
                "text-size": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    5,
                    ["match", ["get", "type"], "town", 9.5, 8],
                    16,
                    ["match", ["get", "type"], "town", 20, 16]
                ],
                "text-font": [
                    "step",
                    ["zoom"],
                    ["literal", ["Roboto Regular", "Arial Unicode MS Regular"]],
                    12,
                    [
                        "match",
                        ["get", "type"],
                        "town",
                        [
                            "literal",
                            ["Roboto Medium", "Arial Unicode MS Regular"]
                        ],
                        [
                            "literal",
                            ["Roboto Regular", "Arial Unicode MS Regular"]
                        ]
                    ]
                ],
                "text-max-width": 7,
                "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]]
            },
            "paint": {
                "text-color": "hsl(0, 0%, 0%)",
                "text-halo-blur": 0.5,
                "text-halo-color": "hsla(0, 0%, 100%, 0.95)",
                "text-halo-width": 1
            }
        },
        {
            "id": "place-city-label",
            "type": "symbol",
            "source": "composite",
            "source-layer": "place_label",
            "minzoom": 3,
            "maxzoom": 14,
            "filter": [
                "all",
                ["<=", ["get", "filterrank"], 3],
                ["==", ["get", "type"], "city"]
            ],
            "layout": {
                "text-size": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    3,
                    ["step", ["get", "symbolrank"], 12, 9, 11, 12, 10, 14, 6.5],
                    14,
                    ["step", ["get", "symbolrank"], 27, 9, 23, 10, 21, 12, 20]
                ],
                "text-font": [
                    "step",
                    ["zoom"],
                    ["literal", ["Roboto Medium", "Arial Unicode MS Regular"]],
                    10,
                    [
                        "step",
                        ["get", "symbolrank"],
                        ["literal", ["Roboto Bold", "Arial Unicode MS Bold"]],
                        5,
                        [
                            "literal",
                            ["Roboto Medium", "Arial Unicode MS Regular"]
                        ]
                    ]
                ],
                "text-max-width": 10,
                "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]]
            },
            "paint": {
                "text-color": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    5,
                    "hsl(0, 0%, 33%)",
                    6,
                    "hsl(0, 0%, 0%)"
                ],
                "text-halo-blur": 0.5,
                "text-halo-color": "hsla(0, 0%, 100%, 0.95)",
                "text-halo-width": 1.25,
                "text-opacity": 1
            }
        },
        {
            "id": "state-label",
            "type": "symbol",
            "source": "composite",
            "source-layer": "place_label",
            "minzoom": 4,
            "maxzoom": 8,
            "filter": ["==", ["get", "type"], "state"],
            "layout": {
                "text-size": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    4,
                    9.5,
                    9,
                    18
                ],
                "text-transform": "uppercase",
                "text-font": ["Roboto Black", "Arial Unicode MS Bold"],
                "text-padding": 1,
                "text-field": [
                    "step",
                    ["zoom"],
                    ["get", "abbr"],
                    5,
                    ["coalesce", ["get", "name_en"], ["get", "name"]]
                ],
                "text-letter-spacing": 0.2,
                "text-max-width": 6
            },
            "paint": {
                "text-color": "hsl(38, 7%, 64%)",
                "text-halo-width": 1,
                "text-halo-color": "hsla(0, 0%, 100%, 0.95)"
            }
        },
        {
            "id": "country-label",
            "type": "symbol",
            "source": "composite",
            "source-layer": "place_label",
            "minzoom": 3,
            "maxzoom": 8,
            "filter": ["==", ["get", "type"], "country"],
            "layout": {
                "text-field": ["coalesce", ["get", "name_en"], ["get", "name"]],
                "text-max-width": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0,
                    5,
                    3,
                    6
                ],
                "text-font": [
                    "step",
                    ["zoom"],
                    ["literal", ["Roboto Medium", "Arial Unicode MS Regular"]],
                    4,
                    ["literal", ["Roboto Bold", "Arial Unicode MS Bold"]]
                ],
                "text-size": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    1,
                    ["step", ["get", "symbolrank"], 12, 3, 10, 5, 9],
                    9,
                    ["step", ["get", "symbolrank"], 35, 3, 27, 5, 22]
                ]
            },
            "paint": {
                "text-halo-width": 1.5,
                "text-halo-color": "hsla(0, 0%, 100%, 0.95)",
                "text-color": "hsl(0, 0%, 0%)"
            }
        },
        {
            "id": "building",
            "type": "fill-extrusion",
            "source": "composite",
            "source-layer": "building",
            "filter": ["match", ["get", "extrude"], ["true"], true, false],
            "layout": {},
            "paint": {
                "fill-extrusion-height": [
                    "interpolate",
                    ["linear"],
                    ["get", "height"],
                    0,
                    0,
                    999,
                    999
                ],
                "fill-extrusion-color": "hsl(0, 0%, 63%)"
            }
        }
    ],
    "created": "2019-07-08T11:54:10.867Z",
    "id": "cjxubv6lf7wco1cnykkt6akrg",
    "modified": "2019-07-08T12:42:46.753Z",
    "owner": "goldfor1",
    "visibility": "private",
    "draft": false
};