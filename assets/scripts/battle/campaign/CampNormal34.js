var CampNormal34 = module.exports;

CampNormal34.data = {
    maps:[
        ["tk-a","tk-a","tk-a"],
        ["tk-b","tk-c","tk-d-ditu"],
        ["tk-e-ditu","tk-e-ditu","tk-e-ditu"],
    ],
    monsterWaves:[
        {wave:{groups:[113,115,117,118,27],wait:0,delay:[2,2,4,5,6]},maps:{mapIndex:[0,1],mapSpeed:[250,400],mapScale:[1,1],mapLoop:[0,0]}},
        {wave:{groups:[32,120,45,111,116],wait:0,delay:[0,0,0,4,5]},maps:{mapIndex:[0,2],mapSpeed:[400,800],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[18,17,126,31,32,30,125,126],wait:0,delay:[0,0,1,2,2,2,8,8]}}, 
        {wave:{groups:[214],wait:0,delay:[0]}}, 
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
                {wave:{index:1,step:3}},
            ],
            effect:[
                {extra:-1},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:1,step:4}},
            ],
            effect:[
                {extra:-1},
            ],
        },
    ],
}