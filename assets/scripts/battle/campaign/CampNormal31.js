var CampNormal31 = module.exports;

CampNormal31.data = {
    maps:[
        ["bfc-a","bfc-a","bfc-a"],
        ["bfc-b-01hebing","bfc-b-01hebing","bfc-b-01hebing"],
    ],
    monsterWaves:[
        {wave:{groups:[271,225,301,226],wait:0,delay:[2,3,5,7]},maps:{mapIndex:[0,1],mapSpeed:[300,1000],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[16,22,42,43,230,228],wait:0,delay:[0,0,2,2,5,7]}},
        {wave:{groups:[86],wait:0,delay:[0],anime:1},maps:{mapIndex:[0,1],mapSpeed:[300,600],mapScale:[1,1],mapLoop:[0,0]}},
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