var CampNormal13 = module.exports;

CampNormal13.data = {
    maps:[
        ["cx-b","cx-c","cx-c"],
        ["cx-c","cx-d","cx-c"],
        ["cx-d","cx-c","cx-e-bossditu"],
    ],
    monsterWaves:[
        {wave:{groups:[618,44,45],wait:0,delay:[0.3,1,2.5]},maps:{mapIndex:[0,1],mapSpeed:[400,800],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[619,40,41],wait:0,delay:[0.2,1,2.6]}},
        {wave:{groups:[620,29,32],wait:0,delay:[0,1,2.4]}},
        {wave:{groups:[621,546],wait:0,delay:[0,2.4]}},
        {wave:{groups:[622,543],wait:0,delay:[0,2.4]}},
        {wave:{groups:[614],wait:0,delay:[0,0],anime:1},maps:{mapIndex:[0,1],mapSpeed:[400,500],mapScale:[1,1],mapLoop:[1,0]}},
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
                {wave:{index:4,step:8}},
            ],
            effect:[
                {extra:-1},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:5,step:6}},
            ],
            effect:[
                {extra:-2},
            ],
        },
    ],
    
}