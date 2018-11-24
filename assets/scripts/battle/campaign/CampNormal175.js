var CampNormal175 = module.exports;

CampNormal175.data = {
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
                {imageIndex:[2,1,2],loopCount:0,speed:10,zorder:-998},
                {imageIndex:[3,4],loopCount:0,speed:10,zorder:-998},
                {imageIndex:[4,4],loopCount:0,speed:10,zorder:-998},
                {imageIndex:[4,4],loopCount:0,speed:10,zorder:-998},
                {imageIndex:[4,4],loopCount:0,speed:10,zorder:-998},
                {imageIndex:[4,4],loopCount:-1,speed:10,zorder:-998},
            ],
        },
    ],

    //refreshMode:{choose(挑选规则):0.顺序1.随机, wait(是否等待上一波死亡):0.否1.是, interval(刷新间隔):秒}
    monsterWaves:[
        {groups:[14,20],refreshMap:{loopIndex:1,groupIndex:0,delay:2},refreshMode:{choose:0,wait:0,interval:2}},
        {groups:[27],refreshMap:{loopIndex:1,groupIndex:1,delay:0.5},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[15,21],refreshMap:{loopIndex:1,groupIndex:1,delay:3.5},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[49,88],refreshMap:{loopIndex:1,groupIndex:1,delay:4.5},refreshMode:{choose:0,wait:0,interval:1}},
        {groups:[38,27],refreshMap:{loopIndex:1,groupIndex:2,delay:1},refreshMode:{choose:0,wait:0,interval:4}},
        {groups:[46,54,42],refreshMap:{loopIndex:1,groupIndex:3,delay:1},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[24],refreshMap:{loopIndex:1,groupIndex:3,delay:5},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[49],refreshMap:{loopIndex:1,groupIndex:4,delay:2.5},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[34],refreshMap:{loopIndex:1,groupIndex:5,delay:2},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[41],refreshMap:{loopIndex:1,groupIndex:6,delay:0.5},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[38,27],refreshMap:{loopIndex:1,groupIndex:6,delay:3.5},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[39],refreshMap:{loopIndex:1,groupIndex:7,delay:3},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[92,93],refreshMap:{loopIndex:1,groupIndex:8,delay:0.5},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[53],refreshMap:{loopIndex:1,groupIndex:8,delay:3.5},refreshMode:{choose:0,wait:0,interval:0}},
    ],

    monsterExtra:[],

    totalHint:[
        {
            checkTime:1,
            condition:[
                {wave:{index:13,complete:3}},
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
    ],
}