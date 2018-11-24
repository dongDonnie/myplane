var CampNormal26 = module.exports;

CampNormal26.data = {
    maps:[
        ["cx-a","cx-a","cx-b"],
        ["cx-c","cx-c","cx-c"],
    ],
    monsterWaves:[
        {wave:{groups:[22,16,43,42,192,27],wait:0,delay:[2,2,3,3,5,6]},maps:{mapIndex:[0],mapSpeed:[1000],mapScale:[1],mapLoop:[0]}},
        {wave:{groups:[233,234,28,31,193,16,22],wait:0,delay:[0,0,2,2,6,7,7]},maps:{mapIndex:[1],mapSpeed:[600],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[227,228],wait:0,delay:[0,0]}},
        {wave:{groups:[237,238,36,37],wait:0,delay:[0,0,4,4]}},
        {wave:{groups:[272],wait:0,delay:[0]}},
    ],
    monsterExtra:[311,312,313,314,315,316,317],

    totalHint:[
        {
            checkTime:-1,
            condition:[
                {interval:18},
            ],
            effect:[
                {drop:10000},
            ]
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:1,step:3}},
            ],
            effect:[
                {extra:-1},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:1,step:4}},
            ],
            effect:[
                {extra:-1},
            ],
        },
    ],
}