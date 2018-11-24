var CampNormal43 = module.exports;

CampNormal43.data = {
    maps:[
        ["ry-a","ry-a","ry-a"],
        ["ditu-2","ditu-2","ditu-2"],
    ],
    monsterWaves:[
        {wave:{groups:[27,273],wait:0,delay:[2,3]},maps:{mapIndex:[0],mapSpeed:[500],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[196,38,36,42],wait:0,delay:[0,4,4.5,5]}},
        {wave:{groups:[27,271,272],wait:0,delay:[0,3,4]}},
        {wave:{groups:[230,237,238,26],wait:0,delay:[0,4,4.5,5]},maps:{mapIndex:[1],mapSpeed:[800],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[194],wait:0,delay:[0]}},
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