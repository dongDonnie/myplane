var CampNormal8 = module.exports;

CampNormal8.data = {
    maps:[
        ["bfc-a","bfc-a","bfc-a"],
        ["tk-b","tk-c","tk-d-ditu"],
        ["tk-e-ditu","tk-e-ditu","tk-e-ditu"],
    ],
    monsterWaves:[
        {wave:{groups:[736,27,42,43,18,37,34,44,45,738,739,737,556,558],wait:0,delay:[0.5,2,3.5,4,5.5,6,7,8.8,9,11,12,13,15,16]},maps:{mapIndex:[0,1],mapSpeed:[400,600],mapScale:[1,1],mapLoop:[0,0]}},
        {wave:{groups:[750,746,752,753,749,746,752,750,751],wait:0,delay:[0,0.6,1.2,1.6,2,2,2.4,3,4]}},
        {wave:{groups:[742,745,742,745,742,745,742,745,749,746,752,750],wait:0,delay:[0,0.6,1.2,1.8,2,4,3,3.6,4.2,4.2,4.6,4.6]}},
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