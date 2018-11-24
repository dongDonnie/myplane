var CampNormal42 = module.exports;

CampNormal42.data = {
    maps:[
        ["ry-a","ditu-2","ry-a","ditu-2"],
        ["kjznb-tongdao","kjznb-tongdao","kjznb-tongdao"],
    ],
    monsterWaves:[
        {wave:{groups:[232,234,235],wait:0,delay:[2,2.5,3]},maps:{mapIndex:[0,1],mapSpeed:[250,700],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[223,226,31,33,36],wait:0,delay:[0,1,2,2,2]}},
        {wave:{groups:[27,192,274,26],wait:0,delay:[0,1,4,5]}},
        {wave:{groups:[40,41,230,275,20,15,22,17,24],wait:0,delay:[0,0.5,1,6,6,6,6,6,6]}},
        {wave:{groups:[193],wait:0,delay:[0]}},
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