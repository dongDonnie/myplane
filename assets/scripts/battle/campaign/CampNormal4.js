var CampNormal4 = module.exports;

CampNormal4.data = {
    maps:[
        ["tk-e-ditu","tk-e-ditu","tk-e-ditu"],
        ["tk-e-ditu","tk-e-ditu","tk-f-bossditu"],
    ],
    monsterWaves:[
        {wave:{groups:[674,18],wait:0,delay:[2,3.5]},maps:{mapIndex:[0],mapSpeed:[500],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[675,50],wait:0,delay:[0,0.9]}},
        {wave:{groups:[676],wait:0,delay:[0]}},
        {wave:{groups:[98],wait:0,delay:[0],anime:1},maps:{mapIndex:[1],mapSpeed:[500],mapScale:[1],mapLoop:[0]}},
    ],
    monsterExtra:[311,312,313,314,315,316,317,302,303],

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
                {wave:{index:2,step:8}},
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
                {extra:-2},
            ],
        },
        
    ],
}