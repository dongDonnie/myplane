var CampNormal25 = module.exports;

CampNormal25.data = {
    maps:[
        ["xingkong","xingkong","xingkong"],
        ["tk-b","tk-c","tk-b"],
    ],
    monsterWaves:[
        {wave:{groups:[14,20,119],wait:0,delay:[2,2,4]},maps:{mapIndex:[0,1],mapSpeed:[250,600],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[15,21,116,170,40,120],wait:0,delay:[0,0,3,4,8,9]}},
        {wave:{groups:[111,114,42,35,37,18,27],wait:0,delay:[0,0,0,3,3.5,4,4.5]}},
        {wave:{groups:[38,119,39],wait:0,delay:[0,0.5,1]}},
        {wave:{groups:[168,169,118],wait:0,delay:[0,0,2]}},
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