var CampNormal35 = module.exports;

CampNormal35.data = {
    maps:[
        ["chengshixunhuan","chengshixunhuan","chengshixunhuan"],
        ["bfc-c-01xianjie","bfc-c-01xianjie","bfc-c-01xianjie"],
    ],
    monsterWaves:[
        {wave:{groups:[679,27],wait:0,delay:[0.5,1]},maps:{mapIndex:[0],mapSpeed:[400],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[680,52],wait:0,delay:[0,0.5]}},
        {wave:{groups:[681,51],wait:0,delay:[0,0.6]},maps:{mapIndex:[0],mapSpeed:[800],mapScale:[1.2],mapLoop:[1]}},
        {wave:{groups:[682,303],wait:0,delay:[0,0]},maps:{mapIndex:[0],mapSpeed:[500],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[683,573],wait:0,delay:[0,0]}},
        {wave:{groups:[684,693],wait:0,delay:[0,0]}},
        {wave:{groups:[694,693,28,31],wait:0,delay:[0,0,1,1.5]}},
        {wave:{groups:[686,694],wait:0,delay:[0,0.5]}},
        {wave:{groups:[687,688,302],wait:0,delay:[0,0,2]}},
        {wave:{groups:[689,19,25],wait:0,delay:[0,0.5,1]}},
        {wave:{groups:[690,303],wait:0,delay:[0,0.8]}},
        {wave:{groups:[96],wait:0,delay:[0]}},
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
                {wave:{index:1,step:8}},
            ],
            effect:[
                {extra:-1},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:2,step:5}},
            ],
            effect:[
                {extra:-2},
            ],
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