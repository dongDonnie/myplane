var CampNormal296 = module.exports;

CampNormal296.data = {
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
        {groups:[14,44],refreshMap:{loopIndex:1,groupIndex:0,delay:2},refreshMode:{choose:0,wait:0,interval:1}},
        {groups:[39,25,84,47],refreshMap:{loopIndex:1,groupIndex:0,delay:4},refreshMode:{choose:0,wait:0,interval:0.5}},
        {groups:[107],refreshMap:{loopIndex:1,groupIndex:1,delay:2.5},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[36,27,41],refreshMap:{loopIndex:1,groupIndex:2,delay:1},refreshMode:{choose:0,wait:0,interval:1}},
        {groups:[82,23],refreshMap:{loopIndex:1,groupIndex:3,delay:0},refreshMode:{choose:0,wait:0,interval:1}},
        {groups:[108],refreshMap:{loopIndex:1,groupIndex:4,delay:2.5},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[17,23],refreshMap:{loopIndex:1,groupIndex:4,delay:5.5},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[57,52,50],refreshMap:{loopIndex:1,groupIndex:4,delay:11.5},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[27],refreshMap:{loopIndex:1,groupIndex:4,delay:13.5},refreshMode:{choose:0,wait:0,interval:0}},
    ],

    monsterExtra:[],

    totalHint:[
        {
            checkTime:1,
            condition:[
                {wave:{index:8,complete:3}},
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