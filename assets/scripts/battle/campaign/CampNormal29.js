var CampNormal29 = module.exports;

CampNormal29.data = {
    maps:[
        ["bfc-a","bfc-a","bfc-a"],
        ["tk-b","tk-c","tk-d-ditu"],
        ["tk-e-ditu","tk-e-ditu","tk-e-ditu"],
    ],
    monsterWaves:[
        {wave:{groups:[164,26,28,29,30],wait:0,delay:[2,2,6,6,6]},maps:{mapIndex:[0,1],mapSpeed:[400,500],mapScale:[1,1],mapLoop:[0,0]}},
        {wave:{groups:[27,120,19,25,19,25],wait:0,delay:[0,0,1,1.5,2,2.5]},maps:{mapIndex:[0,2],mapSpeed:[400,800],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[37,17,23,119,14,20],wait:0,delay:[0,0,0,4,5,5]}},
        {wave:{groups:[44,45,212],wait:0,delay:[0,0,2]}},
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