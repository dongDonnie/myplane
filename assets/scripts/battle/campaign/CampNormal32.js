var CampNormal32 = module.exports;

CampNormal32.data = {
    maps:[
        ["xkm-budong"],
    ],
    monsterWaves:[
        {wave:{groups:[42,43,44,45,21,22,130],wait:0,delay:[2,2.5,3,3.5,4,5,6]},maps:{mapIndex:[0],mapSpeed:[0],mapScale:[1],mapLoop:[0]}},
        {wave:{groups:[196],wait:0,delay:[0]}},
        {wave:{groups:[118,121,195,26,27],wait:0,delay:[0,2,4,4,4]}},
        {wave:{groups:[93],wait:0,delay:[0],anime:1}},
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
    ],
}