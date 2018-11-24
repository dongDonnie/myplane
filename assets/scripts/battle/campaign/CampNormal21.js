var CampNormal21 = module.exports;

CampNormal21.data = {
    maps:[
        ["chengshixunhuan","chengshixunhuan","chengshixunhuan"],
        ["bfc-c-01xianjie","bfc-c-01xianjie","bfc-c-01xianjie"],
    ],
    monsterWaves:[
        {wave:{groups:[44,45,37,34,121,122],wait:0,delay:[2,2,4,4,5,5]},maps:{mapIndex:[0,1],mapSpeed:[250,500],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[16,22,111,114,40,41],wait:0,delay:[0,0,2,2,6,6]}},
        {wave:{groups:[196,27],wait:0,delay:[0,2]}},
        {wave:{groups:[85],wait:0,delay:[0],anime:1},maps:{mapIndex:[0,1],mapSpeed:[250,1000],mapScale:[1,1.2],mapLoop:[1,1]}},
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
                {wave:{index:3,step:3}},
            ],
            effect:[
                {extra:-1},
            ],
        },
    ],
}