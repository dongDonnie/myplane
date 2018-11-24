var CampNormal50 = module.exports;

CampNormal50.data = {
    maps:[
        ["tkz","tkz","tkz"],
        ["bfc-b-01hebing","bfc-b-01hebing","bfc-b-01hebing"],
    ],
    monsterWaves:[
        {wave:{groups:[211,165,27,120,21,22,23,25],wait:0,delay:[2,3,4,5,8,8,8,10]},maps:{mapIndex:[0,1],mapSpeed:[400,800],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[34,35,123,124],wait:0,delay:[0,0.5,1,1.5]}},
        {wave:{groups:[92],wait:0,delay:[0],anime:1},maps:{mapIndex:[0,1],mapSpeed:[400,500],mapScale:[1,1],mapLoop:[0,0]}},
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
    ],
}