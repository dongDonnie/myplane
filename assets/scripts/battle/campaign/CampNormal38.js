var CampNormal38 = module.exports;

CampNormal38.data = {
    maps:[
        ["fg_fight_bg_0","fg_fight_bg_0","fg_fight_bg_0"],
    ],
    monsterWaves:[
        {wave:{groups:[19,27,25,123,124],wait:0,delay:[2,2.5,3,4,4.5]},maps:{mapIndex:[0],mapSpeed:[500],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[29,33,121,122,27,120],wait:0,delay:[0,0,0.5,1,2,3]}},
        {wave:{groups:[194,118,26,121,122],wait:0,delay:[0,3,5,7,7]},maps:{mapIndex:[0],mapSpeed:[800],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[163,20,14,36,37],wait:0,delay:[0,3,3,5,5]}},
        {wave:{groups:[171],wait:0,delay:[0]}},
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