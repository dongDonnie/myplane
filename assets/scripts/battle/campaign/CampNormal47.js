var CampNormal47 = module.exports;

CampNormal47.data = {
    maps:[
        ["tk-e-ditu","tk-e-ditu","tk-e-ditu"],
        ["tk-e-ditu","tk-e-ditu","tk-f-bossditu"],
    ],
    monsterWaves:[
        {wave:{groups:[120,127,128,27],wait:0,delay:[2,3,4,4]},maps:{mapIndex:[0],mapSpeed:[1000],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[44,45,116,113,14,16,18],wait:0,delay:[0,0.5,1,1.5,3,3,3]}},
        {wave:{groups:[91],wait:0,delay:[0],anime:1},maps:{mapIndex:[1],mapSpeed:[600],mapScale:[1],mapLoop:[0]}},
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