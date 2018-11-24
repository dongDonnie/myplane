var CampNormal6 = module.exports;

CampNormal6.data = {
    maps:[
        ["xingkong","xingkong","xingkong"],
        ["kjznb-tongdao","kjznb-tongdao","kjznb-tongdao"],
    ],
    monsterWaves:[
        {wave:{groups:[552,707,553],wait:0,delay:[0.2,0.5,1]},maps:{mapIndex:[0,1],mapSpeed:[400,500],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[708,39],wait:0,delay:[0,0]}},
        {wave:{groups:[710],wait:0,delay:[0]}},
        {wave:{groups:[34,711,40,41],wait:0,delay:[0,2,5,5]}},
        {wave:{groups:[34,710,40],wait:0,delay:[0,0,2]}},
        {wave:{groups:[34,716,41],wait:0,delay:[0,0,2]}},
        {wave:{groups:[715],wait:0,delay:[0]},maps:{mapIndex:[0,1],mapSpeed:[400,500],mapScale:[1,1],mapLoop:[1,1]}},
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
                {extra:-2},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:3,step:8}},
            ],
            effect:[
                {extra:-1},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:4,step:4}},
            ],
            effect:[
                {extra:-2},
            ],
        },
    ],
}