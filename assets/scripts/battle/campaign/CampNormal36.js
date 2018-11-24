var CampNormal36 = module.exports;

CampNormal36.data = {
    maps:[
        ["cx-a","cx-a","cx-b"],
        ["cx-c","cx-c","cx-c"],
    ],
    monsterWaves:[
        {wave:{groups:[211],wait:0,delay:[2]},maps:{mapIndex:[0],mapSpeed:[1000],mapScale:[1],mapLoop:[0]}},
        {wave:{groups:[230,27,38,39,40,41,27,191],wait:0,delay:[0,2,4,4.5,5,5.5,8,9]}},
        {wave:{groups:[273],wait:0,delay:[0]},maps:{mapIndex:[1],mapSpeed:[600],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[227,228,36,33,196],wait:0,delay:[0,1,2,2,6]}},
        {wave:{groups:[280,281],wait:0,delay:[0,0]}},
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
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:2,step:4}},
            ],
            effect:[
                {extra:-1},
            ],
        },
    ],
}