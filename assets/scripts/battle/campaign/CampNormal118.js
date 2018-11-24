var CampNormal118 = module.exports;

CampNormal118.data = {
    mapLoop: [
        {
            imageData:["tk-a"],
            groups:[
                {imageIndex:[0,0],loopCount:4,speed:5,zorder:-999},
            ],
        },
        {
            imageData:["tk-b1","tk-b","tk-c","tk-d-ditu","tk-e-ditu"],
            groups:[
                {imageIndex:[0,1],loopCount:0,speed:10,zorder:-998},
                {imageIndex:[2,1,2],loopCount:0,speed:10,zorder:-998},
                {imageIndex:[2,1,2],loopCount:0,speed:10,zorder:-998},
                {imageIndex:[3,4],loopCount:0,speed:10,zorder:-998},
                {imageIndex:[4,4],loopCount:-1,speed:10,zorder:-998},
            ],
        },
    ],

    //refreshMode:{choose(挑选规则):0.顺序1.随机, wait(是否等待上一波死亡):0.否1.是, interval(刷新间隔):秒}
    monsterWaves:[
        {groups:[19,73,63],refreshMap:{loopIndex:1,groupIndex:0,delay:2},refreshMode:{choose:0,wait:0,interval:0.5}},
        {groups:[64,68],refreshMap:{loopIndex:1,groupIndex:1,delay:1.5},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[61,78,18,27],refreshMap:{loopIndex:1,groupIndex:2,delay:1},refreshMode:{choose:0,wait:0,interval:0.5}},
        {groups:[15,22],refreshMap:{loopIndex:1,groupIndex:2,delay:3},refreshMode:{choose:0,wait:0,interval:1}},
        {groups:[83],refreshMap:{loopIndex:1,groupIndex:2,delay:5},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[70],refreshMap:{loopIndex:1,groupIndex:3,delay:0},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[39,43,76],refreshMap:{loopIndex:1,groupIndex:3,delay:4},refreshMode:{choose:0,wait:0,interval:0.5}},
        {groups:[112],refreshMap:{loopIndex:1,groupIndex:4,delay:3.5},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[24,25,35,27],refreshMap:{loopIndex:1,groupIndex:4,delay:7.5},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[92],refreshMap:{loopIndex:1,groupIndex:4,delay:13.5},refreshMode:{choose:0,wait:0,interval:0}},
    ],

    monsterExtra:[],

    totalHint:[
        {
            checkTime:1,
            condition:[
                {wave:{index:9,complete:3}},
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