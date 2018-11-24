var CampNormal22 = module.exports;

CampNormal22.data = {
    maps:[
        ["bfc-boss-01","bfc-boss-01","bfc-boss-01"],
    ],
    monsterWaves:[
        {wave:{groups:[231,232,194,40,41],wait:0,delay:[2,2,6,8,8]},maps:{mapIndex:[0],mapSpeed:[500],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[191,233,234,40,41],wait:0,delay:[0,1,2,4,4]}},
        {wave:{groups:[85],wait:0,delay:[0],anime:1},maps:{mapIndex:[0],mapSpeed:[500],mapScale:[1],mapLoop:[0]}},
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
                {wave:{index:2,step:3}},
            ],
            effect:[
                {extra:-1},
            ],
        },
    ],
}