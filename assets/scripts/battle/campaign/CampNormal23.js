var CampNormal23 = module.exports;

CampNormal23.data = {
    maps:[
        ["tk-e-ditu","tk-e-ditu","tk-e-ditu"],
        ["tk-e-ditu","tk-e-ditu","tk-f-bossditu"],
    ],
    monsterWaves:[
        {wave:{groups:[122,124,29,30],wait:0,delay:[2,3,4,4]},maps:{mapIndex:[0],mapSpeed:[1000],mapScale:[1],mapLoop:[1]}},
        {wave:{groups:[27,113,116,36,37,26],wait:0,delay:[0,1,2,4,4.5,5]}},
        {wave:{groups:[87],wait:0,delay:[0],anime:1},maps:{mapIndex:[1],mapSpeed:[600],mapScale:[1],mapLoop:[0]}},
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