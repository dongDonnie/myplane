var CampNormal39 = module.exports;

CampNormal39.data = {
    maps:[
        ["shamo","shamo","shamo"],
    ],
    monsterWaves:[
        {wave:{groups:[162,112,161,31,32,33],wait:0,delay:[2,3,6,8,8,8]},maps:{mapIndex:[0],mapSpeed:[500],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[27,120,44,43,45,42],wait:0,delay:[0,1,2,2.5,3,3.5]}},
        {wave:{groups:[125,126,19,25,27,118],wait:0,delay:[0,1,4,4.5,5,5.5]},maps:{mapIndex:[0],mapSpeed:[800],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[165],wait:0,delay:[0]}},
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
                {extra:-1},
            ],
        },
    ],
}