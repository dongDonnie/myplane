var CampNormal20 = module.exports;

CampNormal20.data = {
    maps:[
        ["tk-e-ditu","tk-e-ditu","tk-e-ditu"],
        ["tk-e-ditu","tk-e-ditu","tk-e-ditu","tk-f-bossditu"],
    ],
    monsterWaves:[
        {wave:{groups:[193,112,115,19,25],wait:0,delay:[2,3,4,4,4]},maps:{mapIndex:[0],mapSpeed:[600],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[45,120],wait:0,delay:[0,0]}},
        {wave:{groups:[113,116,38,39],wait:0,delay:[0,1,2,3]}}, 
        {wave:{groups:[89],wait:0,delay:[0],anime:1},maps:{mapIndex:[1],mapSpeed:[1000],mapScale:[1],mapLoop:[0]}},
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
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:3,step:4}},
            ],
            effect:[
                {extra:-1},
            ],
        },
    ],
}