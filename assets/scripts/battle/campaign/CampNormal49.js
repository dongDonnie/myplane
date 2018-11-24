var CampNormal49 = module.exports;

CampNormal49.data = {
    maps:[
        ["chengshixunhuan","chengshixunhuan","chengshixunhuan"],
    ],
    monsterWaves:[
        {wave:{groups:[111,114,14,16,27,121,122],wait:0,delay:[2,2,4,4,5,9,9]},maps:{mapIndex:[0],mapSpeed:[1000],mapScale:[1.2],mapLoop:[1]}},
        {wave:{groups:[196,28,31],wait:0,delay:[0,4,4]}},
        {wave:{groups:[120,40,41],wait:0,delay:[0,4,4]},maps:{mapIndex:[0],mapSpeed:[600],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[85],wait:0,delay:[0],anime:1}},
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