var CampNormal5 = module.exports;

CampNormal5.data = {
    maps:[
        ["bfc-boss-01","bfc-boss-01","bfc-boss-01"],
        ["tk-b","tk-b","tk-b"],
    ],
    monsterWaves:[
        {wave:{groups:[697,27],wait:0,delay:[0.5,0.5]},maps:{mapIndex:[0,1],mapSpeed:[200,400],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[698,52],wait:0,delay:[0.2,0.5]}},
        {wave:{groups:[699,51],wait:0,delay:[0.2,0.5]}},
        {wave:{groups:[700,303],wait:0,delay:[0.2,0.5]}},
        {wave:{groups:[701,573],wait:0,delay:[0.2,0.5]}},
        {wave:{groups:[702,694],wait:0,delay:[0.2,0.5]}},
        {wave:{groups:[703,693],wait:0,delay:[0.2,0.5]}},
    ],
    monsterExtra:[311,312,313,314,315,316,317],

    totalHint:[
        {
            checkTime:-1,
            condition:[
                {interval:12},
            ],
            effect:[
                {drop:10000},
            ]
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:0,step:8}},
            ],
            effect:[
                {extra:{open:-1,delay:3}},
            ],
        },
        {
            eventKey:0,
            checkTime:1,
            condition:[
                {wave:{index:2,step:6}},
            ],
            effect:[
                {extra:{open:-2}},
            ],
        },
    ],
}