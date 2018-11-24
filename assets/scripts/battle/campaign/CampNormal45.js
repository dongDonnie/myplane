var CampNormal45 = module.exports;

CampNormal45.data = {
    maps:[
        ["fg_fight_bg_0","fg_fight_bg_0","fg_fight_bg_0"],
    ],
    monsterWaves:[
        {wave:{groups:[27,117,118,119,19,25,26],wait:0,delay:[2,4,5,6,8,9,10]},maps:{mapIndex:[0],mapSpeed:[600],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[36,35,192,120],wait:0,delay:[0,0.5,1,1.5]}},
        {wave:{groups:[28,31,127,128],wait:0,delay:[0,0,4,4]},maps:{mapIndex:[0],mapSpeed:[1000],mapScale:[1.3],mapLoop:[1]}},
        {wave:{groups:[126,125,27,119],wait:0,delay:[0,0,4,5]}},
        {wave:{groups:[167,168],wait:0,delay:[0,1]}},
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