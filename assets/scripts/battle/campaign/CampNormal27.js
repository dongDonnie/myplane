var CampNormal27 = module.exports;

CampNormal27.data = {
    maps:[
        ["cx-d","cx-c","cx-d"],
        ["cx-c","cx-d","cx-e-bossditu"],
    ],
    monsterWaves:[
        {wave:{groups:[34,228,27,193,40,43,230],wait:0,delay:[2,2.5,3,3.5,6,7,8]},maps:{mapIndex:[0],mapSpeed:[1000],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[38,39,194],wait:0,delay:[0,0.5,1]}},
        {wave:{groups:[88,28,33,27],wait:0,delay:[0,1,2,3],anime:1},maps:{mapIndex:[1],mapSpeed:[600],mapScale:[1],mapLoop:[0]}},
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