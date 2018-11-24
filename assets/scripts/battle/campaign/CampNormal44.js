var CampNormal44 = module.exports;

CampNormal44.data = {
    maps:[
        ["tk-a","tk-a","tk-a"],
        ["tk-b","tk-c","tk-b"],
        ["tk-d-ditu","tk-e-ditu","tk-f-bossditu"],
    ],
    monsterWaves:[
        {wave:{groups:[27,196,26],wait:0,delay:[2,2.5,3]},maps:{mapIndex:[0,1],mapSpeed:[400,500],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[211],wait:0,delay:[0]}},
        {wave:{groups:[44,45,118],wait:0,delay:[0,1,2]}}, 
        {wave:{groups:[42,43,120],wait:0,delay:[0,1,2]}}, 
        {wave:{groups:[87,20,21,22,23,24],wait:0,delay:[0,2,2.5,3,3.5,4],anime:1},maps:{mapIndex:[0,2],mapSpeed:[400,800],mapScale:[1,1],mapLoop:[0,0]}},
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
                {wave:{index:4,step:3}},
            ],
            effect:[
                {extra:-1},
            ],
        },
    ],
}