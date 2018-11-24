var CampNormal46 = module.exports;

CampNormal46.data = {
    maps:[
        ["fg_fight_bg_0","fg_fight_bg_0","fg_fight_bg_0"],
        ["bfc-c-01xianjie","bfc-c-01xianjie","bfc-c-01xianjie"],
    ],
    monsterWaves:[
        {wave:{groups:[274,44,45,27],wait:0,delay:[2,4,4,7]},maps:{mapIndex:[0,1],mapSpeed:[400,500],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[230,223,226,17,18,21,22],wait:0,delay:[0,1,2,4,4,4,4]},maps:{mapIndex:[0,1],mapSpeed:[400,800],mapScale:[1,1.2],mapLoop:[1,1]}},
        {wave:{groups:[276,277,31,33,29],wait:0,delay:[0,1,3,3,3]}},
        {wave:{groups:[193,127,128],wait:0,delay:[0,1,2]},maps:{mapIndex:[0,1],mapSpeed:[400,800],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[196],wait:0,delay:[0]}},
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