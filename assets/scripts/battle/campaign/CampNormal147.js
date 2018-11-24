var CampNormal147 = module.exports;

CampNormal147.data = {
    mapLoop: [
        {
            imageData:["tk-e-ditu","tk-f-bossditu"],
            groups:[
                {imageIndex:[0,0],loopCount:0,speed:10,zorder:-998},
                {imageIndex:[0,0],loopCount:-1,speed:10,zorder:-998},
                {imageIndex:[0,1],loopCount:0,speed:10,zorder:-998},
            ],
        },
    ],

    //refreshMode:{choose(挑选规则):0.顺序1.随机, wait(是否等待上一波死亡):0.否1.是, interval(刷新间隔):秒}
    monsterWaves:[
        {groups:[25,15,33,39],refreshMap:{loopIndex:0,groupIndex:0,delay:2},refreshMode:{choose:0,wait:0,interval:1}},
        {groups:[84,80,55,52],refreshMap:{loopIndex:0,groupIndex:1,delay:0.5},refreshMode:{choose:0,wait:0,interval:1}},
        {groups:[42,44,59],refreshMap:{loopIndex:0,groupIndex:1,delay:3},refreshMode:{choose:0,wait:0,interval:0.5}},
        {groups:[114],refreshMap:{loopIndex:0,groupIndex:2,delay:0},refreshMode:{choose:0,wait:0,interval:0},refreshCount:-2},
    ],

    monsterExtra:[],

    totalHint:[
        {
            eventKey:2,
            checkTime:1,
            condition:[
                {killMonster:85},
            ],
            effect:[
                {result:1},
            ]
        },
        {
            checkTime:-1,
            relation:'&&',
            condition:[
                {interval:18},
            ],
            effect:[
                {drop:10000},
            ]
        },
        {
            checkTime:1,
            relation:'&&',
            condition:[
                {wave:{index:2,complete:3}},
                {anime:1},
            ],
            effect:[
                {wave:{index:3}},
                {map:{loopIndex:0,groupIndex:1,loopCount:0,speed:10}},
            ]
        },
        {
            checkTime:1,
            condition:[
                {wave:{index:2,complete:3}},
            ],
            effect:[
                {anime:1},
            ]
        },
    ],
}