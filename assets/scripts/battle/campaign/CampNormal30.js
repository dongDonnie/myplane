var CampNormal30 = module.exports;

CampNormal30.data = {
    maps:[
        ["shamo","shamo","shamo"],
        ["kjznb-tongdao","kjznb-tongdao","kjznb-tongdao"],
    ],
    monsterWaves:[
        {wave:{groups:[213,163,14,20],wait:0,delay:[2,3,3,3.5]},maps:{mapIndex:[0,1],mapSpeed:[300,800],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[125,126,121,122,33,34,35,36],wait:0,delay:[0,1,2,3,3.5,4,4.5,5]}},
        {wave:{groups:[95],wait:0,delay:[0],anime:1},maps:{mapIndex:[0,1],mapSpeed:[300,600],mapScale:[1,1.1],mapLoop:[0,0]}},
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