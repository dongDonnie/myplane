var CampNormal40 = module.exports;

CampNormal40.data = {
    maps:[
        ["xingkong","xingkong","xingkong"],
        ["tk-b","tk-c","tk-b"],
        ["tk-d-ditu","tk-e-ditu","tk-f-bossditu"],
    ],
    monsterWaves:[
        {wave:{groups:[195,45,44],wait:0,delay:[2,3,3]},maps:{mapIndex:[0,1],mapSpeed:[400,500],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[123,124,127,128],wait:0,delay:[0,0.5,1,1.5]}},
        {wave:{groups:[42,43,196],wait:0,delay:[0,0,2]}}, 
        {wave:{groups:[87],wait:0,delay:[0],anime:1},maps:{mapIndex:[0,2],mapSpeed:[400,800],mapScale:[1,1],mapLoop:[0,0]}},
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
    ],
}