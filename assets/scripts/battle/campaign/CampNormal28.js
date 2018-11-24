var CampNormal28 = module.exports;

CampNormal28.data = {
    maps:[
        ["xkm-budong"],
        ["tk-b","tk-c","tk-b"],
    ],
    monsterWaves:[
        {wave:{groups:[119,33,17,23],wait:0,delay:[2,2.5,4,5]},maps:{mapIndex:[0,1],mapSpeed:[0,600],mapScale:[1,1],mapLoop:[0,1]}},
        {wave:{groups:[29,30,32,33,118,43,125],wait:0,delay:[0,0,0,0,3,4,5]}},
        {wave:{groups:[25,42,43,37,196,16,14,21,23],wait:0,delay:[0,0.5,1,1.5,4,4.5,5,5.5,6]}},
        {wave:{groups:[172,173],wait:0,delay:[0,0]}},
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