var CampNormal64 = module.exports;

CampNormal64.data = {
    maps:[
        ["bfc-a","bfc-a","bfc-a"],
        ["bfc-b-01hebing","bfc-b-01hebing","bfc-b-01hebing"],
        ["bfc-c-01xianjie","bfc-c-01xianjie","bfc-c-01xianjie"],
    ],
    monsterWaves:[
        {wave:{groups:[608,27,609,573],wait:0,delay:[0.3,1,2.5,4.5]},maps:{mapIndex:[0,1],mapSpeed:[400,800],mapScale:[1,1],mapLoop:[1,1]}},
        {wave:{groups:[610,563,564],wait:0,delay:[0.2,1,2.6]}},
        {wave:{groups:[611,554,555],wait:0,delay:[0,1,2.4]}},
        {wave:{groups:[612,375],wait:0,delay:[0,2.4]}},
        {wave:{groups:[613,587,590],wait:0,delay:[0,1,2.4]}},
        {wave:{groups:[615,543],wait:0,delay:[0,1.5]}},
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