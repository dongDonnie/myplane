var CampNormal15 = module.exports;

CampNormal15.data = {
    maps:[
        ["cx-a","cx-a","cx-a"],
        ["cx-a","cx-a","cx-b"],
    ],
    monsterWaves:[
        {wave:{groups:[42,43,228,229,37,45,194],wait:0,delay:[2,2,2,4,6,10,10]},maps:{mapIndex:[0],mapSpeed:[800],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[42,43,195,14,21,16,23,196],wait:0,delay:[0,0,2,4,4,4,4,8]}},
        {wave:{groups:[274],wait:0,delay:[0]},maps:{mapIndex:[1],mapSpeed:[600],mapScale:[1],mapLoop:[0]}},
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