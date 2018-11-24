var CampNormal37 = module.exports;

CampNormal37.data = {
    maps:[
        ["cx-c","cx-d","cx-c"],
        ["cx-d","cx-c","cx-e-bossditu"],
    ],
    monsterWaves:[
        {wave:{groups:[231,232,27],wait:0,delay:[2,2.5,3]},maps:{mapIndex:[0],mapSpeed:[1000],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[227,230,222,275,28,31],wait:0,delay:[0,1,2,3,3,3]}},
        {wave:{groups:[86,44,27,45],wait:0,delay:[0,1,2,3],anime:1},maps:{mapIndex:[1],mapSpeed:[600],mapScale:[1],mapLoop:[0]}},
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