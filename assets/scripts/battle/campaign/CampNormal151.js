var CampNormal151 = module.exports;

CampNormal151.data = {
    mapLoop: [
        {
            imageData:["tk-a"],
            groups:[
                {imageIndex:[0,0],loopCount:4,speed:5,zorder:-999},
            ],
        },
        {
            imageData:["tk-b1","tk-b","tk-c","tk-d-ditu","tk-e-ditu","tk-f-bossditu"],
            groups:[
                {imageIndex:[0,1],loopCount:0,speed:10,zorder:-998},
                {imageIndex:[2,1,2],loopCount:0,speed:10,zorder:-998},
                {imageIndex:[2,1,2],loopCount:0,speed:10,zorder:-998},
                {imageIndex:[3,4],loopCount:0,speed:10,zorder:-998},
                {imageIndex:[4,4],loopCount:0,speed:10,zorder:-998},
                {imageIndex:[4,4],loopCount:-1,speed:10,zorder:-998},
                {imageIndex:[4,5],loopCount:0,speed:10,zorder:-998},
            ],
        },
    ],

    //refreshMode:{choose(挑选规则):0.顺序1.随机, wait(是否等待上一波死亡):0.否1.是, interval(刷新间隔):秒}
    monsterWaves:[
        {groups:[28,74],refreshMap:{loopIndex:1,groupIndex:0,delay:1.5},refreshMode:{choose:0,wait:0,interval:1}},
        {groups:[56,43],refreshMap:{loopIndex:1,groupIndex:1,delay:1.0},refreshMode:{choose:0,wait:0,interval:3}},
        {groups:[18,84],refreshMap:{loopIndex:1,groupIndex:2,delay:0.5},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[42,43],refreshMap:{loopIndex:1,groupIndex:2,delay:0.5},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[67,84],refreshMap:{loopIndex:1,groupIndex:3,delay:0},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[18,23],refreshMap:{loopIndex:1,groupIndex:4,delay:0},refreshMode:{choose:0,wait:0,interval:1}},
        {groups:[27],refreshMap:{loopIndex:1,groupIndex:5,delay:0.5},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[115],refreshMap:{loopIndex:1,groupIndex:6,delay:0.5},refreshMode:{choose:0,wait:0,interval:0},refreshCount:-2},
    ],

    monsterExtra:[],

    totalHint:[
        {
            eventKey:2,
            checkTime:1,
            condition:[
                {killMonster:86},
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
                {wave:{index:6,complete:3}},
                {anime:1},
            ],
            effect:[
                {wave:{index:7}},
                {map:{loopIndex:1,groupIndex:5,loopCount:0,speed:10}},
            ]
        },
        {
            checkTime:1,
            condition:[
                {wave:{index:6,complete:3}},
            ],
            effect:[
                {anime:1},
            ]
        },
    ],
}