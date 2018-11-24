var CampNormal9 = module.exports;

CampNormal9.data = {
    maps:[
        ["bfc-a","bfc-a","bfc-a"],
        ["bfc-b-01hebing","bfc-b-01hebing","bfc-b-01hebing"],
    ],
    monsterWaves:[
        {wave:{groups:[795,761,777,785],wait:0,delay:[0.3,1,2.2,3.4]},maps:{mapIndex:[0,1],mapSpeed:[400,1000],mapScale:[1,1.2],mapLoop:[1,1]}},
        {wave:{groups:[761,772,794,796,778],wait:0,delay:[0,1,2,2,2]}},
        {wave:{groups:[764,773,782,773],wait:0,delay:[0,1,1.5,2.5]}},
        {wave:{groups:[793,797,764,775,773,788],wait:0,delay:[0,0,1.5,2.5,3,3.5]}},
        {wave:{groups:[792,795,798,794,797,764,762,775],wait:0,delay:[0,0.8,1.6,2.4,2.4,2.5,3,3.5]}},
        {wave:{groups:[794,798,792,795,797,766,761,778,766,762,778],wait:0,delay:[0,0.8,1.6,2.4,2.4,2.5,3,3.5,4,4,4.5]}},

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
                {extra:-2},
            ],
        },
    ],
}