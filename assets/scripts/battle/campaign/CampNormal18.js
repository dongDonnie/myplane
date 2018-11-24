var CampNormal18 = module.exports;

CampNormal18.data = {
    maps:[
        ["cx-c","cx-c","cx-c"],
        ["kjznb-tongdao","kjznb-tongdao","kjznb-tongdao"],
    ],
    monsterWaves:[
        {wave:{groups:[41,228,39,33,16,18,24,22],wait:0,delay:[2,2,4,4,8,8,8,8]},maps:{mapIndex:[0,1],mapSpeed:[400,600],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[39,16,22,14,20,40],wait:0,delay:[0,2,2,2,2,4]},maps:{mapIndex:[0,1],mapSpeed:[400,800],mapScale:[1,1.2],mapLoop:[1,1]}},
        {wave:{groups:[27,44,45,16,14,41,21,23,274],wait:0,delay:[0,1,2,4,4,5,7,7,9]}},
        {wave:{groups:[232,233,227],wait:0,delay:[0,0,2]}},
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