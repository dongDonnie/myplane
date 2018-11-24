var CampNormal17 = module.exports;

CampNormal17.data = {
    maps:[
        ["cx-d","cx-c","cx-d"],
        ["cx-c","cx-d","cx-e-bossditu"],
    ],
    monsterWaves:[
        {wave:{groups:[37,228,227,44,45,229],wait:0,delay:[2,2.5,2.5,6,6,7]},maps:{mapIndex:[0],mapSpeed:[800],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[36,24,196],wait:0,delay:[0,0.5,1]}},
        {wave:{groups:[90,27,28,31],wait:0,delay:[0,1,2,3],anime:1},maps:{mapIndex:[1],mapSpeed:[600],mapScale:[1],mapLoop:[0]}},
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