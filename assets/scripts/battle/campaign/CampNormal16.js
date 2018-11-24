var CampNormal16 = module.exports;

CampNormal16.data = {
    maps:[
        ["cx-b","cx-c","cx-d"],
        ["cx-c","cx-d","cx-c","cx-d"],
    ],
    monsterWaves:[
        {wave:{groups:[23,230,273,44,45],wait:0,delay:[2,2,6,6,6]},maps:{mapIndex:[0],mapSpeed:[600],mapScale:[1],mapLoop:[0]}},
        {wave:{groups:[48,281,39,229],wait:0,delay:[0,1,2,3]},maps:{mapIndex:[1],mapSpeed:[800],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[221,224,41,36,38,18,27,39,229],wait:0,delay:[0,0,1,3,5,5.5,6.5,9,9]}},
        {wave:{groups:[38,273,233],wait:0,delay:[0,0,1]}},
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