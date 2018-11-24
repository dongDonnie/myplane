var CampNormal24 = module.exports;

CampNormal24.data = {
    maps:[
        ["shamo","shamo","shamo"],
    ],
    monsterWaves:[
        {wave:{groups:[196,],wait:0,delay:[2]},maps:{mapIndex:[0],mapSpeed:[500],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[118,117,34,112,40],wait:0,delay:[0,0,2,6,6]}},
        {wave:{groups:[28,31,194,28,21,20,127,128],wait:0,delay:[0,0,3,5,5,5,9,9]}},
        {wave:{groups:[120],wait:0,delay:[0]}},
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