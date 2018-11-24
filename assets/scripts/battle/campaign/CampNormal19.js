var CampNormal19 = module.exports;

CampNormal19.data = {
    maps:[
        ["tk-a","tk-a","tk-a"],
        ["tk-b","tk-c","tk-d-ditu"],
        ["tk-e-ditu","tk-e-ditu","tk-e-ditu"],
    ],
    monsterWaves:[
        {wave:{groups:[120,44,45,19,25],wait:0,delay:[2,3,3,5,5]},maps:{mapIndex:[0,1],mapSpeed:[400,600],mapScale:[1,1],mapLoop:[1,0]}},
        {wave:{groups:[113,116,45,44],wait:0,delay:[0,0,2,2]},maps:{mapIndex:[0,2],mapSpeed:[400,800],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[112,115,37,17,23,119,39,38],wait:0,delay:[0,0,4,4.5,5,8,8,8]}},
        {wave:{groups:[42,43,165],wait:0,delay:[0,0,0]}},
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