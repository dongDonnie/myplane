var CampNormal249 = module.exports;

CampNormal249.data = {
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
                {imageIndex:[4,4,4],loopCount:0,speed:10,zorder:-998},
                {imageIndex:[4,4],loopCount:-1,speed:10,zorder:-998},
            ],
        },
    ],

    //refreshMode:{choose(挑选规则):0.顺序1.随机, wait(是否等待上一波死亡):0.否1.是, interval(刷新间隔):秒}
    monsterWaves:[
        {groups:[33],refreshMap:{loopIndex:1,groupIndex:0,delay:2},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[18,24],refreshMap:{loopIndex:1,groupIndex:1,delay:1.5},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[39,22],refreshMap:{loopIndex:1,groupIndex:1,delay:5.5},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[60,64],refreshMap:{loopIndex:1,groupIndex:2,delay:1},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[20,23],refreshMap:{loopIndex:1,groupIndex:2,delay:5},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[21,59],refreshMap:{loopIndex:1,groupIndex:3,delay:2},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[67,37,40],refreshMap:{loopIndex:1,groupIndex:3,delay:4},refreshMode:{choose:0,wait:0,interval:0}},
        {groups:[30,36,29,26,63,55],refreshMap:{loopIndex:1,groupIndex:4,delay:3.5},refreshMode:{choose:0,wait:0,interval:1}},
        {groups:[105],refreshMap:{loopIndex:1,groupIndex:5,delay:3},refreshMode:{choose:0,wait:0,interval:0}},
    ],

    monsterExtra:[],

    totalHint:[
        {
            eventKey:2,
            checkTime:1,
            condition:[
                {killMonster:63},
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