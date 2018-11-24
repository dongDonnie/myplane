var CampNormal41 = module.exports;

CampNormal41.data = {
    maps:[
        ["tkz","tkz","tkz"],
    ],
    monsterWaves:[
        {wave:{groups:[28,29,30,227,230],wait:0,delay:[2,2,2,5,6]},maps:{mapIndex:[0],mapSpeed:[1000],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[27,222,226,229],wait:0,delay:[0,3,3,7]}},
        {wave:{groups:[280,283],wait:0,delay:[0,1]},maps:{mapIndex:[0],mapSpeed:[600],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[191,230,36,225,221,27,45],wait:0,delay:[0,1,2,6,6,6.5,7]}},
        {wave:{groups:[273],wait:0,delay:[0]}},
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