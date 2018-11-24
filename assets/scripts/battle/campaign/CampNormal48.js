var CampNormal48 = module.exports;

CampNormal48.data = {
    maps:[
        ["bfc-boss-01","bfc-boss-01","bfc-boss-01"],
    ],
    monsterWaves:[
        {wave:{groups:[19,25,26,194,231,232],wait:0,delay:[2,3,4,5,9,9]},maps:{mapIndex:[0],mapSpeed:[500],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[273,42,43,27],wait:0,delay:[0,4,4,4]}},
        {wave:{groups:[191,230],wait:0,delay:[0,1]}},
        {wave:{groups:[93],wait:0,delay:[0],anime:1},maps:{mapIndex:[0],mapSpeed:[800],mapScale:[1],mapLoop:[0]}},
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
                {wave:{index:3,step:3}},
            ],
            effect:[
                {extra:-1},
            ],
        },
    ],
}